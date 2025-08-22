package com.visithran.loanapp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoanStatusUpdateRequest {
    
    @NotNull(message = "Status is required")
    private String status;
    
    private String rejectionReason;
}
