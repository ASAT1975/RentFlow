package com.rentflow.rentflow.repository;

import com.rentflow.rentflow.model.Property;
import com.rentflow.rentflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByLandlord(User landlord);
    Optional<Property> findByInviteCode(String inviteCode);
}