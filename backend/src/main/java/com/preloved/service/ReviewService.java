package com.preloved.service;
import com.preloved.dto.ReviewRequest;
import com.preloved.entity.*;
import com.preloved.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepo;
    private final UserRepository userRepo;

    public ReviewService(ReviewRepository reviewRepo, UserRepository userRepo) {
        this.reviewRepo = reviewRepo;
        this.userRepo = userRepo;
    }

    public Review addReview(Long sellerId, ReviewRequest req, String reviewerEmail) {
        User reviewer = userRepo.findByEmail(reviewerEmail).orElseThrow();
        User seller = userRepo.findById(sellerId).orElseThrow();
        return reviewRepo.save(Review.builder().reviewer(reviewer).seller(seller)
                .rating(req.rating()).comment(req.comment()).build());
    }

    public List<Review> getSellerReviews(Long sellerId) {
        return reviewRepo.findBySeller(userRepo.findById(sellerId).orElseThrow());
    }

    public void flagFalseReview(Long reviewId) {
        Review review = reviewRepo.findById(reviewId).orElseThrow();
        review.setFalseDescriptionFlag(true);
        reviewRepo.save(review);
        User seller = review.getSeller();
        seller.setFalseReviewCount(seller.getFalseReviewCount() + 1);
        if (seller.getFalseReviewCount() >= 3) seller.setBanned(true);
        userRepo.save(seller);
    }
}
