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
@Document(collection = "categories")
public class Category {

    @Id
    private String id;

    @NotBlank(message = "categoryId is required")
    private String categoryId;

    @NotBlank(message = "categoryName is required")
    private String categoryName;

    private String description;

    private String primaryProductId;
}
