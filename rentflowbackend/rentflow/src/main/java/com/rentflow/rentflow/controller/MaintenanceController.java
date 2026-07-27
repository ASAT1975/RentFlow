package com.rentflow.rentflow.controller;

import com.rentflow.rentflow.model.*;
import com.rentflow.rentflow.repository.PropertyRepository;
import com.rentflow.rentflow.security.JwtUtil;
import com.rentflow.rentflow.service.AuthService;
import com.rentflow.rentflow.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PropertyRepository propertyRepository;

    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return authService.findByEmail(email);
    }

    // Tenant submits a maintenance request
    @PostMapping("/submit")
    public ResponseEntity<?> submitRequest(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {

        User tenant = getCurrentUser(authHeader);
        Long propertyId = Long.valueOf(body.get("propertyId").toString());
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        String photoUrl = body.containsKey("photoUrl") ? (String) body.get("photoUrl") : null;

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        MaintenanceRequest request = maintenanceService.submitRequest(
                tenant, property, title, description);

        if (photoUrl != null && !photoUrl.isBlank()) {
            request.setPhotoUrl(photoUrl);
            maintenanceService.save(request);
        }

        return ResponseEntity.ok(Map.of(
                "id", request.getId(),
                "title", request.getTitle(),
                "description", request.getDescription(),
                "status", request.getStatus(),
                "submittedDate", request.getSubmittedDate(),
                "photoUrl", request.getPhotoUrl() != null ? request.getPhotoUrl() : ""
        ));
    }

    // Upload a photo for a maintenance request
    @PostMapping(value = "/upload-photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPhoto(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file) {

        getCurrentUser(authHeader); // auth check
        if (file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));

        try {
            String ext = "";
            String original = file.getOriginalFilename();
            if (original != null && original.contains("."))
                ext = original.substring(original.lastIndexOf('.'));

            String filename = UUID.randomUUID() + ext;
            Path uploadDir = Paths.get("uploads", "maintenance");
            Files.createDirectories(uploadDir);
            Files.copy(file.getInputStream(), uploadDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

            String url = "/uploads/maintenance/" + filename;
            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Upload failed"));
        }
    }

    // Landlord updates request status
    @PutMapping("/update/{requestId}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long requestId,
            @RequestBody Map<String, String> body) {

        MaintenanceStatus status = MaintenanceStatus.valueOf(body.get("status"));
        MaintenanceRequest request = maintenanceService.updateStatus(requestId, status);

        return ResponseEntity.ok(Map.of(
                "id", request.getId(),
                "title", request.getTitle(),
                "status", request.getStatus()
        ));
    }

    // Landlord sees all requests for a property
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<?> getPropertyRequests(
            @PathVariable Long propertyId) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        List<MaintenanceRequest> requests = maintenanceService.getPropertyRequests(property);
        return ResponseEntity.ok(requests.stream().map(r -> {
            Map<String, Object> dto = new java.util.HashMap<>();
            dto.put("id", r.getId());
            dto.put("title", r.getTitle());
            dto.put("description", r.getDescription());
            dto.put("status", r.getStatus());
            dto.put("submittedDate", r.getSubmittedDate());
            dto.put("photoUrl", r.getPhotoUrl() != null ? r.getPhotoUrl() : "");
            if (r.getTenant() != null)
                dto.put("tenant", Map.of("id", r.getTenant().getId(), "name", r.getTenant().getName(), "email", r.getTenant().getEmail()));
            if (r.getProperty() != null)
                dto.put("property", Map.of("id", r.getProperty().getId(), "name", r.getProperty().getName()));
            return dto;
        }).toList());
    }

    // Tenant sees their own requests
    @GetMapping("/my")
    public ResponseEntity<?> getMyRequests(
            @RequestHeader("Authorization") String authHeader) {

        User tenant = getCurrentUser(authHeader);
        List<MaintenanceRequest> requests = maintenanceService.getTenantRequests(tenant);
        return ResponseEntity.ok(requests.stream().map(r -> {
            Map<String, Object> dto = new java.util.HashMap<>();
            dto.put("id", r.getId());
            dto.put("title", r.getTitle());
            dto.put("description", r.getDescription());
            dto.put("status", r.getStatus());
            dto.put("submittedDate", r.getSubmittedDate());
            dto.put("photoUrl", r.getPhotoUrl() != null ? r.getPhotoUrl() : "");
            if (r.getTenant() != null)
                dto.put("tenant", Map.of("id", r.getTenant().getId(), "name", r.getTenant().getName(), "email", r.getTenant().getEmail()));
            if (r.getProperty() != null)
                dto.put("property", Map.of("id", r.getProperty().getId(), "name", r.getProperty().getName()));
            return dto;
        }).toList());
    }
}