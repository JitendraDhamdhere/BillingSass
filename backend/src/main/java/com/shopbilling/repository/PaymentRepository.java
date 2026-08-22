package com.shopbilling.repository;
import com.shopbilling.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByTransactionTypeAndTransactionId(String transactionType, Long transactionId);
}
