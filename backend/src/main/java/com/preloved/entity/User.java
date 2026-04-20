package com.preloved.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    private String name;
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final User user = new User();
        public Builder id(Long id) { user.id = id; return this; }
        public Builder email(String email) { user.email = email; return this; }
        public Builder password(String password) { user.password = password; return this; }
        public Builder name(String name) { user.name = name; return this; }
        public User build() { return user; }
    }
}
