import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { useTheme } from '../lib/themeContext';
import { saveLoanApplication, generateId } from '../lib/storage';
import { loanTypes } from '../lib/mockData';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  DollarSign, 
  Calendar,
  Upload,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const UserDetails: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    loanType: '',
    loanAmount: '',
    duration: '',
    incomeProof: null as File | null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.loanType) newErrors.loanType = 'Please select a loan type';
    if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
    if (!formData.duration) newErrors.duration = 'Loan duration is required';
    if (!formData.incomeProof) newErrors.incomeProof = 'Income proof is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, incomeProof: file }));
      if (errors.incomeProof) {
        setErrors(prev => ({ ...prev, incomeProof: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const application = {
        id: generateId(),
        applicantId: user!.id,
        applicantName: formData.fullName,
        applicantEmail: formData.email,
        status: 'SUBMITTED' as const,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userDetails: {
          fullName: formData.fullName,
          dateOfBirth: '',
          phone: formData.phone,
          address: '',
          city: '',
          state: '',
          zipCode: '',
          employmentStatus: '',
          monthlyIncome: 0
        },
        accountDetails: {
          loanType: formData.loanType as any,
          loanAmount: parseFloat(formData.loanAmount),
          loanPurpose: '',
          preferredBank: '',
          accountNumber: '',
          ifscCode: ''
        },
        emiDetails: {
          monthlyEMI: 0,
          loanTenure: parseInt(formData.duration),
          interestRate: 0,
          downPayment: 0,
          processingFee: 0
        },
        netWorth: {
          totalAssets: 0,
          totalLiabilities: 0,
          netWorth: 0,
          properties: [],
          investments: []
        }
      };

      saveLoanApplication(application);
      setIsSuccess(true);
      
      // Redirect to status tracker after 2 seconds
      setTimeout(() => {
        navigate('/status-tracker');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div>Please log in to submit a loan application.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loan Application Form
          </h1>
          <p className="text-gray-600">
            Please fill in your details to submit your loan application
          </p>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">
                Application submitted successfully! Redirecting to status tracker...
              </span>
            </div>
          </div>
        )}

        {/* Application Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Loan Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loan Type */}
                <div>
                  <label htmlFor="loanType" className="form-label">
                    Loan Type *
                  </label>
                  <select
                    id="loanType"
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleInputChange}
                    className={`input-field ${errors.loanType ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select loan type</option>
                    {loanTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.loanType && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.loanType}
                    </p>
                  )}
                </div>

                {/* Loan Amount */}
                <div>
                  <label htmlFor="loanAmount" className="form-label">
                    Loan Amount (USD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      id="loanAmount"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.loanAmount ? 'border-red-500' : ''}`}
                      placeholder="Enter loan amount"
                      min="1000"
                      step="1000"
                    />
                  </div>
                  {errors.loanAmount && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.loanAmount}
                    </p>
                  )}
                </div>

                {/* Loan Duration */}
                <div>
                  <label htmlFor="duration" className="form-label">
                    Loan Duration (Years) *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className={`input-field pl-10 ${errors.duration ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select duration</option>
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="3">3 Years</option>
                      <option value="5">5 Years</option>
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years</option>
                      <option value="30">30 Years</option>
                    </select>
                  </div>
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.duration}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Income Proof Upload */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                Income Proof
              </h2>
              
              <div>
                <label htmlFor="incomeProof" className="form-label">
                  Upload Income Proof Document *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="incomeProof"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="incomeProof"
                          name="incomeProof"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
                
                {formData.incomeProof && (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{formData.incomeProof.name}</span>
                  </div>
                )}
                
                {errors.incomeProof && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.incomeProof}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
