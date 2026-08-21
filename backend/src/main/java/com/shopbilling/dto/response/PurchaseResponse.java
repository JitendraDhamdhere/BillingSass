package com.shopbilling.dto.response;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PurchaseResponse {
    private Long id;
    private String purchaseNumber;
    private Long supplierId;
    private String supplierName;
    private LocalDateTime purchaseDate;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal discount;
    private BigDecimal grandTotal;
    private String paymentStatus;
    private String notes;
}
