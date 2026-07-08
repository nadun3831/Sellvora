package com.vavuniya.ordermgmt.repository;

import com.vavuniya.ordermgmt.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    List<Product> findByCategoryId(String categoryId);

    Optional<Product> findByProductName(String name);

    Optional<Product> findByProductId(String productId);
}
