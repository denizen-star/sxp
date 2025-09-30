/**
 * Authentication Demo Component
 * Demonstrates the authentication tracking system with sample actions
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Login, PersonAdd, Lock, Logout } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { ValidationUtils } from '../../utils/validationUtils';

const AuthDemo: React.FC = () => {
  const [email, setEmail] = useState('demo@optimizer.com');
  const [password, setPassword] = useState('Demo123!');
  const [name, setName] = useState('Demo User');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});

  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    resetPassword,
    changePassword
  } = useAuth();

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const validateField = (field: string, value: string) => {
    let errors: string[] = [];
    
    switch (field) {
      case 'email':
        const emailValidation = ValidationUtils.validateEmail(value);
        errors = emailValidation.errors;
        break;
      case 'password':
        const passwordValidation = ValidationUtils.validatePassword(value);
        errors = passwordValidation.errors;
        break;
      case 'name':
        const nameValidation = ValidationUtils.validateName(value);
        errors = nameValidation.errors;
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: errors
    }));
    
    return errors.length === 0;
  };

  const validateAllFields = () => {
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);
    const nameValid = validateField('name', name);
    
    return emailValid && passwordValid && nameValid;
  };

  const handleLogin = async () => {
    const success = await login({ email, password, rememberMe: true });
    if (success) {
      showMessage('Login successful! Check the Security tab to see the tracked event.', 'success');
    } else {
      showMessage('Login failed. This failure has been tracked for security monitoring.', 'error');
    }
  };

  const handleSignup = async () => {
    if (!validateAllFields()) {
      showMessage('Please fix the validation errors before signing up.', 'error');
      return;
    }
    
    const success = await signup({ 
      email, 
      password, 
      name, 
      acceptTerms: true 
    });
    if (success) {
      showMessage('Signup successful! Welcome to Optimizer.', 'success');
    } else {
      showMessage('Signup failed. Please try again.', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    showMessage('You have been logged out. This action has been tracked.', 'info');
  };

  const handleResetPassword = async () => {
    const success = await resetPassword(email);
    if (success) {
      showMessage('Password reset email sent. This request has been tracked.', 'success');
    } else {
      showMessage('Password reset failed.', 'error');
    }
  };

  const handleChangePassword = async () => {
    const success = await changePassword('demo123', 'newPassword123');
    if (success) {
      showMessage('Password changed successfully. This security action has been tracked.', 'success');
    } else {
      showMessage('Password change failed.', 'error');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: '15px', fontWeight: 'normal' }}>
        Authentication Demo & Tracking
      </Typography>
      
      <Box sx={{ 
        borderTop: '0.05px solid #2c3e50', 
        margin: '30px 0' 
      }} />
      
      <Typography variant="body1" paragraph color="text.secondary">
        This demo shows how all authentication actions are tracked with timestamps.
        Try the actions below and then check the "Security" tab to see the tracked events.
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Current User Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Status
              </Typography>
              {isAuthenticated && user ? (
                <Box>
                  <Typography variant="body1">
                    <strong>Logged in as:</strong> {user.name} ({user.email})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User ID: {user.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Login: {user.lastLoginAt.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email Verified: {user.emailVerified ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    2FA Enabled: {user.twoFactorEnabled ? 'Yes' : 'No'}
                  </Typography>
                  <Button
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    variant="outlined"
                    color="warning"
                    sx={{ mt: 2 }}
                    disabled={isLoading}
                  >
                    Logout
                  </Button>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Not authenticated
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Authentication Actions */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Authentication Actions
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateField('email', e.target.value);
                  }}
                  margin="dense"
                  size="small"
                  error={validationErrors.email && validationErrors.email.length > 0}
                  helperText={validationErrors.email && validationErrors.email[0]}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField('password', e.target.value);
                  }}
                  margin="dense"
                  size="small"
                  error={validationErrors.password && validationErrors.password.length > 0}
                  helperText={validationErrors.password && validationErrors.password[0]}
                />
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateField('name', e.target.value);
                  }}
                  margin="dense"
                  size="small"
                  error={validationErrors.name && validationErrors.name.length > 0}
                  helperText={validationErrors.name && validationErrors.name[0]}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  startIcon={<Login />}
                  onClick={handleLogin}
                  variant="contained"
                  disabled={isLoading || isAuthenticated}
                  fullWidth
                >
                  Login (Tracked)
                </Button>
                
                <Button
                  startIcon={<PersonAdd />}
                  onClick={handleSignup}
                  variant="outlined"
                  disabled={isLoading || isAuthenticated}
                  fullWidth
                >
                  Sign Up (Tracked)
                </Button>
                
                <Button
                  startIcon={<Lock />}
                  onClick={handleResetPassword}
                  variant="outlined"
                  color="secondary"
                  disabled={isLoading}
                  fullWidth
                >
                  Reset Password (Tracked)
                </Button>

                {isAuthenticated && (
                  <Button
                    startIcon={<Lock />}
                    onClick={handleChangePassword}
                    variant="outlined"
                    color="warning"
                    disabled={isLoading}
                    fullWidth
                  >
                    Change Password (Tracked)
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tracking Information */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                What Gets Tracked
              </Typography>
              <Typography variant="body2" paragraph>
                Every authentication action is tracked with comprehensive details:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Timestamp Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Exact date and time
                    • Timezone information
                    • Relative time (e.g., "2 minutes ago")
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    User Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • User ID (if logged in)
                    • Email address
                    • Session ID
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Device & Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Device type (desktop/mobile/tablet)
                    • Browser information
                    • Operating system
                    • IP address (backend)
                    • Geographic location (backend)
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Security Monitoring
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Success/failure status
                    • Error reasons
                    • Suspicious activity detection
                    • Account lockout tracking
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary">
                <strong>Try this:</strong> Attempt to login with wrong credentials multiple times to see 
                how the system tracks failed attempts and detects suspicious activity.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthDemo;
