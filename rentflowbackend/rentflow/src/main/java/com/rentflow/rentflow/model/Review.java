package com.rentflow.rentflow.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    private String comment;
    private int rating; // 1 to 5
    private LocalDate reviewDate;

    @Enumerated(EnumType.STRING)
    private ReviewType type; // TENANT_REVIEW or LANDLORD_REVIEW

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public LocalDate getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }

    public ReviewType getType() { return type; }
    public void setType(ReviewType type) { this.type = type; }
}