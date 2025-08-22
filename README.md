# Loan Application & Approval System

A comprehensive loan management system built with React.js frontend and Spring Boot backend architecture.

## 🚀 Live Demo

**Demo Credentials:**
- **Applicant**: `applicant@demo.com` / `demo123`
- **Agent**: `agent@demo.com` / `demo123`  
- **Admin**: `admin@demo.com` / `demo123`

## ✨ Features

### For Applicants
- 🔐 Secure registration and JWT authentication
- 📝 Multi-step loan application form with validation
- 📎 Document upload with file validation (PDF, JPG, PNG)
- 📊 Real-time application status tracking
- 🔔 In-app notifications for status changes
- 📱 Fully responsive mobile-friendly design

### For Agents  
- 👥 View and manage pending applications
- ✅ Approve or reject applications with reasons
- 📋 Application review dashboard
- 🔍 Search and filter capabilities
- 📊 Performance analytics

### For Administrators
- 🎛️ Full system administration dashboard
- 👤 User management (create agents, manage accounts)
- ⚙️ Loan type configuration (amounts, rates, terms)
- 🗂️ Rejected applications bin with recovery
- 📈 Comprehensive analytics and reporting
- 🔍 Complete audit trail access
- 📊 System performance metrics

## 🛠️ Technology Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** components
- **React Router** for navigation
- **React Query** for state management
- **JWT** authentication

### Backend Architecture (Spring Boot)
- **Spring Boot 3.2** with Java 17
- **Spring Security** with JWT authentication
- **Spring Data JPA** with MySQL
- **RESTful API** design
- **Role-based access control (RBAC)**
- **Comprehensive audit logging**

### Database (MySQL)
- **Normalized schema** with proper relationships
- **Audit trail** for all changes
- **Document storage** management
- **Performance optimized** with proper indexing

## 📖 Documentation

### Technical Documentation
- [Database Schema & ERD](docs/Database_Schema.md)
- [Spring Boot Architecture](docs/Spring_Boot_Architecture.md)
- [API Documentation](docs/API_Documentation.md)
- [Role Permissions Matrix](docs/Role_Permissions_Matrix.md)
- [System Workflow Diagrams](docs/System_Workflow_Diagrams.md)

## 🚀 Getting Started

### Frontend Development
```bash
npm install
npm run dev
```

### Backend Setup (Spring Boot)
```bash
# Configure database connection in application.yml
# Run MySQL database
# Execute schema creation scripts
mvn spring-boot:run
```

## 🔧 Configuration

### Environment Variables
```bash
# Database
DB_USERNAME=loan_admin
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Email
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
```

---

Built with ❤️ using React.js, Spring Boot, and MySQL.