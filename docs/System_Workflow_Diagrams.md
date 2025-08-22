# Loan Application System - Workflow Diagrams

## 1. Application Submission Workflow

<lov-mermaid>
flowchart TD
    A[Applicant Login] --> B{Has Active Application?}
    B -->|Yes| C[View Existing Application]
    B -->|No| D[Fill Application Form]
    
    D --> E[Personal Information]
    E --> F[Financial Information]
    F --> G[Loan Details]
    G --> H[Upload Documents]
    H --> I[Review & Submit]
    
    I --> J{Validation Passed?}
    J -->|No| K[Show Errors] --> D
    J -->|Yes| L[Create Application Record]
    
    L --> M[Generate Application ID]
    M --> N[Send Confirmation Email]
    N --> O[Create Audit Log]
    O --> P[Notify Agents]
    P --> Q[Application Status: PENDING]
    
    C --> R[Track Status]
    Q --> R
    R --> S[View Application Details]
</lov-mermaid>

## 2. Application Review Process

<lov-mermaid>
flowchart TD
    A[Application Submitted] --> B[Status: PENDING]
    B --> C[Agent/Admin Login]
    C --> D[View Pending Applications]
    D --> E[Select Application]
    E --> F[Review Applicant Details]
    
    F --> G[Check Documents]
    G --> H{Documents Complete?}
    H -->|No| I[Request Additional Documents]
    H -->|Yes| J[Status: UNDER_REVIEW]
    
    I --> K[Notify Applicant]
    K --> L[Wait for Documents]
    L --> M[Documents Uploaded]
    M --> J
    
    J --> N[Verify Information]
    N --> O[Credit Check]
    O --> P[Risk Assessment]
    P --> Q{Approve Application?}
    
    Q -->|Yes| R[Status: APPROVED]
    Q -->|No| S[Status: REJECTED]
    
    R --> T[Set Loan Terms]
    T --> U[Generate Approval Letter]
    U --> V[Notify Applicant]
    
    S --> W[Add Rejection Reason]
    W --> X[Move to Rejected Bin]
    X --> Y[Notify Applicant]
    
    V --> Z[Create Audit Log]
    Y --> Z
    Z --> AA[Update Dashboard Stats]
</lov-mermaid>

## 3. User Role Access Flow

<lov-mermaid>
flowchart TD
    A[User Login] --> B{Authentication Valid?}
    B -->|No| C[Show Login Error]
    B -->|Yes| D{Check User Role}
    
    D -->|APPLICANT| E[Applicant Dashboard]
    D -->|AGENT| F[Agent Dashboard]
    D -->|ADMIN| G[Admin Dashboard]
    
    E --> E1[My Applications]
    E --> E2[Apply for Loan]
    E --> E3[Track Status]
    E --> E4[View Documents]
    
    F --> F1[Pending Reviews]
    F --> F2[Under Review]
    F --> F3[Approve/Reject]
    F --> F4[View All Applications]
    
    G --> G1[All Applications]
    G --> G2[User Management]
    G --> G3[Loan Configuration]
    G --> G4[Analytics Dashboard]
    G --> G5[Rejected Bin]
    G --> G6[System Reports]
</lov-mermaid>

## 4. Document Upload and Verification

<lov-mermaid>
sequenceDiagram
    participant A as Applicant
    participant F as Frontend
    participant B as Backend
    participant S as File Storage
    participant D as Database
    
    A->>F: Select Documents
    F->>F: Validate File Types/Sizes
    F->>B: POST /documents/upload
    B->>B: Validate JWT Token
    B->>B: Check File Constraints
    B->>S: Store Files Securely
    S-->>B: Return File URLs
    B->>D: Save Document Records
    D-->>B: Confirm Save
    B-->>F: Success Response
    F-->>A: Show Upload Success
    
    Note over A,D: Agent/Admin Review Process
    
    F->>B: GET /documents/list
    B->>B: Check User Permissions
    B->>D: Query Documents
    D-->>B: Return Document List
    B-->>F: Filtered Document List
    F-->>A: Display Documents
</lov-mermaid>

## 5. Notification System Flow

<lov-mermaid>
flowchart TD
    A[System Event] --> B{Event Type}
    
    B -->|Application Submitted| C[Create Submission Notification]
    B -->|Status Changed| D[Create Status Notification]
    B -->|Document Requested| E[Create Document Notification]
    B -->|System Alert| F[Create System Notification]
    
    C --> G[Email Service]
    D --> G
    E --> G
    F --> G
    
    G --> H{Email Enabled?}
    H -->|Yes| I[Send Email]
    H -->|No| J[Skip Email]
    
    I --> K[Log Email Sent]
    J --> L[In-App Notification Only]
    K --> M[Save to Database]
    L --> M
    
    M --> N[Update User Dashboard]
    N --> O[Real-time Push to Frontend]
    O --> P[Show Notification Badge]
</lov-mermaid>

## 6. Data Archival and Cleanup Process

<lov-mermaid>
flowchart TD
    A[Scheduled Job: Daily 2 AM] --> B[Query Old Applications]
    B --> C{Applications > 1 Year Old?}
    C -->|No| D[End Process]
    C -->|Yes| E[Filter by Status]
    
    E --> F{Status = APPROVED or REJECTED?}
    F -->|No| D
    F -->|Yes| G[Mark as Archived]
    
    G --> H[Move Documents to Archive Storage]
    H --> I[Update Archive Flag]
    I --> J[Create Archive Audit Log]
    J --> K[Send Admin Summary Report]
    K --> L[Update System Metrics]
    L --> D
    
    style A fill:#e1f5fe
    style G fill:#fff3e0
    style K fill:#e8f5e8
</lov-mermaid>

## 7. Security and Audit Trail

<lov-mermaid>
sequenceDiagram
    participant U as User
    participant A as Auth Service
    participant API as API Gateway
    participant S as Business Service
    participant DB as Database
    participant AL as Audit Logger
    
    U->>A: Login Request
    A->>A: Validate Credentials
    A->>DB: Check User Status
    A-->>U: JWT Token
    
    U->>API: API Request + JWT
    API->>API: Validate JWT
    API->>S: Forward Request
    S->>DB: Database Operation
    S->>AL: Log Action
    AL->>DB: Save Audit Record
    
    DB-->>S: Operation Result
    S-->>API: Response
    API-->>U: Final Response
    
    Note over AL,DB: All actions logged with:<br/>- User ID<br/>- Timestamp<br/>- Action Type<br/>- IP Address<br/>- Data Changes
</lov-mermaid>

## 8. Scalability and Performance Flow

<lov-mermaid>
flowchart TB
    A[Load Balancer] --> B[App Server 1]
    A --> C[App Server 2]
    A --> D[App Server N]
    
    B --> E[Database Cluster]
    C --> E
    D --> E
    
    E --> F[Master DB]
    E --> G[Read Replica 1]
    E --> H[Read Replica 2]
    
    B --> I[Redis Cache]
    C --> I
    D --> I
    
    B --> J[File Storage]
    C --> J
    D --> J
    
    J --> K[Primary Storage]
    J --> L[Backup Storage]
    
    M[Monitoring Service] --> A
    M --> B
    M --> C
    M --> D
    M --> E
    M --> I
    M --> J
    
    N[Admin Dashboard] --> M
    
    style A fill:#bbdefb
    style E fill:#c8e6c9
    style I fill:#ffcdd2
    style J fill:#fff9c4
    style M fill:#e1bee7
</lov-mermaid>

## 9. Error Handling and Recovery

<lov-mermaid>
flowchart TD
    A[API Request] --> B{Request Valid?}
    B -->|No| C[Validation Error]
    B -->|Yes| D[Process Request]
    
    D --> E{Database Available?}
    E -->|No| F[Database Error]
    E -->|Yes| G[Execute Operation]
    
    G --> H{Operation Success?}
    H -->|No| I[Business Logic Error]
    H -->|Yes| J[Success Response]
    
    C --> K[Log Error]
    F --> K
    I --> K
    
    K --> L{Error Type}
    L -->|Client Error 4xx| M[Return User-Friendly Message]
    L -->|Server Error 5xx| N[Return Generic Error + Log Details]
    L -->|Critical Error| O[Alert Admin + Retry Logic]
    
    M --> P[Send Error Response]
    N --> P
    O --> Q[Attempt Recovery]
    
    Q --> R{Recovery Success?}
    R -->|Yes| J
    R -->|No| S[Escalate to Support]
    
    J --> T[Log Success]
    P --> U[End Request]
    S --> U
    T --> U
    
    style C fill:#ffcdd2
    style F fill:#ffcdd2
    style I fill:#ffcdd2
    style O fill:#ff8a80
    style J fill:#c8e6c9
</lov-mermaid>

## State Transitions

### Application Status Flow
```
PENDING → UNDER_REVIEW → APPROVED ✓
PENDING → UNDER_REVIEW → REJECTED ✓
PENDING → REJECTED ✓ (if clearly not eligible)

Invalid Transitions:
APPROVED → PENDING ✗
APPROVED → UNDER_REVIEW ✗
REJECTED → APPROVED ✗ (must create new application)
```

### User Role Permissions Matrix

| Action | APPLICANT | AGENT | ADMIN |
|--------|-----------|-------|-------|
| Submit Application | ✓ | ✗ | ✗ |
| View Own Applications | ✓ | ✗ | ✗ |
| View All Applications | ✗ | ✓ | ✓ |
| Approve/Reject | ✗ | ✓ | ✓ |
| Manage Users | ✗ | ✗ | ✓ |
| Configure Loan Types | ✗ | ✗ | ✓ |
| View Analytics | ✗ | Limited | ✓ |
| Access Rejected Bin | ✗ | ✗ | ✓ |
| System Administration | ✗ | ✗ | ✓ |

### Business Rules
1. **One Active Application**: Applicants can only have one PENDING or UNDER_REVIEW application
2. **Document Requirements**: Minimum 3 documents required for submission
3. **Auto-Archive**: Applications archived after 1 year from last update
4. **Audit Immutability**: Audit logs cannot be modified or deleted
5. **Role Escalation**: Agents can escalate to Admin for complex cases