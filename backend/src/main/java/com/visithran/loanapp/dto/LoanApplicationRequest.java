package com.visithran.loanapp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanApplicationRequest {
    
    @NotBlank(message = "Loan type is required")
    private String loanType;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "100.0", message = "Amount must be at least 100")
    private BigDecimal amount;
    
    private String description;
    
    @NotBlank(message = "Bank branch is required")
    private String selectedBankBranch;
}
