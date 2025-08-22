import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Trash2, 
  FileText, 
  XCircle, 
  LogOut, 
  Search,
  User,
  DollarSign,
  Building2,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { LoanApplication } from '../types/api-types';
import { mockApiService } from '../services/mockData';

const RejectedBin: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }
    
    loadRejectedApplications();
  }, [user, navigate]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm]);

  const loadRejectedApplications = async () => {
    try {
      setIsLoading(true);
      const data = await mockApiService.getRejectedApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error loading rejected applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.selectedBankBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.amount.toString().includes(searchTerm)
      );
    }

    setFilteredApplications(filtered);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">LoanWise</h1>
              <span className="text-sm text-gray-500">Admin Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user.name}</span>
                <Badge variant="secondary">{user.role}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link 
              to="/admin/dashboard" 
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/applications" 
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              All Applications
            </Link>
            <Link 
              to="/admin/bin" 
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
            >
              Rejected Bin
            </Link>
            <Link 
              to="/admin/manage-banks" 
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Manage Banks
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Link to="/admin/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Rejected Applications Bin</h2>
              <p className="text-gray-600">View and manage rejected loan applications</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={loadRejectedApplications}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rejected Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search rejected applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading rejected applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rejected applications found</h3>
              <p className="text-gray-600 mb-6">
                {applications.length === 0 
                  ? "No loan applications have been rejected yet."
                  : "No rejected applications match your search criteria."
                }
              </p>
              {applications.length === 0 && (
                <Link to="/admin/dashboard">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <Card key={application.id} className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <h3 className="text-lg font-medium text-gray-900">
                          {application.loanType.replace('_', ' ')}
                        </h3>
                        <Badge className="bg-red-100 text-red-800">
                          Rejected
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">{application.applicant.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>₹{application.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4" />
                          <span>{application.selectedBankBranch}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {application.description && (
                        <p className="text-sm text-gray-600">
                          <strong>Description:</strong> {application.description}
                        </p>
                      )}
                      
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-800">
                          <strong>Status:</strong> This application was rejected and moved to the bin.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredApplications.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="text-center text-sm text-gray-600">
                Showing {filteredApplications.length} of {applications.length} rejected applications
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RejectedBin;
