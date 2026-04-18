package com.preloved.controller;

import com.preloved.dto.MessageResponse;
import com.preloved.entity.Favourite;
import com.preloved.service.FavouriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favourites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavouriteController {

    private final FavouriteService favouriteService;

    // ✅ FIX (manual constructor)
    public FavouriteController(FavouriteService favouriteService) {
        this.favouriteService = favouriteService;
    }

    @GetMapping
    public ResponseEntity<List<Favourite>> getFavourites(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(favouriteService.getFavourites(ud.getUsername()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> add(@PathVariable Long productId, @AuthenticationPrincipal UserDetails ud) {
        favouriteService.addFavourite(ud.getUsername(), productId);
        return ResponseEntity.ok(new MessageResponse("Added to favourites"));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> remove(@PathVariable Long productId, @AuthenticationPrincipal UserDetails ud) {
        favouriteService.removeFavourite(ud.getUsername(), productId);
        return ResponseEntity.ok(new MessageResponse("Removed from favourites"));
    }
}