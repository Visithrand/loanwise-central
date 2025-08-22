package com.visithran.loanapp.repository;

import com.visithran.loanapp.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    List<AuditLog> findByLoanApplicationId(Long loanApplicationId);
    
    List<AuditLog> findByUserId(Long userId);
    
    List<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    List<AuditLog> findByAction(AuditLog.Action action);
}
