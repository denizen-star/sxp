# 🚀 Netlify Deployment Logs Integration Guide

This guide explains how to use the Netlify deployment logs API to capture and display deployment stages in real-time.

## 🎯 Overview

The Netlify deployment logs integration provides:
- **Real-time deployment monitoring** via WebSocket connections
- **Deployment stage tracking** (Initializing, Building, Deploying, Cleanup, Post-processing)
- **Live log streaming** with automatic updates
- **Historical deployment data** via REST API
- **Mock data support** for development and testing

## 🚀 Quick Start

### **1. Access the Demo**
Navigate to `/netlify-deployment-logs` in your SXP application to see the interactive demo.

### **2. Choose Your Mode**

#### **Mock Data Mode (Recommended for Testing)**
- No Netlify credentials required
- Shows simulated deployment stages
- Perfect for development and demonstration

#### **Real Netlify Data Mode**
- Requires Netlify access token and site ID
- Connects to actual Netlify deployments
- Provides real-time log streaming

## 🔧 Configuration

### **Environment Variables**
Add these to your `.env.local` file:

```bash
# Netlify Integration
REACT_APP_NETLIFY_ACCESS_TOKEN=your_netlify_access_token
REACT_APP_NETLIFY_SITE_ID=your_netlify_site_id
REACT_APP_NETLIFY_USE_MOCK_DATA=true
```

### **Getting Netlify Credentials**

#### **1. Access Token**
1. Go to [Netlify Account Settings](https://app.netlify.com/user/applications#personal-access-tokens)
2. Navigate to "Applications" → "Personal access tokens"
3. Click "New access token"
4. Give it a name and select appropriate scopes
5. Copy the generated token

#### **2. Site ID**
1. Go to your site dashboard on Netlify
2. Navigate to "Site settings" → "General"
3. Find "Site ID" in the site information section
4. Copy the site ID

## 📊 Deployment Stages

The integration tracks five main deployment stages:

### **1. Initializing**
- **Purpose**: Setting up the build environment
- **Status**: First stage of deployment
- **Logs**: Environment checks, context preparation

### **2. Building**
- **Purpose**: Compiling and building your application
- **Status**: Installing dependencies, running build scripts
- **Logs**: Build commands, compilation output, asset processing

### **3. Deploying**
- **Purpose**: Uploading and deploying the built application
- **Status**: File uploads, CDN updates, DNS changes
- **Logs**: Upload progress, deployment status

### **4. Cleanup**
- **Purpose**: Cleaning up temporary files and resources
- **Status**: Removing build artifacts, optimizing resources
- **Logs**: Cleanup operations, resource optimization

### **5. Post-processing**
- **Purpose**: Final optimizations and validations
- **Status**: Performance checks, final validations
- **Logs**: Performance metrics, validation results

## 🛠️ Implementation

### **Service Usage**

```typescript
import { netlifyDeploymentService } from './services/netlifyDeploymentService';

// Initialize the service
netlifyDeploymentService.initialize({
  accessToken: 'your-netlify-token',
  siteId: 'your-site-id',
  deployId: 'optional-deploy-id'
});

// Connect to real-time logs
await netlifyDeploymentService.connectToDeploymentLogs();

// Listen for updates
netlifyDeploymentService.addListener((data) => {
  console.log('New deployment log:', data);
  // Update your UI with new data
});

// Get deployment information
const deployment = await netlifyDeploymentService.getDeploymentInfo();

// Get recent deployments
const deployments = await netlifyDeploymentService.getRecentDeployments(10);
```

### **Component Usage**

```tsx
import NetlifyDeploymentLogs from './components/NetlifyDeploymentLogs/NetlifyDeploymentLogs';

// Use with mock data
<NetlifyDeploymentLogs useMockData={true} />

// Use with real Netlify data
<NetlifyDeploymentLogs
  siteId="your-site-id"
  deployId="your-deploy-id"
  accessToken="your-access-token"
  useMockData={false}
/>
```

## 🔄 Real-time Updates

### **WebSocket Connection**
The service automatically connects to Netlify's WebSocket endpoint for real-time log streaming:

```typescript
// Connection details
const wsUrl = 'wss://api.netlify.com/build/logs';
const payload = {
  access_token: 'your-token',
  deploy_id: 'deploy-id',
  site_id: 'site-id'
};
```

### **Event Handling**
Listen for real-time updates:

```typescript
netlifyDeploymentService.addListener((data) => {
  // Handle different types of updates
  switch (data.type) {
    case 'stage_update':
      // Update stage status
      break;
    case 'log_message':
      // Add new log message
      break;
    case 'deployment_complete':
      // Handle deployment completion
      break;
  }
});
```

## 📱 UI Features

### **Deployment Overview**
- Overall deployment status
- Progress bar showing completion percentage
- Deployment URL with direct access
- Creation and update timestamps

### **Stage Tracking**
- Visual indicators for each stage status
- Expandable sections for detailed logs
- Duration tracking for completed stages
- Error handling and display

### **Log Management**
- Real-time log streaming
- Copy logs to clipboard
- Filter by stage or log level
- Search within logs

### **Interactive Controls**
- Connect/disconnect from live logs
- Refresh deployment data
- Switch between mock and real data
- Export logs functionality

## 🔒 Security Considerations

### **Access Token Security**
- Store tokens securely in environment variables
- Never commit tokens to version control
- Use least-privilege access tokens
- Rotate tokens regularly

### **API Rate Limits**
- Netlify has API rate limits
- Implement proper error handling
- Use connection pooling for multiple requests
- Monitor usage and implement backoff strategies

### **Data Privacy**
- Logs may contain sensitive information
- Implement proper data sanitization
- Consider log retention policies
- Ensure compliance with data protection regulations

## 🚨 Troubleshooting

### **Common Issues**

#### **1. "Failed to connect to WebSocket"**
- Check if access token is valid
- Verify site ID is correct
- Ensure deploy ID exists and is accessible
- Check network connectivity

#### **2. "No deployment data available"**
- Verify site has recent deployments
- Check if deploy ID is valid
- Ensure proper permissions on access token
- Try refreshing the data

#### **3. "WebSocket connection closed unexpectedly"**
- Check network stability
- Verify token hasn't expired
- Implement reconnection logic
- Monitor for rate limiting

### **Debug Mode**
Enable debug logging:

```typescript
// Enable debug mode
localStorage.setItem('netlify-debug', 'true');

// Check connection status
const isConnected = netlifyDeploymentService.isWebSocketConnected();
console.log('WebSocket connected:', isConnected);
```

## 🔮 Advanced Features

### **Custom Log Processing**
```typescript
// Process logs with custom logic
netlifyDeploymentService.addListener((data) => {
  if (data.type === 'log_message') {
    // Custom log processing
    const processedLog = processLogMessage(data.message);
    updateUI(processedLog);
  }
});
```

### **Deployment Analytics**
```typescript
// Track deployment metrics
const trackDeploymentMetrics = (deployment) => {
  const metrics = {
    totalDuration: calculateTotalDuration(deployment),
    stageBreakdown: analyzeStageDurations(deployment),
    successRate: calculateSuccessRate(deployment)
  };
  
  sendAnalytics(metrics);
};
```

### **Integration with CI/CD**
```typescript
// Integrate with your CI/CD pipeline
const notifyOnDeploymentComplete = (deployment) => {
  if (deployment.status === 'ready') {
    // Send notifications
    sendSlackNotification(`Deployment ${deployment.id} completed successfully`);
    sendEmailNotification(deployment);
  }
};
```

## 📚 API Reference

### **NetlifyDeploymentService Methods**

```typescript
// Initialize service
initialize(config: NetlifyConfig): void

// Connect to real-time logs
connectToDeploymentLogs(deployId?: string): Promise<void>

// Get deployment information
getDeploymentInfo(deployId?: string): Promise<DeploymentInfo>

// Get recent deployments
getRecentDeployments(limit: number): Promise<DeploymentInfo[]>

// Add event listener
addListener(callback: (data: any) => void): void

// Remove event listener
removeListener(callback: (data: any) => void): void

// Disconnect from WebSocket
disconnect(): void

// Check connection status
isWebSocketConnected(): boolean
```

### **Data Types**

```typescript
interface DeploymentStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  logs: string[];
  error?: string;
}

interface DeploymentInfo {
  id: string;
  siteId: string;
  status: 'building' | 'ready' | 'error';
  deployUrl?: string;
  stages: DeploymentStage[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 🎉 Benefits

### **For Development Teams**
- **Real-time visibility** into deployment progress
- **Immediate feedback** on build and deployment issues
- **Historical tracking** of deployment performance
- **Automated monitoring** and alerting

### **For DevOps**
- **Centralized deployment monitoring** across multiple sites
- **Performance analytics** and optimization insights
- **Integration capabilities** with existing tools
- **Automated troubleshooting** and resolution

### **For Stakeholders**
- **Transparent deployment process** with real-time updates
- **Confidence in deployment reliability**
- **Historical data** for performance analysis
- **Automated reporting** and notifications

---

**Ready to monitor your Netlify deployments?** Visit `/netlify-deployment-logs` to start the interactive demo!
