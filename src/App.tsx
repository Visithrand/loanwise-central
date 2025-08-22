import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/authContext';
import { ThemeProvider } from './lib/themeContext';
import { initializeStorage } from './lib/storage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './app/Login';
import Home from './app/Home';
import UserDetails from './app/UserDetails';
import ApplicantDashboard from './app/ApplicantDashboard';
import AdminDashboard from './app/AdminDashboard';
import StatusTracker from './app/StatusTracker';
import Calculator from './app/Calculator';
import './styles/global.css';
import './styles/themes.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Main App Layout
const AppLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {user && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          
          {/* Protected Routes - Applicant */}
          <Route 
            path="/user-details" 
            element={
              <ProtectedRoute allowedRoles={['APPLICANT']}>
                <UserDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applicant-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['APPLICANT']}>
                <ApplicantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/status-tracker" 
            element={
              <ProtectedRoute allowedRoles={['APPLICANT']}>
                <StatusTracker />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/status-tracker/:id" 
            element={
              <ProtectedRoute allowedRoles={['APPLICANT']}>
                <StatusTracker />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - All Authenticated Users */}
          <Route 
            path="/calculator" 
            element={
              <ProtectedRoute>
                <Calculator />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes */}
          <Route path="/about" element={
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">About LoanWise</h1>
                <p className="text-gray-600">
                  Your trusted partner for financial solutions. We provide comprehensive loan services 
                  with competitive rates and personalized support to help you achieve your financial goals.
                </p>
              </div>
            </div>
          } />
          
          <Route path="/contact" element={
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-gray-600">
                  Get in touch with our team for any questions or support.
                </p>
              </div>
            </div>
          } />
          
          <Route path="/privacy" element={
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600">
                  Learn about how we protect your personal information.
                </p>
              </div>
            </div>
          } />
          
          <Route path="/help" element={
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Center</h1>
                <p className="text-gray-600">
                  Find answers to frequently asked questions and get support.
                </p>
              </div>
            </div>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-600">
                  The page you're looking for doesn't exist.
                </p>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
