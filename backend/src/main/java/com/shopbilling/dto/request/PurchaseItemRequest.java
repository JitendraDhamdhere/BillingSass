package com.shopbilling.dto.request;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
@Data
public class PurchaseItemRequest {
    @NotNull private Long productId;
    @NotNull private Integer quantity;
    @NotNull private BigDecimal purchasePrice;
    private BigDecimal discount = BigDecimal.ZERO;
    @NotNull private BigDecimal tax;
}
