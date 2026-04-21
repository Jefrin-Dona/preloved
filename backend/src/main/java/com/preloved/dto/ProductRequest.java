package com.preloved.dto;

import java.math.BigDecimal;

public record ProductRequest(String title, String description,
                              BigDecimal price, String category, String condition) {}