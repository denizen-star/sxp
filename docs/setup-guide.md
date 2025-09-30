# SXP Setup Guide

## 🚀 Quick Start

This guide will help you set up the SXP (Social Experiment Application) for local development.

## 📋 Prerequisites

### **Required Software**
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

### **Optional but Recommended**
- **Docker** - For containerized development
- **PostgreSQL** - For local database testing
- **Redis** - For caching and sessions

## 🛠️ Installation Steps

### **1. Clone the Repository**
```bash
# Clone the SXP repository
git clone https://github.com/YOUR_USERNAME/sxp.git
cd sxp
```

### **2. Install Dependencies**
```bash
# Install all dependencies
npm install

# Or using yarn
yarn install
```

### **3. Environment Configuration**
```bash
# Copy environment variables template
cp env.example .env.local

# Edit environment variables
nano .env.local
```

### **4. Configure Environment Variables**
Update `.env.local` with your values:

```env
# Application
REACT_APP_NAME=SXP
REACT_APP_VERSION=1.0.0
REACT_APP_DOMAIN=localhost:3000

# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_VERSION=v1

# Authentication
REACT_APP_AUTH_DOMAIN=localhost:3000
REACT_APP_AUTH_CLIENT_ID=your_auth_client_id

# SendGrid (for email functionality)
REACT_APP_SENDGRID_API_KEY=your_sendgrid_api_key
REACT_APP_SENDGRID_FROM_EMAIL=noreply@localhost

# Development
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

### **5. Start Development Server**
```bash
# Start the development server
npm start

# The application will be available at http://localhost:3000
```

## 🔧 Development Setup

### **VS Code Configuration**

Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html"
  }
}
```

### **Recommended Extensions**
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

## 🗄️ Database Setup (Optional)

### **PostgreSQL Setup**
```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb sxp_development

# Run migrations (when available)
npm run db:migrate
```

### **Redis Setup**
```bash
# Install Redis (macOS with Homebrew)
brew install redis
brew services start redis

# Test Redis connection
redis-cli ping
```

## 🧪 Testing Setup

### **Run Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### **Linting**
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix
```

## 🚀 Build and Deployment

### **Production Build**
```bash
# Create production build
npm run build

# Test production build locally
npx serve -s build
```

### **Build Analysis**
```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npx depcheck
```

## 🔍 Development Tools

### **Debugging**
- **React Developer Tools** - Browser extension
- **Redux DevTools** - For state management debugging
- **Network Tab** - For API debugging

### **Performance Monitoring**
```bash
# Install web-vitals for performance monitoring
npm install web-vitals

# Run performance audit
npm run audit
```

## 📁 Project Structure

```
sxp/
├── src/
│   ├── components/           # React components
│   │   ├── PersonaSelector/
│   │   ├── NavigationGuide/
│   │   └── ScheduleViewer/
│   ├── services/            # Business logic
│   │   ├── activityTrackingService.ts
│   │   ├── creativeSuggestionsService.ts
│   │   └── exportService.ts
│   ├── modules/             # Feature modules
│   │   ├── authentication-module/
│   │   ├── activities-module/
│   │   └── persona-module/
│   ├── design-system/       # UI components
│   ├── store/               # State management
│   ├── types/               # TypeScript types
│   └── App.tsx              # Main application
├── public/                  # Static assets
├── docs/                    # Documentation
├── package.json             # Dependencies
├── tsconfig.json           # TypeScript config
└── README.md               # Project documentation
```

## 🐛 Troubleshooting

### **Common Issues**

#### **Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm start
```

#### **Node Modules Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **TypeScript Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript
npm install typescript@latest
```

#### **Build Failures**
```bash
# Check for missing dependencies
npm ls

# Update all dependencies
npm update

# Check for security vulnerabilities
npm audit
```

### **Performance Issues**

#### **Slow Build Times**
```bash
# Use npm ci for faster installs
npm ci

# Enable build caching
npm config set cache-min 3600
```

#### **Memory Issues**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm start
```

## 📚 Additional Resources

### **Documentation**
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### **Development Best Practices**
- Follow the existing code style and patterns
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation when needed

## 🆘 Getting Help

### **Common Commands**
```bash
# Check project status
npm run status

# View available scripts
npm run

# Check for updates
npm outdated

# Security audit
npm audit
```

### **Support Channels**
- **GitHub Issues** - For bug reports and feature requests
- **Documentation** - Check the docs folder
- **Development Team** - Contact for technical support

---

**Last Updated:** December 19, 2024
**Version:** 1.0.0
