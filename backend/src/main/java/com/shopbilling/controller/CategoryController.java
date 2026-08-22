package com.shopbilling.controller;

import com.shopbilling.dto.request.CategoryRequest;
import com.shopbilling.dto.response.ApiResponse;
import com.shopbilling.dto.response.CategoryResponse;
import com.shopbilling.dto.response.PaginatedResponse;
import com.shopbilling.service.CategoryService;
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
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService service;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<CategoryResponse>> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Category created", service.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<CategoryResponse>> update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Category updated", service.update(id, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Category fetched", service.getById(id)));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<CategoryResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id,desc") String sort) {
        String[] sortParams = sort.split(",");
        Sort sortObj = Sort.by(Sort.Direction.fromString(sortParams[1]), sortParams[0]);
        Page<CategoryResponse> data = service.getAll(PageRequest.of(page, size, sortObj));
        return ResponseEntity.ok(PaginatedResponse.success("Categorys fetched", data.getContent(), 
            data.getNumber(), data.getSize(), data.getTotalElements(), data.getTotalPages()));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllActive() {
        return ResponseEntity.ok(ApiResponse.success("Active categories fetched", service.getAllActive()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
        } catch (Exception e) {
            try {
                service.softDelete(id);
                return ResponseEntity.ok(ApiResponse.success("Category is in use. Disabled and set to INACTIVE instead.", null));
            } catch (Exception ex) {
                return ResponseEntity.status(500).body(ApiResponse.error("Failed to delete category"));
            }
        }
    }
}
