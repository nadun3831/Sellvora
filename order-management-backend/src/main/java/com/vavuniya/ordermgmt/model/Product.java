package com.vavuniya.ordermgmt.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    @NotBlank(message = "productId is required")
    private String productId;

    @NotBlank(message = "productName is required")
    private String productName;

    @NotNull(message = "price is required")
    @Positive(message = "price must be greater than 0")
    private Double price;

    @NotNull(message = "stock is required")
    @Min(value = 0, message = "stock must be >= 0")
    private Integer stock;

    private String description;

    private String categoryId;

    private String imageUrl;
}
