import { useState } from "react";
import LoginForm from "@/components/Auth/LoginForm";
import LoanDashboard from "@/pages/LoanDashboard";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'APPLICANT' | 'AGENT' | 'ADMIN';
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const { toast } = useToast();

  const handleLogin = (email: string, password: string, role: string) => {
    setLoginLoading(true);
    setLoginError("");

    // Simulate API authentication
    setTimeout(() => {
      // Demo credentials validation
      const validCredentials = {
        "applicant@demo.com": { name: "John Smith", role: "APPLICANT" as const },
        "agent@demo.com": { name: "Sarah Wilson", role: "AGENT" as const },
        "admin@demo.com": { name: "Admin User", role: "ADMIN" as const }
      };

      const userInfo = validCredentials[email as keyof typeof validCredentials];
      
      if (userInfo && password === "demo123") {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: userInfo.name,
          role: userInfo.role
        };
        
        setCurrentUser(user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
      } else {
        setLoginError("Invalid email or password. Use demo credentials.");
      }
      
      setLoginLoading(false);
    }, 1500);
  };

  // Show login form if no user is authenticated
  if (!currentUser) {
    return (
      <LoginForm
        onLogin={handleLogin}
        loading={loginLoading}
        error={loginError}
      />
    );
  }

  // Show dashboard for authenticated user
  return <LoanDashboard currentUser={currentUser} />;
};

export default Index;
