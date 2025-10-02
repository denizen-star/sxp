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
  ? '/.netlify/functions/auth/api' 
  : 'http://localhost:3001/api';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('sxp_auth_token');
    if (token) {
      loadUserProfile(token);
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
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
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
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('sxp_auth_token');
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
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
