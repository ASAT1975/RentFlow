package com.rentflow.rentflow.repository;

import com.rentflow.rentflow.model.MaintenanceRequest;
import com.rentflow.rentflow.model.Property;
import com.rentflow.rentflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByTenant(User tenant);
    List<MaintenanceRequest> findByProperty(Property property);
}