package com.visithran.loanapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "loan_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanType loanType;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String selectedBankBranch;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;
    
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = Status.SUBMITTED;
        }
    }
    
    public enum LoanType {
        PERSONAL_LOAN, EDUCATION_LOAN, HOUSE_LOAN, JEWEL_LOAN, AUTO_LOAN
    }
    
    public enum Status {
        SUBMITTED, APPROVED, REJECTED, VIEWED
    }
}
