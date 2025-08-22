# 🏦 LoanWise - Frontend Loan Management System

A complete, modern React-based frontend for a loan application and approval system with role-based access control, multi-step forms, and comprehensive dashboards.

## ✨ Features

### 🔐 Authentication & User Management
- **Role-based Login System**: Applicant, Agent, and Admin roles
- **Demo Credentials**: Pre-configured test accounts for all roles
- **Session Management**: Persistent login state with localStorage
- **Error Handling**: User-friendly error messages and validation

### 📝 Loan Application System
- **Multi-step Application Form**: 
  - User Details (Personal Information)
  - Account Details (Loan Type, Amount, Purpose)
  - EMI Details (Payment Terms)
  - Net Worth & Properties (Financial Assessment)
- **Real-time Validation**: Form validation with immediate feedback
- **Progress Tracking**: Visual progress indicators

### 🎯 Role-Based Dashboards

#### 👤 Applicant Dashboard
- Submit new loan applications
- Track application status in real-time
- View application history
- Access to loan calculator

#### 👨‍💼 Agent Dashboard
- Review pending applications
- Add review notes and recommendations
- Approve/reject applications with reasons
- Search and filter applications

#### 👨‍💻 Admin Dashboard
- Comprehensive system overview
- Analytics and reporting
- Manage all applications
- System configuration

### 🎨 UI/UX Features
- **Multiple Themes**: Light, Dark, and Gradient themes
- **Responsive Design**: Mobile-first, fully responsive layout
- **Modern Components**: Card-based layouts with smooth animations
- **Theme Switcher**: Easy theme switching with persistent storage
- **Professional Styling**: Clean, modern interface with Tailwind CSS

### 📊 Analytics & Reporting
- **Loan Statistics**: Approval rates, processing times
- **Performance Metrics**: Visual charts and graphs
- **Real-time Updates**: Live status tracking
- **Export Capabilities**: Data export functionality

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom CSS
- **Routing**: React Router v6
- **State Management**: React Context API + Hooks
- **Icons**: Lucide React
- **Charts**: Recharts
- **Storage**: localStorage (Mock Backend)

## 📁 Project Structure

```
src/
├── app/                    # Main application pages
│   ├── Login.tsx         # Authentication page
│   ├── Home.tsx          # Landing page
│   └── ...               # Other page components
├── components/            # Reusable UI components
│   ├── Navbar.tsx        # Navigation component
│   ├── Footer.tsx        # Footer component
│   └── ...               # Other components
├── lib/                   # Core utilities and data
│   ├── types.ts          # TypeScript interfaces
│   ├── mockData.ts       # Sample data and constants
│   ├── storage.ts        # localStorage utilities
│   ├── authContext.tsx   # Authentication context
│   └── themeContext.tsx  # Theme management context
└── styles/                # Global styles and themes
    ├── global.css        # Base styles and utilities
    └── themes.css        # Theme-specific styles
```

## 🎯 Demo Credentials

### 👤 Applicant Account
- **Email**: `applicant@test.com`
- **Password**: `1234`
- **Access**: Submit applications, track status

### 👨‍💼 Agent Account
- **Email**: `agent@test.com`
- **Password**: `1234`
- **Access**: Review applications, approve/reject

### 👨‍💻 Admin Account
- **Email**: `admin@test.com`
- **Password**: `1234`
- **Access**: Full system access, analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd loanwise-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:8081`
   - Use demo credentials to login

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Environment Variables
- **Port**: Configured to run on port 8081
- **Theme**: Default theme is 'light', saved in localStorage
- **Mock Data**: Automatically initialized on first load

### Customization
- **Themes**: Modify `src/styles/themes.css` for custom themes
- **Mock Data**: Update `src/lib/mockData.ts` for sample data
- **Styling**: Customize `src/styles/global.css` for global styles

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Responsive design with Tailwind CSS
- **Touch Friendly**: Optimized for touch interactions
- **Cross Browser**: Compatible with modern browsers

## 🎨 Theme System

### Available Themes
1. **Light Theme**: Clean, minimal design with blue accents
2. **Dark Theme**: Sleek dark mode with light text
3. **Gradient Theme**: Modern gradient backgrounds with glass effects

### Theme Features
- **Persistent Storage**: Theme preference saved in localStorage
- **Dynamic Switching**: Instant theme changes without page reload
- **Customizable**: Easy to add new themes
- **CSS Variables**: Theme-specific color schemes

## 🔒 Security Features

- **Role-based Access Control**: Different permissions per user role
- **Protected Routes**: Authentication required for sensitive pages
- **Input Validation**: Form validation and sanitization
- **Session Management**: Secure user session handling

## 📊 Data Management

### Mock Data Structure
- **Users**: Sample user accounts with different roles
- **Loan Applications**: Sample applications with various statuses
- **Statistics**: Performance metrics and analytics data

### Storage
- **localStorage**: Client-side data persistence
- **Auto-initialization**: Demo data loaded on first visit
- **Data Persistence**: User preferences and session data

## 🧪 Testing

### Manual Testing
- **Login Flow**: Test all demo accounts
- **Navigation**: Verify role-based navigation
- **Forms**: Test multi-step application forms
- **Themes**: Test theme switching functionality

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

## 🚀 Performance Features

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Production-optimized builds
- **Efficient Rendering**: React 18 concurrent features

## 🔮 Future Enhancements

### Planned Features
- **Real Backend Integration**: Replace mock data with actual API calls
- **Advanced Analytics**: More detailed reporting and charts
- **Document Upload**: File upload and management
- **Notifications**: Real-time notifications system
- **Multi-language Support**: Internationalization

### Technical Improvements
- **State Management**: Redux or Zustand for complex state
- **Testing**: Jest and React Testing Library
- **PWA**: Progressive Web App capabilities
- **Performance Monitoring**: Analytics and error tracking

## 🤝 Contributing

### Development Guidelines
- **Code Style**: Follow TypeScript best practices
- **Component Structure**: Use functional components with hooks
- **Styling**: Prefer Tailwind CSS classes
- **Testing**: Write tests for new features

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Strict type checking
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
1. **Port Conflicts**: Ensure port 8081 is available
2. **Dependencies**: Use `--legacy-peer-deps` for installation
3. **Build Errors**: Check TypeScript configuration
4. **Theme Issues**: Clear localStorage if themes don't work

### Getting Help
- Check the console for error messages
- Verify all dependencies are installed
- Ensure Node.js version is 16+
- Clear browser cache if needed

## 🎉 Conclusion

LoanWise provides a comprehensive, production-ready frontend for loan management systems. With its modern architecture, responsive design, and role-based access control, it serves as an excellent foundation for financial applications.

The system demonstrates best practices in React development, TypeScript usage, and modern web application design, making it suitable for both learning and production use.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**