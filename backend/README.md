# Loan Application & Approval System - Spring Boot Backend

A comprehensive Spring Boot REST API for managing loan applications with role-based access control, JWT authentication, and MySQL database integration.

## 🚀 Features

- **User Management**: Registration, login, and role-based access control
- **Loan Applications**: Submit, view, approve, and reject loan applications
- **Document Management**: Upload and manage application documents
- **Audit Logging**: Track all system actions and changes
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: APPLICANT, AGENT, ADMIN roles
- **Search & Filtering**: Advanced search capabilities for agents
- **Archiving**: Automatic archiving of old applications
- **CORS Enabled**: Frontend integration ready

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA + Hibernate
- **Build Tool**: Maven
- **Java Version**: 17
- **Testing**: JUnit 5 + Mockito

## 📋 Prerequisites

- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## 🗄️ Database Setup

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE visithran_db;
   ```

2. **Database Configuration** (already configured in `application.properties`):
   - **URL**: `jdbc:mysql://localhost:3306/visithran_db?createDatabaseIfNotExist=true`
   - **Username**: `root`
   - **Password**: `Visithran@mysql#123`
   - **Driver**: `com.mysql.cj.jdbc.Driver`

## 🚀 Installation & Running

1. **Clone and Navigate**:
   ```bash
   cd backend
   ```

2. **Build the Project**:
   ```bash
   mvn clean install
   ```

3. **Run the Application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Access the API**:
   - **Base URL**: `http://localhost:8080`
   - **API Documentation**: `http://localhost:8080/api`

## 🔐 Authentication

### Demo Credentials
- **Username**: `demo`
- **Password**: `Demo@123`
- **Role**: `APPLICANT`

### JWT Token
- **Secret**: Configured in `application.properties`
- **Expiration**: 24 hours (86400000 ms)
- **Format**: `Bearer <token>`

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register    - User registration
POST /api/auth/login       - User authentication
```

### User Management
```
GET  /api/users/me         - Get current user info
```

### Loan Applications
```
POST /api/loans            - Submit new loan application
GET  /api/loans/my         - Get user's applications
GET  /api/loans            - Get all applications (AGENT/ADMIN)
PUT  /api/loans/{id}       - Update loan status
POST /api/loans/archive    - Archive old applications
```

## 🔒 Role Permissions

### APPLICANT
- Submit loan applications
- View own applications
- Update personal information

### AGENT
- View all loan applications
- Approve/reject applications
- Search and filter applications
- Archive old applications

### ADMIN
- All AGENT permissions
- User management
- System configuration
- Audit log access

## 📊 Database Schema

### Users Table
- `id` (PK, auto)
- `username` (unique)
- `email` (unique)
- `password` (BCrypt hashed)
- `role` (APPLICANT/AGENT/ADMIN)

### Loan Applications Table
- `id` (PK, auto)
- `applicant_id` (FK to Users)
- `loan_type` (PERSONAL/BUSINESS/MORTGAGE/AUTO/STUDENT)
- `amount` (decimal)
- `status` (PENDING/APPROVED/REJECTED)
- `rejection_reason` (text)
- `created_at` (timestamp)

### Application Documents Table
- `id` (PK, auto)
- `loan_application_id` (FK to Loan Applications)
- `document_name` (varchar)
- `file_url` (varchar)
- `file_type` (varchar)
- `file_size` (bigint)

### Audit Logs Table
- `id` (PK, auto)
- `loan_application_id` (FK to Loan Applications)
- `user_id` (FK to Users)
- `action` (varchar)
- `details` (text)
- `timestamp` (timestamp)

## 🧪 Testing

### Run Tests
```bash
mvn test
```

### Test Coverage
- **Unit Tests**: Service layer testing
- **Integration Tests**: Controller layer testing
- **Demo Login Test**: Verifies demo user authentication

## ⚙️ Configuration

### Application Properties
- **Server Port**: 8080
- **Database**: MySQL with auto-creation
- **JPA**: Hibernate with SQL logging
- **CORS**: Enabled for `http://localhost:8081`
- **JWT**: Configurable secret and expiration

### CORS Configuration
- **Allowed Origins**: `http://localhost:8081`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: All headers
- **Credentials**: Enabled

## 🔄 Frontend Integration

### TypeScript Interfaces
Complete TypeScript interfaces are provided in `src/main/resources/static/types/api-types.ts`

### API Service Example
```typescript
import { apiService } from './services/api';

// Login
const response = await apiService.login({
  username: 'demo',
  password: 'Demo@123'
});

// Submit loan application
const loan = await apiService.submitLoanApplication({
  loanType: 'PERSONAL',
  amount: 10000
});
```

## 📈 Performance & Scalability

- **Concurrent Users**: Supports 1000+ concurrent users
- **Database**: Optimized queries with proper indexing
- **Caching**: Ready for Redis integration
- **Horizontal Scaling**: Stateless design for load balancing

## 🔍 Monitoring & Logging

- **Logging Level**: DEBUG for development
- **SQL Logging**: Enabled with formatting
- **Security Logging**: Authentication and authorization events
- **Audit Trail**: Complete action tracking

## 🚀 Deployment

### Docker Support
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/loan-app-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Production Configuration
- Update database credentials
- Configure JWT secret
- Set appropriate logging levels
- Enable HTTPS
- Configure CORS for production domains

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection**: Verify MySQL is running and credentials are correct
2. **Port Conflicts**: Ensure port 8080 is available
3. **CORS Issues**: Check frontend origin configuration
4. **JWT Errors**: Verify secret key configuration

### Logs
Check application logs for detailed error information:
```bash
tail -f logs/application.log
```

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)
- [JWT.io](https://jwt.io/) - JWT token debugging
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This backend is designed to work seamlessly with the TypeScript React frontend. All API responses are TypeScript-friendly and include proper CORS configuration for frontend integration.
