/**
 * Setup Guide Page
 */

import React from 'react';
import DocumentationViewer from '../DocumentationViewer/DocumentationViewer';

const SetupGuide: React.FC = () => {
  const content = `
    <h1>Setup Guide</h1>
    
    <h2>System Requirements</h2>
    <p>Before installing SXP, ensure your system meets the following requirements:</p>
    
    <h3>Minimum Requirements</h3>
    <ul>
      <li><strong>Operating System:</strong> Windows 10, macOS 10.14, or Linux Ubuntu 18.04+</li>
      <li><strong>Memory:</strong> 4GB RAM (8GB recommended)</li>
      <li><strong>Storage:</strong> 2GB free disk space</li>
      <li><strong>Browser:</strong> Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+</li>
      <li><strong>Internet:</strong> Stable broadband connection</li>
    </ul>
    
    <h3>Recommended Requirements</h3>
    <ul>
      <li><strong>Memory:</strong> 8GB RAM or more</li>
      <li><strong>Storage:</strong> 5GB free disk space</li>
      <li><strong>Display:</strong> 1920x1080 resolution or higher</li>
      <li><strong>Network:</strong> High-speed internet connection</li>
    </ul>
    
    <h2>Installation Methods</h2>
    
    <h3>Method 1: Web Application (Recommended)</h3>
    <ol>
      <li>Open your web browser</li>
      <li>Navigate to <code>https://sxp.app</code></li>
      <li>Click "Get Started" or "Sign Up"</li>
      <li>Follow the on-screen registration process</li>
      <li>Verify your email address</li>
      <li>Complete your profile setup</li>
    </ol>
    
    <h3>Method 2: Local Development Setup</h3>
    <p>For developers who want to run SXP locally:</p>
    <ol>
      <li>Clone the repository:
        <pre>git clone https://github.com/your-repo/sxp.git
cd sxp</pre>
      </li>
      <li>Install dependencies:
        <pre>npm install</pre>
      </li>
      <li>Set up environment variables:
        <pre>cp env.example .env
# Edit .env with your configuration</pre>
      </li>
      <li>Start the development server:
        <pre>npm start</pre>
      </li>
    </ol>
    
    <h2>Configuration</h2>
    
    <h3>Environment Variables</h3>
    <p>Create a <code>.env</code> file in your project root with the following variables:</p>
    <pre># Database Configuration
DATABASE_URL=your_database_url
DATABASE_PASSWORD=your_password

# Authentication
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# API Configuration
API_BASE_URL=https://api.sxp.com
API_VERSION=v1</pre>
    
    <h3>Database Setup</h3>
    <ol>
      <li>Install PostgreSQL 12+ or MySQL 8+</li>
      <li>Create a new database for SXP</li>
      <li>Update the DATABASE_URL in your .env file</li>
      <li>Run database migrations:
        <pre>npm run db:migrate</pre>
      </li>
    </ol>
    
    <h2>First-Time Setup</h2>
    
    <h3>Account Creation</h3>
    <ol>
      <li>Visit the SXP application</li>
      <li>Click "Create Account"</li>
      <li>Enter your email and password</li>
      <li>Verify your email address</li>
      <li>Complete the onboarding questionnaire</li>
    </ol>
    
    <h3>Initial Configuration</h3>
    <ol>
      <li>Select your persona type</li>
      <li>Set your time zone</li>
      <li>Configure your availability</li>
      <li>Add your first activities</li>
      <li>Review and save your preferences</li>
    </ol>
    
    <h2>Verification</h2>
    <p>To verify your installation is working correctly:</p>
    <ol>
      <li>Log in to your account</li>
      <li>Navigate to the Schedule Viewer</li>
      <li>Create a test schedule</li>
      <li>Verify that optimization is working</li>
      <li>Check that all features are accessible</li>
    </ol>
    
    <h2>Troubleshooting</h2>
    
    <h3>Common Issues</h3>
    <ul>
      <li><strong>Database connection errors:</strong> Verify your DATABASE_URL and credentials</li>
      <li><strong>Email not sending:</strong> Check SMTP configuration and credentials</li>
      <li><strong>Performance issues:</strong> Ensure you meet minimum system requirements</li>
      <li><strong>Browser compatibility:</strong> Update to a supported browser version</li>
    </ul>
    
    <h3>Getting Help</h3>
    <p>If you encounter issues during setup:</p>
    <ul>
      <li>Check the FAQ section</li>
      <li>Review the troubleshooting guide</li>
      <li>Contact support with specific error messages</li>
      <li>Join the community forum for peer support</li>
    </ul>
  `;

  return (
    <DocumentationViewer
      title="Setup Guide"
      content={content}
      category="Setup"
      lastUpdated="January 19, 2025"
    />
  );
};

export default SetupGuide;
