package com.preloved.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(new Object() {
            public String status = "UP";
            public String message = "Looply Backend is running on port 8080";
            public String version = "1.0.0";
        });
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(new Object() {
            public String status = "UP";
            public String message = "Server is healthy";
        });
    }
}
