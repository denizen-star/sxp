/**
 * Authentication Activity Component
 * Displays user authentication events with detailed timestamps and security information
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Security,
  Login,
  Logout,
  PersonAdd,
  Lock,
  LockOpen,
  Warning,
  CheckCircle,
  Error,
  Info,
  Download,
  Refresh,
  LocationOn,
  Computer,
  Smartphone,
  Tablet,
  Schedule
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../hooks/useAuth';
import { AuthEvent, AuthAction } from '../../services/authTrackingService';

interface AuthActivityProps {
  showStats?: boolean;
  maxEvents?: number;
}

const AuthActivity: React.FC<AuthActivityProps> = ({ 
  showStats = true, 
  maxEvents = 50 
}) => {
  const { getAuthEvents, getAuthStats } = useAuth();
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [stats, setStats] = useState<any>({});
  const [selectedEvent, setSelectedEvent] = useState<AuthEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAuthActivity = () => {
    setLoading(true);
    try {
      const authEvents = getAuthEvents().slice(0, maxEvents);
      const authStats = getAuthStats();
      
      setEvents(authEvents);
      setStats(authStats);
    } catch (error) {
      console.error('Failed to load auth activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: AuthAction) => {
    switch (action) {
      case AuthAction.LOGIN_SUCCESS:
      case AuthAction.LOGIN_ATTEMPT:
        return <Login />;
      case AuthAction.LOGOUT:
        return <Logout />;
      case AuthAction.SIGNUP_SUCCESS:
      case AuthAction.SIGNUP_ATTEMPT:
        return <PersonAdd />;
      case AuthAction.PASSWORD_CHANGE:
      case AuthAction.PASSWORD_RESET_REQUEST:
        return <Lock />;
      case AuthAction.ACCOUNT_LOCKED:
        return <Lock color="error" />;
      case AuthAction.ACCOUNT_UNLOCKED:
        return <LockOpen color="success" />;
      case AuthAction.SUSPICIOUS_ACTIVITY:
        return <Warning color="warning" />;
      case AuthAction.EMAIL_VERIFICATION_SUCCESS:
        return <CheckCircle color="success" />;
      case AuthAction.TWO_FACTOR_ENABLED:
      case AuthAction.TWO_FACTOR_DISABLED:
        return <Security />;
      default:
        return <Info />;
    }
  };

  const getActionColor = (action: AuthAction, success: boolean) => {
    if (!success) return 'error';
    
    switch (action) {
      case AuthAction.LOGIN_SUCCESS:
      case AuthAction.SIGNUP_SUCCESS:
      case AuthAction.EMAIL_VERIFICATION_SUCCESS:
      case AuthAction.TWO_FACTOR_ENABLED:
        return 'success';
      case AuthAction.LOGIN_FAILURE:
      case AuthAction.SIGNUP_FAILURE:
      case AuthAction.ACCOUNT_LOCKED:
      case AuthAction.SUSPICIOUS_ACTIVITY:
        return 'error';
      case AuthAction.LOGOUT:
      case AuthAction.PASSWORD_CHANGE:
      case AuthAction.TWO_FACTOR_DISABLED:
        return 'warning';
      default:
        return 'info';
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone fontSize="small" />;
      case 'tablet':
        return <Tablet fontSize="small" />;
      default:
        return <Computer fontSize="small" />;
    }
  };

  const formatActionText = (action: AuthAction) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const exportAuthActivity = () => {
    const csvData = events.map(event => ({
      timestamp: format(event.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      action: formatActionText(event.action),
      success: event.success ? 'Success' : 'Failed',
      email: event.email || '',
      ipAddress: event.ipAddress || '',
      userAgent: event.userAgent || '',
      location: event.location?.timezone || '',
      errorReason: event.errorReason || ''
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auth-activity-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSeverityLevel = (event: AuthEvent) => {
    if (event.action === AuthAction.SUSPICIOUS_ACTIVITY) return 'high';
    if (event.action === AuthAction.ACCOUNT_LOCKED) return 'high';
    if (!event.success && event.action.includes('LOGIN')) return 'medium';
    if (!event.success) return 'medium';
    return 'low';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Loading Authentication Activity...</Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: '15px', fontWeight: 'normal' }}>
        Authentication Activity
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom sx={{ fontSize: '12px' }}>
        Monitor security events, login attempts, and authentication activities
      </Typography>
      
      <Box sx={{ 
        borderTop: '0.05px solid #2c3e50', 
        margin: '30px 0' 
      }} />

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<Refresh />}
            onClick={loadAuthActivity}
            variant="outlined"
            size="small"
          >
            Refresh
          </Button>
          <Button
            startIcon={<Download />}
            onClick={exportAuthActivity}
            variant="outlined"
            size="small"
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Security Alerts */}
      {events.some(e => getSeverityLevel(e) === 'high') && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Security Alert</Typography>
          High-risk authentication activities detected. Please review your recent login activity.
        </Alert>
      )}

      {/* Statistics Cards */}
      {showStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Login color="primary" />
                  <Box>
                    <Typography variant="h4">{stats.successfulLogins || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Successful Logins (24h)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Error color="error" />
                  <Box>
                    <Typography variant="h4">{stats.failedLogins || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Failed Attempts (24h)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonAdd color="success" />
                  <Box>
                    <Typography variant="h4">{stats.signups || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      New Signups (24h)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning color="warning" />
                  <Box>
                    <Typography variant="h4">{stats.suspiciousActivities || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Suspicious Activity (24h)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Events Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow 
                key={event.id}
                sx={{ 
                  backgroundColor: getSeverityLevel(event) === 'high' ? 'rgba(244, 67, 54, 0.05)' : 'inherit'
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {format(event.timestamp, 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(event.timestamp, 'HH:mm:ss')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getActionIcon(event.action)}
                    <Typography variant="body2">
                      {formatActionText(event.action)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={event.success ? 'Success' : 'Failed'}
                    color={getActionColor(event.action, event.success) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {event.email || '-'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getDeviceIcon(event.deviceInfo?.type)}
                    <Box>
                      <Typography variant="body2">
                        {event.deviceInfo?.browser || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.deviceInfo?.os || 'Unknown OS'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn fontSize="small" color="disabled" />
                    <Typography variant="body2">
                      {event.location?.timezone || 'Unknown'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Info />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Event Details Dialog */}
      <Dialog
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedEvent && getActionIcon(selectedEvent.action)}
            Authentication Event Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><Schedule /></ListItemIcon>
                      <ListItemText
                        primary="Timestamp"
                        secondary={format(selectedEvent.timestamp, 'PPpp')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Info /></ListItemIcon>
                      <ListItemText
                        primary="Action"
                        secondary={formatActionText(selectedEvent.action)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {selectedEvent.success ? <CheckCircle color="success" /> : <Error color="error" />}
                      </ListItemIcon>
                      <ListItemText
                        primary="Status"
                        secondary={selectedEvent.success ? 'Success' : 'Failed'}
                      />
                    </ListItem>
                    {selectedEvent.errorReason && (
                      <ListItem>
                        <ListItemIcon><Warning color="error" /></ListItemIcon>
                        <ListItemText
                          primary="Error Reason"
                          secondary={selectedEvent.errorReason}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon><LocationOn /></ListItemIcon>
                      <ListItemText
                        primary="Location"
                        secondary={selectedEvent.location?.timezone || 'Unknown'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>{getDeviceIcon(selectedEvent.deviceInfo?.type)}</ListItemIcon>
                      <ListItemText
                        primary="Device"
                        secondary={`${selectedEvent.deviceInfo?.browser || 'Unknown'} on ${selectedEvent.deviceInfo?.os || 'Unknown'}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Computer /></ListItemIcon>
                      <ListItemText
                        primary="IP Address"
                        secondary={selectedEvent.ipAddress || 'Unknown'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Security /></ListItemIcon>
                      <ListItemText
                        primary="Session ID"
                        secondary={selectedEvent.sessionId || 'Unknown'}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              {selectedEvent.metadata && Object.keys(selectedEvent.metadata).length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>Additional Information</Typography>
                  <Box sx={{ backgroundColor: 'grey.100', p: 2, borderRadius: 1 }}>
                    <pre style={{ fontSize: '0.875rem', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(selectedEvent.metadata, null, 2)}
                    </pre>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEvent(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {events.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Security sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No authentication activity found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Authentication events will appear here once you start using the application.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AuthActivity;
