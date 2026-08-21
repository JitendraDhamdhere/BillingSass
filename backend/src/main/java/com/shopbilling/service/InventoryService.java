package com.shopbilling.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopbilling.dto.request.InventoryAdjustmentRequest;
import com.shopbilling.entity.InventoryTransaction;
import com.shopbilling.entity.Product;
import com.shopbilling.entity.TransactionType;
import com.shopbilling.exception.BusinessException;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.InventoryTransactionRepository;
import com.shopbilling.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final ProductRepository productRepository;
    private final InventoryTransactionRepository transactionRepository;

    @Transactional
    public void adjustStock(Long productId, InventoryAdjustmentRequest request, String username) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        int previousQuantity = product.getCurrentStock() != null ? product.getCurrentStock() : 0;
        int newQuantity = previousQuantity + request.getAdjustmentQuantity();

        if (newQuantity < 0) {
            throw new BusinessException("Stock cannot be negative");
        }

        product.setCurrentStock(newQuantity);
        productRepository.save(product);

        InventoryTransaction transaction = InventoryTransaction.builder()
                .product(product)
                .type(TransactionType.ADJUSTMENT)
                .previousQuantity(previousQuantity)
                .transactionQuantity(request.getAdjustmentQuantity())
                .newQuantity(newQuantity)
                .reason(request.getReason())
                .username(username)
                .build();
        transactionRepository.save(transaction);
    }

    @Transactional
    public void recordTransaction(Product product, TransactionType type, int quantity, String referenceNumber, String username) {
        int previousQuantity = product.getCurrentStock() != null ? product.getCurrentStock() : 0;
        int newQuantity = previousQuantity + quantity;
        
        if (newQuantity < 0 && (type == TransactionType.SALE || type == TransactionType.PURCHASE_RETURN)) {
            throw new BusinessException("Insufficient stock for product: " + product.getName());
        }

        product.setCurrentStock(newQuantity);
        productRepository.save(product);

        InventoryTransaction transaction = InventoryTransaction.builder()
                .product(product)
                .type(type)
                .previousQuantity(previousQuantity)
                .transactionQuantity(quantity)
                .newQuantity(newQuantity)
                .referenceNumber(referenceNumber)
                .username(username)
                .build();
        transactionRepository.save(transaction);
    }

    public Page<InventoryTransaction> getProductTransactions(Long productId, Pageable pageable) {
        return transactionRepository.findByProductId(productId, pageable);
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findAll().stream()
                .filter(p -> p.getCurrentStock() != null && p.getMinimumStock() != null 
                        && p.getCurrentStock() <= p.getMinimumStock())
                .collect(Collectors.toList());
    }
}
