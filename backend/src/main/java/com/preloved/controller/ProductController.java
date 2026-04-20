package com.preloved.controller;

import com.preloved.entity.Product;
import com.preloved.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllMockupProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }
}