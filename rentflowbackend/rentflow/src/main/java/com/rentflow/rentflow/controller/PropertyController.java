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

    // Helper to get logged in user from token
    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return authService.findByEmail(email);
    }

    // Landlord creates a property
    @PostMapping("/create")
    public ResponseEntity<?> createProperty(
            @RequestHeader("Authorization") String authHeader,
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
            @RequestHeader("Authorization") String authHeader) {

        User landlord = getCurrentUser(authHeader);
        List<Property> properties = propertyService.getLandlordProperties(landlord);
        return ResponseEntity.ok(properties);
    }

    // Tenant joins property with invite code
    @PostMapping("/join")
    public ResponseEntity<?> joinProperty(
            @RequestHeader("Authorization") String authHeader,
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