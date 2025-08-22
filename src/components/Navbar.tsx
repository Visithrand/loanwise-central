import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { useTheme } from '../lib/themeContext';
import { 
  Home, 
  User, 
  CreditCard, 
  Calculator, 
  Building, 
  BarChart3, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Palette, 
  LogOut,
  FileText,
  Eye
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5" />;
      case 'dark':
        return <Moon className="w-5 h-5" />;
      case 'gradient':
        return <Palette className="w-5 h-5" />;
      default:
        return <Sun className="w-5 h-5" />;
    }
  };

  const navigationItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Submit Application', path: '/user-details', icon: FileText },
    { name: 'My Dashboard', path: '/applicant-dashboard', icon: BarChart3 },
    { name: 'Track Status', path: '/status-tracker', icon: Eye },
    { name: 'Loan Calculator', path: '/calculator', icon: Calculator },
  ];

  const adminItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'Loan Calculator', path: '/calculator', icon: Calculator },
  ];

  const agentItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Loan Calculator', path: '/calculator', icon: Calculator },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900 gradient-text">LoanWise</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                {user.role === 'APPLICANT' && (
                  <>
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    {adminItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </>
                )}

                {user.role === 'AGENT' && (
                  <>
                    {agentItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>

          {/* Right side - User info and theme toggle */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              title={`Current theme: ${theme}`}
            >
              {getThemeIcon()}
            </button>

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && (
              <>
                {user.role === 'APPLICANT' && (
                  <>
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    {adminItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </>
                )}

                {user.role === 'AGENT' && (
                  <>
                    {agentItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                            isActive(item.path)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
