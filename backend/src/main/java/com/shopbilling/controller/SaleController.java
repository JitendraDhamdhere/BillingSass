package com.shopbilling.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopbilling.dto.request.SaleRequest;
import com.shopbilling.dto.response.ApiResponse;
import com.shopbilling.service.SaleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'CASHIER')")
    public ResponseEntity<ApiResponse<Long>> createSale(
            @Valid @RequestBody SaleRequest request,
            Authentication authentication) {
        Long saleId = saleService.createSale(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Sale created successfully", saleId));
    }
}
