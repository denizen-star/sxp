/**
 * API Documentation Page
 */

import React from 'react';
import DocumentationViewer from '../DocumentationViewer/DocumentationViewer';

const ApiDocumentation: React.FC = () => {
  const content = `
    <h1>API Documentation</h1>
    
    <h2>Overview</h2>
    <p>The SXP platform provides a comprehensive REST API for managing schedules, personas, and user data. All API endpoints are designed to be RESTful and follow standard HTTP conventions.</p>
    
    <h2>Authentication</h2>
    <p>All API requests require authentication using Bearer tokens. Include the token in the Authorization header:</p>
    <pre>Authorization: Bearer your-token-here</pre>
    
    <h2>Base URL</h2>
    <p>All API endpoints are relative to the base URL:</p>
    <pre>https://api.sxp.com/v1</pre>
    
    <h2>Endpoints</h2>
    
    <h3>Authentication Endpoints</h3>
    <ul>
      <li><code>POST /auth/login</code> - User login</li>
      <li><code>POST /auth/register</code> - User registration</li>
      <li><code>POST /auth/verify</code> - Email verification</li>
      <li><code>POST /auth/reset</code> - Password reset</li>
    </ul>
    
    <h3>User Management</h3>
    <ul>
      <li><code>GET /users/profile</code> - Get user profile</li>
      <li><code>PUT /users/profile</code> - Update user profile</li>
      <li><code>DELETE /users/account</code> - Delete user account</li>
    </ul>
    
    <h3>Schedule Management</h3>
    <ul>
      <li><code>GET /schedules</code> - Get user schedules</li>
      <li><code>POST /schedules</code> - Create new schedule</li>
      <li><code>PUT /schedules/:id</code> - Update schedule</li>
      <li><code>DELETE /schedules/:id</code> - Delete schedule</li>
    </ul>
    
    <h2>Response Format</h2>
    <p>All API responses follow a consistent format:</p>
    <pre>{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}</pre>
    
    <h2>Error Handling</h2>
    <p>Errors are returned with appropriate HTTP status codes and error messages:</p>
    <pre>{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}</pre>
    
    <h2>Rate Limiting</h2>
    <p>API requests are rate limited to 1000 requests per hour per user. Rate limit headers are included in responses:</p>
    <ul>
      <li><code>X-RateLimit-Limit</code> - Request limit per hour</li>
      <li><code>X-RateLimit-Remaining</code> - Remaining requests</li>
      <li><code>X-RateLimit-Reset</code> - Reset timestamp</li>
    </ul>
  `;

  return (
    <DocumentationViewer
      title="API Documentation"
      content={content}
      category="Technical"
      lastUpdated="January 19, 2025"
    />
  );
};

export default ApiDocumentation;
