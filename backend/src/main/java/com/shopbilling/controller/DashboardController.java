package com.shopbilling.controller;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopbilling.dto.response.ApiResponse;
import com.shopbilling.dto.response.DashboardMetrics;
import com.shopbilling.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProductRepository productRepository;
    private final com.shopbilling.repository.SaleRepository saleRepository;
    private final com.shopbilling.repository.PurchaseRepository purchaseRepository;
    private final com.shopbilling.service.SaleService saleService;

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<DashboardMetrics>> getMetrics() {
        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime endOfDay = java.time.LocalDate.now().atTime(java.time.LocalTime.MAX);

        BigDecimal todaySales = saleRepository.sumGrandTotalBySaleDateBetween(startOfDay, endOfDay);
        BigDecimal todayPurchases = purchaseRepository.sumGrandTotalByPurchaseDateBetween(startOfDay, endOfDay);
        long totalProducts = productRepository.count();
        int lowStockCount = (int) productRepository.countLowStockProducts();

        DashboardMetrics metrics = DashboardMetrics.builder()
            .todaySales(todaySales)
            .todayPurchases(todayPurchases)
            .totalProducts(totalProducts)
            .lowStockCount(lowStockCount)
            .recentSales(saleService.getRecentSales())
            .build();
        return ResponseEntity.ok(ApiResponse.success("Metrics fetched", metrics));
    }
}
