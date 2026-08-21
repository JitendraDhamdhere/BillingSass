package com.shopbilling.service;

import com.shopbilling.dto.request.CustomerRequest;
import com.shopbilling.dto.response.CustomerResponse;
import com.shopbilling.entity.Customer;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.CustomerRepository;
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
public class CustomerService {
    private final CustomerRepository repository;

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        Customer entity = new Customer();
        BeanUtils.copyProperties(request, entity);
        
        String lastCode = repository.findTopByOrderByIdDesc()
            .map(Customer::getCustomerCode)
            .orElse("CUST-000");
            
        try {
            int num = Integer.parseInt(lastCode.replace("CUST-", ""));
            entity.setCustomerCode(String.format("CUST-%03d", num + 1));
        } catch (Exception e) {
            entity.setCustomerCode("CUST-" + System.currentTimeMillis());
        }

        if(entity.getStatus() == null) entity.setStatus("ACTIVE");
        return mapToResponse(repository.save(entity));
    }

    @Transactional
    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer entity = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        if (request.getStatus() == null) request.setStatus(entity.getStatus());
        BeanUtils.copyProperties(request, entity, "id", "createdAt", "updatedAt", "customerCode");
        return mapToResponse(repository.save(entity));
    }

    public CustomerResponse getById(Long id) {
        return mapToResponse(repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Customer not found")));
    }

    public Page<CustomerResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable).map(this::mapToResponse);
    }
    
    public List<CustomerResponse> getAllActive() {
        return repository.findAll().stream()
                .filter(e -> "ACTIVE".equals(e.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CustomerResponse mapToResponse(Customer entity) {
        CustomerResponse response = new CustomerResponse();
        BeanUtils.copyProperties(entity, response);
        response.setStatus(entity.getStatus());
        return response;
    }
}
