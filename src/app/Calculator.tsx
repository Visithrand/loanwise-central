import React, { useState } from 'react';
import { useTheme } from '../lib/themeContext';
import { Calculator as CalculatorIcon, DollarSign, Calendar, Percent, TrendingUp } from 'lucide-react';

const Calculator: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTenure: '',
    downPayment: ''
  });
  
  const [results, setResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    
    const principal = parseFloat(formData.loanAmount) - parseFloat(formData.downPayment || '0');
    const rate = parseFloat(formData.interestRate) / 100 / 12; // Monthly interest rate
    const time = parseFloat(formData.loanTenure) * 12; // Total months
    
    if (principal > 0 && rate > 0 && time > 0) {
      // EMI calculation formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
      const emi = principal * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1);
      const totalAmount = emi * time;
      const totalInterest = totalAmount - principal;
      
      setResults({
        monthlyEMI: emi,
        totalAmount,
        totalInterest,
        principal,
        downPayment: parseFloat(formData.downPayment || '0')
      });
      setShowResults(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const resetForm = () => {
    setFormData({
      loanAmount: '',
      interestRate: '',
      loanTenure: '',
      downPayment: ''
    });
    setResults(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loan EMI Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your monthly EMI, total interest, and loan details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <CalculatorIcon className="w-6 h-6 mr-2 text-blue-600" />
              Calculate Your Loan
            </h2>
            
            <form onSubmit={calculateLoan} className="space-y-6">
              {/* Loan Amount */}
              <div>
                                 <label htmlFor="loanAmount" className="form-label">
                   Loan Amount (₹)
                 </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    id="loanAmount"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter loan amount in ₹"
                                         min="10000"
                     step="10000"
                    required
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label htmlFor="interestRate" className="form-label">
                  Annual Interest Rate (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    id="interestRate"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter interest rate"
                    min="0.1"
                    max="30"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              {/* Loan Tenure */}
              <div>
                <label htmlFor="loanTenure" className="form-label">
                  Loan Tenure (Years)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    id="loanTenure"
                    name="loanTenure"
                    value={formData.loanTenure}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter loan tenure"
                    min="1"
                    max="30"
                    step="1"
                    required
                  />
                </div>
              </div>

              {/* Down Payment */}
              <div>
                                 <label htmlFor="downPayment" className="form-label">
                   Down Payment (₹) - Optional
                 </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    id="downPayment"
                    name="downPayment"
                    value={formData.downPayment}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter down payment in ₹"
                    min="0"
                                         step="10000"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="btn-primary flex-1 py-3 text-lg font-semibold"
                >
                  Calculate EMI
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary py-3 px-6 text-lg font-semibold"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Results Display */}
          <div className="space-y-6">
            {showResults && results && (
              <>
                {/* Monthly EMI */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md p-8 text-white">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    Monthly EMI
                  </h3>
                  <div className="text-4xl font-bold mb-2">
                    {formatCurrency(results.monthlyEMI)}
                  </div>
                  <p className="text-blue-100">
                    per month for {formData.loanTenure} years
                  </p>
                </div>

                {/* Loan Summary */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(formData.loanAmount))}</span>
                    </div>
                    
                    {results.downPayment > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Down Payment:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(results.downPayment)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Principal Amount:</span>
                      <span className="font-semibold">{formatCurrency(results.principal)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="font-semibold text-red-600">{formatCurrency(results.totalInterest)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-semibold text-blue-600">{formatCurrency(results.totalAmount)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Loan Tenure:</span>
                      <span className="font-semibold">{formData.loanTenure} years</span>
                    </div>
                  </div>
                </div>

                {/* Amortization Preview */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Amortization Preview</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-gray-600">First Year</div>
                        <div className="font-semibold text-blue-600">
                          {formatCurrency(results.monthlyEMI * 12)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Middle Year</div>
                        <div className="font-semibold text-blue-600">
                          {formatCurrency(results.monthlyEMI * 12)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-600">Last Year</div>
                        <div className="font-semibold text-blue-600">
                          {formatCurrency(results.monthlyEMI * 12)}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      * Monthly EMI remains constant throughout the loan term
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Info Card */}
            {!showResults && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Enter your loan amount, interest rate, and tenure</p>
                  <p>• Optionally add a down payment to reduce your principal</p>
                  <p>• Get instant calculation of monthly EMI and total costs</p>
                  <p>• Understand the complete loan breakdown</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Loan Tips & Advice</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Before Applying</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Check your credit score and improve it if needed</li>
                <li>• Save for a larger down payment to reduce EMI</li>
                <li>• Compare interest rates from multiple lenders</li>
                <li>• Ensure your debt-to-income ratio is below 43%</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">During Repayment</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Set up automatic payments to avoid late fees</li>
                <li>• Consider making extra payments to reduce interest</li>
                <li>• Keep track of your loan balance and payments</li>
                <li>• Contact your lender if you face financial difficulties</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
