/**
 * Services Available Component
 * Comprehensive overview of available services and workflows
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore, Code, Person, AdminPanelSettings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDesignSystem } from '../../design-system';

interface Service {
  name: string;
  description: string;
  status: 'active' | 'beta' | 'maintenance';
  endpoints: string[];
  documentation: string;
}

interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  actions: string[];
}

const ServicesAvailable: React.FC = () => {
  const { colors, helpers } = useDesignSystem();
  const navigate = useNavigate();

  const handleDocumentationClick = (link: string) => {
    navigate(link);
  };

  const [services] = useState<Service[]>([
    {
      name: 'Authentication Service',
      description: 'Complete user authentication and authorization system',
      status: 'active',
      endpoints: ['/auth/login', '/auth/register', '/auth/verify', '/auth/reset'],
      documentation: '/docs/authentication'
    },
    {
      name: 'User Management Service',
      description: 'User profile and account management',
      status: 'active',
      endpoints: ['/users/profile', '/users/update', '/users/delete'],
      documentation: '/docs/user-management'
    },
    {
      name: 'Schedule Service',
      description: 'Schedule creation and optimization',
      status: 'beta',
      endpoints: ['/schedule/create', '/schedule/optimize', '/schedule/export'],
      documentation: '/docs/schedule'
    },
    {
      name: 'Analytics Service',
      description: 'Usage analytics and reporting',
      status: 'beta',
      endpoints: ['/analytics/usage', '/analytics/reports'],
      documentation: '/docs/analytics'
    }
  ]);

  const [customerJourney] = useState<WorkflowStep[]>([
    {
      step: 1,
      title: 'Discovery & Onboarding',
      description: 'Customer discovers the platform and creates an account',
      actions: [
        'Visit landing page',
        'Select persona type',
        'Create account with email verification',
        'Complete onboarding questionnaire'
      ]
    },
    {
      step: 2,
      title: 'Schedule Creation',
      description: 'Customer creates their initial schedule based on persona',
      actions: [
        'View personalized schedule template',
        'Customize time allocations',
        'Set preferences and constraints',
        'Generate optimized schedule'
      ]
    },
    {
      step: 3,
      title: 'Usage & Optimization',
      description: 'Customer uses the schedule and receives optimizations',
      actions: [
        'Follow daily schedule',
        'Track completion rates',
        'Receive optimization suggestions',
        'Adjust schedule based on performance'
      ]
    },
    {
      step: 4,
      title: 'Analytics & Insights',
      description: 'Customer reviews their progress and insights',
      actions: [
        'View performance analytics',
        'Review time allocation effectiveness',
        'Export schedule data',
        'Share insights with others'
      ]
    }
  ]);

  const [developerJourney] = useState<WorkflowStep[]>([
    {
      step: 1,
      title: 'Environment Setup',
      description: 'Developer sets up development environment',
      actions: [
        'Clone repository',
        'Install dependencies',
        'Configure environment variables',
        'Run development server'
      ]
    },
    {
      step: 2,
      title: 'Module Development',
      description: 'Developer works on specific modules',
      actions: [
        'Choose module to work on',
        'Follow module documentation',
        'Implement features',
        'Write tests'
      ]
    },
    {
      step: 3,
      title: 'Integration & Testing',
      description: 'Developer integrates and tests their work',
      actions: [
        'Run integration tests',
        'Test with other modules',
        'Fix any conflicts',
        'Update documentation'
      ]
    },
    {
      step: 4,
      title: 'Deployment & Monitoring',
      description: 'Developer deploys and monitors their changes',
      actions: [
        'Create pull request',
        'Review and merge',
        'Deploy to staging',
        'Monitor for issues'
      ]
    }
  ]);

  const [adminJourney] = useState<WorkflowStep[]>([
    {
      step: 1,
      title: 'System Monitoring',
      description: 'Admin monitors system health and performance',
      actions: [
        'Check system status dashboard',
        'Review error logs',
        'Monitor user activity',
        'Check resource usage'
      ]
    },
    {
      step: 2,
      title: 'User Management',
      description: 'Admin manages user accounts and permissions',
      actions: [
        'View user accounts',
        'Manage user permissions',
        'Handle support requests',
        'Monitor user behavior'
      ]
    },
    {
      step: 3,
      title: 'Content & Configuration',
      description: 'Admin manages content and system configuration',
      actions: [
        'Update system settings',
        'Manage content updates',
        'Configure integrations',
        'Set up monitoring alerts'
      ]
    },
    {
      step: 4,
      title: 'Security & Compliance',
      description: 'Admin ensures security and compliance',
      actions: [
        'Review security logs',
        'Update security policies',
        'Handle security incidents',
        'Ensure compliance requirements'
      ]
    }
  ]);

  const quickStartCommands = [
    {
      category: 'Development',
      commands: [
        'npm install - Install all dependencies',
        'npm start - Start development server',
        'npm run build - Build for production',
        'npm test - Run test suite'
      ]
    },
    {
      category: 'Database',
      commands: [
        'npm run db:migrate - Run database migrations',
        'npm run db:seed - Seed database with test data',
        'npm run db:reset - Reset database',
        'npm run db:backup - Create database backup'
      ]
    },
    {
      category: 'Deployment',
      commands: [
        'npm run deploy:staging - Deploy to staging',
        'npm run deploy:production - Deploy to production',
        'npm run health:check - Check system health',
        'npm run logs:view - View application logs'
      ]
    }
  ];

  const projectStructure = {
    'src/': {
      'components/': { description: 'React components organized by feature', fileCount: 4 },
      'modules/': { description: 'Feature modules with their own structure', fileCount: 3 },
      'services/': { description: 'Business logic and API services', fileCount: 5 },
      'design-system/': { description: 'Reusable UI components and theme', fileCount: 15 },
      'store/': { description: 'State management (Zustand)', fileCount: 1 },
      'types/': { description: 'TypeScript type definitions', fileCount: 1 }
    },
    'docs/': {
      'api-documentation.md': { description: 'Complete API documentation', fileCount: 1 },
      'user-guide.md': { description: 'End-user documentation', fileCount: 1 },
      'development-status.md': { description: 'Current development status', fileCount: 1 },
      'deployment-guide.md': { description: 'Deployment instructions', fileCount: 1 },
      'setup-guide.md': { description: 'Setup and installation guide', fileCount: 1 },
      'contributing-guide.md': { description: 'Contributor guidelines', fileCount: 1 },
      'faq.md': { description: 'Frequently asked questions', fileCount: 1 },
      'sxp-modules.md': { description: 'SXP modules documentation', fileCount: 1 }
    },
    'Configuration Files': {
      'package.json': { description: 'Dependencies and scripts', fileCount: 1 },
      'tsconfig.json': { description: 'TypeScript configuration', fileCount: 1 },
      'netlify.toml': { description: 'Netlify deployment configuration', fileCount: 1 },
      'env.example': { description: 'Environment variables template', fileCount: 1 }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.status.success;
      case 'beta':
        return colors.accent.teal;
      case 'maintenance':
        return colors.status.error;
      default:
        return colors.text.secondary;
    }
  };


  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Typography variant="h4" sx={{ color: colors.text.primary, fontWeight: 600, mb: 3 }}>
        Services Available
      </Typography>

      {/* Services Overview Card */}
      <Card sx={{ mb: 3, ...helpers.getCardStyles() }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
            🔧 Services Overview
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            {services.map((service, index) => (
              <Paper key={index} sx={{ p: 2, backgroundColor: colors.background.light }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ mr: 1, color: colors.text.primary }}>
                    {service.name}
                  </Typography>
                  <Chip
                    label={service.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(service.status),
                      color: 'white',
                      fontSize: '10px',
                      height: '20px'
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                  {service.description}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.text.secondary, display: 'block', mb: 1 }}>
                  Endpoints:
                </Typography>
                <List dense>
                  {service.endpoints.map((endpoint, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={endpoint}
                        primaryTypographyProps={{ fontSize: '11px', fontFamily: 'monospace' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* New Usage Workflow Card */}
      <Card sx={{ mb: 3, ...helpers.getCardStyles() }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
            🚀 New Usage Workflow
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1, color: colors.accent.blue }} />
                <Typography variant="subtitle2">Customer Journey</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                {customerJourney.map((step, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    backgroundColor: colors.background.light,
                    position: 'relative'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      top: -10,
                      left: 20,
                      backgroundColor: colors.accent.blue,
                      color: 'white',
                      borderRadius: '50%',
                      width: 30,
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {step.step}
                    </Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.primary, mt: 2 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                      {step.description}
                    </Typography>
                    <List dense>
                      {step.actions.map((action, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={`• ${action}`}
                            primaryTypographyProps={{ fontSize: '12px' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Code sx={{ mr: 1, color: colors.accent.teal }} />
                <Typography variant="subtitle2">Developer Journey</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                {developerJourney.map((step, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    backgroundColor: colors.background.light,
                    position: 'relative'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      top: -10,
                      left: 20,
                      backgroundColor: colors.accent.teal,
                      color: 'white',
                      borderRadius: '50%',
                      width: 30,
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {step.step}
                    </Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.primary, mt: 2 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                      {step.description}
                    </Typography>
                    <List dense>
                      {step.actions.map((action, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={`• ${action}`}
                            primaryTypographyProps={{ fontSize: '12px' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AdminPanelSettings sx={{ mr: 1, color: colors.accent.blue }} />
                <Typography variant="subtitle2">Admin Journey</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                {adminJourney.map((step, index) => (
                  <Paper key={index} sx={{ 
                    p: 2, 
                    backgroundColor: colors.background.light,
                    position: 'relative'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      top: -10,
                      left: 20,
                      backgroundColor: colors.accent.blue,
                      color: 'white',
                      borderRadius: '50%',
                      width: 30,
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {step.step}
                    </Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.primary, mt: 2 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                      {step.description}
                    </Typography>
                    <List dense>
                      {step.actions.map((action, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={`• ${action}`}
                            primaryTypographyProps={{ fontSize: '12px' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Quick Start Commands Card */}
      <Card sx={{ mb: 3, ...helpers.getCardStyles() }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
            ⚡ Quick Start Commands
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            {quickStartCommands.map((category, index) => (
              <Paper key={index} sx={{ p: 2, backgroundColor: colors.background.light }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.primary }}>
                  {category.category}
                </Typography>
                <List dense>
                  {category.commands.map((command, idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={command}
                        primaryTypographyProps={{ fontSize: '11px', fontFamily: 'monospace' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Project Structure & File Analysis Card */}
      <Card sx={{ ...helpers.getCardStyles() }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
            📁 Project Structure & File Analysis
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            {Object.entries(projectStructure).map(([category, items], index) => (
              <Paper key={index} sx={{ p: 2, backgroundColor: colors.background.light }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.primary }}>
                  {category}
                </Typography>
                <List dense>
                  {Object.entries(items).map(([item, data], idx) => (
                    <ListItem key={idx} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '11px', fontFamily: 'monospace' }}>
                              {item}
                            </Typography>
                            <Chip 
                              label={`${data.fileCount} files`}
                              size="small"
                              sx={{ 
                                height: '20px',
                                fontSize: '9px',
                                backgroundColor: colors.accent.blue,
                                color: 'white'
                              }}
                            />
                          </Box>
                        }
                        secondary={data.description}
                        secondaryTypographyProps={{ fontSize: '10px' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Instructions for Operation Card */}
      <Card sx={{ ...helpers.getCardStyles() }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
            📚 Instructions for Operation
          </Typography>
          <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 3 }}>
            Comprehensive guides and documentation for operating the SXP platform
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            {[
              {
                title: 'API Documentation',
                description: 'Complete API reference and endpoints',
                link: '/docs/api-documentation',
                category: 'Technical'
              },
              {
                title: 'User Guide',
                description: 'End-user instructions and tutorials',
                link: '/docs/user-guide',
                category: 'User'
              },
              {
                title: 'Setup Guide',
                description: 'Installation and configuration instructions',
                link: '/docs/setup-guide',
                category: 'Setup'
              },
              {
                title: 'Deployment Guide',
                description: 'Production deployment instructions',
                link: '/docs/deployment-guide',
                category: 'Deployment'
              },
              {
                title: 'Development Status',
                description: 'Current development progress and status',
                link: '/docs/development-status',
                category: 'Development'
              },
              {
                title: 'Contributing Guide',
                description: 'Guidelines for contributors and developers',
                link: '/docs/contributing-guide',
                category: 'Development'
              },
              {
                title: 'FAQ',
                description: 'Frequently asked questions and answers',
                link: '/docs/faq',
                category: 'Support'
              },
              {
                title: 'SXP Modules',
                description: 'Module-specific documentation and guides',
                link: '/docs/sxp-modules',
                category: 'Technical'
              }
            ].map((guide, index) => (
              <Paper key={index} sx={{ 
                p: 2, 
                backgroundColor: colors.background.light,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: colors.text.primary }}>
                    {guide.title}
                  </Typography>
                  <Chip 
                    label={guide.category}
                    size="small"
                    sx={{ 
                      height: '20px',
                      fontSize: '9px',
                      backgroundColor: colors.accent.teal,
                      color: 'white'
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 2 }}>
                  {guide.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ 
                    fontSize: '10px',
                    textTransform: 'none',
                    borderColor: colors.accent.blue,
                    color: colors.accent.blue,
                    '&:hover': {
                      backgroundColor: colors.accent.blue,
                      color: 'white'
                    }
                  }}
                  onClick={() => handleDocumentationClick(guide.link)}
                >
                  View Guide →
                </Button>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServicesAvailable;
