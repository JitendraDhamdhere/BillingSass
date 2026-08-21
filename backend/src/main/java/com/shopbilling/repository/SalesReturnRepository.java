package com.shopbilling.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.shopbilling.entity.SalesReturn;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SalesReturnRepository extends JpaRepository<SalesReturn, Long> {
    List<SalesReturn> findByReturnDateBetween(LocalDateTime start, LocalDateTime end);
}
