package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.PayementMethod;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentMethodRepository extends MongoRepository<PayementMethod,String> {

}
