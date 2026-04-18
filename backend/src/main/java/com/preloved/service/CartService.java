package com.preloved.service;
import com.preloved.entity.*;
import com.preloved.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {
    private final CartItemRepository cartRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public CartService(CartItemRepository cartRepo, UserRepository userRepo, ProductRepository productRepo) {
        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    public List<CartItem> getCart(String email) {
        return cartRepo.findByUser(userRepo.findByEmail(email).orElseThrow());
    }

    public void addToCart(String email, Long productId) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();
        CartItem item = CartItem.builder().user(user).product(product).build();
        cartRepo.save(item);
    }

    public void removeFromCart(String email, Long productId) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();
        cartRepo.deleteByUserAndProduct(user, product);
    }
}
