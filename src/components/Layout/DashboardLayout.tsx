import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Home,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'APPLICANT' | 'AGENT' | 'ADMIN';
  userName: string;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DashboardLayout = ({ 
  children, 
  userRole, 
  userName, 
  activeSection, 
  onSectionChange 
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', icon: Home, label: 'Dashboard' },
    ];

    switch (userRole) {
      case 'APPLICANT':
        return [
          ...baseItems,
          { id: 'apply', icon: FileText, label: 'Apply for Loan' },
          { id: 'applications', icon: CreditCard, label: 'My Applications' },
          { id: 'status', icon: Clock, label: 'Application Status' },
        ];
      case 'AGENT':
        return [
          ...baseItems,
          { id: 'pending', icon: Clock, label: 'Pending Applications' },
          { id: 'review', icon: FileText, label: 'Under Review' },
          { id: 'completed', icon: CheckCircle, label: 'Completed' },
        ];
      case 'ADMIN':
        return [
          ...baseItems,
          { id: 'all-applications', icon: FileText, label: 'All Applications' },
          { id: 'approved', icon: CheckCircle, label: 'Approved' },
          { id: 'rejected', icon: XCircle, label: 'Rejected Bin' },
          { id: 'users', icon: Users, label: 'User Management' },
          { id: 'loan-types', icon: Settings, label: 'Loan Configuration' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">LoanSystem</h1>
                <p className="text-xs text-sidebar-foreground/70">{userRole}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start space-x-3 text-sidebar-foreground hover:bg-sidebar-accent",
                    activeSection === item.id && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">{userName}</p>
                <p className="text-xs text-sidebar-foreground/70">{userRole.toLowerCase()}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start space-x-2 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => window.location.reload()}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {userName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;