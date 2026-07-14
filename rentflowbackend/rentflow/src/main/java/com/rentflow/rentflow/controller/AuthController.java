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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");
        Role role = Role.valueOf(body.get("role")); // "LANDLORD" or "TENANT"

        User user = authService.register(name, email, password, role);
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

        User user = authService.findByEmail(email);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Wrong password"));
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

        GoogleTokenVerifier.GoogleUser googleUser = googleTokenVerifier.verify(accessToken);

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
            Role role = Role.valueOf(body.get("role")); // "LANDLORD" or "TENANT"
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
}