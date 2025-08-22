import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from "lucide-react";

interface AnalyticsData {
  applicationVolume: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  approvalRate: {
    approved: number;
    total: number;
    percentage: number;
  };
  agentPerformance: Array<{
    name: string;
    processed: number;
    approvalRate: number;
  }>;
  loanTypeBreakdown: Array<{
    type: string;
    count: number;
    totalAmount: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    applications: number;
    approved: number;
  }>;
}

interface AdminAnalyticsProps {
  data?: AnalyticsData;
}

const AdminAnalytics = ({ data }: AdminAnalyticsProps) => {
  // Mock data for demo
  const mockData: AnalyticsData = {
    applicationVolume: {
      thisMonth: 127,
      lastMonth: 98,
      growth: 29.6
    },
    approvalRate: {
      approved: 89,
      total: 127,
      percentage: 70.1
    },
    agentPerformance: [
      { name: "Sarah Wilson", processed: 45, approvalRate: 73.3 },
      { name: "Mike Johnson", processed: 38, approvalRate: 68.4 },
      { name: "Emily Davis", processed: 32, approvalRate: 75.0 },
      { name: "James Brown", processed: 28, approvalRate: 64.3 }
    ],
    loanTypeBreakdown: [
      { type: "Personal Loan", count: 58, totalAmount: 1450000 },
      { type: "Home Loan", count: 34, totalAmount: 11900000 },
      { type: "Auto Loan", count: 22, totalAmount: 990000 },
      { type: "Business Loan", count: 13, totalAmount: 1625000 }
    ],
    monthlyTrends: [
      { month: "Jan", applications: 89, approved: 62 },
      { month: "Feb", applications: 94, approved: 66 },
      { month: "Mar", applications: 102, approved: 71 },
      { month: "Apr", applications: 98, approved: 68 },
      { month: "May", applications: 115, approved: 81 },
      { month: "Jun", applications: 127, approved: 89 }
    ]
  };

  const analytics = data || mockData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Application Volume */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications This Month</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.applicationVolume.thisMonth}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {analytics.applicationVolume.growth > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+{analytics.applicationVolume.growth}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">{analytics.applicationVolume.growth}%</span>
                </>
              )}
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Approval Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.approvalRate.percentage}%</div>
            <div className="text-xs text-muted-foreground">
              {analytics.approvalRate.approved} of {analytics.approvalRate.total} applications
            </div>
            <Progress value={analytics.approvalRate.percentage} className="mt-2" />
          </CardContent>
        </Card>

        {/* Total Loan Amount */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loan Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.loanTypeBreakdown.reduce((sum, loan) => sum + loan.totalAmount, 0))}
            </div>
            <div className="text-xs text-muted-foreground">
              Across {analytics.loanTypeBreakdown.reduce((sum, loan) => sum + loan.count, 0)} applications
            </div>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.agentPerformance.length}</div>
            <div className="text-xs text-muted-foreground">
              Processing applications
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Agent Performance</span>
          </CardTitle>
          <CardDescription>Individual agent statistics for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.agentPerformance.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">{agent.processed} applications processed</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={agent.approvalRate > 70 ? "default" : "secondary"}>
                    {agent.approvalRate}% approval rate
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loan Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Loan Type Breakdown</span>
          </CardTitle>
          <CardDescription>Distribution by loan type this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.loanTypeBreakdown.map((loan, index) => {
              const percentage = (loan.count / analytics.loanTypeBreakdown.reduce((sum, l) => sum + l.count, 0)) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{loan.type}</span>
                    <div className="text-right">
                      <div className="font-medium">{loan.count} applications</div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(loan.totalAmount)}</div>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total applications</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Monthly Trends</span>
          </CardTitle>
          <CardDescription>Application and approval trends over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.monthlyTrends.map((trend, index) => {
              const approvalRate = (trend.approved / trend.applications) * 100;
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="font-medium w-12">{trend.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{trend.applications} applications</span>
                      <span>{trend.approved} approved ({approvalRate.toFixed(1)}%)</span>
                    </div>
                    <Progress value={approvalRate} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;