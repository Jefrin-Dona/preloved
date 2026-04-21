package com.preloved.repository;
import com.preloved.entity.Review;
import com.preloved.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findBySeller(User seller);
}
