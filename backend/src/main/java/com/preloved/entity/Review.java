package com.preloved.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "reviewer_id")
    private User reviewer;
    @ManyToOne @JoinColumn(name = "seller_id")
    private User seller;
    @ManyToOne @JoinColumn(name = "product_id")
    private Product product;
    private int rating;
    private String comment;
    private boolean falseDescriptionFlag = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }
    public User getSeller() { return seller; }
    public void setSeller(User seller) { this.seller = seller; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public boolean isFalseDescriptionFlag() { return falseDescriptionFlag; }
    public void setFalseDescriptionFlag(boolean f) { this.falseDescriptionFlag = f; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Review r = new Review();
        public Builder reviewer(User reviewer) { r.reviewer = reviewer; return this; }
        public Builder seller(User seller) { r.seller = seller; return this; }
        public Builder product(Product product) { r.product = product; return this; }
        public Builder rating(int rating) { r.rating = rating; return this; }
        public Builder comment(String comment) { r.comment = comment; return this; }
        public Review build() { return r; }
    }
}
