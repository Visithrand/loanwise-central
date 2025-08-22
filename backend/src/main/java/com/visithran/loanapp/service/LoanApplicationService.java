package com.visithran.loanapp.service;

import com.visithran.loanapp.dto.LoanApplicationRequest;
import com.visithran.loanapp.dto.LoanApplicationResponse;
import com.visithran.loanapp.dto.LoanStatusUpdateRequest;
import com.visithran.loanapp.entity.*;
import com.visithran.loanapp.repository.AuditLogRepository;
import com.visithran.loanapp.repository.LoanApplicationRepository;
import com.visithran.loanapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanApplicationService {
    
    @Autowired
    private LoanApplicationRepository loanApplicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    public LoanApplicationResponse submitLoanApplication(LoanApplicationRequest request, String username) {
        User applicant = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LoanApplication application = new LoanApplication();
        application.setApplicant(applicant);
        application.setLoanType(LoanApplication.LoanType.valueOf(request.getLoanType()));
        application.setAmount(request.getAmount());
        application.setStatus(LoanApplication.Status.PENDING);
        
        LoanApplication savedApplication = loanApplicationRepository.save(application);
        
        // Create audit log
        createAuditLog(savedApplication, applicant, AuditLog.Action.CREATED, "Loan application submitted");
        
        return LoanApplicationResponse.fromLoanApplication(savedApplication);
    }
    
    public List<LoanApplicationResponse> getUserApplications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<LoanApplication> applications = loanApplicationRepository.findByApplicantId(user.getId());
        return applications.stream()
                .map(LoanApplicationResponse::fromLoanApplication)
                .collect(Collectors.toList());
    }
    
    public Page<LoanApplicationResponse> getAllApplications(Pageable pageable, String search) {
        Page<LoanApplication> applications;
        if (search != null && !search.trim().isEmpty()) {
            applications = loanApplicationRepository.findBySearchTerm(search, pageable);
        } else {
            applications = loanApplicationRepository.findAll(pageable);
        }
        
        return applications.map(LoanApplicationResponse::fromLoanApplication);
    }
    
    public LoanApplicationResponse updateLoanStatus(Long id, LoanStatusUpdateRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan application not found"));
        
        LoanApplication.Status newStatus = LoanApplication.Status.valueOf(request.getStatus());
        application.setStatus(newStatus);
        
        if (newStatus == LoanApplication.Status.REJECTED) {
            application.setRejectionReason(request.getRejectionReason());
        }
        
        LoanApplication updatedApplication = loanApplicationRepository.save(application);
        
        // Create audit log
        String action = newStatus == LoanApplication.Status.APPROVED ? "APPROVED" : "REJECTED";
        createAuditLog(updatedApplication, user, AuditLog.Action.valueOf(action), 
                "Loan application " + action.toLowerCase());
        
        return LoanApplicationResponse.fromLoanApplication(updatedApplication);
    }
    
    public String archiveOldApplications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusYears(1);
        List<LoanApplication> oldApplications = loanApplicationRepository.findOldApplicationsForArchiving(cutoffDate);
        
        // In a real application, you might move these to an archive table
        // For now, we'll just delete them
        loanApplicationRepository.deleteAll(oldApplications);
        
        return "Archived " + oldApplications.size() + " old applications";
    }
    
    private void createAuditLog(LoanApplication application, User user, AuditLog.Action action, String details) {
        AuditLog auditLog = new AuditLog();
        auditLog.setLoanApplication(application);
        auditLog.setUser(user);
        auditLog.setAction(action);
        auditLog.setDetails(details);
        auditLogRepository.save(auditLog);
    }
}
