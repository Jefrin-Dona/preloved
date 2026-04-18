package com.preloved.service;
import com.preloved.dto.ProductRequest;
import com.preloved.entity.*;
import com.preloved.repository.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final S3Service s3Service;

    public ProductService(ProductRepository productRepo, UserRepository userRepo, S3Service s3Service) {
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.s3Service = s3Service;
    }

    public Page<Product> search(String keyword, String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Specification<Product> spec = Specification.where(null);
        if (keyword != null && !keyword.isBlank())
            spec = spec.and((r, q, cb) -> cb.like(cb.lower(r.get("title")), "%" + keyword.toLowerCase() + "%"));
        if (category != null && !category.isBlank())
            spec = spec.and((r, q, cb) -> cb.equal(r.get("category"), category));
        if (minPrice != null)
            spec = spec.and((r, q, cb) -> cb.greaterThanOrEqualTo(r.get("price"), minPrice));
        if (maxPrice != null)
            spec = spec.and((r, q, cb) -> cb.lessThanOrEqualTo(r.get("price"), maxPrice));
        spec = spec.and((r, q, cb) -> cb.equal(r.get("status"), Product.ProductStatus.AVAILABLE));
        return productRepo.findAll(spec, pageable);
    }

    public Product addProduct(ProductRequest req, List<MultipartFile> images, String sellerEmail) {
        User seller = userRepo.findByEmail(sellerEmail).orElseThrow();
        if (seller.isBanned()) throw new RuntimeException("Your account is suspended.");
        if (!seller.isIdVerified()) throw new RuntimeException("ID must be verified before listing.");
        List<String> imageUrls = images.stream().map(s3Service::uploadFile).toList();
        return productRepo.save(Product.builder().title(req.title()).description(req.description())
                .price(req.price()).category(req.category()).condition(req.condition())
                .imageUrls(imageUrls).seller(seller).status(Product.ProductStatus.AVAILABLE).build());
    }

    public Product findById(Long id) {
        return productRepo.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getSellerProducts(String email) {
        return productRepo.findBySeller(userRepo.findByEmail(email).orElseThrow());
    }

    public Product updateProduct(Long id, ProductRequest req, List<MultipartFile> images, String email) {
        Product product = findById(id);
        if (!product.getSeller().getEmail().equals(email)) throw new RuntimeException("Unauthorized");
        product.setTitle(req.title()); product.setDescription(req.description());
        product.setPrice(req.price()); product.setCategory(req.category()); product.setCondition(req.condition());
        if (images != null && !images.isEmpty())
            product.setImageUrls(images.stream().map(s3Service::uploadFile).toList());
        return productRepo.save(product);
    }

    public void deleteProduct(Long id, String email) {
        Product product = findById(id);
        if (!product.getSeller().getEmail().equals(email)) throw new RuntimeException("Unauthorized");
        product.setStatus(Product.ProductStatus.REMOVED);
        productRepo.save(product);
    }

    public List<Product> getReportedProducts() {
        return productRepo.findByStatus(Product.ProductStatus.REMOVED);
    }
}
