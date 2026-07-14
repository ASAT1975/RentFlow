package com.rentflow.rentflow.service;

import com.rentflow.rentflow.model.*;
import com.rentflow.rentflow.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class UnitService {

    @Autowired
    private UnitRepository unitRepository;

    // Landlord adds a unit to a property
    public RentUnit createUnit(Property property, String unitNumber,
                               String description, Double rentAmount) {
        RentUnit unit = new RentUnit();
        unit.setProperty(property);
        unit.setUnitNumber(unitNumber);
        unit.setDescription(description);
        unit.setRentAmount(rentAmount);
        unit.setStatus(UnitStatus.VACANT);
        unit.setInviteCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return unitRepository.save(unit);
    }

    // Tenant joins using invite code
    public RentUnit joinUnit(String inviteCode, User tenant) {
        RentUnit unit = unitRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));

        if (unit.getStatus() == UnitStatus.OCCUPIED) {
            throw new RuntimeException("Unit is already occupied");
        }

        unit.setTenant(tenant);
        unit.setStatus(UnitStatus.OCCUPIED);
        return unitRepository.save(unit);
    }

    // Get all units for a property
    public List<RentUnit> getPropertyUnits(Property property) {
        return unitRepository.findByProperty(property);
    }

    // Get vacant units
    public List<RentUnit> getVacantUnits(Property property) {
        return unitRepository.findByPropertyAndStatus(property, UnitStatus.VACANT);
    }

    // Get tenant's unit
    public RentUnit getTenantUnit(User tenant) {
        return unitRepository.findByTenant(tenant)
                .orElseThrow(() -> new RuntimeException("No unit found for tenant"));
    }

    public RentUnit saveUnit(RentUnit unit) {
        return unitRepository.save(unit);
    }
}