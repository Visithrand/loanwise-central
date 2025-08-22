package com.visithran.loanapp.repository;

import com.visithran.loanapp.entity.LoanApplication;
import com.visithran.loanapp.entity.LoanApplication.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    
    List<LoanApplication> findByApplicantId(Long applicantId);
    
    Page<LoanApplication> findByStatus(Status status, Pageable pageable);
    
    @Query("SELECT la FROM LoanApplication la WHERE " +
           "la.applicant.username LIKE %:search% OR " +
           "la.applicant.email LIKE %:search% OR " +
           "CAST(la.id AS string) LIKE %:search%")
    Page<LoanApplication> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT la FROM LoanApplication la WHERE " +
           "la.status IN ('APPROVED', 'REJECTED') AND " +
           "la.createdAt < :cutoffDate")
    List<LoanApplication> findOldApplicationsForArchiving(@Param("cutoffDate") LocalDateTime cutoffDate);
}
