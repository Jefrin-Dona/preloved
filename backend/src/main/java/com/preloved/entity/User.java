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
    private String phone;
    @Enumerated(EnumType.STRING)
    private Role role;
    private String idDocumentUrl;
    private boolean idVerified = false;
    private boolean banned = false;
    private int falseReviewCount = 0;
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role { BUYER, SELLER, ADMIN }

    public User() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getIdDocumentUrl() { return idDocumentUrl; }
    public void setIdDocumentUrl(String idDocumentUrl) { this.idDocumentUrl = idDocumentUrl; }
    public boolean isIdVerified() { return idVerified; }
    public void setIdVerified(boolean idVerified) { this.idVerified = idVerified; }
    public boolean isBanned() { return banned; }
    public void setBanned(boolean banned) { this.banned = banned; }
    public int getFalseReviewCount() { return falseReviewCount; }
    public void setFalseReviewCount(int falseReviewCount) { this.falseReviewCount = falseReviewCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final User user = new User();
        public Builder id(Long id) { user.id = id; return this; }
        public Builder email(String email) { user.email = email; return this; }
        public Builder password(String password) { user.password = password; return this; }
        public Builder name(String name) { user.name = name; return this; }
        public Builder phone(String phone) { user.phone = phone; return this; }
        public Builder role(Role role) { user.role = role; return this; }
        public Builder idVerified(boolean idVerified) { user.idVerified = idVerified; return this; }
        public Builder banned(boolean banned) { user.banned = banned; return this; }
        public User build() { return user; }
    }
}
