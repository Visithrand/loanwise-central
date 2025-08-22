import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, ArrowLeft, CheckCircle, DollarSign, Building2, FileText } from 'lucide-react';
import { LoanApplicationRequest, BankBranch, LOAN_TYPES } from '../types/api-types';
import { mockApiService } from '../services/mockData';

const SubmitLoan: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bankBranches, setBankBranches] = useState<BankBranch[]>([]);
  
  const [formData, setFormData] = useState<LoanApplicationRequest>({
    loanType: 'PERSONAL_LOAN',
    amount: 0,
    description: '',
    selectedBankBranch: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadBankBranches();
  }, [user, navigate]);

  const loadBankBranches = async () => {
    try {
      const branches = await mockApiService.getAllBankBranches();
      setBankBranches(branches);
      
      // Set default bank branch if available
      if (branches.length > 0 && !formData.selectedBankBranch) {
        setFormData(prev => ({ ...prev, selectedBankBranch: branches[0].branchName }));
      }
    } catch (error) {
      console.error('Error loading bank branches:', error);
      setError('Failed to load bank branches. Please try again.');
    }
  };

  const handleInputChange = (field: keyof LoanApplicationRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.selectedBankBranch) {
      setError('Please select a bank branch');
      return;
    }

    if (formData.amount <= 0) {
      setError('Please enter a valid loan amount');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await mockApiService.submitLoanApplication(formData, user!.email);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit loan application';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your loan application has been successfully submitted and is under review.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Submit Loan Application</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>New Loan Application</span>
            </CardTitle>
            <CardDescription>
              Fill out the form below to submit your loan application. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Loan Type */}
              <div className="space-y-2">
                <Label htmlFor="loanType" className="text-sm font-medium text-gray-700">
                  Loan Type *
                </Label>
                <Select 
                  value={formData.loanType} 
                  onValueChange={(value) => handleInputChange('loanType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Loan Amount (₹) *
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter loan amount"
                    value={formData.amount || ''}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    className="pl-10"
                    min="100"
                    step="100"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Minimum amount: ₹100
                </p>
              </div>
              
              {/* Bank Branch */}
              <div className="space-y-2">
                <Label htmlFor="bankBranch" className="text-sm font-medium text-gray-700">
                  Bank Branch *
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Select 
                    value={formData.selectedBankBranch} 
                    onValueChange={(value) => handleInputChange('selectedBankBranch', value)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select bank branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankBranches.map(branch => (
                        <SelectItem key={branch.id} value={branch.branchName}>
                          {branch.branchName} - {branch.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {bankBranches.length === 0 && (
                  <p className="text-xs text-red-500">
                    No bank branches available. Please contact support.
                  </p>
                )}
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of your loan..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">
                  {formData.description?.length || 0}/500 characters
                </p>
              </div>
              
              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <Link to="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading || bankBranches.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Application Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Application Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Applicant:</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium">{user.role}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitLoan;
