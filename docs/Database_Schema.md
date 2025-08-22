# Loan Application System - Database Schema

## Entity Relationship Diagram (ERD)

```
[users] ──┐
│id (PK)   │
│name      │
│email     │
│password  │
│role      │
│created   │
└──────────┘
     │
     │ 1:N
     ▼
[loan_applications] ──┐
│id (PK)              │
│applicant_id (FK)    │
│loan_type_id (FK)    │
│amount               │
│status               │
│rejection_reason     │
│archived_flag        │
│submitted_date       │
│last_updated         │
└─────────────────────┘
     │                │
     │ 1:N            │ N:1
     ▼                ▼
[application_documents] [loan_types]
│id (PK)              │id (PK)
│application_id (FK)  │name
│document_name        │max_amount
│file_url             │interest_rate
│upload_date          │terms
└─────────────────────┘└─────────────

[audit_logs] ──┐
│id (PK)       │
│application_id│
│user_id (FK)  │
│action        │
│old_status    │
│new_status    │
│reason        │
│timestamp     │
└──────────────┘
```

## MySQL Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'AGENT', 'APPLICANT') NOT NULL DEFAULT 'APPLICANT',
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);
```

### 2. Loan Types Table
```sql
CREATE TABLE loan_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_amount DECIMAL(15, 2) NOT NULL,
    min_amount DECIMAL(15, 2) NOT NULL DEFAULT 1000,
    interest_rate DECIMAL(5, 4) NOT NULL,
    max_term_months INT NOT NULL,
    min_term_months INT NOT NULL DEFAULT 12,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active)
);
```

### 3. Loan Applications Table
```sql
CREATE TABLE loan_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_number VARCHAR(20) UNIQUE NOT NULL,
    applicant_id BIGINT NOT NULL,
    loan_type_id BIGINT NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn_last_four CHAR(4) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    
    -- Financial Information
    annual_income DECIMAL(15, 2) NOT NULL,
    employment_status ENUM('FULL_TIME', 'PART_TIME', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED') NOT NULL,
    employer VARCHAR(200),
    job_title VARCHAR(200),
    work_experience INT,
    monthly_expenses DECIMAL(15, 2),
    credit_score INT,
    
    -- Loan Details
    requested_amount DECIMAL(15, 2) NOT NULL,
    loan_purpose TEXT NOT NULL,
    collateral TEXT,
    
    -- Application Status
    status ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    approved_amount DECIMAL(15, 2),
    approved_interest_rate DECIMAL(5, 4),
    approved_term_months INT,
    
    -- Audit Fields
    archived_flag BOOLEAN DEFAULT FALSE,
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    reviewed_by BIGINT,
    reviewed_at TIMESTAMP NULL,
    
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (loan_type_id) REFERENCES loan_types(id) ON DELETE RESTRICT,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_applicant (applicant_id),
    INDEX idx_status (status),
    INDEX idx_submitted_date (submitted_date),
    INDEX idx_archived (archived_flag),
    INDEX idx_application_number (application_number)
);
```

### 4. Application Documents Table
```sql
CREATE TABLE application_documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    document_type ENUM('IDENTITY', 'INCOME_PROOF', 'BANK_STATEMENT', 'EMPLOYMENT_VERIFICATION', 'OTHER') NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE CASCADE,
    
    INDEX idx_application (application_id),
    INDEX idx_document_type (document_type)
);
```

### 5. Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    application_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    action ENUM('SUBMITTED', 'REVIEWED', 'APPROVED', 'REJECTED', 'ARCHIVED', 'DOCUMENT_UPLOADED') NOT NULL,
    old_status ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'),
    new_status ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'),
    reason TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    
    INDEX idx_application (application_id),
    INDEX idx_user (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_action (action)
);
```

### 6. Notifications Table
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    application_id BIGINT,
    type ENUM('STATUS_CHANGE', 'DOCUMENT_REQUEST', 'APPROVAL', 'REJECTION', 'SYSTEM') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES loan_applications(id) ON DELETE SET NULL,
    
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
);
```

## Sample Data Insertion

### Insert Loan Types
```sql
INSERT INTO loan_types (name, description, max_amount, min_amount, interest_rate, max_term_months, min_term_months) VALUES
('Personal Loan', 'Unsecured personal loan for various purposes', 50000.00, 1000.00, 0.0899, 60, 12),
('Home Loan', 'Mortgage loan for home purchase', 1000000.00, 50000.00, 0.0349, 360, 120),
('Auto Loan', 'Vehicle financing loan', 75000.00, 5000.00, 0.0549, 84, 24),
('Business Loan', 'Small business financing', 500000.00, 10000.00, 0.0699, 120, 12);
```

### Insert Default Users
```sql
INSERT INTO users (name, email, password_hash, role, phone) VALUES
('Admin User', 'admin@loansystem.com', '$2a$12$encrypted_password_hash', 'ADMIN', '555-0001'),
('John Agent', 'john.agent@loansystem.com', '$2a$12$encrypted_password_hash', 'AGENT', '555-0002'),
('Jane Agent', 'jane.agent@loansystem.com', '$2a$12$encrypted_password_hash', 'AGENT', '555-0003');
```

## Indexing Strategy

### Performance Indexes
```sql
-- Composite indexes for common queries
CREATE INDEX idx_applications_status_date ON loan_applications(status, submitted_date);
CREATE INDEX idx_applications_applicant_status ON loan_applications(applicant_id, status);
CREATE INDEX idx_audit_logs_app_timestamp ON audit_logs(application_id, timestamp);

-- Full-text search indexes
CREATE FULLTEXT INDEX idx_applications_search ON loan_applications(first_name, last_name, email);
```

## Database Constraints and Triggers

### Auto-generate Application Numbers
```sql
DELIMITER $$
CREATE TRIGGER before_insert_loan_application
BEFORE INSERT ON loan_applications
FOR EACH ROW
BEGIN
    IF NEW.application_number IS NULL OR NEW.application_number = '' THEN
        SET NEW.application_number = CONCAT('LA', LPAD((SELECT COALESCE(MAX(id), 0) + 1 FROM loan_applications), 6, '0'));
    END IF;
END$$
DELIMITER ;
```

### Audit Log Trigger
```sql
DELIMITER $$
CREATE TRIGGER after_update_loan_application
AFTER UPDATE ON loan_applications
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO audit_logs (application_id, user_id, action, old_status, new_status, reason)
        VALUES (NEW.id, NEW.reviewed_by, 'STATUS_CHANGED', OLD.status, NEW.status, NEW.rejection_reason);
    END IF;
END$$
DELIMITER ;
```

## Database Views

### Application Summary View
```sql
CREATE VIEW application_summary AS
SELECT 
    la.id,
    la.application_number,
    CONCAT(la.first_name, ' ', la.last_name) as applicant_name,
    u.email as applicant_email,
    lt.name as loan_type,
    la.requested_amount,
    la.status,
    la.submitted_date,
    la.last_updated,
    COUNT(ad.id) as document_count
FROM loan_applications la
JOIN users u ON la.applicant_id = u.id
JOIN loan_types lt ON la.loan_type_id = lt.id
LEFT JOIN application_documents ad ON la.id = ad.application_id
WHERE la.archived_flag = FALSE
GROUP BY la.id;
```

This schema provides:
- **Normalization**: Reduces data redundancy
- **Scalability**: Proper indexing for performance
- **Audit Trail**: Complete tracking of all changes
- **Security**: Role-based data access
- **Flexibility**: Easy to extend with new loan types
- **Data Integrity**: Foreign key constraints and triggers