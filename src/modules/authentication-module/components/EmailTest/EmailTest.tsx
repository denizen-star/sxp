/**
 * Email Test Component
 * Test email functionality with SendGrid integration
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
  Chip,
  Divider
} from '@mui/material';
import { Email, Send, CheckCircle, Warning } from '@mui/icons-material';
import { SimpleEmailService } from '../../services/simpleEmailService';

const EmailTest: React.FC = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('Test User');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const hasSendGridKey = !!process.env.REACT_APP_SENDGRID_API_KEY;

  const handleTestVerificationEmail = async () => {
    if (!testEmail) {
      setTestResult({
        type: 'error',
        message: 'Please enter an email address'
      });
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const success = await SimpleEmailService.sendVerificationEmail({
        email: testEmail,
        name: testName,
        userId: 'test_user_' + Date.now()
      });

      if (success) {
        setTestResult({
          type: 'success',
          message: hasSendGridKey 
            ? 'Verification email sent successfully via SendGrid! Check your inbox.'
            : 'Verification email logged to console. Check browser console for the verification URL.'
        });
      } else {
        setTestResult({
          type: 'error',
          message: 'Failed to send verification email'
        });
      }
    } catch (error) {
      setTestResult({
        type: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestWelcomeEmail = async () => {
    if (!testEmail) {
      setTestResult({
        type: 'error',
        message: 'Please enter an email address'
      });
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const success = await SimpleEmailService.sendWelcomeEmail(testEmail, testName);

      if (success) {
        setTestResult({
          type: 'success',
          message: hasSendGridKey 
            ? 'Welcome email sent successfully via SendGrid! Check your inbox.'
            : 'Welcome email logged to console. Check browser console for details.'
        });
      } else {
        setTestResult({
          type: 'error',
          message: 'Failed to send welcome email'
        });
      }
    } catch (error) {
      setTestResult({
        type: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: '15px', fontWeight: 'normal' }}>
        Email Test Center
      </Typography>
      
      <Box sx={{ 
        borderTop: '0.05px solid #2c3e50', 
        margin: '30px 0' 
      }} />
      
      <Typography variant="body1" color="text.secondary" align="center" paragraph>
        Test email functionality with SendGrid integration
      </Typography>

      {/* Configuration Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configuration Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
              icon={hasSendGridKey ? <CheckCircle /> : <Warning />}
              label={hasSendGridKey ? 'SendGrid Configured' : 'SendGrid Not Configured'}
              color={hasSendGridKey ? 'success' : 'warning'}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {hasSendGridKey 
              ? '✅ SendGrid API key found. Emails will be sent via SendGrid.'
              : '⚠️ No SendGrid API key found. Emails will be logged to console only.'
            }
          </Typography>
          {!hasSendGridKey && (
            <Alert severity="info" sx={{ mt: 2 }}>
              To send real emails, add <code>REACT_APP_SENDGRID_API_KEY</code> to your .env file
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Test Form */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Email Functionality
          </Typography>
          
          <TextField
            fullWidth
            label="Test Email Address"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            margin="normal"
            placeholder="Enter your email address to test"
          />
          
          <TextField
            fullWidth
            label="Test Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            margin="normal"
            placeholder="Enter test name"
          />

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<Email />}
              onClick={handleTestVerificationEmail}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Sending...' : 'Test Verification Email'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Send />}
              onClick={handleTestWelcomeEmail}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'Sending...' : 'Test Welcome Email'}
            </Button>
          </Box>

          {testResult && (
            <Alert severity={testResult.type} sx={{ mt: 2 }}>
              {testResult.message}
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            <strong>Note:</strong> If SendGrid is not configured, check the browser console for email details and verification URLs.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmailTest;
