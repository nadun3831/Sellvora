# Product Requirements Document (PRD)
## Online Shopping Platform — Order Management System

**Course:** IT 3232 – E-commerce (P) | Assignment 02
**Institution:** Department of Physical Science, Faculty of Applied Science, University of Vavuniya

---

## 1. Overview

The Order Management System is a full-stack e-commerce backend + frontend application that allows customers to place orders composed of multiple products, where each product belongs to a category and each order is settled through one or more payment methods.

The system consists of:
- **Backend:** Spring Boot REST API backed by MongoDB
- **Frontend:** React single-page application (SPA) consuming the REST API

---

## 2. Goals & Objectives

| Goal | Description |
|---|---|
| G1 | Provide full CRUD management for Orders, Products, Categories, and Payment Methods |
| G2 | Enforce correct relationships between entities (1:N, 1:1, M:N) |
| G3 | Apply business rules — stock validation, order status workflow, discount calculation |
| G4 | Provide robust, centralized error handling with meaningful HTTP responses |
| G5 | Deliver a usable React UI for managing all entities without needing Postman |

---

## 3. Scope

### In Scope
- MongoDB document models: `Order`, `Product`, `Category`, `PaymentMethod`
- Spring Data MongoDB repositories with custom finder methods
- Service layer with validation and business logic
- REST controllers exposing POST / GET (all) / GET (by id) / PUT / PATCH / DELETE for each entity
- Global exception handling via `@ControllerAdvice`
- React frontend with pages/components for each entity, calling the API via Axios/fetch

### Out of Scope
- Authentication/authorization (JWT, login) — not required by assignment, optional stretch goal
- Real payment gateway integration (payment methods are stored records only)
- Deployment/CI-CD pipelines (local run only, unless student adds it)

---

## 4. Entities & Relationships

```
Category (1) ────── (1) Product   [primaryProduct — One-to-One]
Order (1) ────── (N) Product      [products list — One-to-Many]
Order (M) ────── (N) PaymentMethod [paymentMethods — Many-to-Many]
```

### 4.1 Order
| Field | Type | Notes |
|---|---|---|
| id | String | Mongo `_id` |
| orderId | String | Business key, required, unique |
| orderDate | LocalDateTime | Auto-set on creation |
| totalAmount | Double | Calculated field |
| status | String | PENDING / CONFIRMED / SHIPPED / DELIVERED |
| customerEmail | String | Required, valid email format |
| products | List\<Product\> or List\<String\> productIds | One-to-Many |
| paymentMethods | List\<PaymentMethod\> or List\<String\> paymentIds | Many-to-Many |

### 4.2 Product
| Field | Type | Notes |
|---|---|---|
| id | String | Mongo `_id` |
| productId | String | Business key |
| productName | String | Required |
| price | Double | Must be > 0 |
| stock | Integer | Must be >= 0 |
| description | String | Optional |
| categoryId | String | Reference to Category |

### 4.3 Category
| Field | Type | Notes |
|---|---|---|
| id | String | Mongo `_id` |
| categoryId | String | Business key |
| categoryName | String | Required |
| description | String | Optional |
| primaryProductId | String | One-to-One with Product |

### 4.4 PaymentMethod
| Field | Type | Notes |
|---|---|---|
| id | String | Mongo `_id` |
| paymentId | String | Business key |
| paymentType | String | e.g. CARD, WALLET, BANK_TRANSFER |
| accountNumber | String | Required |
| expiryDate | String | Format MM/YY |

---

## 5. Functional Requirements

### 5.1 Repository Layer
- `OrderRepository`: `findByCustomerEmail(String email)`, `findByStatus(String status)`
- `ProductRepository`: `findByCategoryId(String categoryId)`, `findByProductName(String name)`
- `CategoryRepository`: `findByCategoryName(String name)`
- `PaymentMethodRepository`: `findByPaymentType(String type)`

### 5.2 Service Layer Business Rules

**OrderService**
1. **Create Order** — validates that every referenced product exists (via `ProductRepository`) before persisting; throws `ResourceNotFoundException` if a product ID is invalid.
2. **Update Order Status** — accepts a new status string; validates it against the allowed enum set `{PENDING, CONFIRMED, SHIPPED, DELIVERED}`; throws `ValidationException` if invalid.
3. **Calculate Total Amount** — sums the price of all products in the order; if the sum exceeds 5000, applies a 10% discount before saving as `totalAmount`.

**ProductService / CategoryService / PaymentMethodService**
- Standard CRUD with field validation (no negative price, stock >= 0, required fields not null/blank).

### 5.3 Controller Layer (applies to all 4 entities)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/{entity} | Create |
| GET | /api/{entity} | Read all |
| GET | /api/{entity}/{id} | Read one |
| PUT | /api/{entity}/{id} | Full update |
| PATCH | /api/{entity}/{id} | Partial update |
| DELETE | /api/{entity}/{id} | Delete |

Entities: `orders`, `products`, `categories`, `payment-methods`

### 5.4 Exception Handling
- `ValidationException` → HTTP 400, thrown for missing required fields, invalid email format, negative price/zero-or-negative quantity.
- `ResourceNotFoundException` → HTTP 404, thrown when an Order or Product ID lookup fails.
- `GlobalExceptionHandler` (`@ControllerAdvice`) intercepts both plus a generic `Exception` fallback → HTTP 500.
- Standard error response body:
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

## 6. Frontend Requirements (React)

### 6.1 Tech Stack
- React 18 (Vite or Create React App)
- React Router for navigation
- Axios for HTTP calls
- Basic CSS or a lightweight UI library (e.g., Bootstrap/Tailwind) — optional

### 6.2 Pages/Components
| Page | Purpose |
|---|---|
| Dashboard / Home | Overview links to all modules |
| Orders List | Table of orders, search by status/email, links to details |
| Order Form | Create/Edit order — select products & payment methods, view calculated total |
| Order Details | View single order, update status, delete |
| Products List / Form | CRUD for products |
| Categories List / Form | CRUD for categories, link primary product |
| Payment Methods List / Form | CRUD for payment methods |
| Error/Notification component | Displays backend validation/404/500 messages to the user |

### 6.3 Frontend Behaviors
- Every form performs client-side validation mirroring backend rules (non-blocking UX improvement) but always relies on backend as the source of truth.
- API errors (400/404/500) are caught and displayed as toast/banner messages using the JSON error body from the Global Exception Handler.
- Order form recalculates and previews total amount (with discount rule) before submission.

---

## 7. Non-Functional Requirements
- **Database:** MongoDB (local or Atlas)
- **API format:** JSON, REST conventions
- **CORS:** Backend must allow requests from the React dev server origin (e.g., `http://localhost:5173`)
- **Documentation:** Swagger/OpenAPI recommended for testing endpoints
- **Code quality:** Layered architecture (Controller → Service → Repository), DTOs optional but recommended

---

## 8. Success Criteria
- All 4 models persist correctly to MongoDB with correct relationship references
- All 5 CRUD operations work for all 4 controllers (verified via Postman/Swagger)
- Business rules (stock/product validation, status validation, discount calculation) demonstrably enforced
- Custom exceptions return correct status codes and structured error bodies
- React frontend can create, view, edit, and delete records for all 4 entities end-to-end

---

## 9. Deliverables
1. Spring Boot backend project (Maven, `pom.xml`)
2. React frontend project
3. README with setup/run instructions for both
4. Postman collection or Swagger UI (optional but recommended)
5. This PRD + accompanying Implementation Plan document
