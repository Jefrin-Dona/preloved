package com.preloved.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.preloved.entity.User;
import com.preloved.repository.UserRepository;
import com.preloved.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/seller")
@CrossOrigin(origins = "http://localhost:5173")
public class SellerController {
    
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public SellerController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Mock ID verification endpoint for testing purposes
     * Allows sellers to verify their ID without requiring actual document upload
     * In production, this would be handled by a proper verification service
     */
    @PostMapping("/verify-id-mock")
    public ResponseEntity<String> mockVerifyId(HttpServletRequest request) {
        try {
            // Extract JWT token from request header
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            if (email == null) {
                return ResponseEntity.badRequest().body("Invalid token");
            }

            // Find user by email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update ID verification status
            user.setIdVerified(true);
            userRepository.save(user);

            return ResponseEntity.ok("{\"message\": \"ID verified successfully\", \"verified\": true}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }

    /**
     * Check seller verification status
     */
    @GetMapping("/verification-status")
    public ResponseEntity<?> getVerificationStatus(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body("Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(new VerificationStatusResponse(
                    user.isIdVerified(),
                    user.isBanned(),
                    user.getName(),
                    user.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }

    // DTO for verification status response
    public static class VerificationStatusResponse {
        public boolean idVerified;
        public boolean banned;
        public String name;
        public String email;

        public VerificationStatusResponse(boolean idVerified, boolean banned, String name, String email) {
            this.idVerified = idVerified;
            this.banned = banned;
            this.name = name;
            this.email = email;
        }
    }
}
