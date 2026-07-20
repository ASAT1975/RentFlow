package com.rentflow.rentflow.service;

import com.rentflow.rentflow.model.Property;
import com.rentflow.rentflow.model.User;
import com.rentflow.rentflow.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    public Property createProperty(String name, String address, Double rentAmount, User landlord) {
        Property property = new Property();
        property.setName(name);
        property.setAddress(address);
        property.setRentAmount(rentAmount);
        property.setLandlord(landlord);
        property.setInviteCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT));
        return propertyRepository.save(property);
    }

    public List<Property> getLandlordProperties(User landlord) {
        return propertyRepository.findByLandlord(landlord);
    }

    public Property findByInviteCode(String code) {
        return propertyRepository.findByInviteCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));
    }
}