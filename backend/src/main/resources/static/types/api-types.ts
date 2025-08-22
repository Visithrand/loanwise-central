// TypeScript interfaces for Loan Application API

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'APPLICANT' | 'AGENT' | 'ADMIN';
}

export interface AuthRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface LoanType {
  PERSONAL: 'PERSONAL';
  BUSINESS: 'BUSINESS';
  MORTGAGE: 'MORTGAGE';
  AUTO: 'AUTO';
  STUDENT: 'STUDENT';
}

export interface LoanStatus {
  PENDING: 'PENDING';
  APPROVED: 'APPROVED';
  REJECTED: 'REJECTED';
}

export interface Document {
  id: number;
  documentName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

export interface LoanApplication {
  id: number;
  applicant: User;
  loanType: keyof LoanType;
  amount: number;
  status: keyof LoanStatus;
  rejectionReason?: string;
  createdAt: string;
  documents?: Document[];
}

export interface LoanApplicationRequest {
  loanType: keyof LoanType;
  amount: number;
}

export interface LoanStatusUpdateRequest {
  status: keyof LoanStatus;
  rejectionReason?: string;
}

export interface ApiResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiService {
  // Auth endpoints
  register(request: AuthRequest): Promise<AuthResponse>;
  login(request: LoginRequest): Promise<AuthResponse>;
  
  // User endpoints
  getCurrentUser(): Promise<User>;
  
  // Loan endpoints
  submitLoanApplication(request: LoanApplicationRequest): Promise<LoanApplication>;
  getMyApplications(): Promise<LoanApplication[]>;
  getAllApplications(page?: number, size?: number, search?: string): Promise<ApiResponse<LoanApplication>>;
  updateLoanStatus(id: number, request: LoanStatusUpdateRequest): Promise<LoanApplication>;
  archiveOldApplications(): Promise<string>;
}
