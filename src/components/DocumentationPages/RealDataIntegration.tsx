/**
 * Real Data Integration Documentation Page
 */

import React from 'react';
import DocumentationViewer from '../DocumentationViewer/DocumentationViewer';

const RealDataIntegration: React.FC = () => {
  const content = `
    <h1>🔗 Real Data Integration Guide</h1>
    
    <p>This guide explains how to make the Development Track use real data instead of simulated data.</p>
    
    <h2>🎯 Overview</h2>
    
    <p>The Development Track now supports two modes:</p>
    <ul>
      <li><strong>🎭 Simulated Data</strong>: Template-based data for demonstration</li>
      <li><strong>📊 Real Data</strong>: Actual git commits, file changes, and project status</li>
    </ul>
    
    <h2>🚀 Quick Start</h2>
    
    <h3>1. Toggle Real Data Mode</h3>
    <p>Click the <strong>"🎭 Simulated Data"</strong> button in the Development Track header to switch to <strong>"📊 Real Data"</strong> mode.</p>
    
    <h3>2. Backend Setup (Required for Full Real Data)</h3>
    
    <h4>Option A: Node.js Backend Service</h4>
    <pre><code># Create a simple Express server
npm install express cors

# Create server.js
const express = require('express');
const cors = require('cors');
const { handleGitRequest } = require('./src/api/git');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/git', handleGitRequest);

app.listen(3001, () => {
  console.log('Git API server running on port 3001');
});</code></pre>
    
    <h4>Option B: Mock Data (No Backend Required)</h4>
    <p>The system will automatically fall back to mock data if the backend is not available.</p>
    
    <h2>📊 What Real Data Provides</h2>
    
    <h3>📈 App Status Section</h3>
    <ul>
      <li><strong>Online Status</strong>: Actual deployment status</li>
      <li><strong>QA Test Results</strong>: Real test outcomes from your CI/CD</li>
      <li><strong>Release Status</strong>: Actual git status and deployment info</li>
      <li><strong>What Changed</strong>: Real commit messages and file changes</li>
      <li><strong>Module Integration</strong>: Actual progress based on real commits</li>
    </ul>
    
    <h3>📋 Development Status Section</h3>
    <ul>
      <li><strong>Real Commits</strong>: Actual git commit history with:
        <ul>
          <li>Real commit hashes</li>
          <li>Actual author names</li>
          <li>Real timestamps</li>
          <li>Actual commit messages</li>
          <li>File change statistics</li>
        </ul>
      </li>
      <li><strong>Task Management</strong>: Integration with project management tools</li>
    </ul>
    
    <h3>🧪 Testing Results Section</h3>
    <ul>
      <li><strong>Real Test Results</strong>: Actual test outcomes</li>
      <li><strong>Performance Metrics</strong>: Real performance data</li>
      <li><strong>Coverage Reports</strong>: Actual test coverage</li>
    </ul>
    
    <h2>🔧 Implementation Details</h2>
    
    <h3>Git Service (src/services/gitService.ts)</h3>
    <pre><code>// Fetches real git data
const commits = await gitService.getRecentCommits(10);
const status = await gitService.getRepositoryStatus();
const changes = await gitService.getFileChanges();</code></pre>
    
    <h3>Real Data Service (src/services/realDataService.ts)</h3>
    <pre><code>// Integrates real data with the UI
const appStatus = await realDataService.getRealAppStatus();
const devStatus = await realDataService.getRealDevelopmentStatus();
const testResults = await realDataService.getRealTestResults();</code></pre>
    
    <h3>Backend API (src/api/git.js)</h3>
    <pre><code>// Secure git command execution
app.post('/api/git', handleGitRequest);</code></pre>
    
    <h2>🛡️ Security Considerations</h2>
    
    <h3>Git Command Whitelist</h3>
    <p>Only specific git commands are allowed:</p>
    <ul>
      <li><code>git log</code> - Get commit history</li>
      <li><code>git status</code> - Get repository status</li>
      <li><code>git branch</code> - Get branch information</li>
      <li><code>git config</code> - Get configuration</li>
      <li><code>git diff</code> - Get file changes</li>
      <li><code>git rev-list</code> - Get commit counts</li>
    </ul>
    
    <h3>Command Execution</h3>
    <ul>
      <li>Commands run with 10-second timeout</li>
      <li>Limited to project directory</li>
      <li>Error handling and logging</li>
    </ul>
    
    <h2>📝 Configuration</h2>
    
    <h3>Environment Variables</h3>
    <pre><code># .env.local
REACT_APP_USE_REAL_DATA=true
REACT_APP_GIT_API_URL=http://localhost:3001/api/git</code></pre>
    
    <h3>Git Configuration</h3>
    <pre><code># Ensure git is configured
git config user.name "Your Name"
git config user.email "your.email@example.com"</code></pre>
    
    <h2>🚨 Troubleshooting</h2>
    
    <h3>Common Issues</h3>
    
    <h4>1. "Failed to fetch real data"</h4>
    <ul>
      <li>Check if backend server is running</li>
      <li>Verify git repository is accessible</li>
      <li>Check browser console for errors</li>
    </ul>
    
    <h4>2. "Git command not allowed"</h4>
    <ul>
      <li>Ensure only whitelisted commands are used</li>
      <li>Check backend security configuration</li>
    </ul>
    
    <h4>3. "No commits found"</h4>
    <ul>
      <li>Verify git repository has commits</li>
      <li>Check git log command output</li>
    </ul>
    
    <h3>Debug Mode</h3>
    <pre><code>// Enable debug logging
localStorage.setItem('debug', 'true');</code></pre>
    
    <h2>🔮 Future Enhancements</h2>
    
    <h3>Planned Integrations</h3>
    <ul>
      <li><strong>GitHub API</strong>: Direct GitHub integration</li>
      <li><strong>CI/CD Integration</strong>: Jenkins, GitHub Actions</li>
      <li><strong>Project Management</strong>: Jira, Trello, Asana</li>
      <li><strong>Testing Tools</strong>: Jest, Cypress, Playwright</li>
      <li><strong>Deployment Status</strong>: Netlify, Vercel, AWS</li>
    </ul>
    
    <h3>Advanced Features</h3>
    <ul>
      <li><strong>Real-time Updates</strong>: WebSocket connections</li>
      <li><strong>Historical Analysis</strong>: Commit trend analysis</li>
      <li><strong>Performance Metrics</strong>: Bundle size, load times</li>
      <li><strong>Security Scanning</strong>: Vulnerability reports</li>
    </ul>
    
    <h2>📚 API Reference</h2>
    
    <h3>Git Service Methods</h3>
    <pre><code>// Get recent commits
gitService.getRecentCommits(limit: number): Promise&lt;GitCommit[]&gt;

// Get repository status
gitService.getRepositoryStatus(): Promise&lt;GitStatus&gt;

// Get repository info
gitService.getRepositoryInfo(): Promise&lt;RepositoryInfo&gt;

// Get file changes
gitService.getFileChanges(): Promise&lt;FileChange[]&gt;</code></pre>
    
    <h3>Real Data Service Methods</h3>
    <pre><code>// Get real app status
realDataService.getRealAppStatus(): Promise&lt;RealAppStatus&gt;

// Get real development status
realDataService.getRealDevelopmentStatus(): Promise&lt;RealDevelopmentStatus&gt;

// Get real test results
realDataService.getRealTestResults(): Promise&lt;RealTestResult[]&gt;</code></pre>
    
    <h2>🎉 Benefits of Real Data</h2>
    
    <h3>For Development Teams</h3>
    <ul>
      <li><strong>Accurate Progress Tracking</strong>: Real commit data</li>
      <li><strong>Actual Performance Metrics</strong>: Real test results</li>
      <li><strong>True Project Status</strong>: Current state of development</li>
      <li><strong>Historical Analysis</strong>: Track progress over time</li>
    </ul>
    
    <h3>For Project Managers</h3>
    <ul>
      <li><strong>Real-time Insights</strong>: Current development status</li>
      <li><strong>Accurate Reporting</strong>: Based on actual data</li>
      <li><strong>Progress Validation</strong>: Verify claimed progress</li>
      <li><strong>Resource Planning</strong>: Based on real metrics</li>
    </ul>
    
    <h3>For Stakeholders</h3>
    <ul>
      <li><strong>Transparency</strong>: See actual development progress</li>
      <li><strong>Accountability</strong>: Real data prevents over-reporting</li>
      <li><strong>Confidence</strong>: Trust in accurate information</li>
      <li><strong>Decision Making</strong>: Based on real metrics</li>
    </ul>
    
    <hr>
    
    <p><strong>Ready to use real data?</strong> Toggle the <strong>"🎭 Simulated Data"</strong> button to <strong>"📊 Real Data"</strong> and start seeing your actual development progress!</p>
  `;

  return (
    <DocumentationViewer
      title="Real Data Integration"
      content={content}
    />
  );
};

export default RealDataIntegration;
