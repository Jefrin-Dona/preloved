package com.preloved.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(length = 2000)
    private String description;
    private BigDecimal price;
    private String category;
    private String condition;
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;
    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;
    @Enumerated(EnumType.STRING)
    private ProductStatus status;
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ProductStatus { AVAILABLE, SOLD, REMOVED }

    public Product() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }
    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Product p = new Product();
        public Builder title(String title) { p.title = title; return this; }
        public Builder description(String description) { p.description = description; return this; }
        public Builder price(BigDecimal price) { p.price = price; return this; }
        public Builder category(String category) { p.category = category; return this; }
        public Builder condition(String condition) { p.condition = condition; return this; }
        public Builder imageUrls(List<String> imageUrls) { p.imageUrls = imageUrls; return this; }
        public Builder seller(User seller) { p.seller = seller; return this; }
        public Builder status(ProductStatus status) { p.status = status; return this; }
        public Product build() { return p; }
    }
}
