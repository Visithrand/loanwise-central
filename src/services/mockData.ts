import { User, UserLoginRequest, UserResponse, LoanApplication, LoanApplicationRequest, BankBranch } from '../types/api-types';

// Mock data storage
let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'APPLICANT' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'APPLICANT' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
  { id: 4, name: 'Test Applicant', email: 'test@example.com', role: 'APPLICANT' }
];

let loanApplications: LoanApplication[] = [
  {
    id: 1,
    applicant: { id: 1, name: 'John Doe', email: 'john@example.com', role: 'APPLICANT' },
    loanType: 'PERSONAL_LOAN',
    amount: 5000,
    description: 'Personal loan for home renovation',
    selectedBankBranch: 'Main Branch - Downtown',
    status: 'SUBMITTED',
    rejectionReason: '',
    createdAt: '2024-01-15T10:30:00'
  },
  {
    id: 2,
    applicant: { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'APPLICANT' },
    loanType: 'EDUCATION_LOAN',
    amount: 15000,
    description: 'Education loan for MBA',
    selectedBankBranch: 'North Branch',
    status: 'APPROVED',
    rejectionReason: '',
    createdAt: '2024-01-10T14:20:00'
  },
  {
    id: 3,
    applicant: { id: 4, name: 'Test Applicant', email: 'test@example.com', role: 'APPLICANT' },
    loanType: 'AUTO_LOAN',
    amount: 25000,
    description: 'Auto loan for new car',
    selectedBankBranch: 'South Branch',
    status: 'REJECTED',
    rejectionReason: 'Insufficient credit score',
    createdAt: '2024-01-05T09:15:00'
  }
];

let bankBranches: BankBranch[] = [
  { id: 1, branchName: 'Main Branch - Downtown', location: 'Downtown Area', contactNumber: '+1-555-0101', email: 'downtown@bank.com', active: true },
  { id: 2, branchName: 'North Branch', location: 'North District', contactNumber: '+1-555-0102', email: 'north@bank.com', active: true },
  { id: 3, branchName: 'South Branch', location: 'South District', contactNumber: '+1-555-0103', email: 'south@bank.com', active: true },
  { id: 4, branchName: 'East Branch', location: 'East District', contactNumber: '+1-555-0104', email: 'east@bank.com', active: true },
  { id: 5, branchName: 'West Branch', location: 'West District', contactNumber: '+1-555-0105', email: 'west@bank.com', active: true }
];

let nextUserId = 5;
let nextLoanId = 4;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  // User Management
  async login(request: UserLoginRequest): Promise<UserResponse> {
    await delay(500); // Simulate network delay
    
    // Check if user exists
    let user = users.find(u => u.email === request.email);
    
    if (!user) {
      // Create new user as APPLICANT
      user = {
        id: nextUserId++,
        name: request.name,
        email: request.email,
        role: 'APPLICANT'
      };
      users.push(user);
    }
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  async getUserById(id: number): Promise<UserResponse> {
    await delay(300);
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  async promoteToAdmin(email: string): Promise<UserResponse> {
    await delay(300);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    
    user.role = 'ADMIN';
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  // Loan Applications
  async submitLoanApplication(request: LoanApplicationRequest, userEmail: string): Promise<LoanApplication> {
    await delay(800);
    
    const user = users.find(u => u.email === userEmail);
    if (!user) throw new Error('User not found');
    
    const newLoan: LoanApplication = {
      id: nextLoanId++,
      applicant: { id: user.id, name: user.name, email: user.email, role: user.role },
      loanType: request.loanType,
      amount: request.amount,
      description: request.description || '',
      selectedBankBranch: request.selectedBankBranch,
      status: 'SUBMITTED',
      rejectionReason: '',
      createdAt: new Date().toISOString()
    };
    
    loanApplications.push(newLoan);
    return newLoan;
  }

  async getMyApplications(userEmail: string): Promise<LoanApplication[]> {
    await delay(400);
    const user = users.find(u => u.email === userEmail);
    if (!user) throw new Error('User not found');
    
    return loanApplications.filter(loan => loan.applicant.email === userEmail);
  }

  async getAllApplications(page: number = 0, size: number = 10, search?: string): Promise<{ content: LoanApplication[]; totalElements: number; totalPages: number }> {
    await delay(400);
    
    let filtered = [...loanApplications];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(loan => 
        loan.applicant.name.toLowerCase().includes(searchLower) ||
        loan.applicant.email.toLowerCase().includes(searchLower) ||
        loan.loanType.toLowerCase().includes(searchLower) ||
        loan.status.toLowerCase().includes(searchLower)
      );
    }
    
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const content = filtered.slice(start, start + size);
    
    return { content, totalElements, totalPages };
  }

  async approveLoan(id: number): Promise<LoanApplication> {
    await delay(500);
    const loan = loanApplications.find(l => l.id === id);
    if (!loan) throw new Error('Loan application not found');
    
    loan.status = 'APPROVED';
    return loan;
  }

  async rejectLoan(id: number, rejectionReason: string): Promise<LoanApplication> {
    await delay(500);
    const loan = loanApplications.find(l => l.id === id);
    if (!loan) throw new Error('Loan application not found');
    
    loan.status = 'REJECTED';
    loan.rejectionReason = rejectionReason;
    return loan;
  }

  async markAsViewed(id: number): Promise<LoanApplication> {
    await delay(300);
    const loan = loanApplications.find(l => l.id === id);
    if (!loan) throw new Error('Loan application not found');
    
    loan.status = 'VIEWED';
    return loan;
  }

  async getRejectedApplications(): Promise<LoanApplication[]> {
    await delay(300);
    return loanApplications.filter(loan => loan.status === 'REJECTED');
  }

  async getApplicationsByStatus(status: string): Promise<LoanApplication[]> {
    await delay(300);
    return loanApplications.filter(loan => loan.status === status.toUpperCase());
  }

  // Bank Branches
  async getAllBankBranches(): Promise<BankBranch[]> {
    await delay(300);
    return bankBranches.filter(branch => branch.active);
  }

  async createBankBranch(branch: Omit<BankBranch, 'id'>): Promise<BankBranch> {
    await delay(500);
    const newBranch: BankBranch = {
      ...branch,
      id: bankBranches.length + 1
    };
    bankBranches.push(newBranch);
    return newBranch;
  }

  async updateBankBranch(id: number, branch: Partial<BankBranch>): Promise<BankBranch> {
    await delay(500);
    const index = bankBranches.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Bank branch not found');
    
    bankBranches[index] = { ...bankBranches[index], ...branch };
    return bankBranches[index];
  }

  async deleteBankBranch(id: number): Promise<void> {
    await delay(300);
    const index = bankBranches.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Bank branch not found');
    
    bankBranches.splice(index, 1);
  }
}

export const mockApiService = new MockApiService();
