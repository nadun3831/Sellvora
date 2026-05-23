package com.ecommerce.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Category")
@Data
public class Category {
    @Id
    private String categoryId;
    private String categoryName;
    private String description;

}
