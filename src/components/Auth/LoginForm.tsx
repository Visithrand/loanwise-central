import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onLogin: (email: string, password: string, role: string) => void;
  loading?: boolean;
  error?: string;
}

const LoginForm = ({ onLogin, loading = false, error }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("APPLICANT");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password, selectedRole);
  };

  // Demo credentials for each role
  const demoCredentials = {
    APPLICANT: { email: "applicant@demo.com", password: "demo123" },
    AGENT: { email: "agent@demo.com", password: "demo123" },
    ADMIN: { email: "admin@demo.com", password: "demo123" }
  };

  const fillDemoCredentials = (role: string) => {
    const credentials = demoCredentials[role as keyof typeof demoCredentials];
    setEmail(credentials.email);
    setPassword(credentials.password);
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-dashboard">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Loan Management System</CardTitle>
            <CardDescription>
              Sign in to access your loan dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Demo Role Selector */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Demo Login As:</Label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(demoCredentials).map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => fillDemoCredentials(role)}
                  className="text-xs"
                >
                  {role.charAt(0) + role.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" className="text-sm text-muted-foreground">
              Forgot your password?
            </Button>
          </div>

          {/* Demo Info */}
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground text-center">
              This is a demo system. Click any role button above to auto-fill credentials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;