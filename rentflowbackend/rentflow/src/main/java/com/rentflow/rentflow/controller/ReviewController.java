package com.rentflow.rentflow.controller;

import com.rentflow.rentflow.model.*;
import com.rentflow.rentflow.repository.PropertyRepository;
import com.rentflow.rentflow.security.JwtUtil;
import com.rentflow.rentflow.service.AuthService;
import com.rentflow.rentflow.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PropertyRepository propertyRepository;

    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return authService.findByEmail(email);
    }

    // Anyone can submit a review
    @PostMapping("/submit")
    public ResponseEntity<?> submitReview(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {

        User reviewer = getCurrentUser(authHeader);
        Long propertyId = Long.valueOf(body.get("propertyId").toString());
        String comment = (String) body.get("comment");
        int rating = Integer.parseInt(body.get("rating").toString());
        ReviewType type = ReviewType.valueOf((String) body.get("type"));

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Review review = reviewService.submitReview(reviewer, property, comment, rating, type);

        return ResponseEntity.ok(Map.of(
                "id", review.getId(),
                "comment", review.getComment(),
                "rating", review.getRating(),
                "type", review.getType(),
                "reviewDate", review.getReviewDate()
        ));
    }

    // Get all reviews for a property
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<?> getPropertyReviews(
            @PathVariable Long propertyId) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        List<Review> reviews = reviewService.getPropertyReviews(property);
        return ResponseEntity.ok(reviews);
    }

    // Get reviews by type
    @GetMapping("/property/{propertyId}/type/{type}")
    public ResponseEntity<?> getReviewsByType(
            @PathVariable Long propertyId,
            @PathVariable String type) {

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        ReviewType reviewType = ReviewType.valueOf(type);
        List<Review> reviews = reviewService.getReviewsByType(property, reviewType);
        return ResponseEntity.ok(reviews);
    }
}