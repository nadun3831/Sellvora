package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // CREATE ORDER
    public Order createOrder(Order order) {

        order.setOrderDate(LocalDateTime.now());

        // validate products exist
        for (Product p : order.getProducts()) {
            Optional<Product> product = productRepository.findById(p.getProductID());
            if (product.isEmpty()) {
                throw new RuntimeException("Product not found: " + p.getProductID() );
            }
        }

        // calculate total
        double total = 0;
        for (Product p : order.getProducts()) {
            total += p.getPrice();
        }

        // discount rule
        if (total > 5000) {
            total = total * 0.90;
        }

        order.setTotalAmount(total);
        order.setStatus("PENDING");

        return orderRepository.save(order);
    }

    // GET ALL
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // GET BY ID
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    // UPDATE ORDER STATUS ONLY
    public Order updateOrder(String id, Order order) {

        Order existing = getOrderById(id);

        List<String> validStatus = Arrays.asList(
                "PENDING",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED"
        );

        if (order.getStatus() != null && validStatus.contains(order.getStatus())) {
            existing.setStatus(order.getStatus());
        }

        return orderRepository.save(existing);
    }

    // DELETE
    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }
}