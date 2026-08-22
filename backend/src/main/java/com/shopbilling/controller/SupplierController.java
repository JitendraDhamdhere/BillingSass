package com.shopbilling.controller;

import com.shopbilling.dto.request.SupplierRequest;
import com.shopbilling.dto.response.ApiResponse;
import com.shopbilling.dto.response.SupplierResponse;
import com.shopbilling.dto.response.PaginatedResponse;
import com.shopbilling.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {
    private final SupplierService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<SupplierResponse>> create(@Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Supplier created", service.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<SupplierResponse>> update(@PathVariable Long id, @Valid @RequestBody SupplierRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Supplier updated", service.update(id, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Supplier fetched", service.getById(id)));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<SupplierResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        String[] sortParams = sort.split(",");
        Sort sortObj = Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]);
        Page<SupplierResponse> data = service.getAll(PageRequest.of(page, size, sortObj));
        return ResponseEntity.ok(PaginatedResponse.success("Suppliers fetched", data.getContent(), 
            data.getNumber(), data.getSize(), data.getTotalElements(), data.getTotalPages()));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SupplierResponse>>> getAllActive() {
        return ResponseEntity.ok(ApiResponse.success("Active suppliers fetched", service.getAllActive()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Supplier deleted successfully", null));
        } catch (Exception e) {
            try {
                service.softDelete(id);
                return ResponseEntity.ok(ApiResponse.success("Supplier is in use. Disabled and set to INACTIVE instead.", null));
            } catch (Exception ex) {
                return ResponseEntity.status(500).body(ApiResponse.error("Failed to delete supplier"));
            }
        }
    }
}
