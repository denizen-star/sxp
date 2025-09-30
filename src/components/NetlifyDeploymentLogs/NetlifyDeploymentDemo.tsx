import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import { useDesignSystem } from '../../design-system';
import NetlifyDeploymentLogs from './NetlifyDeploymentLogs';

interface DemoConfig {
  accessToken: string;
  siteId: string;
  deployId: string;
  useMockData: boolean;
}

const NetlifyDeploymentDemo: React.FC = () => {
  const { colors } = useDesignSystem();
  const [config, setConfig] = useState<DemoConfig>({
    accessToken: '',
    siteId: '',
    deployId: '',
    useMockData: true
  });
  const [showDemo, setShowDemo] = useState(false);
  const [demoMode, setDemoMode] = useState<'mock' | 'real'>('mock');

  const handleConfigChange = (field: keyof DemoConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startDemo = () => {
    setShowDemo(true);
  };

  const stopDemo = () => {
    setShowDemo(false);
  };

  const switchMode = (mode: 'mock' | 'real') => {
    setDemoMode(mode);
    setConfig(prev => ({
      ...prev,
      useMockData: mode === 'mock'
    }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Netlify Deployment Logs Demo
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        This demo shows how to capture and display Netlify deployment log stages in real-time.
        You can use mock data for demonstration or connect to real Netlify deployments.
      </Typography>

      {!showDemo ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Configuration
            </Typography>
            
            <Box display="flex" gap={2} mb={3}>
              <Button
                variant={demoMode === 'mock' ? 'contained' : 'outlined'}
                onClick={() => switchMode('mock')}
                startIcon={<PlayArrowIcon />}
              >
                Mock Data Demo
              </Button>
              <Button
                variant={demoMode === 'real' ? 'contained' : 'outlined'}
                onClick={() => switchMode('real')}
                startIcon={<InfoIcon />}
              >
                Real Netlify Data
              </Button>
            </Box>

            {demoMode === 'real' && (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  To use real Netlify data, you'll need to provide your Netlify access token and site ID.
                  The access token can be generated in your Netlify account settings.
                </Alert>
                
                <TextField
                  fullWidth
                  label="Netlify Access Token"
                  type="password"
                  value={config.accessToken}
                  onChange={(e) => handleConfigChange('accessToken', e.target.value)}
                  margin="normal"
                  helperText="Get this from Netlify account settings > Applications > Personal access tokens"
                />
                
                <TextField
                  fullWidth
                  label="Site ID"
                  value={config.siteId}
                  onChange={(e) => handleConfigChange('siteId', e.target.value)}
                  margin="normal"
                  helperText="Find this in your site settings or API"
                />
                
                <TextField
                  fullWidth
                  label="Deploy ID (Optional)"
                  value={config.deployId}
                  onChange={(e) => handleConfigChange('deployId', e.target.value)}
                  margin="normal"
                  helperText="Leave empty to get the latest deployment"
                />
              </Box>
            )}

            {demoMode === 'mock' && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Mock data mode will show simulated deployment stages with realistic logs.
                No Netlify credentials required.
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={startDemo}
              disabled={demoMode === 'real' && (!config.accessToken || !config.siteId)}
              sx={{ mt: 2 }}
            >
              Start Demo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {demoMode === 'mock' ? 'Mock Data Demo' : 'Real Netlify Data'}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<StopIcon />}
                  onClick={stopDemo}
                >
                  Stop Demo
                </Button>
              </Box>
              
              {demoMode === 'mock' && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  This is simulated data showing how the deployment stages would appear.
                  In a real implementation, this would connect to your Netlify deployment logs.
                </Alert>
              )}
            </CardContent>
          </Card>

          <NetlifyDeploymentLogs
            siteId={config.siteId}
            deployId={config.deployId}
            accessToken={config.accessToken}
            useMockData={config.useMockData}
          />
        </Box>
      )}

      {/* Implementation Guide */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Implementation Guide
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Here's how to implement Netlify deployment logs in your application:
          </Typography>

          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="1. Install Dependencies"
                secondary="No additional dependencies required - uses built-in WebSocket and fetch APIs"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="2. Configure Netlify Service"
                secondary="Initialize the service with your Netlify access token and site ID"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="3. Connect to WebSocket"
                secondary="Use the WebSocket connection for real-time log streaming"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="4. Display Deployment Stages"
                secondary="Show the five deployment stages: Initializing, Building, Deploying, Cleanup, Post-processing"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Code Example:
          </Typography>
          
          <Paper sx={{ p: 2, backgroundColor: colors.background.light, fontFamily: 'monospace' }}>
            <pre>{`// Initialize the service
netlifyDeploymentService.initialize({
  accessToken: 'your-netlify-token',
  siteId: 'your-site-id',
  deployId: 'optional-deploy-id'
});

// Connect to real-time logs
await netlifyDeploymentService.connectToDeploymentLogs();

// Listen for updates
netlifyDeploymentService.addListener((data) => {
  console.log('New log data:', data);
  // Update your UI with new log data
});`}</pre>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NetlifyDeploymentDemo;
