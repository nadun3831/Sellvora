package com.vavuniya.ordermgmt.repository;

import com.vavuniya.ordermgmt.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {

    Optional<Category> findByCategoryName(String name);

    Optional<Category> findByCategoryId(String categoryId);
}
