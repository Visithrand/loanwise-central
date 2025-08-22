import { 
  UserLoginRequest, 
  UserResponse, 
  LoanApplicationRequest, 
  LoanApplication, 
  BankBranch,
  ApiResponse 
} from '../types/api-types';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User Management
  async login(request: UserLoginRequest): Promise<UserResponse> {
    return this.request<UserResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getUserById(id: number): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/${id}`);
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/email/${email}`);
  }

  async promoteToAdmin(email: string): Promise<UserResponse> {
    return this.request<UserResponse>(`/users/${email}/promote-admin`, {
      method: 'PUT',
    });
  }

  // Loan Applications
  async submitLoanApplication(
    request: LoanApplicationRequest, 
    userEmail: string
  ): Promise<LoanApplication> {
    const queryParams = new URLSearchParams({ userEmail });
    return this.request<LoanApplication>(`/loans?${queryParams}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getMyApplications(userEmail: string): Promise<LoanApplication[]> {
    const queryParams = new URLSearchParams({ userEmail });
    return this.request<LoanApplication[]>(`/loans/my?${queryParams}`);
  }

  async getAllApplications(
    page: number = 0, 
    size: number = 10, 
    search?: string
  ): Promise<{ content: LoanApplication[]; totalElements: number; totalPages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    return this.request<{ content: LoanApplication[]; totalElements: number; totalPages: number }>(`/loans?${params}`);
  }

  async approveLoan(id: number): Promise<LoanApplication> {
    return this.request<LoanApplication>(`/loans/${id}/approve`, {
      method: 'PUT',
    });
  }

  async rejectLoan(id: number): Promise<LoanApplication> {
    return this.request<LoanApplication>(`/loans/${id}/reject`, {
      method: 'PUT',
    });
  }

  async getRejectedApplications(): Promise<LoanApplication[]> {
    return this.request<LoanApplication[]>('/loans/bin');
  }

  async getApplicationsByStatus(status: string): Promise<LoanApplication[]> {
    return this.request<LoanApplication[]>(`/loans/status/${status}`);
  }

  // Bank Branches
  async getAllBankBranches(): Promise<BankBranch[]> {
    return this.request<BankBranch[]>('/banks');
  }

  async getBankBranchById(id: number): Promise<BankBranch> {
    return this.request<BankBranch>(`/banks/${id}`);
  }

  async createBankBranch(bankBranch: Omit<BankBranch, 'id'>): Promise<BankBranch> {
    return this.request<BankBranch>('/banks', {
      method: 'POST',
      body: JSON.stringify(bankBranch),
    });
  }

  async updateBankBranch(id: number, bankBranch: BankBranch): Promise<BankBranch> {
    return this.request<BankBranch>(`/banks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bankBranch),
    });
  }

  async deleteBankBranch(id: number): Promise<void> {
    return this.request<void>(`/banks/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
