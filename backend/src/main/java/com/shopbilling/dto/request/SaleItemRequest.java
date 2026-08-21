package com.shopbilling.dto.request;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
@Data
public class SaleItemRequest {
    @NotNull private Long productId;
    @NotNull private Integer quantity;
    @NotNull private BigDecimal sellingPrice;
    private BigDecimal discount = BigDecimal.ZERO;
}
