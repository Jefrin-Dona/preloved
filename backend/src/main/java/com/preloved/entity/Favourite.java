package com.preloved.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "favourites")
public class Favourite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne @JoinColumn(name = "product_id")
    private Product product;

    public Favourite() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Favourite f = new Favourite();
        public Builder user(User user) { f.user = user; return this; }
        public Builder product(Product product) { f.product = product; return this; }
        public Favourite build() { return f; }
    }
}
