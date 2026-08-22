package com.shopbilling.service;

import com.shopbilling.dto.request.BrandRequest;
import com.shopbilling.dto.response.BrandResponse;
import com.shopbilling.entity.Brand;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.BrandRepository;
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
public class BrandService {
    private final BrandRepository repository;

    @Transactional
    public BrandResponse create(BrandRequest request) {
        Brand entity = new Brand();
        BeanUtils.copyProperties(request, entity);
        if(entity.getStatus() == null) entity.setStatus("ACTIVE");
        return mapToResponse(repository.save(entity));
    }

    @Transactional
    public BrandResponse update(Long id, BrandRequest request) {
        Brand entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
        BeanUtils.copyProperties(request, entity, "id", "createdAt", "updatedAt");
        if(entity.getStatus() == null) entity.setStatus("ACTIVE");
        return mapToResponse(repository.save(entity));
    }

    public BrandResponse getById(Long id) {
        return mapToResponse(repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Brand not found")));
    }

    public Page<BrandResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::mapToResponse);
    }
    
    public List<BrandResponse> getAllActive() {
        return repository.findAll().stream()
                .filter(e -> "ACTIVE".equals(e.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
        repository.flush();
    }

    @Transactional
    public void softDelete(Long id) {
        Brand entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
        entity.setStatus("INACTIVE");
        repository.save(entity);
    }

    private BrandResponse mapToResponse(Brand entity) {
        BrandResponse response = new BrandResponse();
        BeanUtils.copyProperties(entity, response);
        return response;
    }
}
