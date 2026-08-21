package com.shopbilling.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryAdjustmentRequest {
    @NotNull(message = "Adjustment quantity is required")
    private Integer adjustmentQuantity;
    private String reason;
}
