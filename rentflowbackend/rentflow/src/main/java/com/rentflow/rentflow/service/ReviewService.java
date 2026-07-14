package com.rentflow.rentflow.service;

import com.rentflow.rentflow.model.*;
import com.rentflow.rentflow.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review submitReview(User reviewer, Property property,
                               String comment, int rating, ReviewType type) {
        // validate rating
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setProperty(property);
        review.setComment(comment);
        review.setRating(rating);
        review.setReviewDate(LocalDate.now());
        review.setType(type);
        return reviewRepository.save(review);
    }

    public List<Review> getPropertyReviews(Property property) {
        return reviewRepository.findByProperty(property);
    }

    public List<Review> getReviewsByType(Property property, ReviewType type) {
        return reviewRepository.findByPropertyAndType(property, type);
    }
}