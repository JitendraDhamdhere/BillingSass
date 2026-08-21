package com.shopbilling.dto.request;
import lombok.Data;
import jakarta.validation.constraints.NotEmpty;
import com.shopbilling.entity.PaymentStatus;
import java.math.BigDecimal;
import java.util.List;
@Data
public class SaleRequest {
    private Long customerId;
    private BigDecimal discount = BigDecimal.ZERO;
    private String notes;
    @NotEmpty private List<SaleItemRequest> items;
    private List<PaymentRequest> payments;
}
