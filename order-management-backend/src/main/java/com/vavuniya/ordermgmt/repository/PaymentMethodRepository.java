package com.vavuniya.ordermgmt.repository;

import com.vavuniya.ordermgmt.model.PaymentMethod;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends MongoRepository<PaymentMethod, String> {

    List<PaymentMethod> findByPaymentType(String type);

    Optional<PaymentMethod> findByPaymentId(String paymentId);
}
