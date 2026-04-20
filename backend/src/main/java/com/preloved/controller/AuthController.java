package com.preloved.controller;

import com.preloved.dto.AuthRequest;
import com.preloved.dto.AuthResponse;
import com.preloved.dto.RegisterRequest;
import com.preloved.entity.User;
import com.preloved.service.UserService;
import com.preloved.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}