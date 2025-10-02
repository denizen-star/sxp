import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Button,
  CircularProgress
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface AuthEvent {
  id: number;
  user_id: number;
  action: string;
  timestamp: string;
  ip_address: string;
  success: boolean;
}

const AuthEvents: React.FC = () => {
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('sxp_auth_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Check if we're in production (no API_BASE) or development
      const isProduction = process.env.NODE_ENV === 'production';
      
      if (isProduction) {
        // Use localStorage for production
        const events = JSON.parse(localStorage.getItem('sxp_auth_events') || '[]');
        setEvents(events);
      } else {
        // Use backend API for development
        const response = await fetch('http://localhost:3001/api/auth/events', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError('Failed to load events');
        }
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'success';
      case 'register': return 'info';
      case 'logout': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Authentication Events</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadEvents}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{formatDate(event.timestamp)}</TableCell>
                <TableCell>
                  <Chip 
                    label={event.action} 
                    color={getActionColor(event.action) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{event.user_id}</TableCell>
                <TableCell>{event.ip_address}</TableCell>
                <TableCell>
                  <Chip 
                    label={event.success ? 'Success' : 'Failed'} 
                    color={event.success ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuthEvents;
