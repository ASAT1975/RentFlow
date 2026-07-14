package com.rentflow.rentflow.repository;

import com.rentflow.rentflow.model.Payment;
import com.rentflow.rentflow.model.Property;
import com.rentflow.rentflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTenant(User tenant);
    List<Payment> findByProperty(Property property);
    List<Payment> findByTenantAndProperty(User tenant, Property property);
}