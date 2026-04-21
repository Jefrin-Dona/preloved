# 🖼️ Complete Image Upload & Serving Configuration

## 📋 Overview
This document contains all files and code related to product image uploads and serving in the Preloved application.

**Current Issue**: Images are uploaded successfully but not displaying in the frontend. The path configuration needs to be fixed.

**Root Cause**: WebConfig path is resolving incorrectly. Files are in `backend/uploads/` but WebConfig points to `../uploads/`

---

## 🔴 CRITICAL FIX NEEDED

### File: `backend/src/main/java/com/preloved/config/WebConfig.java`

**CURRENT (WRONG):**
```java
package com.preloved.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = Paths.get("../uploads").toAbsolutePath().toString();
        System.out.println("📁 Serving uploads from: " + uploadDir);
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
```

**SHOULD BE (FIX):**
```java
package com.preloved.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = Paths.get("./uploads").toAbsolutePath().toString();
        System.out.println("📁 Serving uploads from: " + uploadDir);
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
```

**Change**: `../uploads` → `./uploads`

---

## 📂 All Related Files

### 1️⃣ Frontend - ProductCard Component

**File**: `frontend/src/components/ProductCard.jsx`

```jsx
export default function ProductCard({ product }) {
  const imageUrl = product.imageUrl 
    ? `http://localhost:8080${product.imageUrl}`  // Backend URL on port 8080
    : "https://via.placeholder.com/200";
  
  const handleImageError = (e) => {
    console.error("❌ Image failed to load:", imageUrl, e);
    e.target.src = "https://via.placeholder.com/200";
  };
  
  const handleImageLoad = () => {
    console.log("✅ Image loaded successfully:", imageUrl);
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm truncate">{product.title}</h3>
        <p className="text-gray-600 text-xs mt-1 line-clamp-2">{product.description}</p>
        <p className="text-rose-600 font-bold mt-2">${product.price}</p>
      </div>
    </div>
  );
}
```

---

### 2️⃣ Backend - Security Config (Allows Public Access to `/uploads/`)

**File**: `backend/src/main/java/com/preloved/config/SecurityConfig.java`

```java
package com.preloved.config;
import com.preloved.security.JwtFilter;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(c -> c.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/health").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/products/search","/api/products/{id}").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()  // 🔑 ALLOW PUBLIC ACCESS TO UPLOADS
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

---

### 3️⃣ Backend - File Storage Service

**File**: `backend/src/main/java/com/preloved/service/FileStorageService.java`

```java
package com.preloved.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = "./uploads";

    public FileStorageService() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path path = Paths.get(uploadDir, filename);
        Files.write(path, file.getBytes());
        return "/uploads/" + filename;  // Return path as served by WebConfig
    }
}
```

---

### 4️⃣ Backend - Product Entity

**File**: `backend/src/main/java/com/preloved/entity/Product.java`

```java
package com.preloved.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    
    @Column(name = "`condition`")  // 🔑 ESCAPE RESERVED KEYWORD
    private String condition;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    private String status;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Get first image URL for convenience
    public String getImageUrl() {
        return (imageUrls != null && !imageUrls.isEmpty()) ? imageUrls.get(0) : null;
    }
}
```

---

### 5️⃣ Backend - Product Service

**File**: `backend/src/main/java/com/preloved/service/ProductService.java`

```java
package com.preloved.service;

import com.preloved.dto.ProductRequest;
import com.preloved.entity.Product;
import com.preloved.entity.User;
import com.preloved.repository.ProductRepository;
import com.preloved.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final FileStorageService fileStorageService;

    public ProductService(ProductRepository productRepo, UserRepository userRepo, FileStorageService fileStorageService) {
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.fileStorageService = fileStorageService;
    }

    public Product addProduct(ProductRequest req, List<MultipartFile> images, String sellerEmail) {
        User seller = userRepo.findByEmail(sellerEmail).orElseThrow();

        // Upload images and get paths
        List<String> imagePaths = images.stream()
                .map(img -> {
                    try {
                        return fileStorageService.uploadFile(img);
                    } catch (Exception e) {
                        throw new RuntimeException("Image upload failed", e);
                    }
                })
                .collect(Collectors.toList());

        Product product = new Product();
        product.setTitle(req.title());
        product.setDescription(req.description());
        product.setPrice(req.price());
        product.setCategory(req.category());
        product.setCondition(req.condition());
        product.setImageUrls(imagePaths);  // 🔑 STORE IMAGE PATHS
        product.setSeller(seller);
        product.setStatus("AVAILABLE");

        return productRepo.save(product);
    }

    public List<Product> getSellerProducts(String email) {
        return productRepo.findBySellerEmail(email);
    }

    public Page<Product> search(String keyword, String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable page) {
        return productRepo.findAll(page);
    }

    public Product findById(Long id) {
        return productRepo.findById(id).orElseThrow();
    }

    public void deleteProduct(Long id, String sellerEmail) {
        Product product = productRepo.findById(id).orElseThrow();
        if (!product.getSeller().getEmail().equals(sellerEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        productRepo.delete(product);
    }
}
```

---

### 6️⃣ Backend - Product Controller

**File**: `backend/src/main/java/com/preloved/controller/ProductController.java`

```java
package com.preloved.controller;

import com.preloved.dto.*;
import com.preloved.entity.Product;
import com.preloved.service.ProductService;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.search(keyword, category, minPrice, maxPrice, PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PostMapping("/seller/add")
    public ResponseEntity<Product> addProduct(@RequestPart("data") ProductRequest req,
            @RequestPart("images") List<MultipartFile> images, @AuthenticationPrincipal UserDetails ud) {
        if (ud == null) {
            throw new RuntimeException("User not authenticated");
        }
        return ResponseEntity.ok(productService.addProduct(req, images, ud.getUsername()));
    }

    @GetMapping("/seller/mine")
    public ResponseEntity<List<Product>> myProducts(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(productService.getSellerProducts(ud.getUsername()));
    }

    @DeleteMapping("/seller/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        productService.deleteProduct(id, ud.getUsername());
        return ResponseEntity.ok(new MessageResponse("Removed"));
    }
}
```

---

### 7️⃣ Backend - Product DTO

**File**: `backend/src/main/java/com/preloved/dto/ProductRequest.java`

```java
package com.preloved.dto;

import java.math.BigDecimal;

public record ProductRequest(
    String title,
    String description,
    BigDecimal price,
    String category,
    String condition
) {}
```

---

## 🔧 How It Works

### Upload Flow:
1. **Frontend** → FormData with images
2. **ProductController** receives `@RequestPart("images")`
3. **FileStorageService** saves to `./uploads/UUID-filename.jpg`
4. **ProductService** stores path `/uploads/UUID-filename.jpg` in database
5. **Product entity** returns via API with `imageUrl` field

### Serving Flow:
1. **Frontend** requests `http://localhost:8080/uploads/UUID-filename.jpg`
2. **SecurityConfig** allows public access to `/uploads/**`
3. **WebConfig** maps `/uploads/**` → `./uploads/` directory
4. **Spring** serves the file directly

---

## ✅ Checklist to Fix

- [ ] Update `WebConfig.java`: Change `../uploads` to `./uploads`
- [ ] Recompile backend: `mvn compile -q`
- [ ] Backend auto-reloads (DevTools)
- [ ] Hard refresh frontend: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
- [ ] Check browser console for: `✅ Image loaded successfully:`
- [ ] Images should appear in ProductCard

---

## 🐛 Debug Commands

```bash
# Check if files exist
ls -la /Users/jonathan/elco/preloved/backend/uploads/

# Check what path WebConfig resolves to
# (Will be in Spring Boot console output when it starts)
# Look for: "📁 Serving uploads from: ..."

# Direct test - try this URL in browser
http://localhost:8080/uploads/a7f25a83-6801-4b4a-add0-cfe3cbd53144-IMG_6603.jpg
```

---

## 📊 Directory Structure

```
/Users/jonathan/elco/preloved/
├── backend/
│   ├── src/
│   │   ├── main/java/com/preloved/
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java     ✅ Allow /uploads/**
│   │   │   │   └── WebConfig.java          🔴 FIX: Change ../uploads to ./uploads
│   │   │   ├── controller/
│   │   │   │   └── ProductController.java
│   │   │   ├── service/
│   │   │   │   ├── FileStorageService.java
│   │   │   │   └── ProductService.java
│   │   │   ├── entity/
│   │   │   │   └── Product.java
│   │   │   └── dto/
│   │   │       └── ProductRequest.java
│   │   └── resources/
│   │       └── application.properties
│   ├── uploads/                             📁 Files stored here
│   │   ├── UUID-IMG_6603.jpg
│   │   ├── UUID-IMG_6604.jpg
│   │   └── ...
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   └── components/
│   │       └── ProductCard.jsx              ✅ Loads from http://localhost:8080
│   └── package.json
└── uploads/  (OLD - files should be in backend/uploads/)
```

---

## 🚀 Quick Start

1. Make the **ONE LINE CHANGE** in `WebConfig.java`
2. Run: `cd /Users/jonathan/elco/preloved/backend && export JAVA_HOME=$(/usr/libexec/java_home) && mvn compile -q`
3. Hard refresh browser
4. **Done!** Images should load ✅
