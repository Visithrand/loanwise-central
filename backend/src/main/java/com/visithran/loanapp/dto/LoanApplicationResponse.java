package com.visithran.loanapp.dto;

import com.visithran.loanapp.entity.LoanApplication;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LoanApplicationResponse {
    private Long id;
    private UserResponse applicant;
    private String loanType;
    private BigDecimal amount;
    private String description;
    private String selectedBankBranch;
    private String status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    
    public static LoanApplicationResponse fromLoanApplication(LoanApplication application) {
        LoanApplicationResponse response = new LoanApplicationResponse();
        response.setId(application.getId());
        response.setApplicant(UserResponse.fromUser(application.getApplicant()));
        response.setLoanType(application.getLoanType().name());
        response.setAmount(application.getAmount());
        response.setDescription(application.getDescription());
        response.setSelectedBankBranch(application.getSelectedBankBranch());
        response.setStatus(application.getStatus().name());
        response.setRejectionReason(application.getRejectionReason());
        response.setCreatedAt(application.getCreatedAt());
        return response;
    }
}
