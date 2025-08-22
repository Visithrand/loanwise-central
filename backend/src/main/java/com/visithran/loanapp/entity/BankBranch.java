package com.visithran.loanapp.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "bank_branches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankBranch {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String branchName;
    
    @Column(nullable = false)
    private String location;
    
    @Column
    private String contactNumber;
    
    @Column
    private String email;
    
    @Column(nullable = false)
    private boolean active = true;
}
