package com.visithran.loanapp.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LoanApplicationRequest {
    
    @NotNull(message = "Loan type is required")
    private String loanType;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "100.0", message = "Amount must be at least 100")
    private BigDecimal amount;
}
