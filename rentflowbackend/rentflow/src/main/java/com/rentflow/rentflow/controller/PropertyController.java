package com.rentflow.rentflow.controller;

import com.rentflow.rentflow.model.Property;
import com.rentflow.rentflow.model.User;
import com.rentflow.rentflow.security.JwtUtil;
import com.rentflow.rentflow.service.AuthService;
import com.rentflow.rentflow.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    private User getCurrentUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return authService.findByEmail(email);
    }

    // Landlord creates a property
    @PostMapping("/create")
    public ResponseEntity<?> createProperty(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> body) {

        User landlord = getCurrentUser(authHeader);
        String name = (String) body.get("name");
        String address = (String) body.get("address");
        Double rentAmount = Double.valueOf(body.get("rentAmount").toString());

        Property property = propertyService.createProperty(name, address, rentAmount, landlord);

        return ResponseEntity.ok(Map.of(
                "id", property.getId(),
                "name", property.getName(),
                "address", property.getAddress(),
                "rentAmount", property.getRentAmount(),
                "inviteCode", property.getInviteCode()
        ));
    }

    // Landlord sees all their properties
    @GetMapping("/my")
    public ResponseEntity<?> getMyProperties(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        User landlord = getCurrentUser(authHeader);
        List<Property> properties = propertyService.getLandlordProperties(landlord);
        return ResponseEntity.ok(properties.stream().map(p -> Map.of(
                "id", p.getId(),
                "name", p.getName(),
                "address", p.getAddress(),
                "rentAmount", p.getRentAmount(),
                "inviteCode", p.getInviteCode() != null ? p.getInviteCode() : ""
        )).toList());
    }

    // Tenant joins property with invite code
    @PostMapping("/join")
    public ResponseEntity<?> joinProperty(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, String> body) {

        String code = body.get("inviteCode");
        Property property = propertyService.findByInviteCode(code);

        return ResponseEntity.ok(Map.of(
                "message", "Joined successfully!",
                "property", property.getName(),
                "rentAmount", property.getRentAmount()
        ));
    }
}