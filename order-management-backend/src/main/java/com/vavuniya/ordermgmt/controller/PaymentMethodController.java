package com.vavuniya.ordermgmt.controller;

import com.vavuniya.ordermgmt.model.PaymentMethod;
import com.vavuniya.ordermgmt.service.PaymentMethodService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @PostMapping
    public ResponseEntity<PaymentMethod> createPaymentMethod(@Valid @RequestBody PaymentMethod paymentMethod) {
        PaymentMethod created = paymentMethodService.createPaymentMethod(paymentMethod);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods(
            @RequestParam(required = false) String type) {
        if (type != null) {
            return ResponseEntity.ok(paymentMethodService.getPaymentMethodsByType(type));
        }
        return ResponseEntity.ok(paymentMethodService.getAllPaymentMethods());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethod> getPaymentMethodById(@PathVariable String id) {
        return ResponseEntity.ok(paymentMethodService.getPaymentMethodById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethod> updatePaymentMethod(@PathVariable String id,
                                                              @Valid @RequestBody PaymentMethod paymentMethod) {
        return ResponseEntity.ok(paymentMethodService.updatePaymentMethod(id, paymentMethod));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PaymentMethod> patchPaymentMethod(@PathVariable String id,
                                                             @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(paymentMethodService.patchPaymentMethod(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable String id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.ok().build();
    }
}
