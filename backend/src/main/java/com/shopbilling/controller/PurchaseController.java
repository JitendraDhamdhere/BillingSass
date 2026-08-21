package com.shopbilling.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopbilling.dto.request.PurchaseRequest;
import com.shopbilling.dto.response.ApiResponse;
import com.shopbilling.dto.response.PaginatedResponse;
import com.shopbilling.dto.response.PurchaseResponse;
import com.shopbilling.service.PurchaseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Purchase fetched", purchaseService.getById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Long>> updatePurchase(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseRequest request,
            Authentication authentication) {
        Long purchaseId = purchaseService.updatePurchase(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Purchase updated successfully", purchaseId));
    }


    private final PurchaseService purchaseService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<PurchaseResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        String[] sortParams = sort.split(",");
        Sort sortObj = Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]);
        Page<PurchaseResponse> data = purchaseService.getAll(PageRequest.of(page, size, sortObj));
        return ResponseEntity.ok(PaginatedResponse.success("Purchases fetched", data.getContent(), 
            data.getNumber(), data.getSize(), data.getTotalElements(), data.getTotalPages()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Long>> createPurchase(
            @Valid @RequestBody PurchaseRequest request,
            Authentication authentication) {
        Long purchaseId = purchaseService.createPurchase(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Purchase created successfully", purchaseId));
    }
}
