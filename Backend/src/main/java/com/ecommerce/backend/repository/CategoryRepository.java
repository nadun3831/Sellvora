package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository <Category,String> {
}
