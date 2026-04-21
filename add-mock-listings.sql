-- Add more mock listings with real uploaded images
INSERT INTO products (category, `condition`, created_at, description, price, seller_id, status, title) VALUES
('Electronics', 'LIKE_NEW', NOW(), 'Brand new MacBook Pro 14 inch M3 chip, sealed box, never opened', 1299.99, 7, 'AVAILABLE', 'MacBook Pro 14" M3 2024'),
('Clothing', 'GOOD', NOW(), 'Vintage Levi\'s 501 jeans, size 32, original 1990s, great condition with minor fading', 45.00, 7, 'AVAILABLE', 'Vintage Levi\'s 501 Jeans'),
('Shoes', 'LIKE_NEW', NOW(), 'Nike Air Force 1 Low Classic White, size 10, worn once indoors', 89.99, 7, 'AVAILABLE', 'Nike Air Force 1 Low White'),
('Accessories', 'GOOD', NOW(), 'Gucci Marmont small leather shoulder bag, authentic with hologram, minor scratches', 699.00, 7, 'AVAILABLE', 'Gucci Marmont Leather Bag'),
('Clothing', 'FAIR', NOW(), 'Cashmere blend cardigan, cream color, size M, some pilling but very soft', 35.00, 7, 'AVAILABLE', 'Cashmere Blend Cardigan Cream'),
('Watches', 'GOOD', NOW(), 'Fossil Townsman automatic watch, brown leather strap, keeps perfect time', 120.00, 7, 'AVAILABLE', 'Fossil Townsman Watch');

-- Get the last 6 product IDs
SET @lastId = LAST_INSERT_ID();
SET @id1 = @lastId - 5;
SET @id2 = @lastId - 4;
SET @id3 = @lastId - 3;
SET @id4 = @lastId - 2;
SET @id5 = @lastId - 1;
SET @id6 = @lastId;

-- Add images for the new products (using the real uploaded images)
INSERT INTO product_images (product_id, image_url) VALUES
(@id1, '/uploads/0337c0a9-0e9e-4502-a84b-98a2b5b63937-IMG_6603.jpg'),
(@id2, '/uploads/a7f25a83-6801-4b4a-add0-cfe3cbd53144-IMG_6603.jpg'),
(@id3, '/uploads/144d58d4-dc93-4ce1-ae6e-ccdfd8799b13-IMG_6603.jpg'),
(@id4, '/uploads/286de0fc-18e6-4e1e-a43b-baea2b7cfc38-IMG_6604.jpg'),
(@id5, '/uploads/cdb2bf73-da91-41cf-a58f-6c6023f61c31-IMG_6603.jpg'),
(@id6, '/uploads/dda364ca-d6e8-4bec-9ff3-2b1e4974915e-IMG_6603.jpg');
