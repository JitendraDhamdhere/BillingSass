package com.shopbilling.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopbilling.dto.request.ProductRequest;
import com.shopbilling.dto.response.ProductResponse;
import com.shopbilling.entity.Brand;
import com.shopbilling.entity.Category;
import com.shopbilling.entity.Product;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.BrandRepository;
import com.shopbilling.repository.CategoryRepository;
import com.shopbilling.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        BeanUtils.copyProperties(request, product);
        
        String lastCode = productRepository.findTopByOrderByIdDesc()
            .map(Product::getProductCode)
            .orElse("PROD-000");
            
        try {
            int num = Integer.parseInt(lastCode.replace("PROD-", ""));
            product.setProductCode(String.format("PROD-%03d", num + 1));
        } catch (Exception e) {
            product.setProductCode("PROD-" + System.currentTimeMillis());
        }
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
                
        product.setCategory(category);
        product.setBrand(brand);
        if(product.getStatus() == null) product.setStatus("ACTIVE");
        
        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
                
        if (request.getStatus() == null) request.setStatus(product.getStatus());
        BeanUtils.copyProperties(request, product, "id", "createdAt", "updatedAt", "currentStock", "productCode", "barcode");
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
                
        product.setCategory(category);
        product.setBrand(brand);
        
        return mapToResponse(productRepository.save(product));
    }

    public ProductResponse getById(Long id) {
        return mapToResponse(productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found")));
    }
    
    public ProductResponse getByBarcode(String barcode) {
        return mapToResponse(productRepository.findByBarcode(barcode)
                .orElseThrow(() -> new EntityNotFoundException("Product not found by barcode")));
    }

    
    public List<ProductResponse> getAllActive() {
        return productRepository.findByStatus("ACTIVE").stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public Page<ProductResponse> getAll(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::mapToResponse);
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        BeanUtils.copyProperties(product, response);
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }
        if (product.getBrand() != null) {
            response.setBrandId(product.getBrand().getId());
            response.setBrandName(product.getBrand().getName());
        }
        return response;
    }
}
