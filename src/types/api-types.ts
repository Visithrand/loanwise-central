// API Types for Loan Application System

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'APPLICANT' | 'ADMIN';
}

export interface UserLoginRequest {
  name: string;
  email: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface BankBranch {
  id: number;
  branchName: string;
  location: string;
  contactNumber?: string;
  email?: string;
  active: boolean;
}

export interface LoanType {
  PERSONAL_LOAN: 'PERSONAL_LOAN';
  EDUCATION_LOAN: 'EDUCATION_LOAN';
  HOUSE_LOAN: 'HOUSE_LOAN';
  JEWEL_LOAN: 'JEWEL_LOAN';
  AUTO_LOAN: 'AUTO_LOAN';
}

export interface LoanStatus {
  SUBMITTED: 'SUBMITTED';
  APPROVED: 'APPROVED';
  REJECTED: 'REJECTED';
}

export interface LoanApplication {
  id: number;
  applicant: UserResponse;
  loanType: keyof LoanType;
  amount: number;
  description?: string;
  selectedBankBranch: string;
  status: keyof LoanStatus;
  createdAt: string;
}

export interface LoanApplicationRequest {
  loanType: keyof LoanType;
  amount: number;
  description?: string;
  selectedBankBranch: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Loan type options for forms
export const LOAN_TYPES = [
  { value: 'PERSONAL_LOAN', label: 'Personal Loan' },
  { value: 'EDUCATION_LOAN', label: 'Education Loan' },
  { value: 'HOUSE_LOAN', label: 'House Loan' },
  { value: 'JEWEL_LOAN', label: 'Jewel Loan' },
  { value: 'AUTO_LOAN', label: 'Auto Loan' },
] as const;

// Loan status options
export const LOAN_STATUSES = [
  { value: 'SUBMITTED', label: 'Submitted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
] as const;
