package com.vavuniya.ordermgmt.service;

import com.vavuniya.ordermgmt.exception.ResourceNotFoundException;
import com.vavuniya.ordermgmt.exception.ValidationException;
import com.vavuniya.ordermgmt.model.Product;
import com.vavuniya.ordermgmt.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product createProduct(Product product) {
        if (product.getProductId() == null || product.getProductId().isBlank()) {
            product.setProductId(getNextProductId());
        }
        validateProduct(product);
        return productRepository.save(product);
    }

    private String getNextProductId() {
        List<Product> products = productRepository.findAll();
        int maxId = 0;
        for (Product p : products) {
            try {
                String pid = p.getProductId();
                if (pid != null) {
                    String numericPart = pid.replaceAll("\\D+", "");
                    if (!numericPart.isEmpty()) {
                        int idVal = Integer.parseInt(numericPart);
                        if (idVal > maxId) {
                            maxId = idVal;
                        }
                    }
                }
            } catch (Exception e) {
                // Ignore parsing errors
            }
        }
        return "PROD-" + String.format("%03d", maxId + 1);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with id: " + id));
    }

    public Product updateProduct(String id, Product productDetails) {
        Product existing = getProductById(id);
        validateProduct(productDetails);

        existing.setProductId(productDetails.getProductId());
        existing.setProductName(productDetails.getProductName());
        existing.setPrice(productDetails.getPrice());
        existing.setStock(productDetails.getStock());
        existing.setDescription(productDetails.getDescription());
        existing.setCategoryId(productDetails.getCategoryId());
        existing.setImageUrl(productDetails.getImageUrl());

        return productRepository.save(existing);
    }

    public Product patchProduct(String id, Map<String, Object> updates) {
        Product existing = getProductById(id);

        if (updates.containsKey("productName")) {
            String name = (String) updates.get("productName");
            if (name == null || name.isBlank()) {
                throw new ValidationException("productName must not be blank");
            }
            existing.setProductName(name);
        }
        if (updates.containsKey("price")) {
            Double price = ((Number) updates.get("price")).doubleValue();
            if (price <= 0) throw new ValidationException("price must be greater than 0");
            existing.setPrice(price);
        }
        if (updates.containsKey("stock")) {
            Integer stock = ((Number) updates.get("stock")).intValue();
            if (stock < 0) throw new ValidationException("stock must be >= 0");
            existing.setStock(stock);
        }
        if (updates.containsKey("description")) existing.setDescription((String) updates.get("description"));
        if (updates.containsKey("categoryId")) existing.setCategoryId((String) updates.get("categoryId"));
        if (updates.containsKey("imageUrl")) existing.setImageUrl((String) updates.get("imageUrl"));

        return productRepository.save(existing);
    }

    public void deleteProduct(String id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    public List<Product> getProductsByCategoryId(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    private void validateProduct(Product product) {
        if (product.getProductName() == null || product.getProductName().isBlank()) {
            throw new ValidationException("productName is required");
        }
        if (product.getPrice() == null || product.getPrice() <= 0) {
            throw new ValidationException("price must be greater than 0");
        }
        if (product.getStock() == null || product.getStock() < 0) {
            throw new ValidationException("stock must be >= 0");
        }
    }
}
