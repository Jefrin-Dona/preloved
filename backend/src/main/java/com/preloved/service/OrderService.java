package com.preloved.service;
import com.preloved.dto.PaymentRequest;
import com.preloved.entity.*;
import com.preloved.repository.*;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    @Value("${stripe.secret.key}")
    private String stripeKey;

    public OrderService(OrderRepository orderRepo, ProductRepository productRepo, UserRepository userRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }

    public String createPaymentIntent(Long productId, String buyerEmail) throws Exception {
        Stripe.apiKey = stripeKey;
        Product product = productRepo.findById(productId).orElseThrow();
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(product.getPrice().multiply(java.math.BigDecimal.valueOf(100)).longValue())
                .setCurrency("usd").build();
        return PaymentIntent.create(params).getClientSecret();
    }

    public Order confirmOrder(PaymentRequest req, String buyerEmail) {
        User buyer = userRepo.findByEmail(buyerEmail).orElseThrow();
        Product product = productRepo.findById(req.productId()).orElseThrow();
        product.setStatus(Product.ProductStatus.SOLD);
        productRepo.save(product);
        return orderRepo.save(Order.builder().buyer(buyer).product(product)
                .totalAmount(product.getPrice())
                .stripePaymentIntentId(req.paymentIntentId())
                .status(Order.OrderStatus.PAID).build());
    }

    public List<Order> getBuyerOrders(String email) {
        return orderRepo.findByBuyer(userRepo.findByEmail(email).orElseThrow());
    }
}
