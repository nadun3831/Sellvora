
package com.ecommerce.backend.model;

import lombok.Data;

import org.springframework.data.annotation.Id;
@Data
public class Product {

    @Id
    private String productID;

    private String productName;
    private double price;
    private int stock;
    private String description;
    private String categoryId;




}

