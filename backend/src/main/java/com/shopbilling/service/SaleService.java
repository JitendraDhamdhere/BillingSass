package com.shopbilling.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shopbilling.dto.request.PaymentRequest;
import com.shopbilling.dto.request.SaleItemRequest;
import com.shopbilling.dto.request.SaleRequest;
import com.shopbilling.entity.Customer;
import com.shopbilling.entity.Payment;
import com.shopbilling.entity.PaymentStatus;
import com.shopbilling.entity.Product;
import com.shopbilling.entity.Sale;
import com.shopbilling.entity.SaleItem;
import com.shopbilling.entity.TransactionType;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.CustomerRepository;
import com.shopbilling.repository.PaymentRepository;
import com.shopbilling.repository.ProductRepository;
import com.shopbilling.repository.SaleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaleService {
    public java.util.List<com.shopbilling.dto.response.SaleResponse> getRecentSales() {
        return saleRepository.findTop5ByOrderBySaleDateDesc().stream().map(s -> {
            com.shopbilling.dto.response.SaleResponse res = new com.shopbilling.dto.response.SaleResponse();
            res.setId(s.getId());
            res.setSaleNumber(s.getSaleNumber());
            res.setSaleDate(s.getSaleDate());
            res.setCustomerName(s.getCustomer() != null ? s.getCustomer().getName() : "Walk-in Customer");
            res.setGrandTotal(s.getGrandTotal());
            res.setPaymentStatus(s.getPaymentStatus() != null ? s.getPaymentStatus().name() : "");
            res.setCashier(s.getCashier());
            return res;
        }).collect(java.util.stream.Collectors.toList());
    }


    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final InventoryService inventoryService;

    @Transactional
    public Long createSale(SaleRequest request, String username) {
        Sale sale = new Sale();
        
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
            sale.setCustomer(customer);
        }
        
        sale.setSaleNumber("INV-" + System.currentTimeMillis());
        sale.setSaleDate(LocalDateTime.now());
        sale.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);
        sale.setNotes(request.getNotes());
        sale.setCashier(username);

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;

        for (SaleItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found"));

            BigDecimal itemDiscount = itemReq.getDiscount() != null ? itemReq.getDiscount() : BigDecimal.ZERO;
            
            // Calculate tax
            BigDecimal itemSub = itemReq.getSellingPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            BigDecimal amountAfterDiscount = itemSub.subtract(itemDiscount);
            
            // Assuming tax percentage is applied on the discounted amount
            BigDecimal taxAmount = amountAfterDiscount.multiply(product.getTaxPercentage())
                                .divide(BigDecimal.valueOf(100));
            
            BigDecimal itemTotal = amountAfterDiscount.add(taxAmount);
            
            subtotal = subtotal.add(itemSub);
            totalTax = totalTax.add(taxAmount);

            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setSellingPrice(itemReq.getSellingPrice());
            item.setPurchasePriceAtSale(product.getPurchasePrice());
            item.setDiscount(itemDiscount);
            item.setTax(taxAmount);
            item.setTotal(itemTotal);
            
            sale.getItems().add(item);
            
            // Update stock (Negative quantity for sale)
            inventoryService.recordTransaction(product, TransactionType.SALE, -itemReq.getQuantity(), sale.getSaleNumber(), username);
        }

        sale.setSubtotal(subtotal);
        sale.setTax(totalTax);
        sale.setGrandTotal(subtotal.subtract(sale.getDiscount()).add(totalTax));

        BigDecimal totalPaid = BigDecimal.ZERO;
        if (request.getPayments() != null) {
            for (PaymentRequest pr : request.getPayments()) {
                totalPaid = totalPaid.add(pr.getAmount());
            }
        }

        if (totalPaid.compareTo(sale.getGrandTotal()) >= 0) {
            sale.setPaymentStatus(PaymentStatus.PAID);
        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            sale.setPaymentStatus(PaymentStatus.PARTIAL);
        } else {
            sale.setPaymentStatus(PaymentStatus.UNPAID);
        }

        Sale savedSale = saleRepository.save(sale);

        if (request.getPayments() != null) {
            for (PaymentRequest pr : request.getPayments()) {
                Payment payment = new Payment();
                payment.setTransactionType("SALE");
                payment.setTransactionId(savedSale.getId());
                payment.setPaymentMethod(pr.getPaymentMethod());
                payment.setAmount(pr.getAmount());
                payment.setNotes(pr.getNotes());
                paymentRepository.save(payment);
            }
        }

        return savedSale.getId();
    }
}
