package com.shopbilling.service;

import com.shopbilling.dto.request.SupplierRequest;
import com.shopbilling.dto.response.SupplierResponse;
import com.shopbilling.entity.Supplier;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplierService {
    private final SupplierRepository repository;

    @Transactional
    public SupplierResponse create(SupplierRequest request) {
        Supplier entity = new Supplier();
        BeanUtils.copyProperties(request, entity);        
        String lastCode = repository.findTopByOrderByIdDesc()
            .map(Supplier::getSupplierCode)
            .orElse("SUP-000");
        try {
            int num = Integer.parseInt(lastCode.replace("SUP-", ""));
            entity.setSupplierCode(String.format("SUP-%03d", num + 1));
        } catch (Exception e) {
            entity.setSupplierCode("SUP-" + System.currentTimeMillis());
        }

        if(entity.getStatus() == null) entity.setStatus("ACTIVE");
        return mapToResponse(repository.save(entity));
    }

    @Transactional
    public SupplierResponse update(Long id, SupplierRequest request) {
        Supplier entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Supplier not found"));
        if (request.getStatus() == null) request.setStatus(entity.getStatus());
        BeanUtils.copyProperties(request, entity, "id", "createdAt", "updatedAt", "supplierCode");
        return mapToResponse(repository.save(entity));
    }

    public SupplierResponse getById(Long id) {
        return mapToResponse(repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Supplier not found")));
    }

    public Page<SupplierResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::mapToResponse);
    }
    
    public List<SupplierResponse> getAllActive() {
        return repository.findAll().stream()
                .filter(e -> "ACTIVE".equals(e.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private SupplierResponse mapToResponse(Supplier entity) {
        SupplierResponse response = new SupplierResponse();
        BeanUtils.copyProperties(entity, response);
        return response;
    }
}
