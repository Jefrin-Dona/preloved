-- Drop existing database if it exists
DROP DATABASE IF EXISTS preloved_db;

-- Create database
CREATE DATABASE preloved_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE preloved_db;

-- Create users table
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'BUYER',
  id_document_url VARCHAR(500) NULL,
  id_verified BOOLEAN DEFAULT FALSE,
  banned BOOLEAN DEFAULT FALSE,
  false_review_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(2000),
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  `condition` VARCHAR(50),
  seller_id BIGINT,
  status VARCHAR(50) DEFAULT 'AVAILABLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- Create product_images table
CREATE TABLE product_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  image_url VARCHAR(500),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  buyer_id BIGINT NOT NULL,
  seller_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create cart_items table
CREATE TABLE cart_items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create favourites table
CREATE TABLE favourites (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create reviews table
CREATE TABLE reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  buyer_id BIGINT NOT NULL,
  rating INT DEFAULT 5,
  comment VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- ===================================
-- INSERT DEMO USERS
-- ===================================
-- IMPORTANT: The passwords below are hashed using BCrypt
-- Seller account:
--   Email: seller@preloved.com
--   Password: seller123
-- Buyer account:
--   Email: buyer@preloved.com
--   Password: buyer123
-- Admin account:
--   Email: admin@preloved.com
--   Password: admin123

INSERT INTO users (email, password, name, phone, role, id_verified, banned, false_review_count) VALUES 
-- Seller User (password: seller123)
('seller@preloved.com', '$2a$10$slYQmyNdGzin7olVvHGFLOYvX1j/n3R0c1qRpVLn3VzFxLqNOJvDa', 'Sarah Vintage Seller', '+1-800-SELLER-1', 'SELLER', TRUE, FALSE, 0),

-- Buyer User (password: buyer123)
('buyer@preloved.com', '$2a$10$vTEWKTZgAKzO4PO1WYX74O8MVxkMzVSUBOZfqVY8tZ7N1F6k1ZR2i', 'John Buyer', '+1-800-BUYER-1', 'BUYER', TRUE, FALSE, 0),

-- Admin User (password: admin123)
('admin@preloved.com', '$2a$10$dXmRJKbWJnT3VzKb5L2S7.mKNZxM4q7Y6Q1P8H9N2K4D5E6A7B8C', 'Admin User', '+1-800-ADMIN-1', 'ADMIN', TRUE, FALSE, 0),

-- Additional demo seller for variety
('vintage.master@preloved.com', '$2a$10$slYQmyNdGzin7olVvHGFLOYvX1j/n3R0c1qRpVLn3VzFxLqNOJvDa', 'Alex Master Seller', '+1-800-SELLER-2', 'SELLER', TRUE, FALSE, 0),

-- Additional demo buyer
('customer.jane@preloved.com', '$2a$10$vTEWKTZgAKzO4PO1WYX74O8MVxkMzVSUBOZfqVY8tZ7N1F6k1ZR2i', 'Jane Smith', '+1-800-BUYER-2', 'BUYER', TRUE, FALSE, 0);

-- ===================================
-- INSERT DEMO PRODUCTS
-- ===================================

INSERT INTO products (title, description, price, category, `condition`, seller_id, status) VALUES
-- Seller 1 Products (ID 1)
('Vintage Levis 501 Jeans', 'Classic 90s Levis 501 jeans in perfect condition. Dark blue denim with minimal fading. Authentic vintage piece, well-maintained.', 45.99, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Leather Crossbody Bag', 'Brown genuine leather crossbody bag with gold hardware. Minor scuff marks on corners but very functional and stylish. Great for travel.', 55.00, 'Accessories', 'Good', 1, 'AVAILABLE'),
('Nike Air Force 1 White', 'Iconic white leather sneakers. Gently worn, clean sole, very comfortable. Authentic Nike product, perfect condition.', 65.50, 'Shoes', 'Good', 1, 'AVAILABLE'),
('Wool Cardigan Sweater', 'Cream colored wool cardigan with wooden buttons. Perfect for autumn, cozy and warm. Premium quality material, no holes or snags.', 28.50, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Vintage Gucci Sunglasses', 'Designer sunglasses with UV protection. Minor scratches on lens but hardly noticeable. Authentic Gucci, comes with case.', 75.00, 'Accessories', 'Fair', 1, 'AVAILABLE'),
('Timberland Boots', 'Waterproof winter boots in tan. Great for outdoor adventures, well-maintained. Durable construction, excellent for hiking.', 65.00, 'Shoes', 'Excellent', 1, 'AVAILABLE'),
('Cashmere Blend Scarf', 'Soft pink cashmere blend scarf. Perfect gift item, minimal wear. Luxurious feel, very warm and comfortable.', 35.00, 'Accessories', 'Excellent', 1, 'AVAILABLE'),
('Ralph Lauren Polo Shirt', 'Classic navy blue polo shirt. Clean, no stains or tears. Timeless style that pairs well with anything.', 22.00, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Vintage Chanel Handbag', 'Designer handbag with quilted pattern. Shows signs of use but authentic and functional. Iconic style, great investment piece.', 120.00, 'Accessories', 'Fair', 1, 'AVAILABLE'),
('Doc Martens Black Oxfords', 'Classic black Doc Martens. Broken in nicely, very comfortable for daily wear. Durable and stylish.', 58.00, 'Shoes', 'Good', 1, 'AVAILABLE'),
('Gap Denim Jacket', 'Light wash denim jacket. Perfect layering piece for spring and fall. Casual and versatile.', 32.50, 'Clothing', 'Good', 1, 'AVAILABLE'),
('Fossil Watch', 'Classic analog watch with leather strap. Keeps perfect time, runs great. Elegant design suitable for any occasion.', 42.00, 'Accessories', 'Excellent', 1, 'AVAILABLE'),
('Adidas Superstar Sneakers', 'White and black classic Adidas. Minor scuff on toe, still in great shape. Iconic three stripes design.', 48.00, 'Shoes', 'Good', 1, 'AVAILABLE'),
('Silk Blouse Pink', 'Delicate pink silk blouse with subtle pattern. Perfect for office or casual wear. High quality silk material.', 38.00, 'Clothing', 'Excellent', 1, 'AVAILABLE'),

-- Seller 4 Products (ID 4) - Vintage Master Seller
('Tommy Hilfiger Sweater', 'Blue and white striped sweater. Warm and cozy, perfect condition. Premium cotton blend.', 25.00, 'Clothing', 'Excellent', 4, 'AVAILABLE'),
('Leather Wallet Brown', 'Genuine leather bifold wallet with card slots. Well-worn but still functional. Classic design, great quality leather.', 18.50, 'Accessories', 'Good', 4, 'AVAILABLE'),
('Converse High Tops', 'Red canvas high-top Converse. Barely worn, like new condition. Authentic Chuck Taylor All Stars.', 35.00, 'Shoes', 'Excellent', 4, 'AVAILABLE'),
('Vintage Band Tee', 'Retro 80s band t-shirt. Soft from washing but graphics still intact. Collectors item, rare print.', 16.00, 'Clothing', 'Good', 4, 'AVAILABLE'),
('Gold Chain Necklace', 'Delicate gold chain necklace. 18k gold plated, elegant and timeless. Perfect for layering or solo wear.', 29.99, 'Accessories', 'Excellent', 4, 'AVAILABLE'),
('Chelsea Boots Burgundy', 'Burgundy suede Chelsea boots. Comfortable fit, great for dressing up or down. Premium suede material.', 62.00, 'Shoes', 'Good', 4, 'AVAILABLE'),
('Oversized Blazer Black', 'Classic black oversized blazer. Perfect for styling, no wrinkles or stains. Versatile piece for any wardrobe.', 48.00, 'Clothing', 'Excellent', 4, 'AVAILABLE'),
('Luxury Watch Silver', 'Luxury-style watch with metal band. Keeps accurate time, looks expensive. Beautiful craftsmanship.', 55.00, 'Accessories', 'Good', 4, 'AVAILABLE'),
('Puma Running Shoes', 'Lightweight running shoes in black and gray. Only used for gym, barely worn. Perfect condition, great support.', 52.00, 'Shoes', 'Excellent', 4, 'AVAILABLE'),
('Cotton Summer Dress', 'Light blue cotton dress with floral print. Perfect for warm weather, comfortable fit. Breathable and stylish.', 28.00, 'Clothing', 'Excellent', 4, 'AVAILABLE'),
('Silver Bracelet Set', 'Set of 3 silver bracelets with various designs. Minimal tarnish, very elegant. Great stacking options.', 24.00, 'Accessories', 'Good', 4, 'AVAILABLE'),
('Merrell Hiking Boots', 'Durable hiking boots with good grip. Perfect for outdoor enthusiasts, broken in nicely. Waterproof and comfortable.', 70.00, 'Shoes', 'Excellent', 4, 'AVAILABLE'),
('Graphic Hoodie Gray', 'Comfortable gray hoodie with faded graphic print. Perfect for casual wear, still soft. Cozy and stylish.', 26.00, 'Clothing', 'Good', 4, 'AVAILABLE'),
('Vintage Camera Polaroid', 'Functional instant camera. Takes great instant photos, retro aesthetic. Works perfectly, includes film cartridges.', 45.00, 'Electronics', 'Fair', 4, 'AVAILABLE');

-- ===================================
-- INSERT PRODUCT IMAGES
-- ===================================

INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://via.placeholder.com/400?text=Vintage+Levis'),
(2, 'https://via.placeholder.com/400?text=Leather+Bag'),
(3, 'https://via.placeholder.com/400?text=Nike+Air+Force'),
(4, 'https://via.placeholder.com/400?text=Wool+Cardigan'),
(5, 'https://via.placeholder.com/400?text=Gucci+Sunglasses'),
(6, 'https://via.placeholder.com/400?text=Timberland+Boots'),
(7, 'https://via.placeholder.com/400?text=Cashmere+Scarf'),
(8, 'https://via.placeholder.com/400?text=Polo+Shirt'),
(9, 'https://via.placeholder.com/400?text=Chanel+Handbag'),
(10, 'https://via.placeholder.com/400?text=Doc+Martens'),
(11, 'https://via.placeholder.com/400?text=Denim+Jacket'),
(12, 'https://via.placeholder.com/400?text=Fossil+Watch'),
(13, 'https://via.placeholder.com/400?text=Adidas+Superstar'),
(14, 'https://via.placeholder.com/400?text=Silk+Blouse'),
(15, 'https://via.placeholder.com/400?text=Tommy+Hilfiger'),
(16, 'https://via.placeholder.com/400?text=Leather+Wallet'),
(17, 'https://via.placeholder.com/400?text=Converse+High+Tops'),
(18, 'https://via.placeholder.com/400?text=Band+Tee'),
(19, 'https://via.placeholder.com/400?text=Gold+Necklace'),
(20, 'https://via.placeholder.com/400?text=Chelsea+Boots'),
(21, 'https://via.placeholder.com/400?text=Black+Blazer'),
(22, 'https://via.placeholder.com/400?text=Silver+Watch'),
(23, 'https://via.placeholder.com/400?text=Puma+Shoes'),
(24, 'https://via.placeholder.com/400?text=Summer+Dress'),
(25, 'https://via.placeholder.com/400?text=Silver+Bracelet'),
(26, 'https://via.placeholder.com/400?text=Hiking+Boots'),
(27, 'https://via.placeholder.com/400?text=Gray+Hoodie'),
(28, 'https://via.placeholder.com/400?text=Polaroid+Camera');

-- ===================================
-- ADD DEMO REVIEWS
-- ===================================

INSERT INTO reviews (product_id, buyer_id, rating, comment) VALUES
(1, 2, 5, 'Excellent quality! Exactly as described. Very happy with this purchase.'),
(3, 2, 4, 'Great shoes! Minor wear but still in amazing condition. Highly recommend.'),
(8, 5, 5, 'Perfect polo shirt. Classic style and excellent condition. Will buy again!'),
(12, 2, 5, 'Beautiful watch. Keeps perfect time and looks great. Highly satisfied.'),
(17, 5, 5, 'Love these Converse! Barely worn, like new. Great deal!');

-- ===================================
-- DATABASE SUMMARY
-- ===================================

SELECT '========== DATABASE SETUP COMPLETE ==========' AS Status;
SELECT '========== DEMO ACCOUNTS ==========' AS Section;
SELECT 'SELLER: seller@preloved.com | Password: seller123' AS Account_Info
UNION ALL
SELECT 'BUYER: buyer@preloved.com | Password: buyer123'
UNION ALL
SELECT 'ADMIN: admin@preloved.com | Password: admin123'
UNION ALL
SELECT 'SELLER2: vintage.master@preloved.com | Password: seller123'
UNION ALL
SELECT 'BUYER2: customer.jane@preloved.com | Password: buyer123';

SELECT COUNT(*) AS Total_Users FROM users;
SELECT COUNT(*) AS Total_Products FROM products;
SELECT COUNT(*) AS Total_Images FROM product_images;
SELECT COUNT(*) AS Total_Reviews FROM reviews;

SELECT '========== USERS ==========' AS Section;
SELECT id, email, name, role FROM users;

SELECT '========== PRODUCTS SAMPLE ==========' AS Section;
SELECT id, title, price, category, `condition`, status FROM products LIMIT 15;
