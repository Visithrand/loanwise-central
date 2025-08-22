// API Service for connecting to Spring Boot Backend
const API_BASE_URL = 'http://localhost:8080/api';

// Types for API requests and responses
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

// API Service Class
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(request: AuthRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    // Store token
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    
    return response;
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
    
    // Store token
    this.token = response.token;
    localStorage.setItem('authToken', response.token);
    
    return response;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // User methods
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // Loan application methods
  async submitLoanApplication(request: LoanApplicationRequest): Promise<LoanApplication> {
    return this.request<LoanApplication>('/loans', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getMyApplications(): Promise<LoanApplication[]> {
    return this.request<LoanApplication[]>('/loans/my');
  }

  async getAllApplications(
    page: number = 0,
    size: number = 10,
    search?: string
  ): Promise<ApiResponse<LoanApplication>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    return this.request<ApiResponse<LoanApplication>>(`/loans?${params.toString()}`);
  }

  async updateLoanStatus(
    id: number,
    request: LoanStatusUpdateRequest
  ): Promise<LoanApplication> {
    return this.request<LoanApplication>(`/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  async archiveOldApplications(): Promise<string> {
    return this.request<string>('/loans/archive', {
      method: 'POST',
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
export default ApiService;
