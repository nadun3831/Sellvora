package com.vavuniya.ordermgmt.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payment_methods")
public class PaymentMethod {

    @Id
    private String id;

    @NotBlank(message = "paymentId is required")
    private String paymentId;

    @NotBlank(message = "paymentType is required")
    private String paymentType;

    @NotBlank(message = "accountNumber is required")
    private String accountNumber;

    private String expiryDate;
}
