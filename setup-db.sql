-- Create database
CREATE DATABASE IF NOT EXISTS preloved_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE preloved_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  price DECIMAL(10,2),
  image_url VARCHAR(500)
);

-- Insert mockup products
INSERT INTO products (title, description, price, image_url) VALUES
('Vintage Nike Shoes', 'Classic white leather sneakers', 45.99, 'https://via.placeholder.com/200?text=Nike+Shoes'),
('Blue Denim Jacket', 'Premium vintage denim jacket', 35.50, 'https://via.placeholder.com/200?text=Denim+Jacket'),
('Leather Handbag', 'Brown leather crossbody bag', 55.00, 'https://via.placeholder.com/200?text=Handbag'),
('Summer T-Shirt', 'Cotton graphic tee', 15.99, 'https://via.placeholder.com/200?text=T-Shirt'),
('Black Boots', 'Waterproof winter boots', 65.00, 'https://via.placeholder.com/200?text=Boots'),
('Wool Sweater', 'Warm knit sweater', 28.50, 'https://via.placeholder.com/200?text=Sweater');

-- Show created tables
SHOW TABLES;
SELECT * FROM products;
