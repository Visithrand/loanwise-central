import React, { useState } from 'react';
import { apiService, AuthRequest, LoginRequest } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { toast } from 'sonner';

export const ApiTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authData, setAuthData] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const request: AuthRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'APPLICANT',
      };
      
      const response = await apiService.register(request);
      setAuthData(response);
      toast.success('Registration successful!');
      console.log('Registration response:', response);
    } catch (error) {
      toast.error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const request: LoginRequest = {
        username: formData.username,
        password: formData.password,
      };
      
      const response = await apiService.login(request);
      setAuthData(response);
      toast.success('Login successful!');
      console.log('Login response:', response);
    } catch (error) {
      toast.error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentUser = async () => {
    setIsLoading(true);
    try {
      const user = await apiService.getCurrentUser();
      toast.success('User data retrieved!');
      console.log('Current user:', user);
    } catch (error) {
      toast.error(`Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Get user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setAuthData(null);
    toast.success('Logged out successfully!');
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleRegister} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
            
            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          
          {apiService.isAuthenticated() && (
            <div className="space-y-2">
              <Button 
                onClick={handleGetCurrentUser} 
                disabled={isLoading}
                variant="secondary"
                className="w-full"
              >
                {isLoading ? 'Loading...' : 'Get Current User'}
              </Button>
              
              <Button 
                onClick={handleLogout} 
                variant="destructive"
                className="w-full"
              >
                Logout
              </Button>
            </div>
          )}
          
          {authData && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Auth Data:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(authData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
