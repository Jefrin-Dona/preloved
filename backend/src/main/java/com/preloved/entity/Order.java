package com.preloved.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "buyer_id")
    private User buyer;
    @ManyToOne @JoinColumn(name = "product_id")
    private Product product;
    private BigDecimal totalAmount;
    private String stripePaymentIntentId;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum OrderStatus { PENDING, PAID, CANCELLED }

    public Order() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getBuyer() { return buyer; }
    public void setBuyer(User buyer) { this.buyer = buyer; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getStripePaymentIntentId() { return stripePaymentIntentId; }
    public void setStripePaymentIntentId(String s) { this.stripePaymentIntentId = s; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Order o = new Order();
        public Builder buyer(User buyer) { o.buyer = buyer; return this; }
        public Builder product(Product product) { o.product = product; return this; }
        public Builder totalAmount(BigDecimal totalAmount) { o.totalAmount = totalAmount; return this; }
        public Builder stripePaymentIntentId(String s) { o.stripePaymentIntentId = s; return this; }
        public Builder status(OrderStatus status) { o.status = status; return this; }
        public Order build() { return o; }
    }
}
