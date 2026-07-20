package com.rentflow.rentflow.controller;

import com.rentflow.rentflow.model.*;
import com.rentflow.rentflow.payment.PaystackService;
import com.rentflow.rentflow.repository.PropertyRepository;
import com.rentflow.rentflow.security.JwtUtil;
import com.rentflow.rentflow.service.AuthService;
import com.rentflow.rentflow.service.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PaystackService paystackService;

    @Autowired
    private UnitService unitService;

    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return authService.findByEmail(email);
    }

    // Landlord adds a unit to a property
    @PostMapping("/create")
    public ResponseEntity<?> createUnit(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {

        Long propertyId = Long.valueOf(body.get("propertyId").toString());
        String unitNumber = (String) body.get("unitNumber");
        String description = (String) body.get("description");
        Double rentAmount = Double.valueOf(body.get("rentAmount").toString());

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        RentUnit unit = unitService.createUnit(property, unitNumber, description, rentAmount);

        return ResponseEntity.ok(Map.of(
                "id", unit.getId(),
                "unitNumber", unit.getUnitNumber(),
                "description", unit.getDescription(),
                "rentAmount", unit.getRentAmount(),
                "inviteCode", unit.getInviteCode(),
                "status", unit.getStatus()
        ));
    }

    // Tenant joins a unit with invite code
    @PostMapping("/join")
    public ResponseEntity<?> joinUnit(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {

        User tenant = getCurrentUser(authHeader);
        String inviteCode = body.get("inviteCode");

        RentUnit unit = unitService.joinUnit(inviteCode, tenant);

        return ResponseEntity.ok(Map.of(
                "message", "Joined successfully!",
                "unit", unit.getUnitNumber(),
                "property", unit.getProperty().getName(),
                "propertyId", unit.getProperty().getId(),
                "rentAmount", unit.getRentAmount()
        ));
    }

    // Landlord sees all units for a property
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<?> getPropertyUnits(
            @PathVariable Long propertyId) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        List<RentUnit> units = unitService.getPropertyUnits(property);
        return ResponseEntity.ok(units);
    }

    // Landlord sees vacant units
    @GetMapping("/property/{propertyId}/vacant")
    public ResponseEntity<?> getVacantUnits(
            @PathVariable Long propertyId) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        List<RentUnit> units = unitService.getVacantUnits(property);
        return ResponseEntity.ok(units);
    }

    // Tenant sees their own unit
    @GetMapping("/my")
    public ResponseEntity<?> getMyUnit(
            @RequestHeader("Authorization") String authHeader) {

        User tenant = getCurrentUser(authHeader);
        RentUnit unit = unitService.getTenantUnit(tenant);
        User landlord = unit.getProperty().getLandlord();

        return ResponseEntity.ok(Map.of(
                "unitNumber", unit.getUnitNumber(),
                "property", unit.getProperty().getName(),
                "propertyId", unit.getProperty().getId(),
                "rentAmount", unit.getRentAmount(),
                "status", unit.getStatus(),
                "paymentAuthorized", unit.getPaystackAuthCode() != null,
                "landlordName", landlord.getName(),
                "landlordEmail", landlord.getEmail(),
                "landlordPhone", landlord.getPhone() != null ? landlord.getPhone() : ""
        ));
    }
    // Tenant deauthorizes automatic rent payment
    @PostMapping("/deauthorize-payment")
    public ResponseEntity<?> deauthorizePayment(
            @RequestHeader("Authorization") String authHeader) {

        User tenant = getCurrentUser(authHeader);
        RentUnit unit = unitService.getTenantUnit(tenant);
        unit.setPaystackAuthCode(null);
        unit.setPaystackEmail(null);
        unit.setRentDueDay(null);
        unitService.saveUnit(unit);

        return ResponseEntity.ok(Map.of("message", "Automatic payments disabled"));
    }

    // Tenant authorizes automatic rent payment
    @PostMapping("/authorize-payment")
    public ResponseEntity<?> authorizePayment(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {

        User tenant = getCurrentUser(authHeader);
        Integer rentDueDay = Integer.valueOf(body.get("rentDueDay").toString());

        // Paystack requires a non-zero amount to tokenize a card for later charges.
        Map response = paystackService.initializeTransaction(
                tenant.getEmail(),
                1.0
        );

        Map data = (Map) response.get("data");
        String authorizationUrl = (String) data.get("authorization_url");

        // Save rent due day to unit
        RentUnit unit = unitService.getTenantUnit(tenant);
        unit.setRentDueDay(rentDueDay);
        unit.setPaystackEmail(tenant.getEmail());
        unitService.saveUnit(unit);

        return ResponseEntity.ok(Map.of(
                "authorizationUrl", authorizationUrl,
                "message", "Complete payment authorization at the URL"
        ));
    }
}