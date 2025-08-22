package com.visithran.loanapp.service;

import com.visithran.loanapp.dto.UserLoginRequest;
import com.visithran.loanapp.dto.UserResponse;
import com.visithran.loanapp.entity.User;
import com.visithran.loanapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public UserResponse loginOrCreateUser(UserLoginRequest request) {
        // Check if user exists by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
        
        if (user == null) {
            // Create new user as APPLICANT for ANY valid email
            user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setRole(User.Role.APPLICANT);
            user = userRepository.save(user);
        }
        
        return UserResponse.fromUser(user);
    }
    
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.fromUser(user);
    }
    
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserResponse.fromUser(user);
    }
    
    // Method to promote user to ADMIN (for testing purposes)
    public UserResponse promoteToAdmin(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.ADMIN);
        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }
}
