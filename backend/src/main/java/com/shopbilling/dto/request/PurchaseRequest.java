package com.shopbilling.dto.request;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import com.shopbilling.entity.PaymentStatus;
import java.math.BigDecimal;
import java.util.List;
@Data
public class PurchaseRequest {
    @NotNull private Long supplierId;
    private String purchaseNumber;
    private BigDecimal discount = BigDecimal.ZERO;
    private String notes;
    @NotEmpty private List<PurchaseItemRequest> items;
    private List<PaymentRequest> payments;
}
