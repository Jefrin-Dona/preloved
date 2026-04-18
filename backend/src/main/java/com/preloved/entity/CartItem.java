package com.preloved.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne @JoinColumn(name = "product_id")
    private Product product;

    public CartItem() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final CartItem c = new CartItem();
        public Builder user(User user) { c.user = user; return this; }
        public Builder product(Product product) { c.product = product; return this; }
        public CartItem build() { return c; }
    }
}
