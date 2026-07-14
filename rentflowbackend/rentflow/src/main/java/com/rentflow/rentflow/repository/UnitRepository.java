package com.rentflow.rentflow.repository;

import com.rentflow.rentflow.model.Property;
import com.rentflow.rentflow.model.RentUnit;
import com.rentflow.rentflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UnitRepository extends JpaRepository<RentUnit, Long> {
    List<RentUnit> findByProperty(Property property);
    Optional<RentUnit> findByInviteCode(String inviteCode);
    Optional<RentUnit> findByTenant(User tenant);
    List<RentUnit> findByPropertyAndStatus(Property property,
                                           com.rentflow.rentflow.model.UnitStatus status);
    Optional<RentUnit> findByPaystackEmail(String paystackEmail);
}