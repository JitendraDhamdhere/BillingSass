package com.shopbilling.repository;
import com.shopbilling.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findTop5ByOrderBySaleDateDesc();

    @Query("SELECT COALESCE(SUM(s.grandTotal), 0) FROM Sale s WHERE s.saleDate >= :start AND s.saleDate <= :end")
    BigDecimal sumGrandTotalBySaleDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
