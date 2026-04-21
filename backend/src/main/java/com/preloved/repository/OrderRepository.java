package com.preloved.repository;
import com.preloved.entity.Order;
import com.preloved.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyer(User buyer);
}
