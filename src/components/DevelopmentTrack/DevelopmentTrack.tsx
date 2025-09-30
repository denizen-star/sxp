/**
 * Development Track Component
 * Simplified development dashboard with real-time status monitoring
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  TextField
} from '@mui/material';
import { Refresh, CheckCircle, Error, Warning, Info, ArrowUpward, ArrowDownward, Star, StarBorder, CheckCircleOutline } from '@mui/icons-material';
import { useDesignSystem } from '../../design-system';

interface AppStatus {
  online: boolean;
  lastQATest: {
    status: 'passed' | 'failed' | 'running' | 'pending';
    timestamp: string;
    details: string;
  };
  lastRelease: {
    gitStatus: string;
    netlifyStatus: string;
    timestamp: string;
  };
  changes: string[];
  moduleIntegration: {
    [key: string]: {
      status: 'integrated' | 'pending' | 'failed';
      progress: number;
    };
  };
}

interface DevelopmentStatus {
  backlog: {
    modules: Array<{
      name: string;
      completion: number;
      next: Array<{
        id: string;
        task: string;
        priority: number;
        estimatedHours: number;
        assignee?: string;
        completed: boolean;
        order: number;
      }>;
      pending: Array<{
        id: string;
        task: string;
        priority: number;
        estimatedHours: number;
        assignee?: string;
        completed: boolean;
        order: number;
      }>;
    }>;
    backend: {
      next: Array<{
        id: string;
        task: string;
        priority: number;
        estimatedHours: number;
        assignee?: string;
        completed: boolean;
        order: number;
      }>;
      design: string[];
    };
    frontend: {
      next: Array<{
        id: string;
        task: string;
        priority: number;
        estimatedHours: number;
        assignee?: string;
        completed: boolean;
        order: number;
      }>;
      design: string[];
    };
  };
  commits: Array<{
    title: string;
    details: string;
    timestamp: string;
  }>;
}

interface TestResult {
  module: string;
  link: string;
  lastRun: string;
  status: 'passed' | 'failed' | 'running';
  results: string;
  recommendations: string[];
}

const DevelopmentTrack: React.FC = () => {
  const { colors, helpers } = useDesignSystem();
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>('');
  const [activeTab, setActiveTab] = useState('online');
  const [devActiveTab, setDevActiveTab] = useState('backlog');
  const [testActiveTab, setTestActiveTab] = useState('authentication');
  
  // State for all data
  const [appStatus, setAppStatus] = useState<AppStatus>({
    online: true,
    lastQATest: {
      status: 'passed',
      timestamp: '2025-01-19 21:15 EST',
      details: 'All core functionality tests passed'
    },
    lastRelease: {
      gitStatus: 'Deployed to main',
      netlifyStatus: 'Live on production',
      timestamp: '2025-01-19 21:00 EST'
    },
    changes: [
      'Fixed TypeScript compilation errors',
      'Updated design system components',
      'Enhanced authentication module',
      'Improved error handling'
    ],
    moduleIntegration: {
      'authentication': { status: 'integrated', progress: 100 },
      'persona': { status: 'integrated', progress: 85 },
      'schedule': { status: 'pending', progress: 60 }
    }
  });

  const [developmentStatus, setDevelopmentStatus] = useState<DevelopmentStatus>({
    backlog: {
      modules: [
        {
          name: 'Authentication Module',
          completion: 100,
          next: [
            { id: 'auth-1', task: 'Email verification enhancement', priority: 1, estimatedHours: 8, assignee: 'John Doe', completed: false, order: 1 },
            { id: 'auth-2', task: 'Password reset flow', priority: 2, estimatedHours: 6, assignee: 'Jane Smith', completed: false, order: 2 }
          ],
          pending: []
        },
        {
          name: 'Persona Module',
          completion: 85,
          next: [
            { id: 'persona-1', task: 'Onboarding flow completion', priority: 1, estimatedHours: 12, assignee: 'Mike Johnson', completed: false, order: 1 },
            { id: 'persona-2', task: 'Persona switching', priority: 2, estimatedHours: 4, assignee: 'Sarah Wilson', completed: false, order: 2 }
          ],
          pending: [
            { id: 'persona-3', task: 'Advanced persona analytics', priority: 3, estimatedHours: 16, assignee: 'Tom Brown', completed: false, order: 3 }
          ]
        },
        {
          name: 'Schedule Module',
          completion: 60,
          next: [
            { id: 'schedule-1', task: 'Time optimization algorithms', priority: 1, estimatedHours: 20, assignee: 'Alex Davis', completed: false, order: 1 },
            { id: 'schedule-2', task: 'Conflict resolution', priority: 2, estimatedHours: 10, assignee: 'Lisa Garcia', completed: false, order: 2 }
          ],
          pending: [
            { id: 'schedule-3', task: 'Calendar integration', priority: 3, estimatedHours: 14, assignee: 'Chris Lee', completed: false, order: 3 },
            { id: 'schedule-4', task: 'Export functionality', priority: 4, estimatedHours: 8, assignee: 'Emma Taylor', completed: false, order: 4 }
          ]
        }
      ],
      backend: {
        next: [
          { id: 'backend-1', task: 'API rate limiting', priority: 1, estimatedHours: 6, assignee: 'Backend Team', completed: false, order: 1 },
          { id: 'backend-2', task: 'Database optimization', priority: 2, estimatedHours: 12, assignee: 'DBA Team', completed: false, order: 2 },
          { id: 'backend-3', task: 'Caching layer', priority: 3, estimatedHours: 8, assignee: 'Backend Team', completed: false, order: 3 }
        ],
        design: ['Microservices architecture', 'Event-driven patterns']
      },
      frontend: {
        next: [
          { id: 'frontend-1', task: 'Component library expansion', priority: 2, estimatedHours: 16, assignee: 'Frontend Team', completed: false, order: 2 },
          { id: 'frontend-2', task: 'Accessibility improvements', priority: 1, estimatedHours: 10, assignee: 'UX Team', completed: false, order: 1 }
        ],
        design: ['Design system consistency', 'Mobile responsiveness']
      }
    },
    commits: [
      {
        title: 'Development Issues Resolution Complete',
        details: 'Fixed all TypeScript errors and compilation issues',
        timestamp: '2025-01-19 21:15 EST'
      },
      {
        title: 'ScheduleViewer Design System Integration',
        details: 'Integrated ScheduleViewer with design system components',
        timestamp: '2025-01-19 21:00 EST'
      },
      {
        title: 'Material-UI Grid v2 Compatibility Verified',
        details: 'Updated grid system for better responsive design',
        timestamp: '2025-01-19 20:45 EST'
      }
    ]
  });

  const [testResults, setTestResults] = useState<TestResult[]>([
    {
      module: 'Authentication',
      link: '/auth-demo',
      lastRun: '2025-01-19 21:10 EST',
      status: 'passed',
      results: 'All authentication flows working correctly',
      recommendations: []
    },
    {
      module: 'User Management',
      link: '/users',
      lastRun: '2025-01-19 20:45 EST',
      status: 'failed',
      results: 'User deletion functionality failing',
      recommendations: ['Fix cascade deletion', 'Add confirmation dialogs']
    },
    {
      module: 'Database',
      link: '/database-query',
      lastRun: '2025-01-19 20:30 EST',
      status: 'passed',
      results: 'All database operations successful',
      recommendations: []
    }
  ]);

  const refreshAllData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update timestamps
      const now = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      setLastRefresh(now);
      
      // Simulate data updates
      setAppStatus(prev => ({
        ...prev,
        lastQATest: {
          ...prev.lastQATest,
          timestamp: now
        }
      }));
      
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'integrated':
      case 'online':
        return <CheckCircle sx={{ color: colors.status.success, fontSize: 20 }} />;
      case 'failed':
        return <Error sx={{ color: colors.status.error, fontSize: 20 }} />;
      case 'running':
        return <CircularProgress size={20} />;
      case 'pending':
        return <Warning sx={{ color: colors.accent.teal, fontSize: 20 }} />;
      default:
        return <Info sx={{ color: colors.accent.blue, fontSize: 20 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'integrated':
      case 'online':
        return colors.status.success;
      case 'failed':
        return colors.status.error;
      case 'running':
        return colors.accent.blue;
      case 'pending':
        return colors.accent.teal;
      default:
        return colors.text.secondary;
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return colors.status.error;
    if (priority === 2) return colors.accent.teal;
    if (priority === 3) return colors.accent.blue;
    return colors.text.secondary;
  };

  const getPriorityIcon = (priority: number) => {
    if (priority === 1) return <Star sx={{ color: colors.status.error, fontSize: 16 }} />;
    if (priority === 2) return <StarBorder sx={{ color: colors.accent.teal, fontSize: 16 }} />;
    if (priority === 3) return <StarBorder sx={{ color: colors.accent.blue, fontSize: 16 }} />;
    return <StarBorder sx={{ color: colors.text.secondary, fontSize: 16 }} />;
  };

  const updateTaskPriority = (moduleIndex: number, taskType: 'next' | 'pending', taskIndex: number, newPriority: number) => {
    setDevelopmentStatus(prev => {
      const updated = { ...prev };
      updated.backlog.modules[moduleIndex][taskType][taskIndex].priority = newPriority;
      return updated;
    });
  };

  const toggleTaskCompletion = (moduleIndex: number, taskType: 'next' | 'pending', taskIndex: number) => {
    setDevelopmentStatus(prev => {
      const updated = { ...prev };
      updated.backlog.modules[moduleIndex][taskType][taskIndex].completed = !updated.backlog.modules[moduleIndex][taskType][taskIndex].completed;
      return updated;
    });
  };

  const updateTaskOrder = (moduleIndex: number, taskType: 'next' | 'pending', taskIndex: number, newOrder: number) => {
    setDevelopmentStatus(prev => {
      const updated = { ...prev };
      updated.backlog.modules[moduleIndex][taskType][taskIndex].order = newOrder;
      // Sort tasks by order
      updated.backlog.modules[moduleIndex][taskType].sort((a, b) => a.order - b.order);
      return updated;
    });
  };

  const moveTaskUp = (moduleIndex: number, taskType: 'next' | 'pending', taskIndex: number) => {
    if (taskIndex > 0) {
      setDevelopmentStatus(prev => {
        const updated = { ...prev };
        const tasks = updated.backlog.modules[moduleIndex][taskType];
        [tasks[taskIndex], tasks[taskIndex - 1]] = [tasks[taskIndex - 1], tasks[taskIndex]];
        return updated;
      });
    }
  };

  const moveTaskDown = (moduleIndex: number, taskType: 'next' | 'pending', taskIndex: number) => {
    setDevelopmentStatus(prev => {
      const updated = { ...prev };
      const tasks = updated.backlog.modules[moduleIndex][taskType];
      if (taskIndex < tasks.length - 1) {
        [tasks[taskIndex], tasks[taskIndex + 1]] = [tasks[taskIndex + 1], tasks[taskIndex]];
      }
      return updated;
    });
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: colors.text.primary, fontWeight: 600 }}>
          Development Track
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={refreshAllData}
          disabled={loading}
          sx={{ ...helpers.getButtonStyles() }}
        >
          {loading ? 'Refreshing...' : 'Refresh All'}
        </Button>
      </Box>

      {lastRefresh && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Last refreshed: {lastRefresh}
        </Alert>
      )}

      {/* App Status Card */}
      <Card sx={{ mb: 3, ...helpers.getCardStyles() }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
            📊 App Status
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { id: 'online', label: 'Online Status' },
                { id: 'qa', label: 'QA Test Status' },
                { id: 'release', label: 'Release Status' },
                { id: 'changes', label: 'What Changed' },
                { id: 'modules', label: 'Module Integration' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'contained' : 'text'}
                  onClick={() => setActiveTab(tab.id)}
                  sx={{ 
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    fontSize: '12px',
                    ...(activeTab === tab.id ? helpers.getButtonStyles() : {})
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ minHeight: 200 }}>
            {activeTab === 'online' && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getStatusIcon(appStatus.online ? 'online' : 'offline')}
                  <Typography sx={{ ml: 1, color: getStatusColor(appStatus.online ? 'online' : 'offline') }}>
                    {appStatus.online ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  Application is currently {appStatus.online ? 'running' : 'down'}
                </Typography>
              </Box>
            )}
            
            {activeTab === 'qa' && (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getStatusIcon(appStatus.lastQATest.status)}
                  <Typography sx={{ ml: 1, color: getStatusColor(appStatus.lastQATest.status) }}>
                    {appStatus.lastQATest.status.toUpperCase()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                  Last test: {appStatus.lastQATest.timestamp}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  {appStatus.lastQATest.details}
                </Typography>
              </Box>
            )}
            
            {activeTab === 'release' && (
              <Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                  <strong>Git:</strong> {appStatus.lastRelease.gitStatus}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                  <strong>Netlify:</strong> {appStatus.lastRelease.netlifyStatus}
                </Typography>
                <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                  <strong>Timestamp:</strong> {appStatus.lastRelease.timestamp}
                </Typography>
              </Box>
            )}
            
            {activeTab === 'changes' && (
              <Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                  Recent changes since last refresh:
                </Typography>
                <List dense>
                  {appStatus.changes.map((change, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={change}
                        primaryTypographyProps={{ fontSize: '12px' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            {activeTab === 'modules' && (
              <Box>
                {Object.entries(appStatus.moduleIntegration).map(([module, status]) => (
                  <Box key={module} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getStatusIcon(status.status)}
                      <Typography sx={{ ml: 1, fontWeight: 500 }}>
                        {module.charAt(0).toUpperCase() + module.slice(1)} Module
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                      Progress: {status.progress}% - {status.status}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Development Status Card */}
      <Card sx={{ mb: 3, ...helpers.getCardStyles() }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
            🚀 Development Status
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { id: 'backlog', label: 'Current Backlog' },
                { id: 'backend-frontend', label: 'Backend vs Frontend' },
                { id: 'commits', label: 'Last 10 Commits' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={devActiveTab === tab.id ? 'contained' : 'text'}
                  onClick={() => setDevActiveTab(tab.id)}
                  sx={{ 
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    fontSize: '12px',
                    ...(devActiveTab === tab.id ? helpers.getButtonStyles() : {})
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ minHeight: 200 }}>
            {devActiveTab === 'backlog' && (
              <Box>
                {developmentStatus.backlog.modules.map((module, moduleIndex) => (
                  <Paper key={moduleIndex} sx={{ p: 2, mb: 2, backgroundColor: colors.background.light }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.primary }}>
                      {module.name} ({module.completion}% complete)
                    </Typography>
                    {module.next.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 1, display: 'block' }}>
                          Next Tasks:
                        </Typography>
                        <List dense>
                          {module.next.map((task, taskIndex) => (
                            <ListItem key={taskIndex} sx={{ 
                              py: 0.5, 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              opacity: task.completed ? 0.6 : 1,
                              textDecoration: task.completed ? 'line-through' : 'none'
                            }}>
                              <Checkbox
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(moduleIndex, 'next', taskIndex)}
                                size="small"
                                sx={{ p: 0.5 }}
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                {getPriorityIcon(task.priority)}
                                <ListItemText 
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography sx={{ fontSize: '11px', flex: 1 }}>
                                        {task.task}
                                      </Typography>
                                      <Chip 
                                        label={`#${task.priority}`}
                                        size="small"
                                        sx={{ 
                                          height: '18px',
                                          fontSize: '9px',
                                          backgroundColor: getPriorityColor(task.priority),
                                          color: 'white'
                                        }}
                                      />
                                      <Typography sx={{ fontSize: '10px', color: colors.text.secondary }}>
                                        {task.estimatedHours}h
                                      </Typography>
                                      <Typography sx={{ fontSize: '10px', color: colors.text.secondary }}>
                                        {task.assignee}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={task.priority}
                                  onChange={(e) => updateTaskPriority(moduleIndex, 'next', taskIndex, parseInt(e.target.value) || 1)}
                                  sx={{ width: 60, '& input': { fontSize: '10px', textAlign: 'center' } }}
                                  inputProps={{ min: 1, max: 10 }}
                                />
                                <TextField
                                  size="small"
                                  type="number"
                                  value={task.order}
                                  onChange={(e) => updateTaskOrder(moduleIndex, 'next', taskIndex, parseInt(e.target.value) || 1)}
                                  sx={{ width: 60, '& input': { fontSize: '10px', textAlign: 'center' } }}
                                  inputProps={{ min: 1 }}
                                />
                                <IconButton 
                                  size="small" 
                                  onClick={() => moveTaskUp(moduleIndex, 'next', taskIndex)}
                                  disabled={taskIndex === 0}
                                >
                                  <ArrowUpward sx={{ fontSize: 14 }} />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => moveTaskDown(moduleIndex, 'next', taskIndex)}
                                  disabled={taskIndex === module.next.length - 1}
                                >
                                  <ArrowDownward sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                    {module.pending.length > 0 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: colors.text.secondary, mb: 1, display: 'block' }}>
                          Pending Tasks:
                        </Typography>
                        <List dense>
                          {module.pending.map((task, taskIndex) => (
                            <ListItem key={taskIndex} sx={{ 
                              py: 0.5, 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              opacity: task.completed ? 0.6 : 1,
                              textDecoration: task.completed ? 'line-through' : 'none'
                            }}>
                              <Checkbox
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(moduleIndex, 'pending', taskIndex)}
                                size="small"
                                sx={{ p: 0.5 }}
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                {getPriorityIcon(task.priority)}
                                <ListItemText 
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Typography sx={{ fontSize: '11px', flex: 1 }}>
                                        {task.task}
                                      </Typography>
                                      <Chip 
                                        label={`#${task.priority}`}
                                        size="small"
                                        sx={{ 
                                          height: '18px',
                                          fontSize: '9px',
                                          backgroundColor: getPriorityColor(task.priority),
                                          color: 'white'
                                        }}
                                      />
                                      <Typography sx={{ fontSize: '10px', color: colors.text.secondary }}>
                                        {task.estimatedHours}h
                                      </Typography>
                                      <Typography sx={{ fontSize: '10px', color: colors.text.secondary }}>
                                        {task.assignee}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={task.priority}
                                  onChange={(e) => updateTaskPriority(moduleIndex, 'pending', taskIndex, parseInt(e.target.value) || 1)}
                                  sx={{ width: 60, '& input': { fontSize: '10px', textAlign: 'center' } }}
                                  inputProps={{ min: 1, max: 10 }}
                                />
                                <TextField
                                  size="small"
                                  type="number"
                                  value={task.order}
                                  onChange={(e) => updateTaskOrder(moduleIndex, 'pending', taskIndex, parseInt(e.target.value) || 1)}
                                  sx={{ width: 60, '& input': { fontSize: '10px', textAlign: 'center' } }}
                                  inputProps={{ min: 1 }}
                                />
                                <IconButton 
                                  size="small" 
                                  onClick={() => moveTaskUp(moduleIndex, 'pending', taskIndex)}
                                  disabled={taskIndex === 0}
                                >
                                  <ArrowUpward sx={{ fontSize: 14 }} />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  onClick={() => moveTaskDown(moduleIndex, 'pending', taskIndex)}
                                  disabled={taskIndex === module.pending.length - 1}
                                >
                                  <ArrowDownward sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Box>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
            )}
            
            {devActiveTab === 'backend-frontend' && (
              <Box>
                <Paper sx={{ p: 2, mb: 2, backgroundColor: colors.background.light }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.primary }}>
                    Backend Next Steps
                  </Typography>
                  <List dense>
                    {developmentStatus.backlog.backend.next.map((task, index) => (
                      <ListItem key={index} sx={{ 
                        py: 0.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        opacity: task.completed ? 0.6 : 1,
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => {
                            setDevelopmentStatus(prev => {
                              const updated = { ...prev };
                              updated.backlog.backend.next[index].completed = !updated.backlog.backend.next[index].completed;
                              return updated;
                            });
                          }}
                          size="small"
                          sx={{ p: 0.5 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                          {getPriorityIcon(task.priority)}
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: '12px', flex: 1 }}>
                                  {task.task}
                                </Typography>
                                <Chip 
                                  label={`#${task.priority}`}
                                  size="small"
                                  sx={{ 
                                    height: '18px',
                                    fontSize: '9px',
                                    backgroundColor: getPriorityColor(task.priority),
                                    color: 'white'
                                  }}
                                />
                                <Typography sx={{ fontSize: '10px', color: colors.text.secondary }}>
                                  {task.estimatedHours}h
                                </Typography>
                                <Typography sx={{ fontSize: '10px', color: colors.text.secondary }}>
                                  {task.assignee}
                                </Typography>
                              </Box>
                            }
                          />
                        </Box>
                        <TextField
                          size="small"
                          type="number"
                          value={task.priority}
                          onChange={(e) => {
                            setDevelopmentStatus(prev => {
                              const updated = { ...prev };
                              updated.backlog.backend.next[index].priority = parseInt(e.target.value) || 1;
                              return updated;
                            });
                          }}
                          sx={{ width: 60, '& input': { fontSize: '10px', textAlign: 'center' } }}
                          inputProps={{ min: 1, max: 10 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1, display: 'block' }}>
                    Design Considerations:
                  </Typography>
                  <List dense>
                    {developmentStatus.backlog.backend.design.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{ fontSize: '11px' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
                <Paper sx={{ p: 2, backgroundColor: colors.background.light }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.primary }}>
                    Frontend Next Steps
                  </Typography>
                  <List dense>
                    {developmentStatus.backlog.frontend.next.map((task, index) => (
                      <ListItem key={index} sx={{ 
                        py: 0.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        opacity: task.completed ? 0.6 : 1,
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}>
                        <Checkbox
                          checked={task.completed}
                          onChange={() => {
                            setDevelopmentStatus(prev => {
                              const updated = { ...prev };
                              updated.backlog.frontend.next[index].completed = !updated.backlog.frontend.next[index].completed;
                              return updated;
                            });
                          }}
                          size="small"
                          sx={{ p: 0.5 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                          {getPriorityIcon(task.priority)}
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontSize: '12px', flex: 1 }}>
                                  {task.task}
                                </Typography>
                                <Chip 
                                  label={`#${task.priority}`}
                                  size="small"
                                  sx={{ 
                                    height: '18px',
                                    fontSize: '9px',
                                    backgroundColor: getPriorityColor(task.priority),
                                    color: 'white'
                                  }}
                                />
                                <Typography sx={{ fontSize: '10px', color: colors.text.secondary }}>
                                  {task.estimatedHours}h
                                </Typography>
                                <Typography sx={{ fontSize: '10px', color: colors.text.secondary }}>
                                  {task.assignee}
                                </Typography>
                              </Box>
                            }
                          />
                        </Box>
                        <TextField
                          size="small"
                          type="number"
                          value={task.priority}
                          onChange={(e) => {
                            setDevelopmentStatus(prev => {
                              const updated = { ...prev };
                              updated.backlog.frontend.next[index].priority = parseInt(e.target.value) || 1;
                              return updated;
                            });
                          }}
                          sx={{ width: 60, '& input': { fontSize: '10px', textAlign: 'center' } }}
                          inputProps={{ min: 1, max: 10 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1, display: 'block' }}>
                    Design Considerations:
                  </Typography>
                  <List dense>
                    {developmentStatus.backlog.frontend.design.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{ fontSize: '11px' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}
            
            {devActiveTab === 'commits' && (
              <Box>
                {developmentStatus.commits.map((commit, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2, backgroundColor: colors.background.light }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.primary }}>
                      {commit.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                      {commit.details}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                      {commit.timestamp}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Testing Results Card */}
      <Card sx={{ ...helpers.getCardStyles() }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
            🧪 Testing Results & Demo Links
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[
                ...testResults.map(result => ({ id: result.module.toLowerCase().replace(' ', '-'), label: result.module })),
                { id: 'new-tests', label: 'New Test Recommendations' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={testActiveTab === tab.id ? 'contained' : 'text'}
                  onClick={() => setTestActiveTab(tab.id)}
                  sx={{ 
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    fontSize: '12px',
                    ...(testActiveTab === tab.id ? helpers.getButtonStyles() : {})
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ minHeight: 200 }}>
            {testResults.map(result => {
              const tabId = result.module.toLowerCase().replace(' ', '-');
              return testActiveTab === tabId && (
                <Box key={tabId}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getStatusIcon(result.status)}
                    <Typography sx={{ ml: 1, color: getStatusColor(result.status) }}>
                      {result.status.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                    <strong>Test Link:</strong> <a href={result.link} target="_blank" rel="noopener noreferrer">{result.link}</a>
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                    <strong>Last Run:</strong> {result.lastRun}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                    <strong>Results:</strong> {result.results}
                  </Typography>
                  {result.recommendations.length > 0 && (
                    <Box>
                      <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 1 }}>
                        <strong>Recommendations:</strong>
                      </Typography>
                      <List dense>
                        {result.recommendations.map((rec, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={rec}
                              primaryTypographyProps={{ fontSize: '12px' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Box>
              );
            })}
            
            {testActiveTab === 'new-tests' && (
              <Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                  Priority test recommendations:
                </Typography>
                <List dense>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary="End-to-end user journey testing"
                      primaryTypographyProps={{ fontSize: '12px' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary="Performance testing under load"
                      primaryTypographyProps={{ fontSize: '12px' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary="Cross-browser compatibility testing"
                      primaryTypographyProps={{ fontSize: '12px' }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary="Security vulnerability scanning"
                      primaryTypographyProps={{ fontSize: '12px' }}
                    />
                  </ListItem>
                </List>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DevelopmentTrack;
