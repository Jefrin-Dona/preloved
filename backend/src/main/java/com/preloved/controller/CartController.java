package com.preloved.controller;

import com.preloved.dto.MessageResponse;
import com.preloved.entity.CartItem;
import com.preloved.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(cartService.getCart(ud.getUsername()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToCart(@PathVariable Long productId, @AuthenticationPrincipal UserDetails ud) {
        cartService.addToCart(ud.getUsername(), productId);
        return ResponseEntity.ok(new MessageResponse("Added to cart"));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId, @AuthenticationPrincipal UserDetails ud) {
        cartService.removeFromCart(ud.getUsername(), productId);
        return ResponseEntity.ok(new MessageResponse("Removed from cart"));
    }
}