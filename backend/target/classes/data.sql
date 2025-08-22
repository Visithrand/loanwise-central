-- Insert demo users for testing (passwords are BCrypt hashed)

-- Applicant Users
INSERT INTO users (username, email, password, role) 
VALUES ('applicant1', 'applicant1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'APPLICANT')
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO users (username, email, password, role) 
VALUES ('john_doe', 'john@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'APPLICANT')
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO users (username, email, password, role) 
VALUES ('jane_smith', 'jane@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'APPLICANT')
ON DUPLICATE KEY UPDATE username=username;

-- Agent Users
INSERT INTO users (username, email, password, role) 
VALUES ('agent1', 'agent1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'AGENT')
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO users (username, email, password, role) 
VALUES ('loan_officer', 'officer@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'AGENT')
ON DUPLICATE KEY UPDATE username=username;

-- Admin Users
INSERT INTO users (username, email, password, role) 
VALUES ('admin1', 'admin1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ADMIN')
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO users (username, email, password, role) 
VALUES ('supervisor', 'supervisor@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ADMIN')
ON DUPLICATE KEY UPDATE username=username;
