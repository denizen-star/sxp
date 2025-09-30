/**
 * Enhanced Signup Component
 * Improved user creation process with better UX
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  LinearProgress,
  Chip,
  FormControlLabel,
  Checkbox,
  // Divider
} from '@mui/material';
import { 
  PersonAdd, 
  Security, 
  Email,
  Person,
  Lock
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { ValidationUtils } from '../../utils/validationUtils';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

const EnhancedSignup: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    acceptTerms: false,
    acceptMarketing: false
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string[]}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const { signup } = useAuth();

  // Steps configuration (commented out for now)
  // const steps = [
  //   {
  //     label: 'Personal Information',
  //     icon: <Person />,
  //     description: 'Tell us about yourself'
  //   },
  //   {
  //     label: 'Account Security',
  //     icon: <Security />,
  //     description: 'Create a secure password'
  //   },
  //   {
  //     label: 'Email Verification',
  //     icon: <Email />,
  //     description: 'Verify your email address'
  //   },
  //   {
  //     label: 'Complete',
  //     icon: <CheckCircle />,
  //     description: 'Welcome to Optimizer!'
  //   }
  // ];

  const validateField = (field: string, value: string) => {
    let errors: string[] = [];
    
    switch (field) {
      case 'email':
        const emailValidation = ValidationUtils.validateEmail(value);
        errors = emailValidation.errors;
        break;
      case 'password':
        const passwordValidation = ValidationUtils.validatePassword(value);
        errors = passwordValidation.errors;
        if (value !== formData.confirmPassword && formData.confirmPassword) {
          errors.push('Passwords do not match');
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errors.push('Passwords do not match');
        }
        break;
      case 'name':
        const nameValidation = ValidationUtils.validateName(value);
        errors = nameValidation.errors;
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: errors
    }));
    
    return errors.length === 0;
  };

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (typeof value === 'string') {
      validateField(field, value);
    }
  };

  const canProceedToNextStep = () => {
    switch (activeStep) {
      case 0: // Personal Information
        return formData.name.trim() !== '' && 
               formData.email.trim() !== '' && 
               !validationErrors.name?.length && 
               !validationErrors.email?.length;
      case 1: // Account Security
        return formData.password !== '' && 
               formData.confirmPassword !== '' && 
               formData.password === formData.confirmPassword &&
               !validationErrors.password?.length && 
               !validationErrors.confirmPassword?.length;
      case 2: // Email Verification
        return formData.acceptTerms;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNextStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const success = await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        acceptTerms: formData.acceptTerms
      });
      
      if (success) {
        setSubmitStatus('success');
        setSubmitMessage('Account created! Please check your email for verification instructions.');
        setActiveStep(3); // Move to email verification step
      } else {
        setSubmitStatus('error');
        setSubmitMessage('Failed to create account. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return {
      score: strength,
      label: strength < 2 ? 'Weak' : strength < 4 ? 'Medium' : 'Strong',
      color: strength < 2 ? 'error' : strength < 4 ? 'warning' : 'success'
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: '15px', fontWeight: 'normal' }}>
        Create Your Account
      </Typography>
      
      <Box sx={{ 
        borderTop: '0.05px solid #2c3e50', 
        margin: '30px 0' 
      }} />
      
      <Typography variant="body1" color="text.secondary" align="center" paragraph>
        Join Optimizer and start optimizing your daily routine
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        {/* Step 1: Personal Information */}
        <Step>
          <StepLabel icon={<Person />}>
            <Typography variant="h6">Personal Information</Typography>
            <Typography variant="body2" color="text.secondary">
              Tell us about yourself
            </Typography>
          </StepLabel>
          <StepContent>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  margin="normal"
                  error={!!validationErrors.name?.length}
                  helperText={validationErrors.name?.[0]}
                  placeholder="Enter your full name"
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  margin="normal"
                  error={!!validationErrors.email?.length}
                  helperText={validationErrors.email?.[0]}
                  placeholder="Enter your email address"
                />
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!canProceedToNextStep()}
                    startIcon={<PersonAdd />}
                  >
                    Continue
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </StepContent>
        </Step>

        {/* Step 2: Account Security */}
        <Step>
          <StepLabel icon={<Security />}>
            <Typography variant="h6">Account Security</Typography>
            <Typography variant="body2" color="text.secondary">
              Create a secure password
            </Typography>
          </StepLabel>
          <StepContent>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  margin="normal"
                  error={!!validationErrors.password?.length}
                  helperText={validationErrors.password?.[0]}
                  placeholder="Create a strong password"
                />
                
                {formData.password && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2">Password Strength:</Typography>
                      <Chip 
                        label={passwordStrength.label} 
                        color={passwordStrength.color as any}
                        size="small"
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(passwordStrength.score / 5) * 100}
                      color={passwordStrength.color as any}
                    />
                  </Box>
                )}

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  margin="normal"
                  error={!!validationErrors.confirmPassword?.length}
                  helperText={validationErrors.confirmPassword?.[0]}
                  placeholder="Confirm your password"
                />
                
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!canProceedToNextStep()}
                    startIcon={<Lock />}
                  >
                    Continue
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </StepContent>
        </Step>

        {/* Step 3: Email Verification */}
        <Step>
          <StepLabel icon={<Email />}>
            <Typography variant="h6">Email Verification</Typography>
            <Typography variant="body2" color="text.secondary">
              Verify your email address
            </Typography>
          </StepLabel>
          <StepContent>
            <Card>
              <CardContent>
                <Typography variant="body1" paragraph>
                  We'll send a verification email to <strong>{formData.email}</strong>
                </Typography>
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptTerms}
                      onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                    />
                  }
                  label="I accept the Terms and Conditions"
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptMarketing}
                      onChange={(e) => handleInputChange('acceptMarketing', e.target.checked)}
                    />
                  }
                  label="I'd like to receive marketing emails (optional)"
                />
                
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!canProceedToNextStep() || isSubmitting}
                    startIcon={<Email />}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Box>
                
                {isSubmitting && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress />
                  </Box>
                )}
                
                {submitStatus === 'error' && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {submitMessage}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </StepContent>
        </Step>

        {/* Step 4: Email Verification */}
        <Step>
          <StepLabel icon={<Email />}>
            <Typography variant="h6">Email Verification</Typography>
            <Typography variant="body2" color="text.secondary">
              Check your email to complete setup
            </Typography>
          </StepLabel>
          <StepContent>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Email sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    Check Your Email!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    We've sent a verification email to <strong>{formData.email}</strong>. 
                    Please check your inbox and click the verification link to activate your account.
                  </Typography>
                  
                  {submitStatus === 'success' && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      {submitMessage}
                    </Alert>
                  )}
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Didn't receive the email? Check your spam folder or{' '}
                    <Button 
                      variant="text" 
                      onClick={() => window.location.href = '/email-test'}
                    >
                      test email functionality
                    </Button>
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => window.location.href = '/auth-demo'}
                    >
                      Go to Login
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
};

export default EnhancedSignup;
