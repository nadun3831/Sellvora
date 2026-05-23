package com.ecommerce.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;
@Data
public class Order {
    @Id
    private String orderId;
    private LocalDateTime orderDate;
    private String status;
    private String customerEmail;
    private List<Product> products;

}
