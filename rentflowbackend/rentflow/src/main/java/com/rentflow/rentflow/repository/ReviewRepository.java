package com.rentflow.rentflow.repository;

import com.rentflow.rentflow.model.Property;
import com.rentflow.rentflow.model.Review;
import com.rentflow.rentflow.model.ReviewType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProperty(Property property);
    List<Review> findByPropertyAndType(Property property, ReviewType type);
}