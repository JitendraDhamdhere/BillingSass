package com.shopbilling.dto.response;
import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardMetrics {
    private List<SaleResponse> recentSales;
    private BigDecimal todaySales;
    private BigDecimal todayPurchases;
    private Long totalProducts;
    private Integer lowStockCount;
}
