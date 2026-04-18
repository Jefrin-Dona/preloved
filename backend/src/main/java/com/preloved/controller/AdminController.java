package com.preloved.controller;
import com.preloved.dto.*;
import com.preloved.entity.User;
import com.preloved.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    private final UserService userService;
    private final ReviewService reviewService;
    private final ProductService productService;

    public AdminController(UserService userService, ReviewService reviewService, ProductService productService) {
        this.userService = userService;
        this.reviewService = reviewService;
        this.productService = productService;
    }

    @GetMapping("/sellers/pending")
    public ResponseEntity<List<User>> pendingVerification() {
        return ResponseEntity.ok(userService.getPendingVerification());
    }

    @PostMapping("/sellers/{id}/verify")
    public ResponseEntity<?> verifySeller(@PathVariable Long id) {
        userService.verifySeller(id);
        return ResponseEntity.ok(new MessageResponse("Seller verified"));
    }

    @PostMapping("/reviews/{id}/flag-false")
    public ResponseEntity<?> flagFalseReview(@PathVariable Long id) {
        reviewService.flagFalseReview(id);
        return ResponseEntity.ok(new MessageResponse("Review flagged"));
    }

    @PostMapping("/sellers/{id}/ban")
    public ResponseEntity<?> banSeller(@PathVariable Long id) {
        userService.banSeller(id);
        return ResponseEntity.ok(new MessageResponse("Seller banned"));
    }

    @GetMapping("/products/reported")
    public ResponseEntity<?> reportedProducts() {
        return ResponseEntity.ok(productService.getReportedProducts());
    }
}
