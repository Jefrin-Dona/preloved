package com.preloved.controller;

import com.preloved.dto.ReviewRequest;
import com.preloved.entity.Review;
import com.preloved.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/seller/{sellerId}")
    public ResponseEntity<Review> postReview(@PathVariable Long sellerId,
            @RequestBody ReviewRequest req, @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(reviewService.addReview(sellerId, req, ud.getUsername()));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Review>> getSellerReviews(@PathVariable Long sellerId) {
        return ResponseEntity.ok(reviewService.getSellerReviews(sellerId));
    }
}