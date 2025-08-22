import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Calculator, 
  Shield, 
  HelpCircle, 
  FileText 
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', path: '/about', icon: FileText },
    { name: 'Contact', path: '/contact', icon: Mail },
    { name: 'Privacy Policy', path: '/privacy', icon: Shield },
    { name: 'Help Center', path: '/help', icon: HelpCircle },
    { name: 'Loan Calculator', path: '/calculator', icon: Calculator },
  ];

  const contactInfo = [
    { icon: Phone, text: '+1 (555) 123-4567', link: 'tel:+15551234567' },
    { icon: Mail, text: 'support@loanwise.com', link: 'mailto:support@loanwise.com' },
    { icon: MapPin, text: '123 Finance Street, NY 10001', link: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold gradient-text">LoanWise</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner for financial solutions. We provide comprehensive loan 
              services with competitive rates and personalized support to help you achieve 
              your financial goals.
            </p>
            <div className="flex space-x-4">
              {contactInfo.map((contact, index) => (
                <a
                  key={index}
                  href={contact.link}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <contact.icon className="w-4 h-4" />
                  <span className="text-sm">{contact.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="text-sm">Personal Loans</li>
              <li className="text-sm">Home Loans</li>
              <li className="text-sm">Car Loans</li>
              <li className="text-sm">Business Loans</li>
              <li className="text-sm">Education Loans</li>
              <li className="text-sm">Loan Refinancing</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} LoanWise. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for better financial future</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
