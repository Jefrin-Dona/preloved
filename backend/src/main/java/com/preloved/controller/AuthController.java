package com.preloved.controller;

import com.preloved.dto.AuthRequest;
import com.preloved.dto.AuthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.AuthenticationException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            String token = "dummy-token";
            return ResponseEntity.ok(
                new AuthResponse(token, request.getEmail(), 1L)
            );
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }
}