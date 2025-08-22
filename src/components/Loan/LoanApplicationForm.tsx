import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Briefcase, 
  DollarSign, 
  Upload, 
  FileText,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface LoanApplicationFormProps {
  onSubmit: (applicationData: any) => void;
  loading?: boolean;
}

const LoanApplicationForm = ({ onSubmit, loading = false }: LoanApplicationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    ssn: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Financial Information
    annualIncome: "",
    employmentStatus: "",
    employer: "",
    jobTitle: "",
    workExperience: "",
    monthlyExpenses: "",
    creditScore: "",
    
    // Loan Details
    loanType: "",
    loanAmount: "",
    loanPurpose: "",
    collateral: "",
    
    // Documents
    uploadedDocuments: [] as File[]
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        uploadedDocuments: [...prev.uploadedDocuments, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedDocuments: prev.uploadedDocuments.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ssn">SSN (Last 4 digits) *</Label>
                <Input
                  id="ssn"
                  maxLength={4}
                  value={formData.ssn}
                  onChange={(e) => updateFormData("ssn", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Select onValueChange={(value) => updateFormData("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData("zipCode", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Employment & Financial Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annualIncome">Annual Income *</Label>
                <Input
                  id="annualIncome"
                  type="number"
                  placeholder="$0"
                  value={formData.annualIncome}
                  onChange={(e) => updateFormData("annualIncome", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="employmentStatus">Employment Status *</Label>
                <Select onValueChange={(value) => updateFormData("employmentStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full-time</SelectItem>
                    <SelectItem value="PART_TIME">Part-time</SelectItem>
                    <SelectItem value="SELF_EMPLOYED">Self-employed</SelectItem>
                    <SelectItem value="UNEMPLOYED">Unemployed</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="employer">Employer *</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => updateFormData("employer", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => updateFormData("jobTitle", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="workExperience">Work Experience (years) *</Label>
                <Input
                  id="workExperience"
                  type="number"
                  value={formData.workExperience}
                  onChange={(e) => updateFormData("workExperience", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="monthlyExpenses">Monthly Expenses *</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  placeholder="$0"
                  value={formData.monthlyExpenses}
                  onChange={(e) => updateFormData("monthlyExpenses", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="creditScore">Credit Score (optional)</Label>
              <Input
                id="creditScore"
                type="number"
                placeholder="300-850"
                min="300"
                max="850"
                value={formData.creditScore}
                onChange={(e) => updateFormData("creditScore", e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Loan Details</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanType">Loan Type *</Label>
                <Select onValueChange={(value) => updateFormData("loanType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERSONAL">Personal Loan</SelectItem>
                    <SelectItem value="HOME">Home Loan</SelectItem>
                    <SelectItem value="AUTO">Auto Loan</SelectItem>
                    <SelectItem value="BUSINESS">Business Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="loanAmount">Loan Amount *</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="$0"
                  value={formData.loanAmount}
                  onChange={(e) => updateFormData("loanAmount", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="loanPurpose">Loan Purpose *</Label>
              <Textarea
                id="loanPurpose"
                placeholder="Describe the purpose of this loan..."
                value={formData.loanPurpose}
                onChange={(e) => updateFormData("loanPurpose", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="collateral">Collateral (if any)</Label>
              <Textarea
                id="collateral"
                placeholder="Describe any collateral you're offering..."
                value={formData.collateral}
                onChange={(e) => updateFormData("collateral", e.target.value)}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Document Upload</h3>
            </div>
            
            <Alert>
              <FileText className="w-4 h-4" />
              <AlertDescription>
                Please upload the required documents. Accepted formats: PDF, JPG, PNG (max 5MB each)
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="documents">Upload Documents *</Label>
                <Input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="cursor-pointer"
                />
              </div>
              
              {formData.uploadedDocuments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Uploaded Files:</h4>
                  {formData.uploadedDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Required Documents:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Proof of Identity (Driver's License, Passport)</li>
                <li>• Proof of Income (Pay stubs, Tax returns)</li>
                <li>• Bank Statements (Last 3 months)</li>
                <li>• Employment Verification Letter</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Loan Application</span>
        </CardTitle>
        <CardDescription>
          Step {currentStep} of {totalSteps}: Complete all sections to submit your application
        </CardDescription>
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          
          <div className="flex justify-between pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next Step
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-primary"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoanApplicationForm;