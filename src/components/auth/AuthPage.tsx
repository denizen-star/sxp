import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import UserDashboard from './UserDashboard';
import { useAuth } from '../../hooks/useAuth';

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, login, register, logout } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    return success;
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    return success;
  };

  if (isAuthenticated && user) {
    return <UserDashboard user={user} onLogout={logout} />;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" align="center" gutterBottom>
        SXP Authentication
      </Typography>
      
      <Paper sx={{ mt: 2 }}>
        <Tabs 
          value={tab} 
          onChange={(e, newValue) => setTab(newValue)}
          variant="fullWidth"
        >
          <Tab 
            icon={<LoginIcon />} 
            label="Sign In" 
            iconPosition="start"
          />
          <Tab 
            icon={<RegisterIcon />} 
            label="Create Account" 
            iconPosition="start"
          />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <LoginForm onLogin={handleLogin} loading={loading} />
          )}
          {tab === 1 && (
            <RegisterForm onRegister={handleRegister} loading={loading} />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthPage;
