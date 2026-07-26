package com.rentflow.rentflow.service;

import com.rentflow.rentflow.model.User;
import com.rentflow.rentflow.model.Role;
import com.rentflow.rentflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public User register(String name, String email, String password, Role role, String phone) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setPhone(phone);
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Optional<User> findByEmailOptional(String email) {
        return userRepository.findByEmail(email);
    }

    public User createGoogleUser(String name, String email, Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRole(role);
        return userRepository.save(user);
    }

    public void sendResetCode(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return; // silently ignore unknown emails
        String code = String.format("%06d", new Random().nextInt(999999));
        user.setResetToken(code);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(email);
        msg.setSubject("RentFlow — Password Reset Code");
        msg.setText("Your password reset code is: " + code + "\n\nThis code expires in 15 minutes.");
        mailSender.send(msg);
    }

    public boolean resetPassword(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getResetToken() == null) return false;
        if (!user.getResetToken().equals(code)) return false;
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) return false;
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
        return true;
    }
}