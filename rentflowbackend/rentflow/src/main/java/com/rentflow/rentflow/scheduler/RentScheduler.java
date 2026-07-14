package com.rentflow.rentflow.scheduler;

import com.rentflow.rentflow.model.*;
import com.rentflow.rentflow.payment.PaystackService;
import com.rentflow.rentflow.repository.PaymentRepository;
import com.rentflow.rentflow.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Component
public class RentScheduler {

    @Autowired
    private UnitRepository unitRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaystackService paystackService;

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void collectRent() {
        int today = LocalDate.now().getDayOfMonth();

        // Get all occupied units
        List<RentUnit> allUnits = unitRepository.findAll();

        for (RentUnit unit : allUnits) {
            // Skip vacant units or units without auth code
            if (unit.getStatus() != UnitStatus.OCCUPIED) continue;
            if (unit.getPaystackAuthCode() == null) continue;
            if (unit.getRentDueDay() == null) continue;

            // Check if today is rent due day for this unit
            if (unit.getRentDueDay() != today) continue;

            try {
                // Charge tenant automatically
                Map response = paystackService.chargeAuthorization(
                        unit.getPaystackAuthCode(),
                        unit.getPaystackEmail(),
                        unit.getRentAmount()
                );

                Map data = (Map) response.get("data");
                String status = (String) data.get("status");

                // Create payment record
                Payment payment = new Payment();
                payment.setTenant(unit.getTenant());
                payment.setProperty(unit.getProperty());
                payment.setTotalAmount(unit.getRentAmount());
                payment.setDueDate(LocalDate.now());

                if (status.equals("success")) {
                    payment.setAmountPaid(unit.getRentAmount());
                    payment.setBalance(0.0);
                    payment.setStatus(PaymentStatus.PAID);
                    payment.setPaidDate(LocalDate.now());
                } else {
                    payment.setAmountPaid(0.0);
                    payment.setBalance(unit.getRentAmount());
                    payment.setStatus(PaymentStatus.OVERDUE);
                }

                paymentRepository.save(payment);

            } catch (Exception e) {
                // Log error, mark as overdue
                Payment payment = new Payment();
                payment.setTenant(unit.getTenant());
                payment.setProperty(unit.getProperty());
                payment.setTotalAmount(unit.getRentAmount());
                payment.setAmountPaid(0.0);
                payment.setBalance(unit.getRentAmount());
                payment.setDueDate(LocalDate.now());
                payment.setStatus(PaymentStatus.OVERDUE);
                paymentRepository.save(payment);

                System.out.println("Failed to charge tenant: " +
                        unit.getTenant().getEmail() + " - " + e.getMessage());
            }
        }
    }
}