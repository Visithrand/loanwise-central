export interface User {
  id: string;
  email: string;
  password: string;
  role: 'APPLICANT' | 'AGENT' | 'ADMIN';
  name: string;
  phone?: string;
}

export interface LoanApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  updatedAt: string;
  
  // User Details
  userDetails: {
    fullName: string;
    dateOfBirth: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    employmentStatus: string;
    monthlyIncome: number;
  };
  
  // Account Details
  accountDetails: {
    loanType: 'PERSONAL' | 'HOME' | 'CAR' | 'BUSINESS' | 'EDUCATION';
    loanAmount: number;
    loanPurpose: string;
    preferredBank: string;
    accountNumber?: string;
    ifscCode?: string;
  };
  
  // EMI Details
  emiDetails: {
    monthlyEMI: number;
    loanTenure: number;
    interestRate: number;
    downPayment: number;
    processingFee: number;
  };
  
  // Net Worth & Properties
  netWorth: {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    properties: Property[];
    investments: Investment[];
  };
  
  // Review & Notes
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Property {
  id: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND';
  address: string;
  value: number;
  isOwned: boolean;
  mortgageAmount?: number;
}

export interface Investment {
  id: string;
  type: 'STOCKS' | 'BONDS' | 'MUTUAL_FUNDS' | 'FIXED_DEPOSITS' | 'GOLD';
  value: number;
  institution?: string;
}

export interface LoanStats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  approvalRate: number;
  averageLoanAmount: number;
  monthlyApplications: number[];
}

export interface Notification {
  id: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
