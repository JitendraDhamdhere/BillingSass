package com.shopbilling.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shopbilling.entity.*;
import com.shopbilling.repository.*;
import com.shopbilling.dto.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final SaleRepository saleRepository;
    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final PaymentRepository paymentRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final SalesReturnRepository salesReturnRepository;

    @GetMapping
    public ResponseEntity<?> getReport(
            @RequestParam String type,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        LocalDateTime start = startDate != null && !startDate.isEmpty() ? 
            LocalDate.parse(startDate).atStartOfDay() : LocalDate.now().minusDays(30).atStartOfDay();
        LocalDateTime end = endDate != null && !endDate.isEmpty() ? 
            LocalDate.parse(endDate).atTime(LocalTime.MAX) : LocalDate.now().atTime(LocalTime.MAX);

        List<Map<String, Object>> data = new ArrayList<>();

        switch (type.toUpperCase()) {
            case "DAILY_SALES":
                data = getDailySales(start, end);
                break;
            case "SALES_SUMMARY":
                return ResponseEntity.ok(ApiResponse.success("Sales Summary fetched", getSalesSummary(start, end)));
            case "SALES_REGISTER":
                data = getSalesRegister(start, end);
                break;
            case "PRODUCT_SALES":
                data = getProductSales(start, end);
                break;
            case "CUSTOMER_SALES":
                data = getCustomerSales(start, end);
                break;
            case "SALES_RETURN":
                data = getSalesReturn(start, end);
                break;
            case "PURCHASE_REPORT":
                data = getPurchaseReport(start, end);
                break;
            case "PURCHASE_RETURN":
                data = new ArrayList<>(); // Mocked empty
                break;
            case "STOCK_REPORT":
                data = getStockReport();
                break;
            case "STOCK_MOVEMENT":
                data = getStockMovement(start, end);
                break;
            case "LOW_STOCK":
                data = getLowStockReport();
                break;
            case "STOCK_VALUATION":
                data = getStockValuation();
                break;
            case "PAYMENT_COLLECTION":
                data = getPaymentCollection(start, end);
                break;
            case "CUSTOMER_OUTSTANDING":
                data = getCustomerOutstanding();
                break;
            case "SUPPLIER_OUTSTANDING":
                data = getSupplierOutstanding();
                break;
            case "PROFIT_LOSS":
                return ResponseEntity.ok(ApiResponse.success("Profit & Loss fetched", getProfitLoss(start, end)));
            case "CUSTOMER_ACTIVITY":
                data = getCustomerActivity(start, end);
                break;
            case "TOP_PRODUCTS":
                data = getTopProducts(start, end);
                break;
            case "TOP_CUSTOMERS":
                data = getTopCustomers(start, end);
                break;
            default:
                return ResponseEntity.badRequest().body(ApiResponse.error("Invalid report type: " + type));
        }

        return ResponseEntity.ok(ApiResponse.success("Report fetched successfully", data));
    }

    private List<Map<String, Object>> getDailySales(LocalDateTime start, LocalDateTime end) {
        List<Sale> sales = saleRepository.findAll().stream()
            .filter(s -> s.getSaleDate().isAfter(start) && s.getSaleDate().isBefore(end))
            .collect(Collectors.toList());

        Map<String, List<Sale>> grouped = sales.stream()
            .collect(Collectors.groupingBy(s -> s.getSaleDate().toLocalDate().toString()));

        List<Map<String, Object>> result = new ArrayList<>();
        grouped.forEach((date, list) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", date);
            map.put("invoiceCount", list.size());
            map.put("totalSales", list.stream().map(Sale::getGrandTotal).reduce(BigDecimal.ZERO, BigDecimal::add));
            result.add(map);
        });

        result.sort((a, b) -> ((String) b.get("date")).compareTo((String) a.get("date")));
        return result;
    }

    private Map<String, Object> getSalesSummary(LocalDateTime start, LocalDateTime end) {
        List<Sale> sales = saleRepository.findAll().stream()
            .filter(s -> s.getSaleDate().isAfter(start) && s.getSaleDate().isBefore(end))
            .collect(Collectors.toList());

        BigDecimal totalSales = sales.stream().map(Sale::getGrandTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalDiscount = sales.stream().map(s -> s.getDiscount() != null ? s.getDiscount() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Summing up tax from sale items
        BigDecimal totalTax = BigDecimal.ZERO;
        for (Sale s : sales) {
            if (s.getItems() != null) {
                for (SaleItem item : s.getItems()) {
                    totalTax = totalTax.add(item.getTax() != null ? item.getTax() : BigDecimal.ZERO);
                }
            }
        }

        BigDecimal netSales = totalSales.subtract(totalTax);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalSales", totalSales);
        summary.put("totalDiscount", totalDiscount);
        summary.put("totalTax", totalTax);
        summary.put("netSales", netSales);
        summary.put("invoiceCount", sales.size());
        return summary;
    }

    private List<Map<String, Object>> getSalesRegister(LocalDateTime start, LocalDateTime end) {
        return saleRepository.findAll().stream()
            .filter(s -> s.getSaleDate().isAfter(start) && s.getSaleDate().isBefore(end))
            .map(s -> {
                Map<String, Object> map = new HashMap<>();
                map.put("saleNumber", s.getSaleNumber());
                map.put("date", s.getSaleDate().toString());
                map.put("customerName", s.getCustomer() != null ? s.getCustomer().getName() : "Walk-in Customer");
                map.put("grandTotal", s.getGrandTotal());
                map.put("paymentStatus", s.getPaymentStatus() != null ? s.getPaymentStatus().name() : "PAID");
                map.put("cashier", s.getCashier());
                return map;
            })
            .sorted((a, b) -> ((String) b.get("date")).compareTo((String) a.get("date")))
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getProductSales(LocalDateTime start, LocalDateTime end) {
        List<Sale> sales = saleRepository.findAll().stream()
            .filter(s -> s.getSaleDate().isAfter(start) && s.getSaleDate().isBefore(end))
            .collect(Collectors.toList());

        Map<String, Map<String, Object>> aggregates = new HashMap<>();
        for (Sale s : sales) {
            if (s.getItems() != null) {
                for (SaleItem item : s.getItems()) {
                    String code = item.getProduct().getProductCode();
                    String name = item.getProduct().getName();
                    BigDecimal totalVal = item.getSellingPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    
                    aggregates.computeIfAbsent(code, k -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("productCode", code);
                        map.put("name", name);
                        map.put("quantitySold", 0);
                        map.put("totalRevenue", BigDecimal.ZERO);
                        return map;
                    });
                    
                    Map<String, Object> map = aggregates.get(code);
                    map.put("quantitySold", (int) map.get("quantitySold") + item.getQuantity());
                    map.put("totalRevenue", ((BigDecimal) map.get("totalRevenue")).add(totalVal));
                }
            }
        }

        return aggregates.values().stream()
            .sorted((a, b) -> ((BigDecimal) b.get("totalRevenue")).compareTo((BigDecimal) a.get("totalRevenue")))
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getCustomerSales(LocalDateTime start, LocalDateTime end) {
        List<Sale> sales = saleRepository.findAll().stream()
            .filter(s -> s.getSaleDate().isAfter(start) && s.getSaleDate().isBefore(end))
            .collect(Collectors.toList());

        Map<String, Map<String, Object>> clientSales = new HashMap<>();
        for (Sale s : sales) {
            String name = s.getCustomer() != null ? s.getCustomer().getName() : "Walk-in Customer";
            clientSales.computeIfAbsent(name, k -> {
                Map<String, Object> map = new HashMap<>();
                map.put("customerName", name);
                map.put("invoiceCount", 0);
                map.put("totalSales", BigDecimal.ZERO);
                return map;
            });

            Map<String, Object> map = clientSales.get(name);
            map.put("invoiceCount", (int) map.get("invoiceCount") + 1);
            map.put("totalSales", ((BigDecimal) map.get("totalSales")).add(s.getGrandTotal()));
        }

        return clientSales.values().stream()
            .sorted((a, b) -> ((BigDecimal) b.get("totalSales")).compareTo((BigDecimal) a.get("totalSales")))
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getSalesReturn(LocalDateTime start, LocalDateTime end) {
        return salesReturnRepository.findByReturnDateBetween(start, end).stream()
            .map(sr -> {
                Map<String, Object> map = new HashMap<>();
                map.put("returnNumber", sr.getReturnNumber());
                map.put("saleNumber", sr.getSale() != null ? sr.getSale().getSaleNumber() : "N/A");
                map.put("date", sr.getReturnDate().toString());
                map.put("refundAmount", sr.getRefundAmount());
                map.put("reason", sr.getReason());
                return map;
            })
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getPurchaseReport(LocalDateTime start, LocalDateTime end) {
        return purchaseRepository.findAll().stream()
            .filter(p -> p.getPurchaseDate().isAfter(start) && p.getPurchaseDate().isBefore(end))
            .map(p -> {
                Map<String, Object> map = new HashMap<>();
                map.put("purchaseNumber", p.getPurchaseNumber());
                map.put("supplierName", p.getSupplier() != null ? p.getSupplier().getName() : "Unknown Supplier");
                map.put("date", p.getPurchaseDate().toString());
                map.put("grandTotal", p.getGrandTotal());
                map.put("paymentStatus", p.getPaymentStatus() != null ? p.getPaymentStatus().name() : "PAID");
                return map;
            })
            .sorted((a, b) -> ((String) b.get("date")).compareTo((String) a.get("date")))
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getStockReport() {
        return productRepository.findAll().stream()
            .map(p -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", p.getName());
                map.put("productCode", p.getProductCode());
                map.put("category", p.getCategory() != null ? p.getCategory().getName() : "N/A");
                map.put("brand", p.getBrand() != null ? p.getBrand().getName() : "N/A");
                map.put("currentStock", p.getCurrentStock());
                map.put("status", p.getStatus());
                return map;
            })
            .sorted((a, b) -> ((String) a.get("name")).compareTo((String) b.get("name")))
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getStockMovement(LocalDateTime start, LocalDateTime end) {
        return inventoryTransactionRepository.findAll().stream()
            .filter(t -> t.getTransactionDate().isAfter(start) && t.getTransactionDate().isBefore(end))
            .map(t -> {
                Map<String, Object> map = new HashMap<>();
                map.put("date", t.getTransactionDate().toString());
                map.put("productName", t.getProduct() != null ? t.getProduct().getName() : "N/A");
                map.put("type", t.getType() != null ? t.getType().name() : "IN");
                map.put("quantity", t.getTransactionQuantity());
                map.put("reason", t.getReason());
                return map;
            })
            .sorted((a, b) -> ((String) b.get("date")).compareTo((String) a.get("date")))
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getLowStockReport() {
        return productRepository.findAll().stream()
            .filter(p -> p.getCurrentStock() <= p.getMinimumStock())
            .map(p -> {
                Map<String, Object> map = new HashMap<>();
                map.put("name", p.getName());
                map.put("productCode", p.getProductCode());
                map.put("currentStock", p.getCurrentStock());
                map.put("minimumStock", p.getMinimumStock());
                map.put("requiredReplenish", p.getMinimumStock() - p.getCurrentStock() + 10); // buffer
                return map;
            })
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getStockValuation() {
        return productRepository.findAll().stream()
            .map(p -> {
                BigDecimal current = BigDecimal.valueOf(p.getCurrentStock());
                BigDecimal purchaseVal = p.getPurchasePrice().multiply(current);
                BigDecimal sellingVal = p.getSellingPrice().multiply(current);
                
                Map<String, Object> map = new HashMap<>();
                map.put("name", p.getName());
                map.put("productCode", p.getProductCode());
                map.put("currentStock", p.getCurrentStock());
                map.put("purchasePrice", p.getPurchasePrice());
                map.put("sellingPrice", p.getSellingPrice());
                map.put("totalPurchaseValue", purchaseVal);
                map.put("totalSellingValue", sellingVal);
                return map;
            })
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getPaymentCollection(LocalDateTime start, LocalDateTime end) {
        List<Payment> payments = paymentRepository.findAll().stream()
            .filter(p -> p.getPaymentDate().isAfter(start) && p.getPaymentDate().isBefore(end))
            .collect(Collectors.toList());

        Map<String, BigDecimal> methods = new HashMap<>();
        methods.put("CASH", BigDecimal.ZERO);
        methods.put("CARD", BigDecimal.ZERO);
        methods.put("UPI", BigDecimal.ZERO);
        methods.put("BANK_TRANSFER", BigDecimal.ZERO);

        for (Payment p : payments) {
            String method = p.getPaymentMethod() != null ? p.getPaymentMethod().name() : "CASH";
            methods.put(method, methods.getOrDefault(method, BigDecimal.ZERO).add(p.getAmount()));
        }

        List<Map<String, Object>> result = new ArrayList<>();
        methods.forEach((k, v) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("paymentMethod", k);
            map.put("totalAmount", v);
            result.add(map);
        });

        return result;
    }

    private List<Map<String, Object>> getCustomerOutstanding() {
        return customerRepository.findAll().stream()
            .map(c -> {
                // Outstanding sales balance
                BigDecimal outstanding = saleRepository.findAll().stream()
                    .filter(s -> s.getCustomer() != null && s.getCustomer().getId().equals(c.getId()))
                    .filter(s -> s.getPaymentStatus() == PaymentStatus.UNPAID || s.getPaymentStatus() == PaymentStatus.PARTIAL)
                    .map(Sale::getGrandTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

                Map<String, Object> map = new HashMap<>();
                map.put("customerCode", c.getCustomerCode());
                map.put("name", c.getName());
                map.put("mobile", c.getMobile());
                map.put("email", c.getEmail());
                map.put("outstanding", outstanding);
                return map;
            })
            .filter(map -> ((BigDecimal) map.get("outstanding")).compareTo(BigDecimal.ZERO) > 0)
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getSupplierOutstanding() {
        return supplierRepository.findAll().stream()
            .map(s -> {
                BigDecimal outstanding = purchaseRepository.findAll().stream()
                    .filter(p -> p.getSupplier() != null && p.getSupplier().getId().equals(s.getId()))
                    .filter(p -> p.getPaymentStatus() == PaymentStatus.UNPAID || p.getPaymentStatus() == PaymentStatus.PARTIAL)
                    .map(Purchase::getGrandTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

                Map<String, Object> map = new HashMap<>();
                map.put("supplierCode", s.getSupplierCode());
                map.put("companyName", s.getCompanyName());
                map.put("name", s.getName());
                map.put("mobile", s.getMobile());
                map.put("outstanding", outstanding);
                return map;
            })
            .filter(map -> ((BigDecimal) map.get("outstanding")).compareTo(BigDecimal.ZERO) > 0)
            .collect(Collectors.toList());
    }

    private Map<String, Object> getProfitLoss(LocalDateTime start, LocalDateTime end) {
        List<Sale> sales = saleRepository.findAll().stream()
            .filter(s -> s.getSaleDate().isAfter(start) && s.getSaleDate().isBefore(end))
            .collect(Collectors.toList());

        BigDecimal totalSales = sales.stream().map(Sale::getGrandTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Cost of Goods Sold = sum (item.quantity * product.purchasePrice)
        BigDecimal costOfGoods = BigDecimal.ZERO;
        for (Sale s : sales) {
            if (s.getItems() != null) {
                for (SaleItem item : s.getItems()) {
                    BigDecimal cost = item.getProduct().getPurchasePrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                    costOfGoods = costOfGoods.add(cost);
                }
            }
        }

        BigDecimal grossProfit = totalSales.subtract(costOfGoods);
        BigDecimal margin = totalSales.compareTo(BigDecimal.ZERO) > 0 ? 
            grossProfit.divide(totalSales, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)) : BigDecimal.ZERO;

        Map<String, Object> pl = new HashMap<>();
        pl.put("totalRevenue", totalSales);
        pl.put("costOfGoods", costOfGoods);
        pl.put("grossProfit", grossProfit);
        pl.put("profitMarginPercentage", margin);
        return pl;
    }

    private List<Map<String, Object>> getCustomerActivity(LocalDateTime start, LocalDateTime end) {
        return customerRepository.findAll().stream()
            .map(c -> {
                List<Sale> sales = saleRepository.findAll().stream()
                    .filter(s -> s.getCustomer() != null && s.getCustomer().getId().equals(c.getId()))
                    .filter(s -> s.getSaleDate().isAfter(start) && s.getSaleDate().isBefore(end))
                    .collect(Collectors.toList());

                BigDecimal totalSpend = sales.stream().map(Sale::getGrandTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

                Map<String, Object> map = new HashMap<>();
                map.put("name", c.getName());
                map.put("customerCode", c.getCustomerCode());
                map.put("invoiceCount", sales.size());
                map.put("totalSpend", totalSpend);
                return map;
            })
            .collect(Collectors.toList());
    }

    private List<Map<String, Object>> getTopProducts(LocalDateTime start, LocalDateTime end) {
        return getProductSales(start, end).stream().limit(10).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getTopCustomers(LocalDateTime start, LocalDateTime end) {
        return getCustomerSales(start, end).stream().limit(10).collect(Collectors.toList());
    }
}
