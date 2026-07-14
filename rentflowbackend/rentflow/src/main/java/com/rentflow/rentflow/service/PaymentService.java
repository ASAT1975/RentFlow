package com.rentflow.rentflow.service;

import com.rentflow.rentflow.model.*;
import com.rentflow.rentflow.payment.PaystackService;
import com.rentflow.rentflow.repository.PaymentRepository;
import com.rentflow.rentflow.repository.PropertyRepository;
import com.rentflow.rentflow.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private PaystackService paystackService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Landlord creates a rent due for a tenant
    public Payment createPayment(User tenant, Property property, Double totalAmount, LocalDate dueDate) {
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

    // Tenant makes a payment
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
            if (!"charge.success".equals(event.get("event"))) {
                return;
            }

            Map<String, Object> data = (Map<String, Object>) event.get("data");
            if (data == null) {
                return;
            }

            Map<String, Object> authorization = (Map<String, Object>) data.get("authorization");
            if (authorization == null) {
                return;
            }

            String authCode = (String) authorization.get("authorization_code");
            if (authCode == null || authCode.isBlank()) {
                return;
            }

            String email = null;
            Map<String, Object> customer = (Map<String, Object>) data.get("customer");
            if (customer != null) {
                email = (String) customer.get("email");
            }
            if (email == null) {
                email = (String) authorization.get("email");
            }
            if (email == null || email.isBlank()) {
                return;
            }

            unitRepository.findByPaystackEmail(email).ifPresent(unit -> {
                unit.setPaystackAuthCode(authCode);
                unitRepository.save(unit);
            });
        } catch (Exception e) {
            System.out.println("Paystack webhook handling failed: " + e.getMessage());
        }
    }
}