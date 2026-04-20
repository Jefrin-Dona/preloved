package com.preloved.service;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import com.preloved.entity.Product;
import com.preloved.repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository productRepo;

    public ProductService(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    public List<Product> getAllMockupProducts() {
        return Arrays.asList(
            Product.builder().title("Vintage Nike Shoes").description("Classic white leather sneakers").price(new BigDecimal("45.99")).imageUrl("https://via.placeholder.com/200?text=Nike+Shoes").build(),
            Product.builder().title("Blue Denim Jacket").description("Premium vintage denim jacket").price(new BigDecimal("35.50")).imageUrl("https://via.placeholder.com/200?text=Denim+Jacket").build(),
            Product.builder().title("Leather Handbag").description("Brown leather crossbody bag").price(new BigDecimal("55.00")).imageUrl("https://via.placeholder.com/200?text=Handbag").build(),
            Product.builder().title("Summer T-Shirt").description("Cotton graphic tee").price(new BigDecimal("15.99")).imageUrl("https://via.placeholder.com/200?text=T-Shirt").build(),
            Product.builder().title("Black Boots").description("Waterproof winter boots").price(new BigDecimal("65.00")).imageUrl("https://via.placeholder.com/200?text=Boots").build(),
            Product.builder().title("Wool Sweater").description("Warm knit sweater").price(new BigDecimal("28.50")).imageUrl("https://via.placeholder.com/200?text=Sweater").build()
        );
    }

    public Product findById(Long id) {
        return productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }
}
