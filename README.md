"# Sellvora" 
Online Shopping Platform - Order Management System

This project is a backend e-commerce application developed using Spring Boot and MongoDB. It manages customers, orders, products, categories, and payment methods through RESTful APIs.

Features
Order Management
Product Management
Category Management
Payment Method Management
CRUD Operations
REST API Integration
MongoDB Database Support
Exception Handling
Order Status Validation
Discount Calculation System
Technologies Used
Java
Spring Boot
Spring Data MongoDB
MongoDB
Maven
API Endpoints
Order APIs
POST /api/orders
GET /api/orders
GET /api/orders/{id}
PUT /api/orders/{id}
PATCH /api/orders/{id}
DELETE /api/orders/{id}
Business Logic
Validate products before creating orders
Update order status:
PENDING
CONFIRMED
SHIPPED
DELIVERED
Calculate total order amount
Apply 10% discount for orders above 5000
Exception Handling
ValidationException
ResourceNotFoundException
Global Exception Handler using @ControllerAdvice
 ---Nadun Nugegoda