package com.preloved.service;

import com.preloved.dto.RegisterRequest;
import com.preloved.entity.User;
import com.preloved.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest req) {
        if (userRepo.findByEmail(req.email()).isPresent())
            throw new RuntimeException("Email already in use");
        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .role(User.Role.valueOf(req.role().toUpperCase()))
                .build();
        return userRepo.save(user);
    }

    public User login(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new RuntimeException("Invalid password");
        return user;
    }

    public User findByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getPendingVerification() {
        return userRepo.findByRoleAndIdVerifiedFalse(User.Role.SELLER);
    }

    public void verifySeller(Long id) {
        User seller = userRepo.findById(id).orElseThrow();
        seller.setIdVerified(true);
        userRepo.save(seller);
    }

    public void banSeller(Long id) {
        User seller = userRepo.findById(id).orElseThrow();
        seller.setBanned(true);
        userRepo.save(seller);
    }
}