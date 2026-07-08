package com.vavuniya.ordermgmt.repository;

import com.vavuniya.ordermgmt.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByCustomerEmail(String email);

    List<Order> findByStatus(String status);

    Optional<Order> findByOrderId(String orderId);
}
