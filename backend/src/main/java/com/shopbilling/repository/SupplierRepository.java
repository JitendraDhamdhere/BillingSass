package com.shopbilling.repository;

import com.shopbilling.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findTopByOrderByIdDesc();
}
