package com.visithran.loanapp.controller;

import com.visithran.loanapp.entity.BankBranch;
import com.visithran.loanapp.repository.BankBranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banks")
@CrossOrigin(origins = "http://localhost:8081")
public class BankController {
    
    @Autowired
    private BankBranchRepository bankBranchRepository;
    
    @GetMapping
    public ResponseEntity<List<BankBranch>> getAllBankBranches() {
        List<BankBranch> branches = bankBranchRepository.findByActiveTrue();
        return ResponseEntity.ok(branches);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BankBranch> getBankBranchById(@PathVariable Long id) {
        BankBranch branch = bankBranchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank branch not found"));
        return ResponseEntity.ok(branch);
    }
    
    @PostMapping
    public ResponseEntity<BankBranch> createBankBranch(@RequestBody BankBranch bankBranch) {
        BankBranch savedBranch = bankBranchRepository.save(bankBranch);
        return ResponseEntity.ok(savedBranch);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BankBranch> updateBankBranch(@PathVariable Long id, @RequestBody BankBranch bankBranch) {
        if (!bankBranchRepository.existsById(id)) {
            throw new RuntimeException("Bank branch not found");
        }
        bankBranch.setId(id);
        BankBranch updatedBranch = bankBranchRepository.save(bankBranch);
        return ResponseEntity.ok(updatedBranch);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBankBranch(@PathVariable Long id) {
        if (!bankBranchRepository.existsById(id)) {
            throw new RuntimeException("Bank branch not found");
        }
        bankBranchRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
