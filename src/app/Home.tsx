import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { 
  FileText, 
  BarChart3, 
  Calculator, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Submit Loan Application',
      description: 'Start your loan application process',
      icon: FileText,
      path: '/user-details',
      color: 'bg-blue-500',
      availableFor: ['APPLICANT']
    },
    {
      title: 'Track Application Status',
      description: 'Monitor your loan application progress',
      icon: Clock,
      path: '/status-tracker',
      color: 'bg-green-500',
      availableFor: ['APPLICANT']
    },
    {
      title: 'My Dashboard',
      description: 'View your applications and statistics',
      icon: BarChart3,
      path: '/applicant-dashboard',
      color: 'bg-purple-500',
      availableFor: ['APPLICANT']
    },
    {
      title: 'Admin Dashboard',
      description: 'Manage system and view analytics',
      icon: TrendingUp,
      path: '/admin/dashboard',
      color: 'bg-orange-500',
      availableFor: ['ADMIN']
    },
    {
      title: 'Loan Calculator',
      description: 'Calculate EMI and loan details',
      icon: Calculator,
      path: '/calculator',
      color: 'bg-indigo-500',
      availableFor: ['APPLICANT', 'AGENT', 'ADMIN']
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-grade security for your financial data'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Quick loan approval and disbursement'
    },
    {
      icon: CheckCircle,
      title: 'Transparent Process',
      description: 'Clear terms and no hidden charges'
    }
  ];

  const stats = [
    { label: 'Total Applications', value: '156', change: '+12%', changeType: 'positive' },
    { label: 'Approval Rate', value: '62.8%', change: '+5.2%', changeType: 'positive' },
    { label: 'Average Processing Time', value: '2.3 days', change: '-0.5 days', changeType: 'positive' },
    { label: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', changeType: 'positive' }
  ];

  const availableActions = quickActions.filter(action => 
    !action.availableFor || action.availableFor.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">LoanWise</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Your trusted partner for financial solutions. Get the loan you need with 
              competitive rates and personalized support.
            </p>
            {user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {availableActions.slice(0, 2).map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      to={action.path}
                      className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{action.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {user && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access the tools and features you need based on your role
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LoanWise?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive financial solutions with the best customer experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Performance</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Track our success metrics and commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 mb-2">{stat.label}</div>
                <div className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers who trust LoanWise for their financial needs
          </p>
          {!user ? (
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              to={user.role === 'APPLICANT' ? '/user-details' : user.role === 'AGENT' ? '/calculator' : '/admin/dashboard'}
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
