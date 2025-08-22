import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  FileText,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface StatusCardProps {
  application: Application;
  onViewDetails?: (id: string) => void;
  showApplicantName?: boolean;
}

const StatusCard = ({ application, onViewDetails, showApplicantName = false }: StatusCardProps) => {
  const getStatusConfig = (status: Application['status']) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          color: 'warning',
          bg: 'bg-warning/10',
          text: 'text-warning',
          label: 'Pending Review'
        };
      case 'UNDER_REVIEW':
        return {
          icon: AlertCircle,
          color: 'info',
          bg: 'bg-info/10',
          text: 'text-info',
          label: 'Under Review'
        };
      case 'APPROVED':
        return {
          icon: CheckCircle,
          color: 'success',
          bg: 'bg-success/10',
          text: 'text-success',
          label: 'Approved'
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          color: 'destructive',
          bg: 'bg-destructive/10',
          text: 'text-destructive',
          label: 'Rejected'
        };
      default:
        return {
          icon: Clock,
          color: 'muted',
          bg: 'bg-muted/10',
          text: 'text-muted-foreground',
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="shadow-card hover:shadow-dashboard transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">
              Application #{application.id}
            </CardTitle>
            {showApplicantName && (
              <p className="text-sm text-muted-foreground">{application.applicantName}</p>
            )}
          </div>
          <Badge 
            variant="secondary" 
            className={cn(
              statusConfig.bg,
              statusConfig.text,
              "border-0"
            )}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Loan Type</p>
            <p className="font-medium">{application.loanType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-medium">{formatCurrency(application.amount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Submitted</p>
              <p className="font-medium">{formatDate(application.submittedDate)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p className="font-medium">{formatDate(application.lastUpdated)}</p>
            </div>
          </div>
        </div>

        {application.status === 'REJECTED' && application.rejectionReason && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
            <p className="text-xs font-medium text-destructive mb-1">Rejection Reason:</p>
            <p className="text-xs text-destructive/80">{application.rejectionReason}</p>
          </div>
        )}

        {onViewDetails && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(application.id)}
              className="w-full"
            >
              <Eye className="w-3 h-3 mr-2" />
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCard;