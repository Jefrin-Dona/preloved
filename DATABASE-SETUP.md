# Preloved Database - Demo Credentials & Setup

## Database Initialization Complete ✅

### Demo Login Credentials

#### SELLER ACCOUNTS
| Email | Password | Name | Role |
|-------|----------|------|------|
| `seller@preloved.com` | `seller123` | Sarah Vintage Seller | SELLER |
| `vintage.master@preloved.com` | `seller123` | Alex Master Seller | SELLER |

#### BUYER ACCOUNTS
| Email | Password | Name | Role |
|-------|----------|------|------|
| `buyer@preloved.com` | `buyer123` | John Buyer | BUYER |
| `customer.jane@preloved.com` | `buyer123` | Jane Smith | BUYER |

#### ADMIN ACCOUNT
| Email | Password | Name | Role |
|-------|----------|------|------|
| `admin@preloved.com` | `admin123` | Admin User | ADMIN |

---

## Database Statistics

- **Total Users**: 5 (2 Sellers, 2 Buyers, 1 Admin)
- **Total Products**: 28 items
- **Product Images**: 28 placeholder images
- **Sample Reviews**: 5 review entries

---

## Product Categories & Details

### Products by Seller 1 (Sarah Vintage Seller)
1. **Vintage Levis 501 Jeans** - $45.99 (Clothing - Excellent)
2. **Leather Crossbody Bag** - $55.00 (Accessories - Good)
3. **Nike Air Force 1 White** - $65.50 (Shoes - Good)
4. **Wool Cardigan Sweater** - $28.50 (Clothing - Excellent)
5. **Vintage Gucci Sunglasses** - $75.00 (Accessories - Fair)
6. **Timberland Boots** - $65.00 (Shoes - Excellent)
7. **Cashmere Blend Scarf** - $35.00 (Accessories - Excellent)
8. **Ralph Lauren Polo Shirt** - $22.00 (Clothing - Excellent)
9. **Vintage Chanel Handbag** - $120.00 (Accessories - Fair)
10. **Doc Martens Black Oxfords** - $58.00 (Shoes - Good)
11. **Gap Denim Jacket** - $32.50 (Clothing - Good)
12. **Fossil Watch** - $42.00 (Accessories - Excellent)
13. **Adidas Superstar Sneakers** - $48.00 (Shoes - Good)
14. **Silk Blouse Pink** - $38.00 (Clothing - Excellent)

### Products by Seller 2 (Alex Master Seller)
15. **Tommy Hilfiger Sweater** - $25.00 (Clothing - Excellent)
16. **Leather Wallet Brown** - $18.50 (Accessories - Good)
17. **Converse High Tops** - $35.00 (Shoes - Excellent)
18. **Vintage Band Tee** - $16.00 (Clothing - Good)
19. **Gold Chain Necklace** - $29.99 (Accessories - Excellent)
20. **Chelsea Boots Burgundy** - $62.00 (Shoes - Good)
21. **Oversized Blazer Black** - $48.00 (Clothing - Excellent)
22. **Luxury Watch Silver** - $55.00 (Accessories - Good)
23. **Puma Running Shoes** - $52.00 (Shoes - Excellent)
24. **Cotton Summer Dress** - $28.00 (Clothing - Excellent)
25. **Silver Bracelet Set** - $24.00 (Accessories - Good)
26. **Merrell Hiking Boots** - $70.00 (Shoes - Excellent)
27. **Graphic Hoodie Gray** - $26.00 (Clothing - Good)
28. **Vintage Camera Polaroid** - $45.00 (Electronics - Fair)

---

## Testing the Application

### For Seller Testing
- Login with: `seller@preloved.com` / `seller123`
- Access seller dashboard to manage products
- View sales and customer interactions

### For Buyer Testing
- Login with: `buyer@preloved.com` / `buyer123`
- Browse and search products
- Add items to cart and favorites
- Leave reviews on products

### For Admin Testing
- Login with: `admin@preloved.com` / `admin123`
- Access admin dashboard
- Manage users and products

---

## Database Backup

To backup the database:
```bash
mysqldump -u root -p12345678 preloved_db > backup-preloved.sql
```

To restore from backup:
```bash
mysql -u root -p12345678 < backup-preloved.sql
```

---

## Quick Database Commands

Check if database exists:
```bash
mysql -u root -p12345678 -e "SHOW DATABASES LIKE 'preloved_db';"
```

View all users:
```bash
mysql -u root -p12345678 -e "USE preloved_db; SELECT id, email, name, role FROM users;"
```

Count products:
```bash
mysql -u root -p12345678 -e "USE preloved_db; SELECT COUNT(*) as total_products FROM products;"
```

---

## Next Steps

1. **Start Backend**: `mvn spring-boot:run` (Port 8080)
2. **Start Frontend**: `npm run dev` (Port 5173 or similar)
3. **Access Application**: Open `http://localhost:5173`
4. **Login**: Use any of the demo credentials above

---

Generated: 2026-04-21
