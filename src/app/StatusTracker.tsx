import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { getLoanApplicationsByUser, getLoanApplications } from '../lib/storage';
import { Clock, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';

const StatusTracker: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const refreshApplications = () => {
    if (user) {
      const userApplications = getLoanApplicationsByUser(user.id);
      setApplications(userApplications);
      
      if (id) {
        const app = userApplications.find(a => a.id === id);
        setSelectedApplication(app);
      }
    }
  };

  useEffect(() => {
    refreshApplications();
    const interval = setInterval(refreshApplications, 5000);
    return () => clearInterval(interval);
  }, [user, id]);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 1;
      case 'UNDER_REVIEW':
        return 2;
      case 'APPROVED':
        return 3;
      case 'REJECTED':
        return 3;
      default:
        return 0;
    }
  };

  const getStatusIcon = (status: string, step: number) => {
    if (status === 'REJECTED' && step === 3) {
      return <XCircle className="w-6 h-6 text-red-500" />;
    }
    
    if (getStatusStep(status) >= step) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    
    return <Clock className="w-6 h-6 text-gray-400" />;
  };

  const getStatusColor = (status: string, step: number) => {
    if (status === 'REJECTED' && step === 3) {
      return 'text-red-500';
    }
    
    if (getStatusStep(status) >= step) {
      return 'text-green-500';
    }
    
    return 'text-gray-400';
  };

  if (!user) {
    return <div>Please log in to view your application status.</div>;
  }

  if (id && !selectedApplication) {
    return <div>Application not found.</div>;
  }

  const applicationsToShow = id ? [selectedApplication] : applications;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {id ? 'Application Status' : 'Application Status Tracker'}
        </h1>

        {applicationsToShow.map((application) => (
          <div key={application.id} className="bg-white rounded-xl shadow-md border border-gray-200 mb-8">
            {/* Application Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {application.accountDetails.loanType} Loan Application
                  </h2>
                  <p className="text-gray-600">
                    Submitted on {new Date(application.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    application.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    application.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-6 py-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Application Progress</span>
                  <span className="text-sm text-gray-500">
                    Step {getStatusStep(application.status)} of 3
                  </span>
                </div>
                
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200"></div>
                  
                  {/* Progress Steps */}
                  <div className="relative flex justify-between">
                    {/* Step 1: Submitted */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${
                        getStatusStep(application.status) >= 1 ? 'border-green-500' : 'border-gray-300'
                      }`}>
                        {getStatusIcon(application.status, 1)}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`text-sm font-medium ${getStatusColor(application.status, 1)}`}>
                          Submitted
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(application.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Under Review */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${
                        getStatusStep(application.status) >= 2 ? 'border-green-500' : 'border-gray-300'
                      }`}>
                        {getStatusIcon(application.status, 2)}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`text-sm font-medium ${getStatusColor(application.status, 2)}`}>
                          Under Review
                        </div>
                        {application.status === 'UNDER_REVIEW' && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(application.updatedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 3: Final Decision */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${
                        getStatusStep(application.status) >= 3 ? 'border-green-500' : 'border-gray-300'
                      }`}>
                        {getStatusIcon(application.status, 3)}
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`text-sm font-medium ${getStatusColor(application.status, 3)}`}>
                          {application.status === 'APPROVED' ? 'Approved' : 
                           application.status === 'REJECTED' ? 'Rejected' : 'Decision Pending'}
                        </div>
                        {(application.status === 'APPROVED' || application.status === 'REJECTED') && (
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(application.updatedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Loan Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan Type:</span>
                      <span className="font-medium">{application.accountDetails.loanType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">
                        ${application.accountDetails.loanAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{application.emiDetails.loanTenure} years</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{application.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{application.applicantEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{application.userDetails.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Updates */}
              {application.reviewNotes && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Status Updates</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Review Notes:</span> {application.reviewNotes}
                        </p>
                        {application.reviewedBy && (
                          <p className="text-xs text-gray-500 mt-1">
                            Reviewed by: {application.reviewedBy}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  {application.status === 'SUBMITTED' && (
                    <p className="text-sm text-blue-900">
                      Your application has been submitted successfully and is awaiting review. 
                      Our team will review your application within 2-3 business days.
                    </p>
                  )}
                  {application.status === 'UNDER_REVIEW' && (
                    <p className="text-sm text-blue-900">
                      Your application is currently under review. We may contact you for additional 
                      information if needed. Please check back for updates.
                    </p>
                  )}
                  {application.status === 'APPROVED' && (
                    <p className="text-sm text-green-900">
                      Congratulations! Your loan application has been approved. 
                      You will receive further instructions via email within 24 hours.
                    </p>
                  )}
                  {application.status === 'REJECTED' && (
                    <p className="text-sm text-red-900">
                      We regret to inform you that your loan application has been rejected. 
                      Please review the feedback provided and consider applying again in the future.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {applications.length === 0 && !id && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              You haven't submitted any loan applications yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusTracker;
