package com.rentflow.rentflow.service;

import com.rentflow.rentflow.model.*;
import com.rentflow.rentflow.repository.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    // Tenant submits a request
    public MaintenanceRequest submitRequest(User tenant, Property property,
                                            String title, String description) {
        MaintenanceRequest request = new MaintenanceRequest();
        request.setTenant(tenant);
        request.setProperty(property);
        request.setTitle(title);
        request.setDescription(description);
        request.setSubmittedDate(LocalDate.now());
        request.setStatus(MaintenanceStatus.PENDING);
        return maintenanceRepository.save(request);
    }

    // Landlord updates status
    public MaintenanceRequest updateStatus(Long requestId, MaintenanceStatus status) {
        MaintenanceRequest request = maintenanceRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return maintenanceRepository.save(request);
    }

    // Landlord sees all requests for a property
    public List<MaintenanceRequest> getPropertyRequests(Property property) {
        return maintenanceRepository.findByProperty(property);
    }

    // Tenant sees their own requests
    public List<MaintenanceRequest> getTenantRequests(User tenant) {
        return maintenanceRepository.findByTenant(tenant);
    }
}