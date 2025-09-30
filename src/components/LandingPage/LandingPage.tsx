import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Container,
  Chip,
  Avatar,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  People,
  Analytics,
  Security,
  Star,
  ArrowForward,
  CheckCircle,
  Psychology,
  BusinessCenter,
  Timeline
} from '@mui/icons-material';
import { useDesignSystem } from '../../design-system';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { colors } = useDesignSystem();
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology />,
      title: 'AI-Powered Persona Matching',
      description: 'Advanced ML algorithms analyze your profile to assign predictive personas and optimize your networking strategy.',
      color: '#9C27B0'
    },
    {
      icon: <People />,
      title: 'Intelligent Professional Networking',
      description: 'Connect with the right people through our sophisticated matching engine that ensures mutual benefit opportunities.',
      color: '#2196F3'
    },
    {
      icon: <Analytics />,
      title: 'Engagement Tracking & Analytics',
      description: 'Comprehensive relationship tracking and performance metrics to continuously optimize your networking success.',
      color: '#4CAF50'
    },
    {
      icon: <Security />,
      title: 'Secure Authentication',
      description: 'Robust user management with magic URL connectivity and privacy-compliant data handling.',
      color: '#FF9800'
    },
    {
      icon: <Timeline />,
      title: 'Smart Schedule Optimization',
      description: 'AI-curated events and co-working arrangements designed for maximum professional impact.',
      color: '#E91E63'
    },
    {
      icon: <BusinessCenter />,
      title: 'Career Development Tools',
      description: 'Personalized job search assistance, skill development tracking, and professional growth planning.',
      color: '#607D8B'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '2,500+', icon: <People /> },
    { label: 'Successful Matches', value: '15,000+', icon: <TrendingUp /> },
    { label: 'Networking Events', value: '500+', icon: <Star /> },
    { label: 'Success Rate', value: '94%', icon: <CheckCircle /> }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Data Scientist',
      company: 'TechCorp',
      content: 'SXP transformed my networking approach. I went from random connections to strategic relationships that actually advanced my career.',
      avatar: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Product Manager',
      company: 'StartupXYZ',
      content: 'The persona matching is incredible. I finally understand my networking style and can optimize it for maximum impact.',
      avatar: 'MR'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Research Director',
      company: 'Innovation Labs',
      content: 'The analytics dashboard gives me insights I never had before. My professional relationships are more strategic and successful.',
      avatar: 'EW'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.background.default }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(colors.primary.main, 0.1)} 0%, ${alpha(colors.secondary.main, 0.1)} 100%)`,
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${colors.primary.main}, ${colors.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                SXP
              </Typography>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 600, color: colors.text.primary, mb: 2 }}
              >
                Social Experiment Application
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                paragraph
                sx={{ mb: 4, lineHeight: 1.6 }}
              >
                Eliminate the guesswork from professional networking. Our AI-powered platform 
                uses proprietary data and persona-matching technology to connect you with the 
                exact people you need to meet for mutual benefit and maximum professional impact.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/navigation-guide')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/auth-demo')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  View Demo
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 400,
                  position: 'relative'
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main})`,
                    color: 'white',
                    maxWidth: 300,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    🎯 Smart Networking
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    AI-powered persona matching for professional success
                  </Typography>
                  <Chip
                    label="94% Success Rate"
                    sx={{
                      backgroundColor: alpha('#fff', 0.2),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: colors.background.paper }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: colors.primary.main,
                      mx: 'auto',
                      mb: 2,
                      width: 56,
                      height: 56
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: colors.primary.main }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Powerful Features
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Everything you need to transform your professional networking
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: feature.color,
                      mb: 2,
                      width: 56,
                      height: 56
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, backgroundColor: colors.background.paper }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            What Our Users Say
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            Real success stories from professionals who transformed their networking
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, backgroundColor: colors.primary.main }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role} at {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    "{testimonial.content}"
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main})`,
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to Transform Your Networking?
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of professionals who have already discovered the power of 
              AI-driven networking and relationship engineering.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/navigation-guide')}
                sx={{
                  backgroundColor: 'white',
                  color: colors.primary.main,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: alpha('#fff', 0.9)
                  }
                }}
              >
                Start Your Journey
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/auth-demo')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: alpha('#fff', 0.1)
                  }
                }}
              >
                Explore Demo
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
