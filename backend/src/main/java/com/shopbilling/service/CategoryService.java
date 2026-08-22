package com.shopbilling.service;

import com.shopbilling.dto.request.CategoryRequest;
import com.shopbilling.dto.response.CategoryResponse;
import com.shopbilling.entity.Category;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.CategoryRepository;
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
public class CategoryService {
    private final CategoryRepository repository;

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category entity = new Category();
        BeanUtils.copyProperties(request, entity);
        if(entity.getStatus() == null) entity.setStatus("ACTIVE");
        return mapToResponse(repository.save(entity));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        if (request.getStatus() == null) request.setStatus(entity.getStatus());
        BeanUtils.copyProperties(request, entity, "id", "createdAt", "updatedAt");
        return mapToResponse(repository.save(entity));
    }

    public CategoryResponse getById(Long id) {
        return mapToResponse(repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Category not found")));
    }

    public Page<CategoryResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::mapToResponse);
    }
    
    public List<CategoryResponse> getAllActive() {
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
        Category entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        entity.setStatus("INACTIVE");
        repository.save(entity);
    }

    private CategoryResponse mapToResponse(Category entity) {
        CategoryResponse response = new CategoryResponse();
        BeanUtils.copyProperties(entity, response);
        return response;
    }
}
