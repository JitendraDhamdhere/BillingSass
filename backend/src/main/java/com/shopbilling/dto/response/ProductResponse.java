package com.shopbilling.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponse {
    private Long id;
    private String productCode;
    private String barcode;
    private String name;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Long brandId;
    private String brandName;
    private String unit;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private BigDecimal taxPercentage;
    private Integer minimumStock;
    private Integer currentStock;
    private String status;
    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
