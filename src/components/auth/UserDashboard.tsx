import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip
} from '@mui/material';
import { Person, Logout, Security } from '@mui/icons-material';

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
}

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Person sx={{ mr: 1 }} />
        <Typography variant="h5">Welcome, {user.name}!</Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="textSecondary">
            Email
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {user.email}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="textSecondary">
            Member Since
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {formatDate(user.createdAt)}
          </Typography>
        </Grid>
        {user.lastLogin && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="textSecondary">
              Last Login
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {formatDate(user.lastLogin)}
            </Typography>
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="textSecondary">
            Status
          </Typography>
          <Chip 
            label="Active" 
            color="success" 
            size="small"
            sx={{ mb: 1 }}
          />
        </Grid>
      </Grid>
      
      <Box display="flex" gap={2}>
        <Button
          variant="outlined"
          startIcon={<Security />}
          onClick={() => window.open('/auth-events', '_blank')}
        >
          View Security Events
        </Button>
        <Button
          variant="contained"
          startIcon={<Logout />}
          onClick={onLogout}
        >
          Sign Out
        </Button>
      </Box>
    </Paper>
  );
};

export default UserDashboard;
