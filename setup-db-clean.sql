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

-- Insert seller user (password: seller123)
INSERT INTO users (email, password, name, phone, role, id_verified, banned, false_review_count) VALUES 
('seller@looply.com', '$2a$10$slYQmyNdGzin7olVvHGFLOYvX1j/n3R0c1qRpVLn3VzFxLqNOJvDa', 'Sarah Vintage', '+1234567890', 'SELLER', TRUE, FALSE, 0),
('admin@looply.com', '$2a$10$slYQmyNdGzin7olVvHGFLOYvX1j/n3R0c1qRpVLn3VzFxLqNOJvDa', 'Admin User', '+0987654321', 'ADMIN', TRUE, FALSE, 0);

-- Insert mock products
INSERT INTO products (title, description, price, category, `condition`, seller_id, status) VALUES
('Vintage Levis 501 Jeans', 'Classic 90s Levis 501 jeans in perfect condition. Dark blue denim with minimal fading.', 45.99, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Leather Crossbody Bag', 'Brown genuine leather crossbody bag with gold hardware. Minor scuff marks but very functional.', 55.00, 'Accessories', 'Good', 1, 'AVAILABLE'),
('Nike Air Force 1 White', 'Iconic white leather sneakers. Gently worn, clean sole, very comfortable.', 65.50, 'Shoes', 'Good', 1, 'AVAILABLE'),
('Wool Cardigan Sweater', 'Cream colored wool cardigan with wooden buttons. Perfect for autumn, cozy and warm.', 28.50, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Vintage Gucci Sunglasses', 'Designer sunglasses with UV protection. Minor scratches on lens but hardly noticeable.', 75.00, 'Accessories', 'Fair', 1, 'AVAILABLE'),
('Timberland Boots', 'Waterproof winter boots in tan. Great for outdoor adventures, well-maintained.', 65.00, 'Shoes', 'Excellent', 1, 'AVAILABLE'),
('Cashmere Blend Scarf', 'Soft pink cashmere blend scarf. Perfect gift item, minimal wear.', 35.00, 'Accessories', 'Excellent', 1, 'AVAILABLE'),
('Ralph Lauren Polo Shirt', 'Classic navy blue polo shirt. Clean, no stains or tears. Timeless style.', 22.00, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Vintage Chanel Handbag', 'Designer handbag with quilted pattern. Shows signs of use but authentic and functional.', 120.00, 'Accessories', 'Fair', 1, 'AVAILABLE'),
('Doc Martens Black Oxfords', 'Classic black Doc Martens. Broken in nicely, very comfortable for daily wear.', 58.00, 'Shoes', 'Good', 1, 'AVAILABLE'),
('Gap Denim Jacket', 'Light wash denim jacket. Perfect layering piece for spring and fall.', 32.50, 'Clothing', 'Good', 1, 'AVAILABLE'),
('Fossil Watch', 'Classic analog watch with leather strap. Keeps perfect time, runs great.', 42.00, 'Accessories', 'Excellent', 1, 'AVAILABLE'),
('Adidas Superstar Sneakers', 'White and black classic Adidas. Minor scuff on toe, still in great shape.', 48.00, 'Shoes', 'Good', 1, 'AVAILABLE'),
('Silk Blouse Pink', 'Delicate pink silk blouse with subtle pattern. Perfect for office or casual wear.', 38.00, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Tommy Hilfiger Sweater', 'Blue and white striped sweater. Warm and cozy, perfect condition.', 25.00, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Leather Wallet Brown', 'Genuine leather bifold wallet with card slots. Well-worn but still functional.', 18.50, 'Accessories', 'Good', 1, 'AVAILABLE'),
('Converse High Tops', 'Red canvas high-top Converse. Barely worn, like new condition.', 35.00, 'Shoes', 'Excellent', 1, 'AVAILABLE'),
('Vintage Band Tee', 'Retro 80s band t-shirt. Soft from washing but graphics still intact.', 16.00, 'Clothing', 'Good', 1, 'AVAILABLE'),
('Gold Chain Necklace', 'Delicate gold chain necklace. 18k gold plated, elegant and timeless.', 29.99, 'Accessories', 'Excellent', 1, 'AVAILABLE'),
('Chelsea Boots Burgundy', 'Burgundy suede Chelsea boots. Comfortable fit, great for dressing up or down.', 62.00, 'Shoes', 'Good', 1, 'AVAILABLE'),
('Oversized Blazer Black', 'Classic black oversized blazer. Perfect for styling, no wrinkles or stains.', 48.00, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Luxury Watch Silver', 'Luxury-style watch with metal band. Keeps accurate time, looks expensive.', 55.00, 'Accessories', 'Good', 1, 'AVAILABLE'),
('Puma Running Shoes', 'Lightweight running shoes in black and gray. Only used for gym, barely worn.', 52.00, 'Shoes', 'Excellent', 1, 'AVAILABLE'),
('Cotton Summer Dress', 'Light blue cotton dress with floral print. Perfect for warm weather, comfortable fit.', 28.00, 'Clothing', 'Excellent', 1, 'AVAILABLE'),
('Silver Bracelet Set', 'Set of 3 silver bracelets with various designs. Minimal tarnish, very elegant.', 24.00, 'Accessories', 'Good', 1, 'AVAILABLE'),
('Merrell Hiking Boots', 'Durable hiking boots with good grip. Perfect for outdoor enthusiasts, broken in nicely.', 70.00, 'Shoes', 'Excellent', 1, 'AVAILABLE'),
('Graphic Hoodie Gray', 'Comfortable gray hoodie with faded graphic print. Perfect for casual wear, still soft.', 26.00, 'Clothing', 'Good', 1, 'AVAILABLE'),
('Vintage Camera Polaroid', 'Functional instant camera. Takes great instant photos, retro aesthetic.', 45.00, 'Electronics', 'Fair', 1, 'AVAILABLE');

-- Insert product images
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

-- Display summary
SELECT '========== DATABASE SETUP COMPLETE ==========' AS Status;
SELECT COUNT(*) AS Total_Users FROM users;
SELECT COUNT(*) AS Total_Products FROM products;
SELECT COUNT(*) AS Total_Images FROM product_images;

SELECT '========== USERS ==========' AS Section;
SELECT id, email, name, role FROM users;

SELECT '========== PRODUCTS SAMPLE ==========' AS Section;
SELECT id, title, price, category, `condition`, status FROM products LIMIT 10;
