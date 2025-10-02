# SXP Authentication Components Documentation

## 📋 Overview

This document provides detailed documentation for all authentication-related React components in the SXP application. These components form the frontend layer of the production authentication system.

## 🧩 Component Architecture

### **Component Hierarchy**
```
AuthPage (Container)
├── LoginForm
├── RegisterForm
└── UserDashboard

AuthEvents (Standalone)
AuthGuard (Route Protection)
useAuth (Hook)
```

## 🔧 Components

### **AuthPage.tsx**
Main authentication page container with tabbed interface.

**Purpose:** Provides a unified interface for user authentication with tabbed navigation between login and registration.

**Props:** None (self-contained)

**Features:**
- Tabbed interface for login/registration
- Responsive design
- Integrated error handling
- Navigation between authentication modes

**Usage:**
```tsx
import { AuthPage } from '../components/auth/AuthPage';

<AuthPage />
```

**Implementation:**
```tsx
const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      {activeTab === 0 && <LoginForm />}
      {activeTab === 1 && <RegisterForm />}
    </Box>
  );
};
```

### **LoginForm.tsx**
User login form component with JWT authentication.

**Purpose:** Handles user authentication with email and password validation.

**Props:**
- `onSubmit?: (data: LoginData) => void` - Optional submit handler
- `loading?: boolean` - Loading state
- `error?: string` - Error message

**Features:**
- Email and password input fields
- Form validation
- Loading states
- Error handling
- Integration with useAuth hook

**Usage:**
```tsx
import { LoginForm } from '../components/auth/LoginForm';

<LoginForm />
```

**Form Data Interface:**
```typescript
interface LoginData {
  email: string;
  password: string;
}
```

**Implementation:**
```tsx
const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" fullWidth disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
```

### **RegisterForm.tsx**
User registration form component with bcrypt password hashing.

**Purpose:** Handles new user registration with comprehensive validation.

**Props:**
- `onSubmit?: (data: RegisterData) => void` - Optional submit handler
- `loading?: boolean` - Loading state
- `error?: string` - Error message

**Features:**
- Name, email, and password input fields
- Password strength validation
- Email format validation
- Automatic login after successful registration
- Integration with useAuth hook

**Usage:**
```tsx
import { RegisterForm } from '../components/auth/RegisterForm';

<RegisterForm />
```

**Form Data Interface:**
```typescript
interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

**Implementation:**
```tsx
const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, error }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(formData.name, formData.email, formData.password);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        required
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" fullWidth disabled={loading}>
        {loading ? 'Creating Account...' : 'Register'}
      </Button>
    </form>
  );
};
```

### **UserDashboard.tsx**
User profile and account management component.

**Purpose:** Displays authenticated user information and provides account management features.

**Props:**
- `user?: User` - User object (optional, uses useAuth hook if not provided)
- `onLogout?: () => void` - Optional logout handler

**Features:**
- Display user information (name, email, creation date)
- Show last login timestamp
- User status indicators
- Logout functionality
- Responsive design

**Usage:**
```tsx
import { UserDashboard } from '../components/auth/UserDashboard';

<UserDashboard />
```

**User Interface:**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
}
```

**Implementation:**
```tsx
const UserDashboard: React.FC<UserDashboardProps> = ({ user: propUser, onLogout }) => {
  const { user: hookUser, logout } = useAuth();
  const user = propUser || hookUser;

  if (!user) return <div>Please log in</div>;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Welcome, {user.name}!
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Email
            </Typography>
            <Typography variant="body1">
              {user.email}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Member Since
            </Typography>
            <Typography variant="body1">
              {formatDate(user.createdAt)}
            </Typography>
          </Grid>
          {user.lastLogin && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="textSecondary">
                Last Login
              </Typography>
              <Typography variant="body1">
                {formatDate(user.lastLogin)}
              </Typography>
            </Grid>
          )}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Status
            </Typography>
            <Chip label="Active" color="success" size="small" />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
```

### **AuthEvents.tsx**
Security events tracking and display component.

**Purpose:** Displays authentication security events for monitoring and debugging.

**Props:**
- `userId?: number` - Filter events by user ID (optional)
- `limit?: number` - Maximum number of events to display (default: 50)

**Features:**
- Display authentication security events
- Real-time event updates
- Event filtering and sorting
- Security event details
- Responsive table design

**Usage:**
```tsx
import { AuthEvents } from '../components/auth/AuthEvents';

<AuthEvents />
```

**Event Interface:**
```typescript
interface AuthEvent {
  id: number;
  userId?: number;
  action: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  errorReason?: string;
  metadata?: string;
}
```

**Implementation:**
```tsx
const AuthEvents: React.FC<AuthEventsProps> = ({ userId, limit = 50 }) => {
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/auth/events');
        const data = await response.json();
        setEvents(data.data || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Security Events
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Success</TableCell>
            <TableCell>IP Address</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.slice(0, limit).map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.action}</TableCell>
              <TableCell>
                <Chip
                  label={event.success ? 'Success' : 'Failed'}
                  color={event.success ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>{event.ipAddress || 'N/A'}</TableCell>
              <TableCell>{formatDate(event.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
```

### **AuthGuard.tsx**
Route protection component for securing SXP routes.

**Purpose:** Protects routes by checking authentication status and redirecting unauthenticated users.

**Props:**
- `children: React.ReactNode` - Protected content
- `redirectTo?: string` - Redirect path for unauthenticated users (default: '/auth')

**Features:**
- Automatic authentication checking
- Redirect to login page for unauthenticated users
- JWT token validation
- Seamless user experience
- Loading states

**Usage:**
```tsx
import { AuthGuard } from '../components/auth/AuthGuard';

<AuthGuard>
  <ProtectedComponent />
</AuthGuard>
```

**Implementation:**
```tsx
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/auth' 
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
};
```

## 🎣 useAuth Hook

### **useAuth.ts**
Custom React hook for authentication state management.

**Purpose:** Provides centralized authentication state and methods for the entire application.

**Returns:**
```typescript
interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}
```

**Features:**
- User authentication state
- Login and registration functions
- Logout functionality
- Token management
- API integration
- Error handling
- Loading states

**Usage:**
```tsx
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, login, register, logout, loading, error } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => login('email', 'password')}>Login</button>
          <button onClick={() => register('name', 'email', 'password')}>Register</button>
        </div>
      )}
    </div>
  );
};
```

**Implementation:**
```tsx
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setUser(data.data.user);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Initialize user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  return { user, loading, login, register, logout, error };
};
```

## 🎨 Styling and Theming

### **Material-UI Integration**
All components use Material-UI v7 components and follow the SXP design system:

```tsx
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress
} from '@mui/material';
```

### **Design System Integration**
Components integrate with the SXP design system:

```tsx
import { useDesignSystem } from '../../design-system';

const MyComponent = () => {
  const { colors, helpers } = useDesignSystem();
  
  return (
    <Box sx={{ 
      backgroundColor: colors.background.paper,
      color: colors.text.primary,
      ...helpers.getCardStyles()
    }}>
      {/* Component content */}
    </Box>
  );
};
```

## 🧪 Testing

### **Component Testing**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../components/auth/LoginForm';

test('LoginForm submits with correct data', () => {
  const mockLogin = jest.fn();
  render(<LoginForm onLogin={mockLogin} />);
  
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' }
  });
  fireEvent.click(screen.getByText('Login'));
  
  expect(mockLogin).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123'
  });
});
```

### **Hook Testing**
```tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';

test('useAuth hook manages authentication state', () => {
  const { result } = renderHook(() => useAuth());
  
  expect(result.current.user).toBeNull();
  expect(result.current.loading).toBe(true);
  
  act(() => {
    result.current.login('test@example.com', 'password123');
  });
  
  expect(result.current.user).toBeDefined();
  expect(result.current.loading).toBe(false);
});
```

## 📚 Best Practices

### **Component Design**
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Implement proper error handling
- Follow Material-UI design patterns
- Use the useAuth hook for authentication state

### **State Management**
- Use the useAuth hook for authentication state
- Store tokens in localStorage
- Implement proper loading states
- Handle errors gracefully

### **Security**
- Never log sensitive information
- Validate all inputs
- Use HTTPS in production
- Implement proper token handling

---

**Component Documentation Version:** 1.0.0  
**Last Updated:** January 2, 2025
