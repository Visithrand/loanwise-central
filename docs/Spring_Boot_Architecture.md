# Loan Application System - Spring Boot Backend Architecture

## Project Structure

```
src/main/java/com/loansystem/
├── LoanSystemApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   ├── DatabaseConfig.java
│   ├── FileUploadConfig.java
│   └── CorsConfig.java
├── controller/
│   ├── AuthController.java
│   ├── LoanApplicationController.java
│   ├── UserController.java
│   ├── DocumentController.java
│   ├── AdminController.java
│   └── NotificationController.java
├── service/
│   ├── AuthService.java
│   ├── LoanApplicationService.java
│   ├── UserService.java
│   ├── DocumentService.java
│   ├── NotificationService.java
│   ├── EmailService.java
│   └── AuditService.java
├── repository/
│   ├── UserRepository.java
│   ├── LoanApplicationRepository.java
│   ├── LoanTypeRepository.java
│   ├── DocumentRepository.java
│   ├── AuditLogRepository.java
│   └── NotificationRepository.java
├── entity/
│   ├── User.java
│   ├── LoanApplication.java
│   ├── LoanType.java
│   ├── ApplicationDocument.java
│   ├── AuditLog.java
│   └── Notification.java
├── dto/
│   ├── auth/
│   ├── loan/
│   ├── user/
│   └── response/
├── security/
│   ├── JwtAuthenticationEntryPoint.java
│   ├── JwtRequestFilter.java
│   ├── JwtTokenUtil.java
│   └── UserDetailsServiceImpl.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── CustomExceptions.java
│   └── ErrorResponse.java
└── utils/
    ├── FileUtils.java
    ├── ValidationUtils.java
    └── DateUtils.java
```

## Dependencies (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.loansystem</groupId>
    <artifactId>loan-application-system</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>17</java.version>
        <jwt.version>0.11.5</jwt.version>
        <mysql.version>8.0.33</mysql.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-mail</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jwt.version}</version>
        </dependency>
        
        <!-- File Upload -->
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>1.5</version>
        </dependency>
        
        <!-- Logging -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

## Application Configuration

### application.yml
```yaml
spring:
  application:
    name: loan-application-system
    
  datasource:
    url: jdbc:mysql://localhost:3306/loan_system_db?useSSL=false&serverTimezone=UTC
    username: ${DB_USERNAME:loan_admin}
    password: ${DB_PASSWORD:secure_password}
    driver-class-name: com.mysql.cj.jdbc.Driver
    
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true
        
  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 25MB
      
  mail:
    host: ${MAIL_HOST:smtp.gmail.com}
    port: ${MAIL_PORT:587}
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

logging:
  level:
    com.loansystem: INFO
    org.springframework.security: DEBUG
  pattern:
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/loan-system.log

jwt:
  secret: ${JWT_SECRET:mySecretKey}
  expiration: 86400000 # 24 hours

file:
  upload:
    dir: ${FILE_UPLOAD_DIR:./uploads}
    max-size: 5242880 # 5MB

server:
  port: 8080
  servlet:
    context-path: /api
```

## Core Entity Classes

### User Entity
```java
package com.loansystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String name;
    
    @Email
    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank
    @Size(max = 255)
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.APPLICANT;
    
    @Size(max = 15)
    private String phone;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL)
    private List<LoanApplication> loanApplications;
    
    // Constructors, getters, setters
    public enum UserRole {
        ADMIN, AGENT, APPLICANT
    }
}
```

### LoanApplication Entity
```java
package com.loansystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "loan_applications")
public class LoanApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "application_number", unique = true, nullable = false)
    private String applicationNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_type_id", nullable = false)
    private LoanType loanType;
    
    // Personal Information
    @NotBlank
    @Size(max = 50)
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Email
    @NotBlank
    @Column(nullable = false)
    private String email;
    
    @NotBlank
    @Column(nullable = false)
    private String phone;
    
    @NotNull
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;
    
    @NotBlank
    @Size(min = 4, max = 4)
    @Column(name = "ssn_last_four", nullable = false)
    private String ssnLastFour;
    
    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;
    
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String city;
    
    @NotBlank
    @Size(max = 50)
    @Column(nullable = false)
    private String state;
    
    @NotBlank
    @Size(max = 10)
    @Column(name = "zip_code", nullable = false)
    private String zipCode;
    
    // Financial Information
    @NotNull
    @DecimalMin("0.01")
    @Column(name = "annual_income", nullable = false, precision = 15, scale = 2)
    private BigDecimal annualIncome;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "employment_status", nullable = false)
    private EmploymentStatus employmentStatus;
    
    @Size(max = 200)
    private String employer;
    
    @Size(max = 200)
    @Column(name = "job_title")
    private String jobTitle;
    
    @Column(name = "work_experience")
    private Integer workExperience;
    
    @Column(name = "monthly_expenses", precision = 15, scale = 2)
    private BigDecimal monthlyExpenses;
    
    @Column(name = "credit_score")
    private Integer creditScore;
    
    // Loan Details
    @NotNull
    @DecimalMin("1000.00")
    @Column(name = "requested_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedAmount;
    
    @NotBlank
    @Column(name = "loan_purpose", nullable = false, columnDefinition = "TEXT")
    private String loanPurpose;
    
    @Column(columnDefinition = "TEXT")
    private String collateral;
    
    // Application Status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
    @Column(name = "approved_amount", precision = 15, scale = 2)
    private BigDecimal approvedAmount;
    
    @Column(name = "approved_interest_rate", precision = 5, scale = 4)
    private BigDecimal approvedInterestRate;
    
    @Column(name = "approved_term_months")
    private Integer approvedTermMonths;
    
    // Audit Fields
    @Column(name = "archived_flag")
    private Boolean archivedFlag = false;
    
    @CreationTimestamp
    @Column(name = "submitted_date", updatable = false)
    private LocalDateTime submittedDate;
    
    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    @OneToMany(mappedBy = "loanApplication", cascade = CascadeType.ALL)
    private List<ApplicationDocument> documents;
    
    @OneToMany(mappedBy = "loanApplication", cascade = CascadeType.ALL)
    private List<AuditLog> auditLogs;
    
    // Constructors, getters, setters
    
    public enum ApplicationStatus {
        PENDING, UNDER_REVIEW, APPROVED, REJECTED
    }
    
    public enum EmploymentStatus {
        FULL_TIME, PART_TIME, SELF_EMPLOYED, UNEMPLOYED, RETIRED
    }
}
```

## Security Configuration

### Security Config
```java
package com.loansystem.config;

import com.loansystem.security.JwtAuthenticationEntryPoint;
import com.loansystem.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    
    @Autowired
    private UserDetailsService jwtUserDetailsService;
    
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(jwtUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/agent/**").hasAnyRole("AGENT", "ADMIN")
                .requestMatchers("/applicant/**").hasAnyRole("APPLICANT", "AGENT", "ADMIN")
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

## REST Controllers

### Loan Application Controller
```java
package com.loansystem.controller;

import com.loansystem.dto.loan.LoanApplicationDTO;
import com.loansystem.dto.loan.LoanApplicationRequestDTO;
import com.loansystem.dto.response.ApiResponse;
import com.loansystem.entity.LoanApplication;
import com.loansystem.service.LoanApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "http://localhost:3000")
public class LoanApplicationController {
    
    @Autowired
    private LoanApplicationService loanApplicationService;
    
    @PostMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<ApiResponse<LoanApplicationDTO>> createApplication(
            @Valid @RequestBody LoanApplicationRequestDTO request,
            Authentication authentication) {
        
        LoanApplicationDTO application = loanApplicationService.createApplication(request, authentication.getName());
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Application submitted successfully", application));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<LoanApplicationDTO>>> getApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable,
            Authentication authentication) {
        
        Page<LoanApplicationDTO> applications = loanApplicationService.getApplications(
                status, search, pageable, authentication);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Applications retrieved successfully", applications));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanApplicationDTO>> getApplicationById(
            @PathVariable Long id,
            Authentication authentication) {
        
        LoanApplicationDTO application = loanApplicationService.getApplicationById(id, authentication);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Application retrieved successfully", application));
    }
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<LoanApplicationDTO>> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam LoanApplication.ApplicationStatus status,
            @RequestParam(required = false) String reason,
            Authentication authentication) {
        
        LoanApplicationDTO application = loanApplicationService.updateApplicationStatus(
                id, status, reason, authentication);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Application status updated successfully", application));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(
            @PathVariable Long id,
            Authentication authentication) {
        
        loanApplicationService.deleteApplication(id, authentication);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Application deleted successfully", null));
    }
    
    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ADMIN', 'AGENT')")
    public ResponseEntity<ApiResponse<Object>> getApplicationAnalytics(
            @RequestParam(required = false) String period,
            Authentication authentication) {
        
        Object analytics = loanApplicationService.getAnalytics(period, authentication);
        
        return ResponseEntity.ok(new ApiResponse<>(true, "Analytics retrieved successfully", analytics));
    }
}
```

## Service Layer

### Loan Application Service
```java
package com.loansystem.service;

import com.loansystem.dto.loan.LoanApplicationDTO;
import com.loansystem.dto.loan.LoanApplicationRequestDTO;
import com.loansystem.entity.LoanApplication;
import com.loansystem.entity.User;
import com.loansystem.exception.ApplicationNotFoundException;
import com.loansystem.exception.UnauthorizedException;
import com.loansystem.repository.LoanApplicationRepository;
import com.loansystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LoanApplicationService {
    
    @Autowired
    private LoanApplicationRepository applicationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuditService auditService;
    
    @Autowired
    private NotificationService notificationService;
    
    public LoanApplicationDTO createApplication(LoanApplicationRequestDTO request, String userEmail) {
        User applicant = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        
        // Check if user already has an active application
        boolean hasActiveApplication = applicationRepository
                .existsByApplicantAndStatusIn(applicant, 
                        Arrays.asList(LoanApplication.ApplicationStatus.PENDING, 
                                     LoanApplication.ApplicationStatus.UNDER_REVIEW));
        
        if (hasActiveApplication) {
            throw new IllegalStateException("You already have an active loan application");
        }
        
        LoanApplication application = new LoanApplication();
        // Map DTO to entity
        mapRequestToEntity(request, application);
        application.setApplicant(applicant);
        
        LoanApplication savedApplication = applicationRepository.save(application);
        
        // Create audit log
        auditService.logApplicationSubmission(savedApplication, applicant);
        
        // Send notification
        notificationService.sendApplicationSubmittedNotification(savedApplication);
        
        return mapEntityToDTO(savedApplication);
    }
    
    @Transactional(readOnly = true)
    public Page<LoanApplicationDTO> getApplications(String status, String search, 
                                                   Pageable pageable, Authentication auth) {
        User user = getCurrentUser(auth);
        
        Page<LoanApplication> applications;
        
        if (user.getRole() == User.UserRole.APPLICANT) {
            applications = applicationRepository.findByApplicant(user, pageable);
        } else if (user.getRole() == User.UserRole.AGENT) {
            applications = applicationRepository.findAgentApplications(status, search, pageable);
        } else { // ADMIN
            applications = applicationRepository.findAllApplications(status, search, pageable);
        }
        
        return applications.map(this::mapEntityToDTO);
    }
    
    public LoanApplicationDTO updateApplicationStatus(Long id, 
                                                     LoanApplication.ApplicationStatus status,
                                                     String reason, 
                                                     Authentication auth) {
        User reviewer = getCurrentUser(auth);
        
        LoanApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));
        
        LoanApplication.ApplicationStatus oldStatus = application.getStatus();
        
        application.setStatus(status);
        application.setReviewedBy(reviewer);
        application.setReviewedAt(LocalDateTime.now());
        
        if (status == LoanApplication.ApplicationStatus.REJECTED) {
            application.setRejectionReason(reason);
        }
        
        LoanApplication savedApplication = applicationRepository.save(application);
        
        // Create audit log
        auditService.logStatusChange(savedApplication, reviewer, oldStatus, status, reason);
        
        // Send notification
        notificationService.sendStatusChangeNotification(savedApplication, oldStatus);
        
        return mapEntityToDTO(savedApplication);
    }
    
    // Additional service methods...
}
```

## Repository Layer

### Loan Application Repository
```java
package com.loansystem.repository;

import com.loansystem.entity.LoanApplication;
import com.loansystem.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    
    Page<LoanApplication> findByApplicant(User applicant, Pageable pageable);
    
    boolean existsByApplicantAndStatusIn(User applicant, List<LoanApplication.ApplicationStatus> statuses);
    
    @Query("SELECT la FROM LoanApplication la WHERE " +
           "(:status IS NULL OR la.status = :status) AND " +
           "(:search IS NULL OR LOWER(la.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(la.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(la.applicationNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<LoanApplication> findAgentApplications(@Param("status") String status, 
                                               @Param("search") String search, 
                                               Pageable pageable);
    
    @Query("SELECT la FROM LoanApplication la WHERE " +
           "(:status IS NULL OR la.status = :status) AND " +
           "(:search IS NULL OR LOWER(la.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(la.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(la.applicationNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<LoanApplication> findAllApplications(@Param("status") String status, 
                                             @Param("search") String search, 
                                             Pageable pageable);
    
    @Query("SELECT COUNT(la) FROM LoanApplication la WHERE la.submittedDate >= :startDate")
    Long countApplicationsSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT la.status, COUNT(la) FROM LoanApplication la GROUP BY la.status")
    List<Object[]> getApplicationStatusCounts();
    
    List<LoanApplication> findByArchivedFlagTrueAndLastUpdatedBefore(LocalDateTime date);
}
```

## Exception Handling

### Global Exception Handler
```java
package com.loansystem.exception;

import com.loansystem.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ApplicationNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleApplicationNotFound(ApplicationNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse<>(false, "Access denied", null));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(false, "Validation failed", errors));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "An error occurred: " + ex.getMessage(), null));
    }
}
```

This Spring Boot architecture provides:
- **Security**: JWT-based authentication with role-based access control
- **Scalability**: Proper service layer separation and database optimization
- **Maintainability**: Clean architecture with proper exception handling
- **Performance**: Optimized queries and caching strategies
- **Reliability**: Transaction management and audit trails