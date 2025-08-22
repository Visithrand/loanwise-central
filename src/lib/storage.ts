import { User, LoanApplication } from './types';
import { demoUsers, sampleLoanApplications } from './mockData';

// Initialize localStorage with demo data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(demoUsers));
  }
  
  if (!localStorage.getItem('loanApplications')) {
    localStorage.setItem('loanApplications', JSON.stringify(sampleLoanApplications));
  }
  
  if (!localStorage.getItem('currentUser')) {
    localStorage.removeItem('currentUser');
  }
};

// User management
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

// Loan application management
export const getLoanApplications = (): LoanApplication[] => {
  const applications = localStorage.getItem('loanApplications');
  return applications ? JSON.parse(applications) : [];
};

export const getLoanApplicationsByUser = (userId: string): LoanApplication[] => {
  const applications = getLoanApplications();
  return applications.filter(app => app.applicantId === userId);
};

export const saveLoanApplication = (application: LoanApplication) => {
  const applications = getLoanApplications();
  const existingIndex = applications.findIndex(app => app.id === application.id);
  
  if (existingIndex >= 0) {
    applications[existingIndex] = application;
  } else {
    applications.push(application);
  }
  
  localStorage.setItem('loanApplications', JSON.stringify(applications));
  
  // Trigger a custom event to notify components of data changes
  window.dispatchEvent(new CustomEvent('loanApplicationsUpdated', { 
    detail: { applications } 
  }));
  
  return application;
};

export const updateLoanApplicationStatus = (
  applicationId: string, 
  status: LoanApplication['status'], 
  reviewNotes?: string,
  reviewedBy?: string
) => {
  const applications = getLoanApplications();
  const application = applications.find(app => app.id === applicationId);
  
  if (application) {
    application.status = status;
    application.updatedAt = new Date().toISOString();
    if (reviewNotes) application.reviewNotes = reviewNotes;
    if (reviewedBy) application.reviewedBy = reviewedBy;
    if (reviewedBy) application.reviewedAt = new Date().toISOString();
    
    localStorage.setItem('loanApplications', JSON.stringify(applications));
    
    // Trigger a custom event to notify components of data changes
    window.dispatchEvent(new CustomEvent('loanApplicationsUpdated', { 
      detail: { applications } 
    }));
    
    return application;
  }
  
  return null;
};

export const deleteLoanApplication = (applicationId: string) => {
  const applications = getLoanApplications();
  const filteredApplications = applications.filter(app => app.id !== applicationId);
  localStorage.setItem('loanApplications', JSON.stringify(filteredApplications));
  
  // Trigger a custom event to notify components of data changes
  window.dispatchEvent(new CustomEvent('loanApplicationsUpdated', { 
    detail: { applications: filteredApplications } 
  }));
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Search and filter applications
export const searchApplications = (
  query: string,
  status?: string,
  loanType?: string
): LoanApplication[] => {
  let applications = getLoanApplications();
  
  if (query) {
    const searchTerm = query.toLowerCase();
    applications = applications.filter(app => 
      app.applicantName.toLowerCase().includes(searchTerm) ||
      app.applicantEmail.toLowerCase().includes(searchTerm) ||
      app.userDetails.fullName.toLowerCase().includes(searchTerm)
    );
  }
  
  if (status && status !== 'ALL') {
    applications = applications.filter(app => app.status === status);
  }
  
  if (loanType && loanType !== 'ALL') {
    applications = applications.filter(app => app.accountDetails.loanType === loanType);
  }
  
  return applications;
};

// Get application statistics for a user
export const getUserApplicationStats = (userId: string) => {
  const applications = getLoanApplicationsByUser(userId);
  
  return {
    total: applications.length,
    submitted: applications.filter(app => app.status === 'SUBMITTED').length,
    underReview: applications.filter(app => app.status === 'UNDER_REVIEW').length,
    approved: applications.filter(app => app.status === 'APPROVED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
  };
};

// Get system-wide statistics
export const getSystemStats = () => {
  const applications = getLoanApplications();
  
  return {
    total: applications.length,
    submitted: applications.filter(app => app.status === 'SUBMITTED').length,
    underReview: applications.filter(app => app.status === 'UNDER_REVIEW').length,
    approved: applications.filter(app => app.status === 'APPROVED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
  };
};
