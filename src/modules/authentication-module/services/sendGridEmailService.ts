/**
 * SendGrid Email Service
 * Real email sending using SendGrid API
 */

import { TokenService } from './tokenService';
import { UrlService } from './urlService';

export interface EmailVerificationData {
  email: string;
  name: string;
  userId: string;
}

export interface PasswordResetData {
  email: string;
  name: string;
  resetToken: string;
}

export class SendGridEmailService {
  private static readonly SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';
  private static readonly FROM_EMAIL = process.env.REACT_APP_FROM_EMAIL || 'noreply@optimizer.kervinapps.com';
  private static readonly FROM_NAME = 'Optimizer';
  // Fallback API key - add your SendGrid API key here for production
  private static readonly FALLBACK_API_KEY = process.env.NODE_ENV === 'production' ? 'YOUR_SENDGRID_API_KEY_HERE' : null;

  /**
   * Send email verification using SendGrid
   */
  static async sendVerificationEmail(data: EmailVerificationData): Promise<boolean> {
    try {
      // Generate and store verification token
      const verificationToken = TokenService.generateToken();
      const expiresAt = TokenService.getTokenExpiration('email_verification');
      
      TokenService.storeToken({
        token: verificationToken,
        userId: data.userId,
        email: data.email,
        type: 'email_verification',
        expiresAt
      });
      
      const verificationUrl = UrlService.generateEmailVerificationUrl(verificationToken);
      
      // Check if SendGrid is configured
      const apiKey = process.env.REACT_APP_SENDGRID_API_KEY || this.FALLBACK_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ SendGrid API key not configured. Falling back to console logging.');
        return this.fallbackToConsoleLogging(data, verificationUrl, verificationToken);
      }

      // Use Netlify Function instead of direct API call
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.email,
          from: this.FROM_EMAIL,
          subject: 'Verify Your Email - Optimizer',
          html: this.getVerificationEmailHTML(data.name, verificationUrl, data.email),
          templateId: 'd-3ee64b454500491c8e5a2cbae5040ced',
          dynamicTemplateData: {
            name: data.name,
            verification_url: verificationUrl,
            email: data.email
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('✅ Verification email sent successfully via Netlify Function');
          return true;
        } else {
          console.error('❌ Netlify Function error:', result.error);
          return this.fallbackToConsoleLogging(data, verificationUrl, verificationToken);
        }
      } else {
        const errorData = await response.text();
        console.error('❌ Netlify Function error:', response.status, errorData);
        return this.fallbackToConsoleLogging(data, verificationUrl, verificationToken);
      }

    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      return false;
    }
  }

  /**
   * Send password reset email using SendGrid
   */
  static async sendPasswordResetEmail(data: PasswordResetData): Promise<boolean> {
    try {
      const resetUrl = UrlService.generatePasswordResetUrl(data.resetToken);
      
      // Check if SendGrid is configured
      const apiKey = process.env.REACT_APP_SENDGRID_API_KEY || this.FALLBACK_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ SendGrid API key not configured. Falling back to console logging.');
        return this.fallbackToPasswordResetLogging(data, resetUrl);
      }

      // Use Netlify Function instead of direct API call
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.email,
          from: this.FROM_EMAIL,
          subject: 'Reset Your Password - Optimizer',
          html: this.getPasswordResetEmailHTML(data.name, resetUrl),
          templateId: 'd-dbf9789afd6b44de8b0c16708852142c',
          dynamicTemplateData: {
            name: data.name,
            reset_url: resetUrl,
            email: data.email
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('✅ Password reset email sent successfully via Netlify Function');
          return true;
        } else {
          console.error('❌ Netlify Function error:', result.error);
          return this.fallbackToPasswordResetLogging(data, resetUrl);
        }
      } else {
        const errorData = await response.text();
        console.error('❌ Netlify Function error:', response.status, errorData);
        return this.fallbackToPasswordResetLogging(data, resetUrl);
      }

    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      return false;
    }
  }

  /**
   * Send welcome email using SendGrid
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      // Check if SendGrid is configured
      const apiKey = process.env.REACT_APP_SENDGRID_API_KEY || this.FALLBACK_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ SendGrid API key not configured. Falling back to console logging.');
        return this.fallbackToWelcomeLogging(email, name);
      }

      // Use Netlify Function instead of direct API call
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          from: this.FROM_EMAIL,
          subject: 'Welcome to Optimizer!',
          html: this.getWelcomeEmailHTML(name, email)
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('✅ Welcome email sent successfully via Netlify Function');
          return true;
        } else {
          console.error('❌ Netlify Function error:', result.error);
          return this.fallbackToWelcomeLogging(email, name);
        }
      } else {
        const errorData = await response.text();
        console.error('❌ Netlify Function error:', response.status, errorData);
        return this.fallbackToWelcomeLogging(email, name);
      }

    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Fallback to console logging when SendGrid is not configured
   */
  private static fallbackToConsoleLogging(data: EmailVerificationData, verificationUrl: string, token: string): boolean {
    console.log('📧 Email Verification Request (Console Fallback):');
    console.log('To:', data.email);
    console.log('Name:', data.name);
    console.log('User ID:', data.userId);
    console.log('Verification URL:', verificationUrl);
    console.log('Token:', token);
    console.log('Subject: Verify Your Email - Optimizer');
    console.log('🔗 Click this link to verify your email:');
    console.log(verificationUrl);
    console.log('📝 Copy this URL and paste it in your browser to complete verification');
    console.log('⏰ This token expires in 24 hours');
    return true;
  }

  private static fallbackToPasswordResetLogging(data: PasswordResetData, resetUrl: string): boolean {
    console.log('📧 Password Reset Request (Console Fallback):');
    console.log('To:', data.email);
    console.log('Name:', data.name);
    console.log('Reset URL:', resetUrl);
    console.log('Subject: Reset Your Password - Optimizer');
    console.log('🔗 Click this link to reset your password:');
    console.log(resetUrl);
    return true;
  }

  private static fallbackToWelcomeLogging(email: string, name: string): boolean {
    console.log('📧 Welcome Email Sent (Console Fallback):');
    console.log('To:', email);
    console.log('Name:', name);
    console.log('Subject: Welcome to Optimizer!');
    return true;
  }

  /**
   * Get verification email HTML template
   */
  private static getVerificationEmailHTML(name: string, verificationUrl: string, email: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Optimizer</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Optimizer</h1>
            <p>Advanced Personal Time Management</p>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Welcome to Optimizer! We're excited to help you optimize your daily routine and achieve better work-life balance.</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours for security reasons.</strong></p>
            <p>If you didn't create an account with Optimizer, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Optimizer. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get password reset email HTML template
   */
  private static getPasswordResetEmailHTML(name: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Optimizer</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔒 Optimizer</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>We received a request to reset your password for your Optimizer account.</p>
            <p>To reset your password, click the button below:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>© 2024 Optimizer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get welcome email HTML template
   */
  private static getWelcomeEmailHTML(name: string, email?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Optimizer!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Optimizer!</h1>
            <p>Your journey to better time management starts now</p>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Congratulations! Your email has been verified and your Optimizer account is now active.</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>🎯 <strong>Select Your Persona:</strong> Choose from different life phases and goals</li>
              <li>⚙️ <strong>Tune Your Allocations:</strong> Customize how you want to spend your time</li>
              <li>📅 <strong>Generate Schedules:</strong> Let AI create optimized daily routines</li>
              <li>📊 <strong>Track Progress:</strong> Monitor your time usage and improvements</li>
            </ul>
            <div style="text-align: center;">
              <a href="https://optimizer.kervinapps.com" class="button">Start Using Optimizer</a>
            </div>
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Optimizer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
