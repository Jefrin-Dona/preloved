# 🎯 Looply - Preloved Goods Marketplace

A full-stack e-commerce platform for buying and selling preloved (secondhand) goods with seller verification and fraud detection.

---

## 📋 Project Overview

**Looply** is a two-sided marketplace where:
- **Buyers** can browse, search, filter, add to cart, and purchase preloved items
- **Sellers** can upload products with multiple images and earn by selling items
- **Admins** can verify seller IDs and handle fraud reports

### Key Features

#### 🛍️ Buyer Features
- ✅ Browse all products with images, pricing, and conditions
- ✅ Search and filter by category, price range, and keywords
- ✅ View detailed product information and seller ratings
- ✅ Add products to cart and checkout securely
- ✅ Save favorite items for later purchases
- ✅ Leave reviews and ratings for sellers
- ✅ Flag false product descriptions (fraud reporting)

#### 🏪 Seller Features
- ✅ Upload multiple products with clear images
- ✅ ID verification (government-issued documents)
- ✅ Manage product listings (create, edit, delete)
- ✅ View product performance and reviews
- ✅ Receive notifications on sold items
- ✅ Auto-ban after 3 false description reports

#### 👮 Admin Features
- ✅ Verify seller identities via document upload
- ✅ Reject or approve ID documentation
- ✅ Monitor fraud reports and false descriptions
- ✅ Ban sellers with multiple fraud flags
- ✅ View dashboard with statistics

---

## 🏗️ Project Structure

```
preloved/
├── backend/                    # Java Spring Boot API
│   ├── src/main/
│   │   ├── java/com/preloved/
│   │   │   ├── entity/        # JPA Entities (User, Product, Order, etc.)
│   │   │   ├── controller/    # REST Controllers
│   │   │   ├── service/       # Business Logic
│   │   │   ├── repository/    # Database Access
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── security/      # JWT & Authentication
│   │   │   └── config/        # Spring Configurations
│   │   └── resources/
│   │       └── application.properties  # Database & Server Config
│   └── pom.xml                # Maven Dependencies
│
└── frontend/                   # React + Vite
    ├── src/
    │   ├── pages/            # All page components
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── ShopPage.jsx          # Buyer product listing
    │   │   ├── ProductDetailPage.jsx # Single product details
    │   │   ├── CartPage.jsx
    │   │   ├── FavoritesPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── SellerDashboard.jsx
    │   │   └── AdminPanel.jsx
    │   ├── components/
    │   │   └── ProductCard.jsx
    │   ├── store/            # Zustand state management
    │   │   └── authStore.js
    │   ├── api/
    │   │   └── axios.js      # API client configuration
    │   └── App.jsx           # Main routing
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 📊 Database Schema

### Users Table
```sql
users {
  id (INT, PK)
  email (VARCHAR, UNIQUE)
  password (VARCHAR, hashed)
  name (VARCHAR)
  phone (VARCHAR)
  role (ENUM: BUYER, SELLER, ADMIN)
  idDocumentUrl (VARCHAR)
  idVerified (BOOLEAN)
  banned (BOOLEAN)
  falseReviewCount (INT)
  createdAt (DATETIME)
}
```

### Products Table
```sql
products {
  id (INT, PK)
  seller_id (FOREIGN KEY → users.id)
  title (VARCHAR)
  description (TEXT)
  price (DECIMAL)
  category (VARCHAR)
  condition (ENUM: LIKE_NEW, GOOD, FAIR)
  status (ENUM: AVAILABLE, SOLD, REMOVED)
  createdAt (DATETIME)
}
```

### Product Images
```sql
product_images {
  id (INT, PK)
  product_id (FOREIGN KEY → products.id)
  image_url (VARCHAR)
}
```

### Cart Items
```sql
cart_items {
  id (INT, PK)
  user_id (FOREIGN KEY → users.id)
  product_id (FOREIGN KEY → products.id)
}
```

### Favorites
```sql
favourites {
  id (INT, PK)
  user_id (FOREIGN KEY → users.id)
  product_id (FOREIGN KEY → products.id)
}
```

### Orders
```sql
orders {
  id (INT, PK)
  buyer_id (FOREIGN KEY → users.id)
  product_id (FOREIGN KEY → products.id)
  totalAmount (DECIMAL)
  stripePaymentIntentId (VARCHAR)
  status (ENUM: PENDING, PAID, CANCELLED)
  createdAt (DATETIME)
}
```

### Reviews
```sql
reviews {
  id (INT, PK)
  reviewer_id (FOREIGN KEY → users.id)
  seller_id (FOREIGN KEY → users.id)
  product_id (FOREIGN KEY → products.id)
  rating (INT, 1-5)
  comment (TEXT)
  falseDescriptionFlag (BOOLEAN)
  createdAt (DATETIME)
}
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/products/search` | Search & filter products |
| GET | `/api/products/{id}` | Get product details |
| POST | `/api/products/seller/add` | Add new product (seller) |
| GET | `/api/products/seller/mine` | Get seller's products |
| DELETE | `/api/products/seller/{id}` | Delete product (seller) |

### Cart
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/cart` | Get cart items |
| POST | `/api/cart/{productId}` | Add to cart |
| DELETE | `/api/cart/{productId}` | Remove from cart |

### Favorites
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/favourites` | Get favorite items |
| POST | `/api/favourites/{productId}` | Add to favorites |
| DELETE | `/api/favourites/{productId}` | Remove from favorites |

### Reviews
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/reviews/seller/{sellerId}` | Post review (buyer) |
| GET | `/api/reviews/seller/{sellerId}` | Get seller reviews |

### Orders
| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/{id}` | Get order details |
| POST | `/api/orders/{id}/cancel` | Cancel order |

### Admin
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/admin/sellers/pending` | Get pending verifications |
| POST | `/api/admin/sellers/{id}/verify` | Verify seller |
| POST | `/api/admin/sellers/{id}/ban` | Ban seller |
| GET | `/api/admin/sellers` | Get all sellers |
| GET | `/api/admin/fraud-reports` | Get fraud reports |

---

## 🚀 Getting Started

### Prerequisites
- **Backend**: Java 17+, MySQL 8.0+, Maven 3.9+
- **Frontend**: Node.js 18+, npm/yarn
- **Git** for version control

### Backend Setup

1. **Configure Database** (MySQL)
```sql
CREATE DATABASE looply;
```

2. **Update** `application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/looply
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

3. **Run Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔐 Authentication Flow

1. **Register**: User chooses BUYER or SELLER role
2. **Login**: JWT token stored in localStorage
3. **Routes Protected**: ProtectedRoute component checks token and role
4. **Redirect**: Based on role (BUYER → /shop, SELLER → /seller/dashboard, ADMIN → /admin)

---

## 🛡️ Fraud Detection System

### Mechanism
1. Buyers can flag products as "false description" when reviewing
2. Each false description flag increments seller's `falseReviewCount`
3. **Auto-ban Rule**: When `falseReviewCount >= 3`, seller is banned automatically
4. Seller cannot list new products when `banned = true`

### Admin Oversight
- Admin can view all fraud reports
- Admin can manually ban sellers
- Admin can reject ID documents and force resubmission

---

## 💳 Payment Integration

**Current Status**: Demo checkout flow (no real payment processing)

**For Production**, integrate:
- **Stripe** (recommended)
- **PayPal**
- **Square**

```javascript
// Example Stripe integration (future)
const stripe = require('stripe')('sk_test_...');
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  metadata: { orderId: orderId }
});
```

---

## 🎨 UI/UX Highlights

### Technology Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Lucide Icons
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Responsive Design
- ✅ Mobile-first design
- ✅ Tablet optimized
- ✅ Desktop fully featured
- ✅ Touch-friendly navigation

---

## 🔄 User Flows

### Buyer Flow
```
Register (BUYER) 
  → Login 
  → ShopPage (browse products)
  → ProductDetailPage (view details & reviews)
  → CartPage (manage items)
  → CheckoutPage (enter shipping & payment)
  → Order Complete
  → Can review seller after purchase
```

### Seller Flow
```
Register (SELLER)
  → Login
  → SellerDashboard (Upload ID)
  → ID Verification (Admin approves)
  → Create Listings (upload images, details, price)
  → View Product Performance
  → Receive Reviews & Ratings
  → Manage Inventory
```

### Admin Flow
```
Login (ADMIN)
  → AdminPanel
  → View Pending ID Verifications
  → Approve/Reject/Ban Sellers
  → Monitor Fraud Reports
  → View Dashboard Stats
  → Auto-ban sellers with 3+ fraud flags
```

---

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: com.mysql.cj.jdbc.exceptions.CommunicationsException
Solution: Ensure MySQL is running and credentials in application.properties are correct
```

### Frontend Not Connecting to Backend
```
Error: CORS error
Solution: Verify backend CORS config includes http://localhost:5173
```

### Products Not Loading
```
Error: 404 /api/products/search
Solution: Ensure backend is running and database has sample products
```

---

## 📈 Future Enhancements

- [ ] Real Stripe payment integration
- [ ] Shipping provider API integration (FedEx, UPS)
- [ ] Email notifications (order, pickup, delivery)
- [ ] Messaging between buyers and sellers
- [ ] Product recommendations (ML-based)
- [ ] Dispute resolution system
- [ ] Seller analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Product return/refund system
- [ ] Multi-language support

---

## 💡 Key Implementation Details

### Seller ID Verification
- Sellers must upload government-issued ID before selling
- Admin reviews ID documents in Admin Panel
- Once verified, seller gets `idVerified = true` badge

### False Description Flagging
- Buyers flag reviews as "false description"
- System increments seller's fraud counter
- After 3 flags, seller is automatically banned
- Admin can view fraud reports and manually ban

### Image Upload
- Products can have multiple images
- Images stored via FileStorageService
- Images displayed in product grid and detail pages

### Responsive Cart & Checkout
- Cart shows all items with ability to remove
- Checkout is 2-step (shipping → payment)
- Order summary always visible on right side

---

## 📞 Support

For issues or questions:
1. Check database connection
2. Verify all environment variables
3. Clear browser cache and localStorage
4. Restart both backend and frontend

---

**Built with ❤️ for Looply - Sustainable Fashion Marketplace**
