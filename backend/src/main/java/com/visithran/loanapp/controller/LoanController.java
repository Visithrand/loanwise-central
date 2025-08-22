package com.visithran.loanapp.controller;

import com.visithran.loanapp.dto.LoanApplicationRequest;
import com.visithran.loanapp.dto.LoanApplicationResponse;
import com.visithran.loanapp.dto.LoanStatusUpdateRequest;
import com.visithran.loanapp.service.LoanApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:8081")
public class LoanController {
    
    @Autowired
    private LoanApplicationService loanApplicationService;
    
    @PostMapping
    public ResponseEntity<LoanApplicationResponse> submitLoanApplication(@Valid @RequestBody LoanApplicationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        LoanApplicationResponse response = loanApplicationService.submitLoanApplication(request, username);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<LoanApplicationResponse>> getMyApplications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        List<LoanApplicationResponse> applications = loanApplicationService.getUserApplications(username);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping
    public ResponseEntity<Page<LoanApplicationResponse>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<LoanApplicationResponse> applications = loanApplicationService.getAllApplications(pageable, search);
        return ResponseEntity.ok(applications);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<LoanApplicationResponse> updateLoanStatus(
            @PathVariable Long id,
            @Valid @RequestBody LoanStatusUpdateRequest request) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        LoanApplicationResponse response = loanApplicationService.updateLoanStatus(id, request, username);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/archive")
    public ResponseEntity<String> archiveOldApplications() {
        String result = loanApplicationService.archiveOldApplications();
        return ResponseEntity.ok(result);
    }
}
