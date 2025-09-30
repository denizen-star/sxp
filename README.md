# SXP - Social Experiment Application

**Professional Networking and Relationship Engineering Platform**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-development-orange.svg)

## Overview

SXP (Social Experiment Application) is a sophisticated React-based platform designed for professional networking and relationship engineering. It uses proprietary data and persona-matching technology to eliminate the guesswork from networking by gathering user data, assigning predictive personas, and curating events and co-working arrangements designed to ensure you connect with the exact people you need to meet for mutual benefit and maximum professional impact.

## Features

### 🎯 **Persona-Based Matching**
- Advanced persona profiling and indexing
- Predictive persona assignment using ML algorithms
- Dynamic persona matching for optimal professional connections

### 🤝 **Professional Networking Engine**
- Intelligent matching algorithm for mutual benefit scoring
- Context-aware event curation and space management
- Real-time networking recommendations

### 📊 **Engagement Tracking & Analytics**
- Comprehensive relationship tracking and analysis
- Performance metrics for networking success
- Continuous ML model optimization based on engagement data

### 🔐 **Secure Authentication & User Management**
- Magic URL connectivity and email/password authentication
- Robust user profile management and data ingestion
- Privacy-compliant data handling and storage

## Technology Stack

- **Frontend**: React 19+ with TypeScript
- **UI Framework**: Material-UI (MUI) v7
- **State Management**: Zustand
- **Routing**: React Router v6
- **Styling**: Emotion (CSS-in-JS)
- **Charts**: Built-in analytics components
- **Export**: HTML2Canvas, jsPDF

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git configured

### Installation

```bash
# Clone the repository
git clone <your-sxp-repo-url>
cd sxp

# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Edit environment variables (optional for development)
nano .env.local

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

### Production Deployment

**Live Application:** https://sxp.kervinapps.com

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📚 Documentation

Comprehensive documentation is available in the [docs](./docs/) folder:

- **[Project Overview](./docs/project-overview.md)** - Complete project overview and architecture
- **[SXP Modules](./docs/sxp-modules.md)** - Detailed module architecture and specifications
- **[Development Status](./docs/development-status.md)** - Current development status and roadmap
- **[API Documentation](./docs/api-documentation.md)** - API endpoints and integration guides
- **[Setup Guide](./docs/setup-guide.md)** - Local development setup instructions
- **[Deployment Guide](./docs/deployment-guide.md)** - Production deployment instructions
- **[Contributing Guide](./docs/contributing-guide.md)** - How to contribute to SXP development
- **[User Guide](./docs/user-guide.md)** - End-user documentation and features
- **[FAQ](./docs/faq.md)** - Frequently asked questions

### Building for Production

```bash
# Create production build
npm run build

# The build folder will contain optimized production files
```

## Project Structure

```
src/
├── components/           # React components
│   ├── PersonaSelector/
│   ├── ScheduleViewer/
│   └── NavigationGuide/
├── services/            # Business logic and API services
│   ├── activityTrackingService.ts
│   ├── creativeSuggestionsService.ts
│   └── exportService.ts
├── store/               # State management
│   └── useStore.ts
├── types/               # TypeScript type definitions
├── modules/             # Feature modules
│   ├── activities-module/
│   ├── authentication-module/
│   └── persona-module/
├── design-system/       # Design system components
└── App.tsx              # Main application component
```

## Usage

### 1. **Complete Your Profile**
Provide comprehensive professional data through our onboarding funnel to build your persona index.

### 2. **Get Matched**
Our ML engine analyzes your persona and matches you with professionals who offer mutual benefit opportunities.

### 3. **Attend Curated Events**
Participate in carefully curated events and co-working arrangements designed for maximum professional impact.

### 4. **Track & Optimize**
Monitor your networking success and let our system continuously optimize your matches based on engagement data.

## Configuration

The application supports various configuration options through:
- Persona modules in `src/modules/persona-module/`
- Activity data in `src/modules/activities-module/`
- Service configurations in `src/services/`

## Development

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (use with caution)

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For support and questions, please contact the development team.

---

**Built with ❤️ for professional networking and relationship engineering**
