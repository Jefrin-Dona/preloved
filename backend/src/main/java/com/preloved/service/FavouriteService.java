package com.preloved.service;
import com.preloved.entity.*;
import com.preloved.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FavouriteService {
    private final FavouriteRepository favouriteRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public FavouriteService(FavouriteRepository favouriteRepo, UserRepository userRepo, ProductRepository productRepo) {
        this.favouriteRepo = favouriteRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    public List<Favourite> getFavourites(String email) {
        return favouriteRepo.findByUser(userRepo.findByEmail(email).orElseThrow());
    }

    public void addFavourite(String email, Long productId) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();
        favouriteRepo.save(Favourite.builder().user(user).product(product).build());
    }

    public void removeFavourite(String email, Long productId) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();
        favouriteRepo.deleteByUserAndProduct(user, product);
    }
}
