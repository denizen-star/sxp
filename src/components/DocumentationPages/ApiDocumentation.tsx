/**
 * API Documentation Page
 */

import React from 'react';
import DocumentationViewer from '../DocumentationViewer/DocumentationViewer';

const ApiDocumentation: React.FC = () => {
  const content = `
    <h1>API Documentation</h1>
    
    <h2>Overview</h2>
    <p>The SXP platform provides a comprehensive REST API for managing schedules, personas, and user data. All API endpoints are designed to be RESTful and follow standard HTTP conventions. The authentication system is production-ready with SQLite database, JWT tokens, and bcrypt password hashing.</p>
    
    <h2>Authentication</h2>
    <p>All API requests require authentication using JWT Bearer tokens. Include the token in the Authorization header:</p>
    <pre>Authorization: Bearer your-jwt-token-here</pre>
    <p><strong>Note:</strong> JWT tokens are obtained through the login endpoint and are required for all protected routes.</p>
    
    <h2>Base URL</h2>
    <p>All API endpoints are relative to the base URL:</p>
    <pre>http://localhost:3001/api</pre>
    <p><strong>Production:</strong> The authentication backend runs on port 3001 with SQLite database.</p>
    
    <h2>Endpoints</h2>
    
    <h3>Authentication Endpoints</h3>
    <ul>
      <li><code>POST /api/auth/register</code> - User registration with bcrypt password hashing</li>
      <li><code>POST /api/auth/login</code> - User login with JWT token generation</li>
      <li><code>POST /api/auth/logout</code> - User logout (token invalidation)</li>
      <li><code>GET /api/auth/profile</code> - Get authenticated user profile</li>
      <li><code>GET /api/auth/events</code> - Get authentication security events</li>
    </ul>
    
    <h3>User Management</h3>
    <ul>
      <li><code>GET /api/auth/profile</code> - Get user profile (requires JWT token)</li>
      <li><code>PUT /api/auth/profile</code> - Update user profile (requires JWT token)</li>
      <li><code>DELETE /api/auth/profile</code> - Delete user account (requires JWT token)</li>
    </ul>
    
    <h3>Security Events</h3>
    <ul>
      <li><code>GET /api/auth/events</code> - Get authentication security events</li>
      <li><code>POST /api/auth/events</code> - Log security event (internal use)</li>
    </ul>
    
    <h3>Schedule Management</h3>
    <ul>
      <li><code>GET /schedules</code> - Get user schedules</li>
      <li><code>POST /schedules</code> - Create new schedule</li>
      <li><code>PUT /schedules/:id</code> - Update schedule</li>
      <li><code>DELETE /schedules/:id</code> - Delete schedule</li>
    </ul>
    
    <h2>API Examples</h2>
    
    <h3>User Registration</h3>
    <pre>POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-01-02T14:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}</pre>
    
    <h3>User Login</h3>
    <pre>POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "lastLogin": "2025-01-02T14:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}</pre>
    
    <h3>Get User Profile</h3>
    <pre>GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-02T14:30:00Z",
    "lastLogin": "2025-01-02T14:30:00Z"
  },
  "message": "Profile retrieved successfully"
}</pre>
    
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
      lastUpdated="January 2, 2025"
    />
  );
};

export default ApiDocumentation;
