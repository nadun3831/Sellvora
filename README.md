# Sellvora — Order Management System

## Online Shopping Platform — Spring Boot + MongoDB + React

### Architecture
- **Backend:** Spring Boot 3.3 REST API + Spring Data MongoDB
- **Frontend:** React 19 (Vite) SPA consuming the REST API
- **Database:** MongoDB (local or Atlas)

---

## Prerequisites

| Tool | Version |
|------|---------|
| JDK | 17+ (JDK 21 recommended) |
| Maven | 3.9+ |
| Node.js | 18+ |
| MongoDB | 6.0+ (local) or MongoDB Atlas |

---

## Quick Start

### 1. Start MongoDB
```bash
# Local MongoDB
mongod --dbpath /data/db

# Or use MongoDB Atlas — update the URI in application.properties
```

### 2. Start Backend
```bash
cd order-management-backend

# Set JAVA_HOME to JDK 21 if needed
set JAVA_HOME=C:\Users\USER\.jdks\ms-21.0.10

# Run with Maven
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

### 3. Start Frontend
```bash
cd order-management-frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## API Endpoints

All endpoints follow REST conventions under `/api/`:

| Entity | Base URL | Operations |
|--------|----------|------------|
| Orders | `/api/orders` | POST, GET, GET/:id, PUT/:id, PATCH/:id, DELETE/:id |
| Products | `/api/products` | POST, GET, GET/:id, PUT/:id, PATCH/:id, DELETE/:id |
| Categories | `/api/categories` | POST, GET, GET/:id, PUT/:id, PATCH/:id, DELETE/:id |
| Payment Methods | `/api/payment-methods` | POST, GET, GET/:id, PUT/:id, PATCH/:id, DELETE/:id |

### Query Parameters
- `GET /api/orders?status=PENDING` — filter by status
- `GET /api/orders?email=user@example.com` — filter by email
- `GET /api/products?categoryId=abc123` — filter by category

### Business Rules
- **Order total calculation:** Sum of all product prices; 10% discount applied if total > $5,000
- **Valid order statuses:** `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`
- **Product validation:** price > 0, stock >= 0, name required
- **Category 1:1:** `primaryProductId` verified against Product collection

### Error Response Format
```json
{
  "timestamp": "2026-07-08T10:15:30",
  "status": 400,
  "error": "Bad Request",
  "message": "customerEmail is required",
  "path": "/api/orders"
}
```

---

## Project Structure

```
order-management-backend/
├── pom.xml
└── src/main/java/com/vavuniya/ordermgmt/
    ├── OrderManagementApplication.java
    ├── model/          (Order, Product, Category, PaymentMethod)
    ├── repository/     (MongoRepository interfaces)
    ├── service/        (Business logic + validation)
    ├── controller/     (REST endpoints)
    ├── exception/      (ValidationException, ResourceNotFoundException, GlobalExceptionHandler)
    └── config/         (CorsConfig)

order-management-frontend/
├── package.json
└── src/
    ├── api/axiosClient.js
    ├── components/     (Navbar, ErrorBanner, ConfirmDialog)
    ├── pages/
    │   ├── dashboard/  (Dashboard)
    │   ├── orders/     (OrderList, OrderForm, OrderDetails)
    │   ├── products/   (ProductList, ProductForm)
    │   ├── categories/ (CategoryList, CategoryForm)
    │   └── payments/   (PaymentList, PaymentForm)
    ├── App.jsx
    ├── main.jsx
    └── index.css
```