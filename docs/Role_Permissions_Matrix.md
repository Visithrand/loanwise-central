# Loan Application System - Role-Based Access Control (RBAC)

## User Roles Overview

The system implements three distinct user roles with hierarchical permissions:

1. **APPLICANT** - End users who apply for loans
2. **AGENT** - Staff members who review and process applications  
3. **ADMIN** - System administrators with full access

---

## Detailed Permissions Matrix

### 📋 Application Management

| Function | APPLICANT | AGENT | ADMIN | Notes |
|----------|-----------|-------|-------|-------|
| Submit New Application | ✅ | ❌ | ❌ | One active application limit |
| View Own Applications | ✅ | ❌ | ✅ | Applicants see only their own |
| View All Applications | ❌ | ✅ | ✅ | Agents/Admins see all |
| Edit Application Details | ✅* | ❌ | ✅ | *Only PENDING status |
| Approve Applications | ❌ | ✅ | ✅ | Requires review workflow |
| Reject Applications | ❌ | ✅ | ✅ | Must provide reason |
| Delete Applications | ❌ | ❌ | ✅ | Soft delete with audit |
| Archive Applications | ❌ | ❌ | ✅ | Auto-archive after 1 year |
| Restore from Archive | ❌ | ❌ | ✅ | Admin only function |

### 📁 Document Management

| Function | APPLICANT | AGENT | ADMIN | Notes |
|----------|-----------|-------|-------|-------|
| Upload Documents | ✅ | ❌ | ✅ | Max 5MB per file |
| View Own Documents | ✅ | ❌ | ✅ | Applicants see their own |
| View All Documents | ❌ | ✅ | ✅ | For application review |
| Download Documents | ✅ | ✅ | ✅ | Audit logged |
| Delete Documents | ✅* | ❌ | ✅ | *Before submission only |
| Request Additional Docs | ❌ | ✅ | ✅ | Notification sent to applicant |

### 👥 User Management

| Function | APPLICANT | AGENT | ADMIN | Notes |
|----------|-----------|-------|-------|-------|
| View Profile | ✅ | ✅ | ✅ | Own profile only |
| Edit Profile | ✅ | ✅ | ✅ | Limited fields for non-admin |
| Create Users | ❌ | ❌ | ✅ | Admin creates agents/applicants |
| View All Users | ❌ | ❌ | ✅ | User directory |
| Deactivate Users | ❌ | ❌ | ✅ | Soft delete with audit |
| Reset Passwords | ❌ | ❌ | ✅ | Admin can reset any password |
| Assign Roles | ❌ | ❌ | ✅ | Role changes logged |

### ⚙️ System Configuration

| Function | APPLICANT | AGENT | ADMIN | Notes |
|----------|-----------|-------|-------|-------|
| View Loan Types | ✅ | ✅ | ✅ | Public information |
| Create Loan Types | ❌ | ❌ | ✅ | Admin configures offerings |
| Edit Loan Types | ❌ | ❌ | ✅ | Interest rates, terms, limits |
| Deactivate Loan Types | ❌ | ❌ | ✅ | Hide from new applications |
| System Settings | ❌ | ❌ | ✅ | Email configs, file limits |
| Backup Management | ❌ | ❌ | ✅ | Database backups |

### 📊 Analytics & Reporting

| Function | APPLICANT | AGENT | ADMIN | Notes |
|----------|-----------|-------|-------|-------|
| Personal Dashboard | ✅ | ❌ | ❌ | Own application stats |
| Agent Dashboard | ❌ | ✅ | ✅ | Assigned applications |
| Admin Dashboard | ❌ | ❌ | ✅ | System-wide metrics |
| Application Reports | ❌ | ✅† | ✅ | †Limited to assigned |
| User Activity Reports | ❌ | ❌ | ✅ | Security monitoring |
| Financial Reports | ❌ | ❌ | ✅ | Loan volumes, revenue |
| Export Data | ❌ | ✅† | ✅ | †Own applications only |
| Audit Log Access | ❌ | ❌ | ✅ | Full system audit trail |

### 🔔 Notifications

| Function | APPLICANT | AGENT | ADMIN | Notes |
|----------|-----------|-------|-------|-------|
| Receive App Updates | ✅ | ❌ | ✅ | Status changes, requests |
| Receive Work Assignments | ❌ | ✅ | ✅ | New applications to review |
| System Notifications | ❌ | ❌ | ✅ | Errors, maintenance alerts |
| Send Custom Notifications | ❌ | ❌ | ✅ | Admin broadcasts |
| Configure Notification Preferences | ✅ | ✅ | ✅ | Email/SMS preferences |

---

## Permission Enforcement Layers

### 1. Frontend UI Controls
```typescript
// React component permission checks
{user.role === 'ADMIN' && (
  <Button onClick={deleteUser}>Delete User</Button>
)}

{['AGENT', 'ADMIN'].includes(user.role) && (
  <ApplicationReviewPanel />
)}
```

### 2. API Route Guards
```java
// Spring Security annotations
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/users/{id}")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    // Implementation
}

@PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
@GetMapping("/applications")
public ResponseEntity<Page<Application>> getApplications() {
    // Implementation
}
```

### 3. Database Row-Level Security
```sql
-- Example: Applicants can only see their own applications
CREATE POLICY applicant_applications ON loan_applications
FOR SELECT TO applicant_role
USING (applicant_id = current_user_id());

-- Agents can see all non-archived applications
CREATE POLICY agent_applications ON loan_applications  
FOR SELECT TO agent_role
USING (archived_flag = false);
```

---

## Role Transition Rules

### Promoting Users
| From Role | To Role | Who Can Promote | Notes |
|-----------|---------|-----------------|-------|
| APPLICANT | AGENT | ADMIN | Requires approval workflow |
| AGENT | ADMIN | ADMIN | Requires executive approval |
| APPLICANT | ADMIN | ADMIN | Not recommended, create new account |

### Demoting Users
- **ADMIN → AGENT**: Admin can demote themselves or others
- **AGENT → APPLICANT**: Admin only, rare case
- **Role changes trigger audit logs and notification**

---

## Special Access Scenarios

### 1. Emergency Access
**ADMIN users can:**
- Override any permission temporarily
- Access on behalf of other users (with audit)
- Emergency application processing
- System recovery operations

### 2. Delegation
**AGENT users can:**
- Assign applications to other agents (Admin approval)
- Request escalation to Admin for complex cases
- Transfer workload during leave

### 3. Compliance Access
**ADMIN users have:**
- Read-only access to all data for compliance
- Ability to generate regulatory reports
- Audit trail export capabilities
- Data retention policy enforcement

---

## API Security Implementation

### JWT Token Claims
```json
{
  "sub": "user@example.com",
  "role": "AGENT",
  "permissions": [
    "application.view.all",
    "application.approve", 
    "application.reject",
    "document.view.all"
  ],
  "iat": 1642123456,
  "exp": 1642209856
}
```

### Permission Validation Flow
```java
@Component
public class PermissionValidator {
    
    public boolean hasPermission(User user, String resource, String action) {
        String permission = resource + "." + action;
        
        switch(user.getRole()) {
            case ADMIN:
                return true; // Admins have all permissions
            case AGENT:
                return AGENT_PERMISSIONS.contains(permission);
            case APPLICANT:
                return APPLICANT_PERMISSIONS.contains(permission) 
                    && isOwnResource(user, resource);
            default:
                return false;
        }
    }
}
```

---

## Security Best Practices

### 1. Principle of Least Privilege
- Users get minimum permissions required for their role
- Temporary elevation available through admin approval
- Regular permission audits and cleanup

### 2. Defense in Depth
- **Frontend**: UI controls hide unauthorized features  
- **API**: Route guards validate permissions
- **Database**: Row-level security as final barrier
- **Audit**: All access attempts logged

### 3. Role-Based Data Filtering
```java
// Service layer automatically filters based on user role
public List<Application> getApplications(User user) {
    switch(user.getRole()) {
        case APPLICANT:
            return applicationRepo.findByApplicantId(user.getId());
        case AGENT:
            return applicationRepo.findAssignedToAgent(user.getId());
        case ADMIN:
            return applicationRepo.findAll();
    }
}
```

### 4. Session Management
- JWT tokens expire after 24 hours
- Refresh tokens for extended sessions
- Immediate revocation on role changes
- Device tracking and session limits

---

## Compliance and Auditing

### Audit Requirements
All permission-based actions are logged with:
- **User ID** and **Role** at time of action
- **Resource** accessed and **Action** performed  
- **Timestamp** and **IP Address**
- **Success/Failure** status
- **Data changes** (before/after for modifications)

### Regulatory Compliance
- **SOX Compliance**: Financial data access controls
- **GDPR**: Data access and deletion rights
- **SOC 2**: Security control documentation
- **Fair Credit Reporting Act**: Credit data handling

### Permission Review Process
- **Weekly**: Automated permission drift detection
- **Monthly**: Manager approval of agent permissions
- **Quarterly**: Full admin permission audit
- **Annually**: External security assessment