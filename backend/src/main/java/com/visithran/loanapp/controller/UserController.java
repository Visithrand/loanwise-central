package com.visithran.loanapp.controller;

import com.visithran.loanapp.dto.UserLoginRequest;
import com.visithran.loanapp.dto.UserResponse;
import com.visithran.loanapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:8081")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody UserLoginRequest request) {
        UserResponse userResponse = userService.loginOrCreateUser(request);
        return ResponseEntity.ok(userResponse);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse userResponse = userService.getUserById(id);
        return ResponseEntity.ok(userResponse);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        UserResponse userResponse = userService.getUserByEmail(email);
        return ResponseEntity.ok(userResponse);
    }
    
    // Endpoint to promote user to ADMIN (for testing purposes)
    @PutMapping("/{email}/promote-admin")
    public ResponseEntity<UserResponse> promoteToAdmin(@PathVariable String email) {
        UserResponse userResponse = userService.promoteToAdmin(email);
        return ResponseEntity.ok(userResponse);
    }
}
