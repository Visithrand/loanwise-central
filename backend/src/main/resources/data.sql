-- Insert sample bank branches
INSERT INTO bank_branches (branch_name, location, contact_number, email, active) 
VALUES ('Main Branch - Downtown', 'Downtown Area', '+1-555-0101', 'downtown@bank.com', true)
ON DUPLICATE KEY UPDATE branch_name=branch_name;

INSERT INTO bank_branches (branch_name, location, contact_number, email, active) 
VALUES ('North Branch', 'North District', '+1-555-0102', 'north@bank.com', true)
ON DUPLICATE KEY UPDATE branch_name=branch_name;

INSERT INTO bank_branches (branch_name, location, contact_number, email, active) 
VALUES ('South Branch', 'South District', '+1-555-0103', 'south@bank.com', true)
ON DUPLICATE KEY UPDATE branch_name=branch_name;

INSERT INTO bank_branches (branch_name, location, contact_number, email, active) 
VALUES ('East Branch', 'East District', '+1-555-0104', 'east@bank.com', true)
ON DUPLICATE KEY UPDATE branch_name=branch_name;

INSERT INTO bank_branches (branch_name, location, contact_number, email, active) 
VALUES ('West Branch', 'West District', '+1-555-0105', 'west@bank.com', true)
ON DUPLICATE KEY UPDATE branch_name=branch_name;

-- Insert demo users
INSERT INTO users (name, email, role) 
VALUES ('John Doe', 'john@example.com', 'APPLICANT')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO users (name, email, role) 
VALUES ('Jane Smith', 'jane@example.com', 'APPLICANT')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO users (name, email, role) 
VALUES ('Admin User', 'admin@example.com', 'ADMIN')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO users (name, email, role) 
VALUES ('Test Applicant', 'test@example.com', 'APPLICANT')
ON DUPLICATE KEY UPDATE name=name;
