package com.shopbilling.controller;

import com.shopbilling.dto.request.BrandRequest;
import com.shopbilling.dto.response.ApiResponse;
import com.shopbilling.dto.response.BrandResponse;
import com.shopbilling.dto.response.PaginatedResponse;
import com.shopbilling.service.BrandService;
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
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {
    private final BrandService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<BrandResponse>> create(@Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Brand created", service.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<BrandResponse>> update(@PathVariable Long id, @Valid @RequestBody BrandRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Brand updated", service.update(id, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Brand fetched", service.getById(id)));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<BrandResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        String[] sortParams = sort.split(",");
        Sort sortObj = Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]);
        Page<BrandResponse> data = service.getAll(PageRequest.of(page, size, sortObj));
        return ResponseEntity.ok(PaginatedResponse.success("Brands fetched", data.getContent(), 
            data.getNumber(), data.getSize(), data.getTotalElements(), data.getTotalPages()));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getAllActive() {
        return ResponseEntity.ok(ApiResponse.success("Active brands fetched", service.getAllActive()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Brand deleted successfully", null));
        } catch (Exception e) {
            try {
                service.softDelete(id);
                return ResponseEntity.ok(ApiResponse.success("Brand is in use. Disabled and set to INACTIVE instead.", null));
            } catch (Exception ex) {
                return ResponseEntity.status(500).body(ApiResponse.error("Failed to delete brand"));
            }
        }
    }
}
