import { User, LoanApplication, LoanStats } from './types';

// Demo Users
export const demoUsers: User[] = [
  {
    id: '1',
    email: 'applicant@test.com',
    password: '1234',
    role: 'APPLICANT',
    name: 'John Doe',
    phone: '+1-555-0101'
  },
  {
    id: '2',
    email: 'agent@test.com',
    password: '1234',
    role: 'AGENT',
    name: 'Jane Smith',
    phone: '+1-555-0102'
  },
  {
    id: '3',
    email: 'admin@test.com',
    password: '1234',
    role: 'ADMIN',
    name: 'Admin User',
    phone: '+1-555-0103'
  }
];

// Sample Loan Applications
export const sampleLoanApplications: LoanApplication[] = [
  {
    id: '1',
    applicantId: '1',
    applicantName: 'John Doe',
    applicantEmail: 'applicant@test.com',
    status: 'UNDER_REVIEW',
    submittedAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    userDetails: {
      fullName: 'John Doe',
      dateOfBirth: '1990-05-15',
      phone: '+1-555-0101',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      employmentStatus: 'EMPLOYED',
      monthlyIncome: 5000
    },
    accountDetails: {
      loanType: 'HOME',
      loanAmount: 250000,
      loanPurpose: 'Home purchase',
      preferredBank: 'Chase Bank',
      accountNumber: '1234567890',
      ifscCode: 'CHASUS33'
    },
    emiDetails: {
      monthlyEMI: 1500,
      loanTenure: 30,
      interestRate: 4.5,
      downPayment: 50000,
      processingFee: 2500
    },
    netWorth: {
      totalAssets: 100000,
      totalLiabilities: 20000,
      netWorth: 80000,
      properties: [
        {
          id: '1',
          type: 'RESIDENTIAL',
          address: '456 Oak Avenue',
          value: 80000,
          isOwned: true
        }
      ],
      investments: [
        {
          id: '1',
          type: 'STOCKS',
          value: 20000,
          institution: 'Fidelity'
        }
      ]
    },
    reviewNotes: 'Application looks good, income verification pending',
    reviewedBy: 'Jane Smith',
    reviewedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '2',
    applicantId: '4',
    applicantName: 'Alice Johnson',
    applicantEmail: 'alice@example.com',
    status: 'APPROVED',
    submittedAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    userDetails: {
      fullName: 'Alice Johnson',
      dateOfBirth: '1985-08-22',
      phone: '+1-555-0104',
      address: '789 Pine Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      employmentStatus: 'EMPLOYED',
      monthlyIncome: 7500
    },
    accountDetails: {
      loanType: 'CAR',
      loanAmount: 35000,
      loanPurpose: 'Vehicle purchase',
      preferredBank: 'Wells Fargo',
      accountNumber: '0987654321',
      ifscCode: 'WFBIUS6S'
    },
    emiDetails: {
      monthlyEMI: 650,
      loanTenure: 60,
      interestRate: 6.2,
      downPayment: 7000,
      processingFee: 500
    },
    netWorth: {
      totalAssets: 150000,
      totalLiabilities: 25000,
      netWorth: 125000,
      properties: [],
      investments: [
        {
          id: '2',
          type: 'MUTUAL_FUNDS',
          value: 50000,
          institution: 'Vanguard'
        }
      ]
    },
    reviewNotes: 'All documents verified, approved for loan',
    reviewedBy: 'Jane Smith',
    reviewedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '3',
    applicantId: '5',
    applicantName: 'Bob Wilson',
    applicantEmail: 'bob@example.com',
    status: 'REJECTED',
    submittedAt: '2024-01-08T11:20:00Z',
    updatedAt: '2024-01-09T13:30:00Z',
    userDetails: {
      fullName: 'Bob Wilson',
      dateOfBirth: '1978-12-03',
      phone: '+1-555-0105',
      address: '321 Elm Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      employmentStatus: 'SELF_EMPLOYED',
      monthlyIncome: 3000
    },
    accountDetails: {
      loanType: 'BUSINESS',
      loanAmount: 100000,
      loanPurpose: 'Business expansion',
      preferredBank: 'Bank of America',
      accountNumber: '1122334455',
      ifscCode: 'BOFAUS3N'
    },
    emiDetails: {
      monthlyEMI: 2200,
      loanTenure: 48,
      interestRate: 8.5,
      downPayment: 20000,
      processingFee: 1500
    },
    netWorth: {
      totalAssets: 50000,
      totalLiabilities: 40000,
      netWorth: 10000,
      properties: [],
      investments: []
    },
    reviewNotes: 'Insufficient income and high debt-to-income ratio',
    reviewedBy: 'Admin User',
    reviewedAt: '2024-01-09T13:30:00Z'
  }
];

// Loan Statistics
export const loanStats: LoanStats = {
  totalApplications: 156,
  pendingReview: 23,
  approved: 98,
  rejected: 35,
  approvalRate: 62.8,
  averageLoanAmount: 125000,
  monthlyApplications: [12, 18, 15, 22, 19, 25, 28, 31, 26, 23, 20, 17]
};

// Banks for dropdown
export const banks = [
  'Chase Bank',
  'Wells Fargo',
  'Bank of America',
  'Citibank',
  'US Bank',
  'PNC Bank',
  'Capital One',
  'TD Bank'
];

// Loan Types
export const loanTypes = [
  { value: 'PERSONAL', label: 'Personal Loan' },
  { value: 'HOME', label: 'Home Loan' },
  { value: 'CAR', label: 'Car Loan' },
  { value: 'BUSINESS', label: 'Business Loan' },
  { value: 'EDUCATION', label: 'Education Loan' }
];

// Employment Status
export const employmentStatuses = [
  'EMPLOYED',
  'SELF_EMPLOYED',
  'UNEMPLOYED',
  'RETIRED',
  'STUDENT'
];
