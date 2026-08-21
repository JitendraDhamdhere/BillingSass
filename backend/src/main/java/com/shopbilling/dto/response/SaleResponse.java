package com.shopbilling.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SaleResponse {
    private Long id;
    private String saleNumber;
    private LocalDateTime saleDate;
    private String customerName;
    private BigDecimal grandTotal;
    private String paymentStatus;
    private String cashier;
}
