package com.visithran.loanapp.controller;

import com.visithran.loanapp.dto.LoanApplicationRequest;
import com.visithran.loanapp.dto.LoanApplicationResponse;
import com.visithran.loanapp.service.LoanApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:8081")
public class LoanController {
    
    @Autowired
    private LoanApplicationService loanApplicationService;
    
    @PostMapping
    public ResponseEntity<LoanApplicationResponse> submitLoanApplication(
            @Valid @RequestBody LoanApplicationRequest request,
            @RequestParam String userEmail) {
        
        LoanApplicationResponse response = loanApplicationService.submitLoanApplication(request, userEmail);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<LoanApplicationResponse>> getMyApplications(
            @RequestParam String userEmail) {
        
        List<LoanApplicationResponse> applications = loanApplicationService.getUserApplications(userEmail);
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
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<LoanApplicationResponse> approveLoan(@PathVariable Long id) {
        LoanApplicationResponse response = loanApplicationService.approveLoan(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<LoanApplicationResponse> rejectLoan(
            @PathVariable Long id,
            @RequestParam String rejectionReason) {
        LoanApplicationResponse response = loanApplicationService.rejectLoan(id, rejectionReason);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/view")
    public ResponseEntity<LoanApplicationResponse> markAsViewed(@PathVariable Long id) {
        LoanApplicationResponse response = loanApplicationService.markAsViewed(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/bin")
    public ResponseEntity<List<LoanApplicationResponse>> getRejectedApplications() {
        List<LoanApplicationResponse> rejectedApplications = loanApplicationService.getRejectedApplications();
        return ResponseEntity.ok(rejectedApplications);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<LoanApplicationResponse>> getApplicationsByStatus(@PathVariable String status) {
        List<LoanApplicationResponse> applications = loanApplicationService.getApplicationsByStatus(
                com.visithran.loanapp.entity.LoanApplication.Status.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(applications);
    }
}
