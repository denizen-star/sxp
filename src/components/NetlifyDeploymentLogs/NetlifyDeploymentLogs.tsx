import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { useDesignSystem } from '../../design-system';
import { netlifyDeploymentService, DeploymentInfo, DeploymentStage } from '../../services/netlifyDeploymentService';

interface NetlifyDeploymentLogsProps {
  siteId?: string;
  deployId?: string;
  accessToken?: string;
  useMockData?: boolean;
}

const NetlifyDeploymentLogs: React.FC<NetlifyDeploymentLogsProps> = ({
  siteId,
  deployId,
  accessToken,
  useMockData = false
}) => {
  const { colors } = useDesignSystem();
  const [deployment, setDeployment] = useState<DeploymentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  // Initialize service
  useEffect(() => {
    if (accessToken && siteId) {
      netlifyDeploymentService.initialize({
        accessToken,
        siteId,
        deployId
      });
    }
  }, [accessToken, siteId, deployId]);

  // Load deployment data
  const loadDeployment = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data for demonstration
        const mockDeployment = netlifyDeploymentService.createMockDeployment();
        setDeployment(mockDeployment);
        setIsLoading(false);
        return;
      }

      if (!accessToken || !siteId) {
        throw new Error('Netlify configuration is required');
      }

      if (deployId) {
        // Load specific deployment
        const deploymentInfo = await netlifyDeploymentService.getDeploymentInfo(deployId);
        setDeployment(deploymentInfo);
      } else {
        // Load recent deployments
        const deployments = await netlifyDeploymentService.getRecentDeployments(1);
        if (deployments.length > 0) {
          setDeployment(deployments[0]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deployment data');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, siteId, deployId, useMockData]);

  // Connect to real-time logs
  const connectToLogs = useCallback(async () => {
    if (!deployId || useMockData) return;

    try {
      await netlifyDeploymentService.connectToDeploymentLogs(deployId);
      setIsConnected(true);

      // Listen for real-time updates
      netlifyDeploymentService.addListener((data) => {
        console.log('Received deployment log data:', data);
        // Update deployment with new log data
        setDeployment(prev => {
          if (!prev) return prev;
          
          // Update stages with new log data
          const updatedStages = prev.stages.map(stage => {
            if (data.stage === stage.id) {
              return {
                ...stage,
                logs: [...stage.logs, data.message],
                status: data.status || stage.status
              };
            }
            return stage;
          });

          return {
            ...prev,
            stages: updatedStages,
            updatedAt: new Date()
          };
        });
      });
    } catch (err) {
      console.error('Failed to connect to deployment logs:', err);
    }
  }, [deployId, useMockData]);

  // Disconnect from logs
  const disconnectFromLogs = useCallback(() => {
    netlifyDeploymentService.disconnect();
    setIsConnected(false);
  }, []);

  // Load initial data
  useEffect(() => {
    loadDeployment();
  }, [loadDeployment]);

  // Connect to real-time logs when deployment is loaded
  useEffect(() => {
    if (deployment && !useMockData) {
      connectToLogs();
    }

    return () => {
      disconnectFromLogs();
    };
  }, [deployment, connectToLogs, disconnectFromLogs, useMockData]);

  // Get stage status icon
  const getStageIcon = (status: DeploymentStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'running':
        return <CircularProgress size={20} />;
      case 'pending':
        return <ScheduleIcon color="disabled" />;
      default:
        return <ScheduleIcon color="disabled" />;
    }
  };

  // Get stage status color
  const getStageColor = (status: DeploymentStage['status']) => {
    switch (status) {
      case 'completed':
        return colors.success.main;
      case 'failed':
        return colors.error.main;
      case 'running':
        return colors.primary.main;
      case 'pending':
        return colors.text.secondary;
      default:
        return colors.text.secondary;
    }
  };

  // Format duration
  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    return `${(duration / 1000).toFixed(1)}s`;
  };

  // Copy deployment URL
  const copyDeploymentUrl = () => {
    if (deployment?.deployUrl) {
      navigator.clipboard.writeText(deployment.deployUrl);
    }
  };

  // Copy logs to clipboard
  const copyLogs = (logs: string[]) => {
    navigator.clipboard.writeText(logs.join('\n'));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!deployment) {
    return (
      <Alert severity="info">
        No deployment data available. {!useMockData && 'Please configure Netlify credentials.'}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h1">
              Netlify Deployment Logs
            </Typography>
            <Box display="flex" gap={1}>
              {!useMockData && (
                <Button
                  variant="outlined"
                  startIcon={isConnected ? <StopIcon /> : <PlayArrowIcon />}
                  onClick={isConnected ? disconnectFromLogs : connectToLogs}
                  size="small"
                >
                  {isConnected ? 'Disconnect' : 'Connect Live'}
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadDeployment}
                size="small"
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Deployment Info */}
          <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
            <Chip
              label={`Status: ${deployment.status.toUpperCase()}`}
              color={deployment.status === 'ready' ? 'success' : deployment.status === 'error' ? 'error' : 'primary'}
              variant="outlined"
            />
            <Chip
              label={`Deploy ID: ${deployment.id}`}
              variant="outlined"
            />
            {deployment.deployUrl && (
              <Chip
                label="View Deployment"
                icon={<OpenInNewIcon />}
                onClick={() => window.open(deployment.deployUrl, '_blank')}
                variant="outlined"
                clickable
              />
            )}
          </Box>

          {/* Overall Progress */}
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Overall Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={deployment.stages.filter(s => s.status === 'completed').length * 20}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Deployment Stages */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Deployment Stages
        </Typography>
        
        {deployment.stages.map((stage, index) => (
          <Accordion
            key={stage.id}
            expanded={expandedStage === stage.id}
            onChange={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: expandedStage === stage.id ? colors.background.secondary : 'transparent',
                '&:hover': {
                  backgroundColor: colors.background.secondary
                }
              }}
            >
              <Box display="flex" alignItems="center" width="100%">
                <Box display="flex" alignItems="center" flex={1}>
                  {getStageIcon(stage.status)}
                  <Typography variant="h6" sx={{ ml: 1, color: getStageColor(stage.status) }}>
                    {stage.name}
                  </Typography>
                  {stage.duration && (
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      ({formatDuration(stage.duration)})
                    </Typography>
                  )}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={stage.status.toUpperCase()}
                    size="small"
                    color={stage.status === 'completed' ? 'success' : stage.status === 'failed' ? 'error' : 'primary'}
                    variant="outlined"
                  />
                  {stage.logs.length > 0 && (
                    <Chip
                      label={`${stage.logs.length} logs`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              {stage.logs.length > 0 ? (
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2">Logs</Typography>
                    <Tooltip title="Copy logs">
                      <IconButton size="small" onClick={() => copyLogs(stage.logs)}>
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <List dense>
                    {stage.logs.map((log, logIndex) => (
                      <ListItem key={logIndex} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={log}
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontFamily: 'monospace',
                            color: stage.status === 'failed' ? 'error.main' : 'text.primary'
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No logs available for this stage
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Footer Info */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Deployment created: {deployment.createdAt.toLocaleString()}
            {deployment.updatedAt.getTime() !== deployment.createdAt.getTime() && (
              <> • Last updated: {deployment.updatedAt.toLocaleString()}</>
            )}
          </Typography>
          {useMockData && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This is mock data for demonstration. Configure real Netlify credentials to see actual deployment logs.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NetlifyDeploymentLogs;
