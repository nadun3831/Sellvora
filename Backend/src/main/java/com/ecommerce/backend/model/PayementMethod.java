package com.ecommerce.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;


@Data
public class PayementMethod {
    @Id
    private String payementId;
    private String payementType;
    private String accountNumber;
    private  String expireDate;

}
