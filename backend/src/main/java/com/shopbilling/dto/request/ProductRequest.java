package com.shopbilling.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String productCode;
    private String barcode;
    @NotBlank(message = "Name is required")
    private String name;
    private String description;
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    @NotNull(message = "Brand ID is required")
    private Long brandId;
    @NotBlank(message = "Unit is required")
    private String unit;
    @NotNull(message = "Purchase price is required")
    private BigDecimal purchasePrice;
    @NotNull(message = "Selling price is required")
    private BigDecimal sellingPrice;
    @NotNull(message = "Tax percentage is required")
    private BigDecimal taxPercentage;
    @NotNull(message = "Minimum stock is required")
    private Integer minimumStock;
    private String status;
    private String image;
}
