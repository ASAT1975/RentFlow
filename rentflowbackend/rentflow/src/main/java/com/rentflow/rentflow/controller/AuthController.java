package com.rentflow.rentflow.controller;

import com.rentflow.rentflow.model.Role;
import com.rentflow.rentflow.model.User;
import com.rentflow.rentflow.security.GoogleTokenVerifier;
import com.rentflow.rentflow.security.JwtUtil;
import com.rentflow.rentflow.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private GoogleTokenVerifier googleTokenVerifier;

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        String phone = body.get("phone");
        String roleStr = body.get("role");
        Role role;
        try {
            role = Role.valueOf(roleStr);
        } catch (IllegalArgumentException | NullPointerException e) {
            return ResponseEntity.status(400).body(Map.of("error", "Invalid role. Must be LANDLORD or TENANT"));
        }

        if (authService.findByEmailOptional(email).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "An account with this email already exists."));
        }

        User user = authService.register(name, email, password, role, phone);
        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole(),
                "name", user.getName()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        // Use optional lookup so unknown emails return 401, not 500
        User user = authService.findByEmailOptional(email).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }

        String token = jwtUtil.generateToken(email);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole(),
                "name", user.getName()
        ));
    }

    @PostMapping("/google")
    public ResponseEntity<?> google(@RequestBody Map<String, String> body) {
        String accessToken = body.get("accessToken");
        if (accessToken == null || accessToken.isBlank()) {
            return ResponseEntity.status(400).body(Map.of("error", "Missing Google token"));
        }

        GoogleTokenVerifier.GoogleUser googleUser;
        try {
            googleUser = googleTokenVerifier.verify(accessToken);
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return ResponseEntity.status(500).body(Map.of("error", "Google verification failed"));
        }

        User user = authService.findByEmailOptional(googleUser.email()).orElse(null);

        // Brand-new Google user with no chosen role yet: ask the client for one.
        if (user == null && body.get("role") == null) {
            return ResponseEntity.ok(Map.of(
                    "needsRole", true,
                    "email", googleUser.email(),
                    "name", googleUser.name()
            ));
        }

        if (user == null) {
            String roleStr = body.get("role");
            Role role;
            try {
                role = Role.valueOf(roleStr);
            } catch (IllegalArgumentException | NullPointerException e) {
                return ResponseEntity.status(400).body(Map.of("error", "Invalid role. Must be LANDLORD or TENANT"));
            }
            user = authService.createGoogleUser(googleUser.name(), googleUser.email(), role);
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole(),
                "name", user.getName(),
                "email", user.getEmail()
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank())
            return ResponseEntity.status(400).body(Map.of("error", "Email is required"));
        authService.sendResetCode(email);
        return ResponseEntity.ok(Map.of("message", "If that email exists, a reset code has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");
        String newPassword = body.get("newPassword");
        if (email == null || code == null || newPassword == null)
            return ResponseEntity.status(400).body(Map.of("error", "email, code and newPassword are required"));
        boolean ok = authService.resetPassword(email, code, newPassword);
        if (!ok) return ResponseEntity.status(400).body(Map.of("error", "Invalid or expired code."));
        return ResponseEntity.ok(Map.of("message", "Password reset successful."));
    }
}