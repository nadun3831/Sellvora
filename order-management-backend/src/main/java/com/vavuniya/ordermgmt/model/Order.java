package com.vavuniya.ordermgmt.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @NotBlank(message = "orderId is required")
    private String orderId;

    private LocalDateTime orderDate;

    private Double totalAmount;

    private String status;

    @NotBlank(message = "customerEmail is required")
    @Email(message = "customerEmail must be a valid email address")
    private String customerEmail;

    private List<String> productIds;

    private List<String> paymentMethodIds;
}
