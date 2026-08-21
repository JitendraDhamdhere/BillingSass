package com.shopbilling.dto.request;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import com.shopbilling.entity.PaymentMethod;
import java.math.BigDecimal;
@Data
public class PaymentRequest {
    @NotNull private PaymentMethod paymentMethod;
    @NotNull private BigDecimal amount;
    private String notes;
}
