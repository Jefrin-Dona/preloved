package com.preloved.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 500)
    private String description;
    private BigDecimal price;
    private String imageUrl;

    public Product() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Product p = new Product();
        public Builder title(String title) { p.title = title; return this; }
        public Builder description(String description) { p.description = description; return this; }
        public Builder price(BigDecimal price) { p.price = price; return this; }
        public Builder imageUrl(String imageUrl) { p.imageUrl = imageUrl; return this; }
        public Product build() { return p; }
    }
}
