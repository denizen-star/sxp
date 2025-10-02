import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading = false }) => {
  const [email, setEmail] = useState('admin@sxp.com');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await onLogin(email, password);
      if (!success) {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <LoginIcon sx={{ mr: 1 }} />
        <Typography variant="h5">Sign In</Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Paper>
  );
};

export default LoginForm;
