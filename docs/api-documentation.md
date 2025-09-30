# SXP API Documentation

## 🌐 API Overview

The SXP API provides endpoints for professional networking, persona matching, and event management. This documentation covers the current and planned API endpoints.

## 🔐 Authentication

### **Authentication Methods**
- **JWT Tokens** - For API access
- **Magic Links** - For passwordless authentication
- **OAuth 2.0** - For third-party integrations

### **Authentication Headers**
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📋 Current API Endpoints

### **Authentication Endpoints**

#### **POST /api/auth/register**
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "profile": {
    "industry": "Technology",
    "experience": "Senior",
    "interests": ["AI", "Networking"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "verificationRequired": true
  }
}
```

#### **POST /api/auth/login**
Authenticate user and return JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### **POST /api/auth/verify-email**
Verify user email address.

**Request:**
```json
{
  "token": "verification_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### **User Management Endpoints**

#### **GET /api/users/profile**
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "profile": {
      "industry": "Technology",
      "experience": "Senior",
      "interests": ["AI", "Networking"],
      "persona": {
        "type": "Innovator",
        "score": 0.85
      }
    }
  }
}
```

#### **PUT /api/users/profile**
Update user profile.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "profile": {
    "industry": "Technology",
    "experience": "Senior",
    "interests": ["AI", "Networking", "Startups"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

## 📋 Planned API Endpoints

### **Persona Management Endpoints**

#### **GET /api/personas**
Get available personas.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "persona_1",
      "name": "Innovator",
      "description": "Tech-savvy professional focused on innovation",
      "traits": ["creative", "risk-taking", "forward-thinking"],
      "compatibility": 0.85
    }
  ]
}
```

#### **POST /api/personas/assign**
Assign persona to user.

**Request:**
```json
{
  "personaId": "persona_1",
  "confidence": 0.85
}
```

**Response:**
```json
{
  "success": true,
  "message": "Persona assigned successfully"
}
```

### **Matching Endpoints**

#### **GET /api/matches**
Get potential matches for user.

**Query Parameters:**
- `limit`: Number of matches to return (default: 10)
- `context`: Matching context (e.g., "networking", "collaboration")
- `radius`: Geographic radius in miles (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "userId": "user_456",
        "name": "Jane Smith",
        "industry": "Technology",
        "mutualBenefitScore": 0.92,
        "compatibility": 0.88,
        "sharedInterests": ["AI", "Networking"],
        "location": {
          "city": "San Francisco",
          "state": "CA",
          "distance": 5.2
        }
      }
    ],
    "totalMatches": 25,
    "nextPage": 2
  }
}
```

#### **POST /api/matches/request**
Request a connection with another user.

**Request:**
```json
{
  "targetUserId": "user_456",
  "message": "Hi Jane, I'd love to connect and discuss AI opportunities!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connection request sent successfully",
  "data": {
    "connectionId": "conn_789",
    "status": "pending"
  }
}
```

### **Event Management Endpoints**

#### **GET /api/events**
Get available events.

**Query Parameters:**
- `location`: Filter by location
- `date`: Filter by date range
- `type`: Filter by event type
- `limit`: Number of events to return

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event_123",
        "title": "AI Networking Mixer",
        "description": "Connect with AI professionals",
        "date": "2025-01-15T18:00:00Z",
        "location": {
          "name": "Tech Hub SF",
          "address": "123 Tech Street, San Francisco, CA",
          "coordinates": [37.7749, -122.4194]
        },
        "capacity": 50,
        "attendees": 23,
        "matchingScore": 0.89
      }
    ],
    "totalEvents": 15
  }
}
```

#### **POST /api/events/register**
Register for an event.

**Request:**
```json
{
  "eventId": "event_123",
  "preferences": {
    "seatingPreference": "near-stage",
    "networkingGoals": ["find-collaborators", "learn-new-skills"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully registered for event",
  "data": {
    "registrationId": "reg_456",
    "seatAssignment": "A-15",
    "matchedAttendees": [
      {
        "userId": "user_789",
        "name": "Bob Johnson",
        "mutualBenefitScore": 0.91
      }
    ]
  }
}
```

### **Analytics Endpoints**

#### **GET /api/analytics/engagement**
Get user engagement analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "connections": {
      "total": 45,
      "newThisMonth": 8,
      "mutualBenefitScore": 0.87
    },
    "events": {
      "attended": 12,
      "upcoming": 3,
      "successRate": 0.92
    },
    "networking": {
      "qualityScore": 0.89,
      "followUpRate": 0.76,
      "relationshipDepth": 0.82
    }
  }
}
```

#### **GET /api/analytics/recommendations**
Get personalized recommendations.

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "eventId": "event_456",
        "title": "Startup Founders Meetup",
        "matchScore": 0.94,
        "reason": "High compatibility with your entrepreneurial interests"
      }
    ],
    "connections": [
      {
        "userId": "user_789",
        "name": "Sarah Wilson",
        "matchScore": 0.91,
        "reason": "Shared interest in AI and similar career stage"
      }
    ]
  }
}
```

## 🔧 API Configuration

### **Base URL**
- **Development:** `http://localhost:3001/api`
- **Staging:** `https://staging-api.sxp.kervinapps.com/api`
- **Production:** `https://api.sxp.kervinapps.com/api`

### **Rate Limiting**
- **Authentication:** 5 requests per minute
- **General API:** 100 requests per hour
- **Matching:** 10 requests per hour
- **Analytics:** 20 requests per hour

### **Response Format**
All API responses follow this format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "error": {
    "code": string,
    "details": string
  },
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "hasNext": boolean
  }
}
```

## 🚨 Error Handling

### **HTTP Status Codes**
- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **429** - Rate Limited
- **500** - Internal Server Error

### **Error Response Format**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

## 📊 API Monitoring

### **Health Check**
**GET /api/health**

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-19T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "sendgrid": "healthy"
  }
}
```

### **Metrics**
- **Response Time:** Average < 200ms
- **Success Rate:** > 99.5%
- **Uptime:** > 99.9%
- **Error Rate:** < 0.5%

## 🔐 Security

### **Authentication**
- JWT tokens with 24-hour expiration
- Refresh tokens for extended sessions
- Magic links for passwordless authentication

### **Authorization**
- Role-based access control
- Resource-level permissions
- API key management

### **Data Protection**
- All data encrypted in transit (HTTPS)
- Sensitive data encrypted at rest
- GDPR compliance
- Data retention policies

## 📚 SDKs and Libraries

### **JavaScript/TypeScript**
```bash
npm install @sxp/api-client
```

```javascript
import { SXPClient } from '@sxp/api-client';

const client = new SXPClient({
  apiKey: 'your_api_key',
  baseURL: 'https://api.sxp.kervinapps.com'
});

// Get user profile
const profile = await client.users.getProfile();

// Get matches
const matches = await client.matches.getMatches({
  limit: 10,
  context: 'networking'
});
```

### **Python**
```bash
pip install sxp-api-client
```

```python
from sxp_client import SXPClient

client = SXPClient(
    api_key='your_api_key',
    base_url='https://api.sxp.kervinapps.com'
)

# Get user profile
profile = client.users.get_profile()

# Get matches
matches = client.matches.get_matches(
    limit=10,
    context='networking'
)
```

## 📞 Support

### **API Support**
- **Documentation:** https://docs.sxp.kervinapps.com
- **Status Page:** https://status.sxp.kervinapps.com
- **Support Email:** api-support@sxp.kervinapps.com

### **Rate Limit Information**
- Check `X-RateLimit-Limit` header
- Check `X-RateLimit-Remaining` header
- Check `X-RateLimit-Reset` header

---

**API Version:** 1.0.0  
**Last Updated:** December 19, 2024  
**Status:** Development Phase
