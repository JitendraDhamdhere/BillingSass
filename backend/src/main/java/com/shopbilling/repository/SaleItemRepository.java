package com.shopbilling.repository;
import com.shopbilling.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {}
