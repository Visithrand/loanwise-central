package com.visithran.loanapp.controller;

import com.visithran.loanapp.dto.AuthRequest;
import com.visithran.loanapp.dto.AuthResponse;
import com.visithran.loanapp.dto.LoginRequest;
import com.visithran.loanapp.dto.UserDto;
import com.visithran.loanapp.entity.User;
import com.visithran.loanapp.repository.UserRepository;
import com.visithran.loanapp.security.JwtTokenProvider;
import com.visithran.loanapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8081")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        UserDto userDto = userService.registerUser(request);
        
        // Authenticate the user after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        AuthResponse response = new AuthResponse();
        response.setToken(jwt);
        response.setUser(userDto);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            User user = (User) authentication.getPrincipal();
            UserDto userDto = UserDto.fromUser(user);
            
            AuthResponse response = new AuthResponse();
            response.setToken(jwt);
            response.setUser(userDto);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Invalid email or password. Use demo credentials.", null));
        }
    }
    
    @GetMapping("/test-users")
    public ResponseEntity<List<UserDto>> getTestUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream()
                .map(UserDto::fromUser)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDtos);
    }
}
