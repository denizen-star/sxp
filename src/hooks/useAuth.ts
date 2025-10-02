import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const API_BASE = process.env.NODE_ENV === 'production' 
  ? null // Use localStorage for production demo
  : 'http://localhost:3001/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  // Check for existing token on mount
  useEffect(() => {
    // Initialize admin user for production demo
    if (!API_BASE) {
      const users = JSON.parse(localStorage.getItem('sxp_users') || '[]');
      if (users.length === 0) {
        const adminUser = {
          id: 1,
          name: 'Admin',
          email: 'admin@sxp.com',
          password: 'Admin123!',
          createdAt: new Date().toISOString()
        };
        users.push(adminUser);
        localStorage.setItem('sxp_users', JSON.stringify(users));
      }
    }
    
    const token = localStorage.getItem('sxp_auth_token');
    if (token) {
      if (API_BASE) {
        loadUserProfile(token);
      } else {
        // Handle localStorage token for production
        try {
          const payload = JSON.parse(atob(token));
          const users = JSON.parse(localStorage.getItem('sxp_users') || '[]');
          const user = users.find((u: any) => u.id === payload.userId);
          if (user) {
            setAuthState({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: new Date().toISOString()
              },
              isAuthenticated: true,
              loading: false
            });
          } else {
            localStorage.removeItem('sxp_auth_token');
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        } catch (error) {
          localStorage.removeItem('sxp_auth_token');
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const loadUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false
        });
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('sxp_auth_token');
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      localStorage.removeItem('sxp_auth_token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false
      });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (API_BASE) {
        // Use backend API for development
        const response = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
          localStorage.setItem('sxp_auth_token', data.token);
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            loading: false
          });
          return true;
        }
        
        return false;
      } else {
        // Use localStorage for production demo
        const users = JSON.parse(localStorage.getItem('sxp_users') || '[]');
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (!user) {
          return false;
        }
        
        const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
        localStorage.setItem('sxp_auth_token', token);
        
        // Log authentication event
        const events = JSON.parse(localStorage.getItem('sxp_auth_events') || '[]');
        events.push({
          id: events.length + 1,
          user_id: user.id,
          action: 'login',
          timestamp: new Date().toISOString(),
          ip_address: 'unknown',
          success: true
        });
        localStorage.setItem('sxp_auth_events', JSON.stringify(events));
        
        setAuthState({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            lastLogin: new Date().toISOString()
          },
          isAuthenticated: true,
          loading: false
        });
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      if (API_BASE) {
        // Use backend API for development
        const response = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
          localStorage.setItem('sxp_auth_token', data.token);
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            loading: false
          });
          return true;
        }
        
        return false;
      } else {
        // Use localStorage for production demo
        const users = JSON.parse(localStorage.getItem('sxp_users') || '[]');
        
        // Check if user already exists
        if (users.find((u: any) => u.email === email)) {
          return false;
        }
        
        const newUser = {
          id: users.length + 1,
          name: name,
          email: email,
          password: password,
          createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('sxp_users', JSON.stringify(users));
        
        const token = btoa(JSON.stringify({ userId: newUser.id, email: newUser.email }));
        localStorage.setItem('sxp_auth_token', token);
        
        // Log authentication event
        const events = JSON.parse(localStorage.getItem('sxp_auth_events') || '[]');
        events.push({
          id: events.length + 1,
          user_id: newUser.id,
          action: 'register',
          timestamp: new Date().toISOString(),
          ip_address: 'unknown',
          success: true
        });
        localStorage.setItem('sxp_auth_events', JSON.stringify(events));
        
        setAuthState({
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            lastLogin: new Date().toISOString()
          },
          isAuthenticated: true,
          loading: false
        });
        return true;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('sxp_auth_token');
      if (token) {
        if (API_BASE) {
          // Use backend API for development
          await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          // Log logout event for production
          try {
            const payload = JSON.parse(atob(token));
            const events = JSON.parse(localStorage.getItem('sxp_auth_events') || '[]');
            events.push({
              id: events.length + 1,
              user_id: payload.userId,
              action: 'logout',
              timestamp: new Date().toISOString(),
              ip_address: 'unknown',
              success: true
            });
            localStorage.setItem('sxp_auth_events', JSON.stringify(events));
          } catch (e) {
            // Token is invalid, continue with logout
          }
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sxp_auth_token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false
      });
    }
  };

  return {
    ...authState,
    login,
    register,
    logout
  };
};
