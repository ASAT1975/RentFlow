package com.rentflow.rentflow.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rentflow.rentflow.model.Payment;
import com.rentflow.rentflow.model.PaymentStatus;
import com.rentflow.rentflow.model.Property;
import com.rentflow.rentflow.model.User;
import com.rentflow.rentflow.payment.PaystackService;
import com.rentflow.rentflow.repository.PaymentRepository;
import com.rentflow.rentflow.repository.PropertyRepository;
import com.rentflow.rentflow.repository.UnitRepository;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final PropertyRepository propertyRepository;
    private final UnitRepository unitRepository;
    private final PaystackService paystackService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, PropertyRepository propertyRepository, UnitRepository unitRepository, PaystackService paystackService) {
        this.paymentRepository = paymentRepository;
        this.propertyRepository = propertyRepository;
        this.unitRepository = unitRepository;
        this.paystackService = paystackService;
    }

    // Landlord creates a rent due for a tenant
    public Payment createPayment(User tenant, Property property, Double totalAmount, LocalDate dueDate) {
        // Prevent duplicate: return existing unpaid payment for same tenant/property/dueDate
        paymentRepository.findByTenantAndProperty(tenant, property).stream()
                .filter(p -> p.getDueDate().equals(dueDate) && p.getStatus() != PaymentStatus.PAID)
                .findFirst()
                .ifPresent(existing -> { throw new RuntimeException("DUPLICATE: Payment already exists for this tenant and due date."); });

        Payment payment = new Payment();
        payment.setTenant(tenant);
        payment.setProperty(property);
        payment.setTotalAmount(totalAmount);
        payment.setAmountPaid(0.0);
        payment.setBalance(totalAmount);
        payment.setDueDate(dueDate);
        payment.setStatus(PaymentStatus.PENDING);
        return paymentRepository.save(payment);
    }

    // Tenant makes a payment — charges via Paystack if auth code is saved on the unit
    public Payment makePaymentViaPaystack(Long paymentId, Double amount, User tenant, UnitRepository unitRepo) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Try Paystack charge if tenant has an authorization code
        unitRepo.findByTenant(tenant).ifPresent(unit -> {
            if (unit.getPaystackAuthCode() != null && unit.getPaystackEmail() != null) {
                try {
                    Map response = paystackService.chargeAuthorization(
                            unit.getPaystackAuthCode(),
                            unit.getPaystackEmail(),
                            amount
                    );
                    Map data = (Map) response.get("data");
                    if (data == null || !"success".equals(data.get("status"))) {
                        throw new RuntimeException("Paystack charge did not succeed");
                    }
                } catch (RuntimeException e) {
                    log.error("Paystack charge failed for tenant {}: {}", tenant.getEmail(), e.getMessage());
                    throw e;
                }
            }
        });

        return makePayment(paymentId, amount);
    }

    // Tenant makes a payment (record only — used internally)
    public Payment makePayment(Long paymentId, Double amount) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        double newAmountPaid = payment.getAmountPaid() + amount;
        double newBalance = payment.getTotalAmount() - newAmountPaid;

        payment.setAmountPaid(newAmountPaid);
        payment.setBalance(newBalance);

        if (newBalance <= 0) {
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidDate(LocalDate.now());
        } else {
            payment.setStatus(PaymentStatus.PARTIAL);
        }

        return paymentRepository.save(payment);
    }

    // Landlord sees all payments for a property
    public List<Payment> getPropertyPayments(Property property) {
        return paymentRepository.findByProperty(property);
    }

    // Tenant sees their own payments
    public List<Payment> getTenantPayments(User tenant) {
        return paymentRepository.findByTenant(tenant);
    }

    public boolean verifyPaystackWebhook(String payload, String signature) {
        return paystackService.verifyWebhookSignature(payload, signature);
    }

    /** Saves {@code authorization_code} onto the matching unit when Paystack confirms a charge. */
    @SuppressWarnings("unchecked")
    public void handlePaystackWebhook(String payload) {
        try {
            Map<String, Object> event = objectMapper.readValue(payload, Map.class);
            if (!"charge.success".equals(event.get("event"))) return;

            Map<String, Object> data = (Map<String, Object>) event.get("data");
            if (data == null) return;

            String authCode = extractAuthCode(data);
            if (authCode == null) return;

            String email = extractEmail(data);
            if (email == null || email.isBlank()) return;

            unitRepository.findByPaystackEmail(email).ifPresent(unit -> {
                unit.setPaystackAuthCode(authCode);
                unitRepository.save(unit);
            });
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse Paystack webhook payload", e);
        }
    }

    @SuppressWarnings("unchecked")
    private String extractAuthCode(Map<String, Object> data) {
        Map<String, Object> authorization = (Map<String, Object>) data.get("authorization");
        if (authorization == null) return null;
        String authCode = (String) authorization.get("authorization_code");
        return (authCode == null || authCode.isBlank()) ? null : authCode;
    }

    @SuppressWarnings("unchecked")
    private String extractEmail(Map<String, Object> data) {
        Map<String, Object> customer = (Map<String, Object>) data.get("customer");
        if (customer != null) {
            String email = (String) customer.get("email");
            if (email != null) return email;
        }
        Map<String, Object> authorization = (Map<String, Object>) data.get("authorization");
        return authorization != null ? (String) authorization.get("email") : null;
    }
}