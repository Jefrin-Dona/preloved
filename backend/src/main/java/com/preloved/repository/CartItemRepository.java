package com.preloved.repository;
import com.preloved.entity.CartItem;
import com.preloved.entity.Product;
import com.preloved.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    void deleteByUserAndProduct(User user, Product product);
}
