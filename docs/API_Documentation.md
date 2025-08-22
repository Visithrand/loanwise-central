# Loan Application System - REST API Documentation

## Base URL
```
https://api.loansystem.com/api/v1
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "role": "APPLICANT"
    }
  }
}
```

### POST /auth/register
Register a new applicant user.

**Request:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "password123",
  "phone": "555-0123"
}
```

### POST /auth/logout
Invalidate the current JWT token.

---

## Loan Application Endpoints

### POST /applications
Submit a new loan application.
**Requires: APPLICANT role**

**Request:**
```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "phone": "555-0123",
    "dateOfBirth": "1990-05-15",
    "ssnLastFour": "1234",
    "address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  },
  "financialInfo": {
    "annualIncome": 75000,
    "employmentStatus": "FULL_TIME",
    "employer": "Tech Corp",
    "jobTitle": "Software Engineer",
    "workExperience": 5,
    "monthlyExpenses": 3500,
    "creditScore": 720
  },
  "loanDetails": {
    "loanTypeId": 1,
    "requestedAmount": 25000,
    "loanPurpose": "Debt consolidation",
    "collateral": "None"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": 123,
    "applicationNumber": "LA000123",
    "status": "PENDING",
    "submittedDate": "2024-01-15T10:30:00Z",
    "estimatedProcessingTime": "3-5 business days"
  }
}
```

### GET /applications
Get applications based on user role.

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, UNDER_REVIEW, APPROVED, REJECTED)
- `search` (optional): Search by name or application number
- `page` (default: 0): Page number
- `size` (default: 20): Page size
- `sort` (default: submittedDate,desc): Sort criteria

**Response:**
```json
{
  "success": true,
  "message": "Applications retrieved successfully",
  "data": {
    "content": [
      {
        "id": 123,
        "applicationNumber": "LA000123",
        "applicantName": "John Smith",
        "loanType": "Personal Loan",
        "requestedAmount": 25000,
        "status": "PENDING",
        "submittedDate": "2024-01-15T10:30:00Z",
        "lastUpdated": "2024-01-15T10:30:00Z"
      }
    ],
    "pageable": {
      "page": 0,
      "size": 20,
      "totalElements": 1,
      "totalPages": 1
    }
  }
}
```

### GET /applications/{id}
Get detailed application information.

**Response:**
```json
{
  "success": true,
  "message": "Application retrieved successfully",
  "data": {
    "id": 123,
    "applicationNumber": "LA000123",
    "status": "PENDING",
    "submittedDate": "2024-01-15T10:30:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z",
    "personalInfo": {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "phone": "555-0123",
      "dateOfBirth": "1990-05-15",
      "address": "123 Main St, Anytown, CA 12345"
    },
    "financialInfo": {
      "annualIncome": 75000,
      "employmentStatus": "FULL_TIME",
      "employer": "Tech Corp",
      "jobTitle": "Software Engineer",
      "workExperience": 5,
      "monthlyExpenses": 3500,
      "creditScore": 720
    },
    "loanDetails": {
      "loanType": "Personal Loan",
      "requestedAmount": 25000,
      "loanPurpose": "Debt consolidation",
      "collateral": "None"
    },
    "documents": [
      {
        "id": 1,
        "documentType": "IDENTITY",
        "documentName": "drivers_license.pdf",
        "uploadDate": "2024-01-15T10:30:00Z"
      }
    ],
    "auditTrail": [
      {
        "action": "SUBMITTED",
        "timestamp": "2024-01-15T10:30:00Z",
        "userRole": "APPLICANT"
      }
    ]
  }
}
```

### PUT /applications/{id}/status
Update application status (Agent/Admin only).
**Requires: AGENT or ADMIN role**

**Request:**
```json
{
  "status": "APPROVED",
  "reason": "All criteria met, credit score excellent",
  "approvedAmount": 25000,
  "approvedInterestRate": 8.99,
  "approvedTermMonths": 36
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application status updated successfully",
  "data": {
    "id": 123,
    "applicationNumber": "LA000123",
    "status": "APPROVED",
    "approvedAmount": 25000,
    "approvedInterestRate": 8.99,
    "approvedTermMonths": 36,
    "reviewedBy": "Agent Sarah Wilson",
    "reviewedAt": "2024-01-18T14:30:00Z"
  }
}
```

---

## Document Management Endpoints

### POST /applications/{id}/documents
Upload documents for an application.

**Request (multipart/form-data):**
```
files: [File objects]
documentTypes: ["IDENTITY", "INCOME_PROOF"]
```

**Response:**
```json
{
  "success": true,
  "message": "Documents uploaded successfully",
  "data": {
    "uploadedDocuments": [
      {
        "id": 1,
        "documentType": "IDENTITY",
        "documentName": "drivers_license.pdf",
        "fileSize": 2048576,
        "uploadDate": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### GET /applications/{id}/documents
Get list of documents for an application.

### DELETE /documents/{documentId}
Delete a document (Admin only).

---

## User Management Endpoints

### GET /users
Get list of users (Admin only).
**Requires: ADMIN role**

**Query Parameters:**
- `role` (optional): Filter by user role
- `search` (optional): Search by name or email
- `page`, `size`, `sort`: Pagination parameters

### POST /users
Create a new user (Admin only).
**Requires: ADMIN role**

**Request:**
```json
{
  "name": "Jane Agent",
  "email": "jane.agent@company.com",
  "role": "AGENT",
  "phone": "555-0124",
  "password": "tempPassword123"
}
```

### PUT /users/{id}
Update user information (Admin only).

### DELETE /users/{id}
Deactivate a user (Admin only).

---

## Loan Configuration Endpoints

### GET /loan-types
Get available loan types.

**Response:**
```json
{
  "success": true,
  "message": "Loan types retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Personal Loan",
      "description": "Unsecured personal loan for various purposes",
      "minAmount": 1000,
      "maxAmount": 50000,
      "interestRate": 8.99,
      "minTermMonths": 12,
      "maxTermMonths": 60,
      "isActive": true
    }
  ]
}
```

### POST /loan-types
Create a new loan type (Admin only).
**Requires: ADMIN role**

### PUT /loan-types/{id}
Update loan type (Admin only).

---

## Analytics and Reporting Endpoints

### GET /analytics/dashboard
Get dashboard analytics.
**Requires: AGENT or ADMIN role**

**Response:**
```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "totalApplications": 156,
    "pendingApplications": 23,
    "approvedApplications": 98,
    "rejectedApplications": 35,
    "totalLoanAmount": 12500000,
    "averageProcessingTime": 4.2,
    "trends": {
      "applicationsThisMonth": 45,
      "applicationsGrowth": 12.5,
      "approvalRate": 73.4
    }
  }
}
```

### GET /analytics/reports/{reportType}
Get specific reports (Admin only).
**Requires: ADMIN role**

**Available Report Types:**
- `monthly-summary`
- `agent-performance`
- `loan-type-analysis`
- `risk-assessment`

---

## Notification Endpoints

### GET /notifications
Get user notifications.

**Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": [
    {
      "id": 1,
      "type": "STATUS_CHANGE",
      "title": "Application Approved",
      "message": "Your loan application LA000123 has been approved!",
      "isRead": false,
      "createdAt": "2024-01-18T14:30:00Z",
      "applicationId": 123
    }
  ]
}
```

### PUT /notifications/{id}/read
Mark notification as read.

### DELETE /notifications/{id}
Delete notification.

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field1": "Field specific error message",
    "field2": "Another error message"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/v1/applications"
}
```

## HTTP Status Codes

- `200 OK` - Successful GET, PUT operations
- `201 Created` - Successful POST operations
- `204 No Content` - Successful DELETE operations
- `400 Bad Request` - Validation errors, invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied, insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Business rule violation (e.g., active application exists)
- `422 Unprocessable Entity` - Business logic errors
- `500 Internal Server Error` - Server errors

## Rate Limiting

API endpoints are rate-limited:
- **Authentication endpoints**: 10 requests per minute per IP
- **Application endpoints**: 100 requests per hour per user
- **File upload endpoints**: 20 requests per hour per user
- **Analytics endpoints**: 50 requests per hour per user

## File Upload Constraints

- **Maximum file size**: 5MB per file
- **Maximum files per request**: 10 files
- **Allowed file types**: PDF, JPG, JPEG, PNG
- **Total upload size per application**: 25MB

## API Versioning

The API uses URL versioning (`/api/v1/`). When breaking changes are introduced, a new version will be released (`/api/v2/`) while maintaining backward compatibility for the previous version.

## SDK and Client Libraries

Official client libraries are available for:
- JavaScript/Node.js
- Python
- Java
- C#/.NET

Example usage (JavaScript):
```javascript
import LoanSystemAPI from '@loansystem/api-client';

const client = new LoanSystemAPI({
  baseURL: 'https://api.loansystem.com/api/v1',
  token: 'your-jwt-token'
});

// Submit application
const application = await client.applications.create(applicationData);

// Get applications
const applications = await client.applications.list({
  status: 'PENDING',
  page: 0,
  size: 20
});
```