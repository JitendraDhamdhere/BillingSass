package com.shopbilling.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopbilling.dto.request.InventoryAdjustmentRequest;
import com.shopbilling.dto.response.ApiResponse;
import com.shopbilling.dto.response.PaginatedResponse;
import com.shopbilling.entity.InventoryTransaction;
import com.shopbilling.entity.Product;
import com.shopbilling.service.InventoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/adjust/{productId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<String>> adjustStock(
            @PathVariable Long productId,
            @Valid @RequestBody InventoryAdjustmentRequest request,
            Authentication authentication) {
        inventoryService.adjustStock(productId, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Stock adjusted successfully", null));
    }

    @GetMapping("/transactions/{productId}")
    public ResponseEntity<PaginatedResponse<InventoryTransaction>> getTransactions(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<InventoryTransaction> data = inventoryService.getProductTransactions(productId, 
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate")));
        return ResponseEntity.ok(PaginatedResponse.success("Transactions fetched", data.getContent(), 
            data.getNumber(), data.getSize(), data.getTotalElements(), data.getTotalPages()));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<Product>>> getLowStockProducts() {
        return ResponseEntity.ok(ApiResponse.success("Low stock products fetched", inventoryService.getLowStockProducts()));
    }
}
