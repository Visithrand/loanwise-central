import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  DollarSign,
  AlertCircle
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  gradient?: string;
}

const StatCard = ({ title, value, change, icon: Icon, trend = 'neutral', gradient }: StatCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${gradient || 'bg-primary/10'}`}>
          <Icon className={`w-4 h-4 ${gradient ? 'text-white' : 'text-primary'}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {change !== undefined && (
              <div className={`flex items-center text-xs ${getTrendColor()}`}>
                {TrendIcon && <TrendIcon className="w-3 h-3 mr-1" />}
                <span>{Math.abs(change)}% from last month</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  userRole: 'APPLICANT' | 'AGENT' | 'ADMIN';
  stats: {
    totalApplications?: number;
    pendingApplications?: number;
    approvedApplications?: number;
    rejectedApplications?: number;
    totalAmount?: number;
    totalUsers?: number;
    applicationsTrend?: number;
    amountTrend?: number;
    usersTrend?: number;
  };
}

const DashboardStats = ({ userRole, stats }: DashboardStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const getStatsForRole = () => {
    switch (userRole) {
      case 'APPLICANT':
        return [
          {
            title: "My Applications",
            value: stats.totalApplications || 0,
            icon: FileText,
            change: stats.applicationsTrend,
            trend: (stats.applicationsTrend && stats.applicationsTrend > 0 ? 'up' : 'down') as 'up' | 'down',
            gradient: 'bg-gradient-primary'
          },
          {
            title: "Pending Review",
            value: stats.pendingApplications || 0,
            icon: Clock,
            gradient: 'bg-gradient-warning'
          },
          {
            title: "Approved",
            value: stats.approvedApplications || 0,
            icon: CheckCircle,
            gradient: 'bg-gradient-success'
          },
          {
            title: "Total Requested",
            value: formatCurrency(stats.totalAmount || 0),
            icon: DollarSign,
            change: stats.amountTrend,
            trend: (stats.amountTrend && stats.amountTrend > 0 ? 'up' : 'down') as 'up' | 'down',
            gradient: 'bg-gradient-info'
          }
        ];

      case 'AGENT':
        return [
          {
            title: "Pending Reviews",
            value: stats.pendingApplications || 0,
            icon: Clock,
            change: stats.applicationsTrend,
            trend: (stats.applicationsTrend && stats.applicationsTrend > 0 ? 'up' : 'down') as 'up' | 'down',
            gradient: 'bg-gradient-warning'
          },
          {
            title: "Under Review",
            value: stats.totalApplications || 0,
            icon: AlertCircle,
            gradient: 'bg-gradient-info'
          },
          {
            title: "Completed",
            value: stats.approvedApplications || 0,
            icon: CheckCircle,
            gradient: 'bg-gradient-success'
          },
          {
            title: "Total Value",
            value: formatCurrency(stats.totalAmount || 0),
            icon: DollarSign,
            change: stats.amountTrend,
            trend: (stats.amountTrend && stats.amountTrend > 0 ? 'up' : 'down') as 'up' | 'down',
            gradient: 'bg-gradient-primary'
          }
        ];

      case 'ADMIN':
        return [
          {
            title: "Total Applications",
            value: stats.totalApplications || 0,
            icon: FileText,
            change: stats.applicationsTrend,
            trend: (stats.applicationsTrend && stats.applicationsTrend > 0 ? 'up' : 'down') as 'up' | 'down',
            gradient: 'bg-gradient-primary'
          },
          {
            title: "Total Users",
            value: stats.totalUsers || 0,
            icon: Users,
            change: stats.usersTrend,
            trend: (stats.usersTrend && stats.usersTrend > 0 ? 'up' : 'down') as 'up' | 'down',
            gradient: 'bg-gradient-info'
          },
          {
            title: "Approved",
            value: stats.approvedApplications || 0,
            icon: CheckCircle,
            gradient: 'bg-gradient-success'
          },
          {
            title: "Total Loan Value",
            value: formatCurrency(stats.totalAmount || 0),
            icon: DollarSign,
            change: stats.amountTrend,
            trend: (stats.amountTrend && stats.amountTrend > 0 ? 'up' : 'down') as 'up' | 'down',
            gradient: 'bg-gradient-success'
          }
        ];

      default:
        return [];
    }
  };

  const statsCards = getStatsForRole();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;