package com.visithran.loanapp.service;

import com.visithran.loanapp.dto.LoanApplicationRequest;
import com.visithran.loanapp.dto.LoanApplicationResponse;
import com.visithran.loanapp.entity.LoanApplication;
import com.visithran.loanapp.entity.User;
import com.visithran.loanapp.repository.LoanApplicationRepository;
import com.visithran.loanapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanApplicationService {
    
    @Autowired
    private LoanApplicationRepository loanApplicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public LoanApplicationResponse submitLoanApplication(LoanApplicationRequest request, String userEmail) {
        User applicant = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        LoanApplication application = new LoanApplication();
        application.setApplicant(applicant);
        application.setLoanType(LoanApplication.LoanType.valueOf(request.getLoanType()));
        application.setAmount(request.getAmount());
        application.setDescription(request.getDescription());
        application.setSelectedBankBranch(request.getSelectedBankBranch());
        application.setStatus(LoanApplication.Status.SUBMITTED);
        
        LoanApplication savedApplication = loanApplicationRepository.save(application);
        return LoanApplicationResponse.fromLoanApplication(savedApplication);
    }
    
    public List<LoanApplicationResponse> getUserApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
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
    
    public LoanApplicationResponse approveLoan(Long id) {
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan application not found"));
        
        application.setStatus(LoanApplication.Status.APPROVED);
        LoanApplication updatedApplication = loanApplicationRepository.save(application);
        return LoanApplicationResponse.fromLoanApplication(updatedApplication);
    }
    
    public LoanApplicationResponse rejectLoan(Long id, String rejectionReason) {
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan application not found"));
        
        application.setStatus(LoanApplication.Status.REJECTED);
        application.setRejectionReason(rejectionReason);
        LoanApplication updatedApplication = loanApplicationRepository.save(application);
        return LoanApplicationResponse.fromLoanApplication(updatedApplication);
    }
    
    public LoanApplicationResponse markAsViewed(Long id) {
        LoanApplication application = loanApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan application not found"));
        
        application.setStatus(LoanApplication.Status.VIEWED);
        LoanApplication updatedApplication = loanApplicationRepository.save(application);
        return LoanApplicationResponse.fromLoanApplication(updatedApplication);
    }
    
    public List<LoanApplicationResponse> getRejectedApplications() {
        List<LoanApplication> rejectedApplications = loanApplicationRepository.findByStatus(LoanApplication.Status.REJECTED);
        return rejectedApplications.stream()
                .map(LoanApplicationResponse::fromLoanApplication)
                .collect(Collectors.toList());
    }
    
    public List<LoanApplicationResponse> getApplicationsByStatus(LoanApplication.Status status) {
        List<LoanApplication> applications = loanApplicationRepository.findByStatus(status);
        return applications.stream()
                .map(LoanApplicationResponse::fromLoanApplication)
                .collect(Collectors.toList());
    }
}
