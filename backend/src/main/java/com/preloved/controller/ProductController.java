package com.preloved.controller;

import com.preloved.dto.*;
import com.preloved.entity.Product;
import com.preloved.service.ProductService;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.search(keyword, category, minPrice, maxPrice, PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PostMapping("/seller/add")
    public ResponseEntity<Product> addProduct(@RequestPart("data") ProductRequest req,
            @RequestPart("images") List<MultipartFile> images, @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(productService.addProduct(req, images, ud.getUsername()));
    }

    @GetMapping("/seller/mine")
    public ResponseEntity<List<Product>> myProducts(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(productService.getSellerProducts(ud.getUsername()));
    }

    @DeleteMapping("/seller/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        productService.deleteProduct(id, ud.getUsername());
        return ResponseEntity.ok(new MessageResponse("Removed"));
    }
}