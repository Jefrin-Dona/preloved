package com.preloved.dto;

public record AuthResponse(String token, String email, Long id, String role) {}