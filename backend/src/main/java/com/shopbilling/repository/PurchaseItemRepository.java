package com.shopbilling.repository;
import com.shopbilling.entity.PurchaseItem;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {}
