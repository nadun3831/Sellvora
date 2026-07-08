package com.vavuniya.ordermgmt.service;

import com.vavuniya.ordermgmt.exception.ResourceNotFoundException;
import com.vavuniya.ordermgmt.exception.ValidationException;
import com.vavuniya.ordermgmt.model.Order;
import com.vavuniya.ordermgmt.model.Product;
import com.vavuniya.ordermgmt.repository.OrderRepository;
import com.vavuniya.ordermgmt.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class OrderService {

    private static final Set<String> VALID_STATUSES = Set.of(
            "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"
    );

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // ---------- CREATE ----------
    public Order createOrder(Order order) {
        // Validate required fields
        if (order.getOrderId() == null || order.getOrderId().isBlank()) {
            throw new ValidationException("orderId is required");
        }
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) {
            throw new ValidationException("customerEmail is required");
        }

        // Validate email format
        if (!EMAIL_PATTERN.matcher(order.getCustomerEmail()).matches()) {
            throw new ValidationException("customerEmail must be a valid email address");
        }

        // Validate each product exists
        if (order.getProductIds() != null) {
            for (String productId : order.getProductIds()) {
                productRepository.findById(productId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + productId));
            }
        }

        // Calculate total amount
        double totalAmount = calculateTotalAmount(order.getProductIds());
        order.setTotalAmount(totalAmount);

        // Set defaults
        order.setOrderDate(LocalDateTime.now());
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PENDING");
        }

        return orderRepository.save(order);
    }

    // ---------- READ ALL ----------
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ---------- READ ONE ----------
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + id));
    }

    // ---------- FULL UPDATE (PUT) ----------
    public Order updateOrder(String id, Order orderDetails) {
        Order existing = getOrderById(id);

        if (orderDetails.getOrderId() != null) existing.setOrderId(orderDetails.getOrderId());
        if (orderDetails.getCustomerEmail() != null) {
            if (!EMAIL_PATTERN.matcher(orderDetails.getCustomerEmail()).matches()) {
                throw new ValidationException("customerEmail must be a valid email address");
            }
            existing.setCustomerEmail(orderDetails.getCustomerEmail());
        }
        if (orderDetails.getProductIds() != null) {
            for (String productId : orderDetails.getProductIds()) {
                productRepository.findById(productId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + productId));
            }
            existing.setProductIds(orderDetails.getProductIds());
            existing.setTotalAmount(calculateTotalAmount(orderDetails.getProductIds()));
        }
        if (orderDetails.getPaymentMethodIds() != null) {
            existing.setPaymentMethodIds(orderDetails.getPaymentMethodIds());
        }
        if (orderDetails.getStatus() != null) {
            validateStatus(orderDetails.getStatus());
            existing.setStatus(orderDetails.getStatus());
        }

        return orderRepository.save(existing);
    }

    // ---------- PARTIAL UPDATE (PATCH) ----------
    public Order patchOrder(String id, Map<String, Object> updates) {
        Order existing = getOrderById(id);

        if (updates.containsKey("status")) {
            String newStatus = (String) updates.get("status");
            validateStatus(newStatus);
            existing.setStatus(newStatus);
        }
        if (updates.containsKey("customerEmail")) {
            String email = (String) updates.get("customerEmail");
            if (!EMAIL_PATTERN.matcher(email).matches()) {
                throw new ValidationException("customerEmail must be a valid email address");
            }
            existing.setCustomerEmail(email);
        }
        if (updates.containsKey("productIds")) {
            @SuppressWarnings("unchecked")
            List<String> productIds = (List<String>) updates.get("productIds");
            for (String productId : productIds) {
                productRepository.findById(productId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + productId));
            }
            existing.setProductIds(productIds);
            existing.setTotalAmount(calculateTotalAmount(productIds));
        }
        if (updates.containsKey("paymentMethodIds")) {
            @SuppressWarnings("unchecked")
            List<String> paymentMethodIds = (List<String>) updates.get("paymentMethodIds");
            existing.setPaymentMethodIds(paymentMethodIds);
        }

        return orderRepository.save(existing);
    }

    // ---------- DELETE ----------
    public void deleteOrder(String id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }

    // ---------- BUSINESS LOGIC ----------
    public double calculateTotalAmount(List<String> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            return 0.0;
        }

        double sum = 0.0;
        for (String productId : productIds) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + productId));
            sum += product.getPrice();
        }

        // 10% discount if total exceeds 5000
        if (sum > 5000) {
            sum = sum * 0.9;
        }

        return Math.round(sum * 100.0) / 100.0;
    }

    private void validateStatus(String status) {
        if (!VALID_STATUSES.contains(status)) {
            throw new ValidationException(
                    "Invalid order status: '" + status +
                    "'. Must be one of: " + VALID_STATUSES);
        }
    }

    // ---------- QUERY METHODS ----------
    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmail(email);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }
}
