package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository <Product,String> {
}
