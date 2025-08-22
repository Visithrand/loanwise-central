import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import DashboardStats from "@/components/Dashboard/DashboardStats";
import StatusCard from "@/components/Dashboard/StatusCard";
import LoanApplicationForm from "@/components/Loan/LoanApplicationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import AdminAnalytics from "@/components/Admin/AdminAnalytics";
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Users,
  Settings,
  BarChart3,
  Trash2,
  Edit,
  Eye
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'APPLICANT' | 'AGENT' | 'ADMIN';
}

interface Application {
  id: string;
  applicantName: string;
  loanType: string;
  amount: number;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
  rejectionReason?: string;
  lastUpdated: string;
}

const LoanDashboard = ({ currentUser }: { currentUser: User }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demo
  useEffect(() => {
    const mockApplications: Application[] = [
      {
        id: 'LA001',
        applicantName: 'John Smith',
        loanType: 'Personal Loan',
        amount: 25000,
        status: 'PENDING',
        submittedDate: '2024-01-15',
        lastUpdated: '2024-01-15'
      },
      {
        id: 'LA002',
        applicantName: 'Sarah Johnson',
        loanType: 'Home Loan',
        amount: 350000,
        status: 'APPROVED',
        submittedDate: '2024-01-10',
        lastUpdated: '2024-01-18'
      },
      {
        id: 'LA003',
        applicantName: 'Mike Davis',
        loanType: 'Auto Loan',
        amount: 45000,
        status: 'REJECTED',
        submittedDate: '2024-01-12',
        lastUpdated: '2024-01-17',
        rejectionReason: 'Insufficient credit score. Minimum required: 650'
      },
      {
        id: 'LA004',
        applicantName: 'Emily Wilson',
        loanType: 'Business Loan',
        amount: 125000,
        status: 'UNDER_REVIEW',
        submittedDate: '2024-01-14',
        lastUpdated: '2024-01-19'
      }
    ];
    setApplications(mockApplications);
  }, []);

  const handleApplicationSubmit = (applicationData: any) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newApplication: Application = {
        id: `LA${String(applications.length + 1).padStart(3, '0')}`,
        applicantName: `${applicationData.firstName} ${applicationData.lastName}`,
        loanType: applicationData.loanType,
        amount: Number(applicationData.loanAmount),
        status: 'PENDING',
        submittedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setApplications(prev => [...prev, newApplication]);
      setLoading(false);
      setActiveSection('applications');
      
      toast({
        title: "Application Submitted",
        description: `Your loan application #${newApplication.id} has been submitted successfully.`,
      });
    }, 2000);
  };

  const handleStatusChange = (applicationId: string, newStatus: Application['status'], reason?: string) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? {
              ...app,
              status: newStatus,
              lastUpdated: new Date().toISOString().split('T')[0],
              rejectionReason: newStatus === 'REJECTED' ? reason : undefined
            }
          : app
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Application #${applicationId} has been ${newStatus.toLowerCase()}.`,
    });
  };

  const getFilteredApplications = () => {
    let filtered = applications;
    
    // Filter by user role
    if (currentUser.role === 'APPLICANT') {
      filtered = filtered.filter(app => app.applicantName.includes(currentUser.name));
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.loanType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    return filtered;
  };

  const getStats = () => {
    const userApplications = currentUser.role === 'APPLICANT' 
      ? applications.filter(app => app.applicantName.includes(currentUser.name))
      : applications;

    return {
      totalApplications: userApplications.length,
      pendingApplications: userApplications.filter(app => app.status === 'PENDING').length,
      approvedApplications: userApplications.filter(app => app.status === 'APPROVED').length,
      rejectedApplications: userApplications.filter(app => app.status === 'REJECTED').length,
      totalAmount: userApplications.reduce((sum, app) => sum + app.amount, 0),
      totalUsers: currentUser.role === 'ADMIN' ? 156 : undefined,
      applicationsTrend: 12,
      amountTrend: 8,
      usersTrend: 5
    };
  };

  const renderApprovalActions = (application: Application) => {
    if (currentUser.role === 'APPLICANT' || application.status !== 'PENDING') return null;

    return (
      <div className="flex space-x-2 mt-3">
        <Button
          size="sm"
          onClick={() => handleStatusChange(application.id, 'APPROVED')}
          className="bg-gradient-success"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            const reason = prompt('Rejection reason:');
            if (reason) {
              handleStatusChange(application.id, 'REJECTED', reason);
            }
          }}
        >
          <XCircle className="w-3 h-3 mr-1" />
          Reject
        </Button>
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats userRole={currentUser.role} stats={getStats()} />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredApplications().slice(0, 6).map(application => (
                <div key={application.id}>
                  <StatusCard 
                    application={application} 
                    showApplicantName={currentUser.role !== 'APPLICANT'}
                  />
                  {renderApprovalActions(application)}
                </div>
              ))}
            </div>
          </div>
        );

      case 'apply':
        return (
          <div className="max-w-4xl mx-auto">
            <LoanApplicationForm 
              onSubmit={handleApplicationSubmit}
              loading={loading}
            />
          </div>
        );

      case 'applications':
      case 'pending':
      case 'all-applications':
      case 'approved':
      case 'rejected':
        return (
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Applications</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by ID, name, or loan type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Applications Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredApplications().map(application => (
                <div key={application.id}>
                  <StatusCard 
                    application={application} 
                    showApplicantName={currentUser.role !== 'APPLICANT'}
                  />
                  {renderApprovalActions(application)}
                </div>
              ))}
            </div>

            {getFilteredApplications().length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No applications found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'ALL' 
                      ? 'Try adjusting your search criteria.' 
                      : 'No applications have been submitted yet.'}
                  </p>
                  {currentUser.role === 'APPLICANT' && (
                    <Button onClick={() => setActiveSection('apply')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Apply for Loan
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'users':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>
                Manage system users and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Settings className="w-4 h-4" />
                <AlertDescription>
                  User management functionality would be implemented here for admin users.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      case 'analytics':
        return currentUser.role === 'ADMIN' ? (
          <AdminAnalytics />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics & Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <BarChart3 className="w-4 h-4" />
                <AlertDescription>
                  Access restricted to administrators only.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <DashboardLayout
      userRole={currentUser.role}
      userName={currentUser.name}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderSectionContent()}
    </DashboardLayout>
  );
};

export default LoanDashboard;