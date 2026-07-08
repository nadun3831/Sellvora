package com.vavuniya.ordermgmt.service;

import com.vavuniya.ordermgmt.exception.ResourceNotFoundException;
import com.vavuniya.ordermgmt.exception.ValidationException;
import com.vavuniya.ordermgmt.model.Category;
import com.vavuniya.ordermgmt.repository.CategoryRepository;
import com.vavuniya.ordermgmt.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public Category createCategory(Category category) {
        validateCategory(category);

        // If primaryProductId is set, verify the product exists
        if (category.getPrimaryProductId() != null && !category.getPrimaryProductId().isBlank()) {
            productRepository.findById(category.getPrimaryProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + category.getPrimaryProductId()));
        }

        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + id));
    }

    public Category updateCategory(String id, Category categoryDetails) {
        Category existing = getCategoryById(id);
        validateCategory(categoryDetails);

        if (categoryDetails.getPrimaryProductId() != null && !categoryDetails.getPrimaryProductId().isBlank()) {
            productRepository.findById(categoryDetails.getPrimaryProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + categoryDetails.getPrimaryProductId()));
        }

        existing.setCategoryId(categoryDetails.getCategoryId());
        existing.setCategoryName(categoryDetails.getCategoryName());
        existing.setDescription(categoryDetails.getDescription());
        existing.setPrimaryProductId(categoryDetails.getPrimaryProductId());

        return categoryRepository.save(existing);
    }

    public Category patchCategory(String id, Map<String, Object> updates) {
        Category existing = getCategoryById(id);

        if (updates.containsKey("categoryName")) {
            String name = (String) updates.get("categoryName");
            if (name == null || name.isBlank()) {
                throw new ValidationException("categoryName must not be blank");
            }
            existing.setCategoryName(name);
        }
        if (updates.containsKey("description")) {
            existing.setDescription((String) updates.get("description"));
        }
        if (updates.containsKey("primaryProductId")) {
            String prodId = (String) updates.get("primaryProductId");
            if (prodId != null && !prodId.isBlank()) {
                productRepository.findById(prodId)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product not found with id: " + prodId));
            }
            existing.setPrimaryProductId(prodId);
        }

        return categoryRepository.save(existing);
    }

    public void deleteCategory(String id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }

    private void validateCategory(Category category) {
        if (category.getCategoryName() == null || category.getCategoryName().isBlank()) {
            throw new ValidationException("categoryName is required");
        }
    }
}
