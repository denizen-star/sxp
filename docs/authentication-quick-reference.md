# SXP Authentication Module - Quick Reference

## 🚀 Quick Start

### **Start Authentication System**
```bash
# Terminal 1: Start Backend
cd auth-backend
node server.js

# Terminal 2: Start Frontend
serve -s build -l 3004
```

### **Access Points**
- **Frontend**: http://localhost:3004
- **Backend API**: http://localhost:3001/api
- **Authentication**: http://localhost:3004/auth
- **Security Events**: http://localhost:3004/auth-events

## 🔑 Default Admin User

**Username:** admin@sxp.com  
**Password:** Admin123!

## 📋 API Quick Reference

### **Register User**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### **Login User**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### **Get Profile**
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Get Security Events**
```bash
curl -X GET http://localhost:3001/api/auth/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛠️ Development Commands

### **Frontend Development**
```bash
npm install          # Install dependencies
npm run build        # Build for production
npm start           # Start development server
```

### **Backend Development**
```bash
cd auth-backend
npm install          # Install backend dependencies
node server.js       # Start authentication server
```

### **Database Management**
```bash
# Check database file
ls -la auth-backend/auth.db

# View database contents (if sqlite3 installed)
sqlite3 auth-backend/auth.db
.tables
SELECT * FROM users;
SELECT * FROM auth_events;
```

## 🔧 Configuration

### **Ports**
- **Frontend**: 3004
- **Backend**: 3001
- **Database**: SQLite (auth.db)

### **Environment Variables**
```bash
# Backend
JWT_SECRET=sxp-simple-secret
PORT=3001

# Frontend
REACT_APP_API_URL=http://localhost:3001/api
```

## 🐛 Common Issues

### **Port Already in Use**
```bash
# Kill existing processes
pkill -f "node server.js"
pkill -f "serve -s build"

# Restart services
cd auth-backend && node server.js
serve -s build -l 3004
```

### **Database Issues**
```bash
# Check database permissions
ls -la auth-backend/auth.db
chmod 664 auth-backend/auth.db

# Recreate database (WARNING: Deletes all data)
rm auth-backend/auth.db
cd auth-backend && node server.js
```

### **CORS Issues**
- Verify backend is running on port 3001
- Check CORS configuration in server.js
- Ensure frontend is on port 3004

## 📊 Testing Checklist

### **Authentication Flow**
- [ ] User can register new account
- [ ] User can login with credentials
- [ ] JWT token is generated and stored
- [ ] User can access protected routes
- [ ] User can logout and token is invalidated

### **Security Features**
- [ ] Passwords are hashed with bcrypt
- [ ] JWT tokens are properly validated
- [ ] Security events are logged
- [ ] CORS is properly configured
- [ ] Rate limiting is active

### **Database Operations**
- [ ] Users table is created
- [ ] Auth events table is created
- [ ] User data is persisted
- [ ] Security events are logged
- [ ] Database file is accessible

## 🔍 Debugging

### **Check Authentication Status**
```javascript
// In browser console
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### **Backend Logs**
```bash
# Start with debug logging
DEBUG=auth:* node server.js
```

### **Database Queries**
```sql
-- Check users
SELECT * FROM users;

-- Check recent auth events
SELECT * FROM auth_events ORDER BY timestamp DESC LIMIT 10;

-- Check specific user events
SELECT * FROM auth_events WHERE user_id = 1;
```

## 📱 Frontend Integration

### **useAuth Hook Usage**
```tsx
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, login, register, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### **Route Protection**
```tsx
import { AuthGuard } from '../components/auth/AuthGuard';

<Route path="/protected" element={
  <AuthGuard>
    <ProtectedComponent />
  </AuthGuard>
} />
```

## 🚨 Security Checklist

### **Production Readiness**
- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Monitor security events
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets

### **Security Best Practices**
- [ ] Passwords are never logged
- [ ] JWT tokens are properly validated
- [ ] Input validation is implemented
- [ ] Error messages don't leak information
- [ ] Security events are comprehensive
- [ ] Database queries use prepared statements

---

**Quick Reference Version:** 1.0.0  
**Last Updated:** January 2, 2025
