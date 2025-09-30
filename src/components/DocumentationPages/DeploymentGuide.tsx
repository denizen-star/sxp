/**
 * Deployment Guide Page
 */

import React from 'react';
import DocumentationViewer from '../DocumentationViewer/DocumentationViewer';

const DeploymentGuide: React.FC = () => {
  const content = `
    <h1>Deployment Guide</h1>
    
    <h2>Overview</h2>
    <p>This guide covers deploying SXP to production environments. We support multiple deployment strategies including cloud platforms, containerized deployments, and traditional server setups.</p>
    
    <h2>Pre-Deployment Checklist</h2>
    <ul>
      <li>✅ Production database configured and tested</li>
      <li>✅ Environment variables properly set</li>
      <li>✅ SSL certificates configured</li>
      <li>✅ Domain name and DNS configured</li>
      <li>✅ Backup strategy implemented</li>
      <li>✅ Monitoring and logging configured</li>
      <li>✅ Security measures in place</li>
    </ul>
    
    <h2>Deployment Options</h2>
    
    <h3>Option 1: Netlify (Recommended for Frontend)</h3>
    <ol>
      <li>Build the production application:
        <pre>npm run build</pre>
      </li>
      <li>Connect your GitHub repository to Netlify</li>
      <li>Configure build settings:
        <pre>Build command: npm run build
Publish directory: build</pre>
      </li>
      <li>Set environment variables in Netlify dashboard</li>
      <li>Deploy and verify the application</li>
    </ol>
    
    <h3>Option 2: Docker Deployment</h3>
    <ol>
      <li>Create a Dockerfile:
        <pre>FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]</pre>
      </li>
      <li>Build the Docker image:
        <pre>docker build -t sxp-app .</pre>
      </li>
      <li>Run the container:
        <pre>docker run -p 3000:3000 sxp-app</pre>
      </li>
    </ol>
    
    <h3>Option 3: Traditional Server</h3>
    <ol>
      <li>Set up a Linux server (Ubuntu 20.04+ recommended)</li>
      <li>Install Node.js 18+ and npm</li>
      <li>Clone the repository to the server</li>
      <li>Install dependencies and build:
        <pre>npm ci
npm run build</pre>
      </li>
      <li>Configure a reverse proxy (Nginx recommended)</li>
      <li>Set up process management (PM2 recommended)</li>
    </ol>
    
    <h2>Database Configuration</h2>
    
    <h3>Production Database Setup</h3>
    <ol>
      <li>Choose a production database:
        <ul>
          <li>PostgreSQL (recommended)</li>
          <li>MySQL</li>
          <li>MongoDB</li>
        </ul>
      </li>
      <li>Configure connection pooling</li>
      <li>Set up database backups</li>
      <li>Configure monitoring and alerts</li>
    </ol>
    
    <h3>Database Migration</h3>
    <pre># Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed</pre>
    
    <h2>Environment Configuration</h2>
    
    <h3>Production Environment Variables</h3>
    <pre># Application
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname
DATABASE_SSL=true

# Authentication
JWT_SECRET=your-super-secure-jwt-secret
SESSION_SECRET=your-super-secure-session-secret

# Email
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password

# API
API_BASE_URL=https://api.yourdomain.com
API_VERSION=v1

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100</pre>
    
    <h2>Security Configuration</h2>
    
    <h3>SSL/TLS Setup</h3>
    <ol>
      <li>Obtain SSL certificates (Let's Encrypt recommended)</li>
      <li>Configure HTTPS redirect</li>
      <li>Set up HSTS headers</li>
      <li>Configure CSP (Content Security Policy)</li>
    </ol>
    
    <h3>Security Headers</h3>
    <pre># Nginx configuration example
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";</pre>
    
    <h2>Monitoring and Logging</h2>
    
    <h3>Application Monitoring</h3>
    <ul>
      <li>Set up application performance monitoring (APM)</li>
      <li>Configure error tracking (Sentry recommended)</li>
      <li>Set up uptime monitoring</li>
      <li>Configure log aggregation</li>
    </ul>
    
    <h3>Health Checks</h3>
    <pre># Health check endpoint
GET /health
Response: {"status": "ok", "timestamp": "2025-01-19T21:00:00Z"}</pre>
    
    <h2>Backup Strategy</h2>
    
    <h3>Database Backups</h3>
    <ul>
      <li>Daily automated backups</li>
      <li>Point-in-time recovery capability</li>
      <li>Off-site backup storage</li>
      <li>Regular backup restoration testing</li>
    </ul>
    
    <h3>Application Backups</h3>
    <ul>
      <li>Source code version control</li>
      <li>Configuration file backups</li>
      <li>Environment variable documentation</li>
      <li>Deployment script backups</li>
    </ul>
    
    <h2>Post-Deployment Verification</h2>
    
    <h3>Functionality Tests</h3>
    <ol>
      <li>Test user registration and login</li>
      <li>Verify schedule creation and optimization</li>
      <li>Test email functionality</li>
      <li>Verify API endpoints</li>
      <li>Test error handling</li>
    </ol>
    
    <h3>Performance Tests</h3>
    <ul>
      <li>Load testing with expected user volume</li>
      <li>Database performance verification</li>
      <li>Response time monitoring</li>
      <li>Memory and CPU usage monitoring</li>
    </ul>
    
    <h2>Maintenance</h2>
    
    <h3>Regular Maintenance Tasks</h3>
    <ul>
      <li>Monitor application logs</li>
      <li>Update dependencies regularly</li>
      <li>Review and rotate secrets</li>
      <li>Monitor database performance</li>
      <li>Update SSL certificates</li>
    </ul>
    
    <h3>Update Deployment</h3>
    <ol>
      <li>Test updates in staging environment</li>
      <li>Create database migrations if needed</li>
      <li>Deploy to production during maintenance window</li>
      <li>Verify functionality post-deployment</li>
      <li>Monitor for issues</li>
    </ol>
  `;

  return (
    <DocumentationViewer
      title="Deployment Guide"
      content={content}
      category="Deployment"
      lastUpdated="January 19, 2025"
    />
  );
};

export default DeploymentGuide;
