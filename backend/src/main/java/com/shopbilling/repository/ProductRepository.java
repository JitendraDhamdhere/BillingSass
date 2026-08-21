package com.shopbilling.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.shopbilling.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByProductCode(String productCode);
    Optional<Product> findByBarcode(String barcode);
    Optional<Product> findTopByOrderByIdDesc();
    List<Product> findByStatus(String status);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.currentStock <= p.minimumStock AND p.status = 'ACTIVE'")
    long countLowStockProducts();
}
