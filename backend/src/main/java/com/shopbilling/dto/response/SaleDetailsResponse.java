package com.shopbilling.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleDetailsResponse {
    private Long id;
    private String saleNumber;
    private LocalDateTime saleDate;
    private String customerName;
    private String customerMobile;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal grandTotal;
    private String paymentStatus;
    private String notes;
    private String cashier;
    private List<ItemDetails> items;
    private List<PaymentDetails> payments;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDetails {
        private String productName;
        private Integer quantity;
        private BigDecimal sellingPrice;
        private BigDecimal discount;
        private BigDecimal tax;
        private BigDecimal total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentDetails {
        private String paymentMethod;
        private BigDecimal amount;
        private String notes;
        private LocalDateTime paymentDate;
    }
}
