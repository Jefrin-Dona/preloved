package com.preloved.repository;
import com.preloved.entity.Favourite;
import com.preloved.entity.Product;
import com.preloved.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    List<Favourite> findByUser(User user);
    void deleteByUserAndProduct(User user, Product product);
}
