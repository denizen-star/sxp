import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { PersonAdd as RegisterIcon } from '@mui/icons-material';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string) => Promise<boolean>;
  loading?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, loading = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    try {
      const success = await onRegister(name, email, password);
      if (!success) {
        setError('Registration failed. Email may already exist.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <RegisterIcon sx={{ mr: 1 }} />
        <Typography variant="h5">Create Account</Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
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
          helperText="At least 6 characters"
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </Paper>
  );
};

export default RegisterForm;
