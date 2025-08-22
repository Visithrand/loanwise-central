package com.visithran.loanapp.repository;

import com.visithran.loanapp.entity.BankBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankBranchRepository extends JpaRepository<BankBranch, Long> {
    
    List<BankBranch> findByActiveTrue();
    
    List<BankBranch> findByLocationContainingIgnoreCase(String location);
}
