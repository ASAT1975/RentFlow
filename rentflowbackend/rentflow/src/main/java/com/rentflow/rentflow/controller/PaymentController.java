package com.rentflow.rentflow.controller;

import com.rentflow.rentflow.model.*;
import com.rentflow.rentflow.repository.PropertyRepository;
import com.rentflow.rentflow.repository.UnitRepository;
import com.rentflow.rentflow.security.JwtUtil;
import com.rentflow.rentflow.service.AuthService;
import com.rentflow.rentflow.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UnitRepository unitRepository;

    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return authService.findByEmail(email);
    }

    // Landlord creates rent due for a tenant
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {

        String tenantEmail = (String) body.get("tenantEmail");
        Long propertyId = Long.valueOf(body.get("propertyId").toString());
        Double totalAmount = Double.valueOf(body.get("totalAmount").toString());
        LocalDate dueDate = LocalDate.parse((String) body.get("dueDate"));

        User tenant = authService.findByEmail(tenantEmail);
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Payment payment = paymentService.createPayment(tenant, property, totalAmount, dueDate);

        return ResponseEntity.ok(Map.of(
                "id", payment.getId(),
                "tenant", tenant.getName(),
                "totalAmount", payment.getTotalAmount(),
                "balance", payment.getBalance(),
                "status", payment.getStatus(),
                "dueDate", payment.getDueDate()
        ));
    }

    // Tenant makes a payment
    @PostMapping("/pay/{paymentId}")
    public ResponseEntity<?> makePayment(
            @PathVariable Long paymentId,
            @RequestBody Map<String, Object> body) {

        Double amount = Double.valueOf(body.get("amount").toString());
        Payment payment = paymentService.makePayment(paymentId, amount);

        return ResponseEntity.ok(Map.of(
                "status", payment.getStatus(),
                "amountPaid", payment.getAmountPaid(),
                "balance", payment.getBalance(),
                "totalAmount", payment.getTotalAmount()
        ));
    }

    // Landlord sees all payments for a property
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<?> getPropertyPayments(
            @PathVariable Long propertyId) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        List<Payment> payments = paymentService.getPropertyPayments(property);
        return ResponseEntity.ok(payments);
    }

    // Tenant sees their own payments
    @GetMapping("/my")
    public ResponseEntity<?> getMyPayments(
            @RequestHeader("Authorization") String authHeader) {

        User tenant = getCurrentUser(authHeader);
        List<Payment> payments = paymentService.getTenantPayments(tenant);
        return ResponseEntity.ok(payments);
    }

    /**
     * Paystack webhook — persists the card authorization code on the tenant's unit
     * after they complete the browser authorization started by {@code /units/authorize-payment}.
     * The nightly {@link com.rentflow.rentflow.scheduler.RentScheduler} then charges
     * that saved authorization on each unit's rent-due day.
     */
    @PostMapping("/webhook")
    public ResponseEntity<Void> paystackWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "x-paystack-signature", required = false) String signature) {

        if (!paymentService.verifyPaystackWebhook(payload, signature)) {
            return ResponseEntity.status(401).build();
        }

        paymentService.handlePaystackWebhook(payload);
        return ResponseEntity.ok().build();
    }
}