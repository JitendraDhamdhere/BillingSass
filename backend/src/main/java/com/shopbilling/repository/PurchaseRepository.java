package com.shopbilling.repository;
import com.shopbilling.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    @Query("SELECT COALESCE(SUM(p.grandTotal), 0) FROM Purchase p WHERE p.purchaseDate >= :start AND p.purchaseDate <= :end")
    BigDecimal sumGrandTotalByPurchaseDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
