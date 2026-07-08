package com.vavuniya.ordermgmt.service;

import com.vavuniya.ordermgmt.exception.ResourceNotFoundException;
import com.vavuniya.ordermgmt.exception.ValidationException;
import com.vavuniya.ordermgmt.model.PaymentMethod;
import com.vavuniya.ordermgmt.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PaymentMethodService {

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    public PaymentMethod createPaymentMethod(PaymentMethod paymentMethod) {
        validatePaymentMethod(paymentMethod);
        return paymentMethodRepository.save(paymentMethod);
    }

    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    public PaymentMethod getPaymentMethodById(String id) {
        return paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "PaymentMethod not found with id: " + id));
    }

    public PaymentMethod updatePaymentMethod(String id, PaymentMethod paymentDetails) {
        PaymentMethod existing = getPaymentMethodById(id);
        validatePaymentMethod(paymentDetails);

        existing.setPaymentId(paymentDetails.getPaymentId());
        existing.setPaymentType(paymentDetails.getPaymentType());
        existing.setAccountNumber(paymentDetails.getAccountNumber());
        existing.setExpiryDate(paymentDetails.getExpiryDate());

        return paymentMethodRepository.save(existing);
    }

    public PaymentMethod patchPaymentMethod(String id, Map<String, Object> updates) {
        PaymentMethod existing = getPaymentMethodById(id);

        if (updates.containsKey("paymentType")) {
            String type = (String) updates.get("paymentType");
            if (type == null || type.isBlank()) {
                throw new ValidationException("paymentType must not be blank");
            }
            existing.setPaymentType(type);
        }
        if (updates.containsKey("accountNumber")) {
            String account = (String) updates.get("accountNumber");
            if (account == null || account.isBlank()) {
                throw new ValidationException("accountNumber must not be blank");
            }
            existing.setAccountNumber(account);
        }
        if (updates.containsKey("expiryDate")) {
            existing.setExpiryDate((String) updates.get("expiryDate"));
        }

        return paymentMethodRepository.save(existing);
    }

    public void deletePaymentMethod(String id) {
        PaymentMethod pm = getPaymentMethodById(id);
        paymentMethodRepository.delete(pm);
    }

    public List<PaymentMethod> getPaymentMethodsByType(String type) {
        return paymentMethodRepository.findByPaymentType(type);
    }

    private void validatePaymentMethod(PaymentMethod pm) {
        if (pm.getAccountNumber() == null || pm.getAccountNumber().isBlank()) {
            throw new ValidationException("accountNumber is required");
        }
        if (pm.getPaymentType() == null || pm.getPaymentType().isBlank()) {
            throw new ValidationException("paymentType is required");
        }
    }
}
