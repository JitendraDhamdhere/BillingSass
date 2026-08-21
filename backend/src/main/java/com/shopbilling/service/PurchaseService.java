package com.shopbilling.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopbilling.dto.request.PaymentRequest;
import com.shopbilling.dto.request.PurchaseItemRequest;
import com.shopbilling.dto.request.PurchaseRequest;
import com.shopbilling.entity.Payment;
import com.shopbilling.entity.PaymentStatus;
import com.shopbilling.entity.Product;
import com.shopbilling.entity.Purchase;
import com.shopbilling.entity.PurchaseItem;
import com.shopbilling.entity.Supplier;
import com.shopbilling.entity.TransactionType;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.PaymentRepository;
import com.shopbilling.repository.ProductRepository;
import com.shopbilling.repository.PurchaseRepository;
import com.shopbilling.repository.SupplierRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final InventoryService inventoryService;

    @Transactional
    
    
    public com.shopbilling.dto.response.PurchaseResponse getById(Long id) {
        Purchase p = purchaseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Purchase not found"));
        com.shopbilling.dto.response.PurchaseResponse res = new com.shopbilling.dto.response.PurchaseResponse();
        org.springframework.beans.BeanUtils.copyProperties(p, res);
        if(p.getSupplier() != null) {
            res.setSupplierId(p.getSupplier().getId());
            res.setSupplierName(p.getSupplier().getName());
        }
        if(p.getPaymentStatus() != null) res.setPaymentStatus(p.getPaymentStatus().name());
        return res;
    }

    @Transactional
    public Long updatePurchase(Long id, PurchaseRequest request, String username) {
        Purchase purchase = purchaseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Purchase not found"));
        
        // Revert old stock
        for (PurchaseItem item : purchase.getItems()) {
            inventoryService.recordTransaction(item.getProduct(), TransactionType.ADJUSTMENT, -item.getQuantity(), "Revert PUR-" + purchase.getPurchaseNumber(), username);
        }
        
        // Clear items
        purchase.getItems().clear();
        
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found"));

        purchase.setSupplier(supplier);
        purchase.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);
        purchase.setNotes(request.getNotes());

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (PurchaseItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));

            BigDecimal itemDiscount = itemReq.getDiscount() != null ? itemReq.getDiscount() : BigDecimal.ZERO;
            BigDecimal itemSub = itemReq.getPurchasePrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            BigDecimal itemTotal = itemSub.subtract(itemDiscount).add(itemReq.getTax());
            
            subtotal = subtotal.add(itemSub);
            totalTax = totalTax.add(itemReq.getTax());

            PurchaseItem item = new PurchaseItem();
            item.setPurchase(purchase);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPurchasePrice(itemReq.getPurchasePrice());
            item.setDiscount(itemDiscount);
            item.setTax(itemReq.getTax());
            item.setTotal(itemTotal);
            
            purchase.getItems().add(item);
            inventoryService.recordTransaction(product, TransactionType.PURCHASE, itemReq.getQuantity(), purchase.getPurchaseNumber(), username);
        }

        purchase.setSubtotal(subtotal);
        purchase.setTax(totalTax);
        purchase.setGrandTotal(subtotal.subtract(purchase.getDiscount()).add(totalTax));
        
        return purchaseRepository.save(purchase).getId();
    }

    public org.springframework.data.domain.Page<com.shopbilling.dto.response.PurchaseResponse> getAll(org.springframework.data.domain.Pageable pageable) {
        return purchaseRepository.findAll(pageable).map(p -> {
            com.shopbilling.dto.response.PurchaseResponse res = new com.shopbilling.dto.response.PurchaseResponse();
            org.springframework.beans.BeanUtils.copyProperties(p, res);
            if(p.getSupplier() != null) {
                res.setSupplierId(p.getSupplier().getId());
                res.setSupplierName(p.getSupplier().getName());
            }
            if(p.getPaymentStatus() != null) res.setPaymentStatus(p.getPaymentStatus().name());
            return res;
        });
    }

    public Long createPurchase(PurchaseRequest request, String username) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found"));

        Purchase purchase = new Purchase();
        purchase.setSupplier(supplier);
        purchase.setPurchaseNumber(request.getPurchaseNumber() != null ? request.getPurchaseNumber() : "PUR-" + System.currentTimeMillis());
        purchase.setPurchaseDate(LocalDateTime.now());
        purchase.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);
        purchase.setNotes(request.getNotes());

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (PurchaseItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));

            BigDecimal itemDiscount = itemReq.getDiscount() != null ? itemReq.getDiscount() : BigDecimal.ZERO;
            
            // Total = (Price * Qty) - Discount + Tax
            BigDecimal itemSub = itemReq.getPurchasePrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            BigDecimal itemTotal = itemSub.subtract(itemDiscount).add(itemReq.getTax());
            
            subtotal = subtotal.add(itemSub);
            totalTax = totalTax.add(itemReq.getTax());

            PurchaseItem item = new PurchaseItem();
            item.setPurchase(purchase);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPurchasePrice(itemReq.getPurchasePrice());
            item.setDiscount(itemDiscount);
            item.setTax(itemReq.getTax());
            item.setTotal(itemTotal);
            
            purchase.getItems().add(item);
            
            // Update stock
            inventoryService.recordTransaction(product, TransactionType.PURCHASE, itemReq.getQuantity(), purchase.getPurchaseNumber(), username);
        }

        purchase.setSubtotal(subtotal);
        purchase.setTax(totalTax);
        purchase.setGrandTotal(subtotal.subtract(purchase.getDiscount()).add(totalTax));

        BigDecimal totalPaid = BigDecimal.ZERO;
        if (request.getPayments() != null) {
            for (PaymentRequest pr : request.getPayments()) {
                totalPaid = totalPaid.add(pr.getAmount());
            }
        }

        if (totalPaid.compareTo(purchase.getGrandTotal()) >= 0) {
            purchase.setPaymentStatus(PaymentStatus.PAID);
        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            purchase.setPaymentStatus(PaymentStatus.PARTIAL);
        } else {
            purchase.setPaymentStatus(PaymentStatus.UNPAID);
        }

        Purchase savedPurchase = purchaseRepository.save(purchase);

        if (request.getPayments() != null) {
            for (PaymentRequest pr : request.getPayments()) {
                Payment payment = new Payment();
                payment.setTransactionType("PURCHASE");
                payment.setTransactionId(savedPurchase.getId());
                payment.setPaymentMethod(pr.getPaymentMethod());
                payment.setAmount(pr.getAmount());
                payment.setNotes(pr.getNotes());
                paymentRepository.save(payment);
            }
        }

        return savedPurchase.getId();
    }
}
