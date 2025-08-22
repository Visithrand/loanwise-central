import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';
import { authenticateUser, setCurrentUser, getCurrentUser, logoutUser } from './storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const authenticatedUser = authenticateUser(email, password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        setCurrentUser(authenticatedUser);
        return { success: true, message: 'Login successful' };
      } else {
        return { 
          success: false, 
          message: 'Invalid email or password. Use demo credentials.' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'An error occurred during login. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    logoutUser();
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
