package com.visithran.loanapp.dto;

import com.visithran.loanapp.entity.LoanApplication;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class LoanApplicationResponse {
    private Long id;
    private UserDto applicant;
    private String loanType;
    private BigDecimal amount;
    private String status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private List<DocumentDto> documents;
    
    public static LoanApplicationResponse fromLoanApplication(LoanApplication application) {
        LoanApplicationResponse response = new LoanApplicationResponse();
        response.setId(application.getId());
        response.setApplicant(UserDto.fromUser(application.getApplicant()));
        response.setLoanType(application.getLoanType().name());
        response.setAmount(application.getAmount());
        response.setStatus(application.getStatus().name());
        response.setRejectionReason(application.getRejectionReason());
        response.setCreatedAt(application.getCreatedAt());
        
        if (application.getDocuments() != null) {
            response.setDocuments(application.getDocuments().stream()
                .map(DocumentDto::fromDocument)
                .collect(Collectors.toList()));
        }
        
        return response;
    }
}
