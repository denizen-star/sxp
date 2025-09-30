/**
 * Simple Email Service
 * Handles email sending using SendGrid API with fallback to console logging
 */

// import { UrlService } from './urlService';
// import { TokenService } from './tokenService';
import { SendGridEmailService } from './sendGridEmailService';

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

export class SimpleEmailService {
  /**
   * Send email verification using SendGrid
   */
  static async sendVerificationEmail(data: EmailVerificationData): Promise<boolean> {
    try {
      // Use SendGrid service for real email sending
      return await SendGridEmailService.sendVerificationEmail(data);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }

  /**
   * Send password reset email using SendGrid
   */
  static async sendPasswordResetEmail(data: PasswordResetData): Promise<boolean> {
    try {
      // Use SendGrid service for real email sending
      return await SendGridEmailService.sendPasswordResetEmail(data);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  /**
   * Send welcome email using SendGrid
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      // Use SendGrid service for real email sending
      return await SendGridEmailService.sendWelcomeEmail(email, name);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Get email templates (for reference)
   */
  static getEmailTemplates() {
    return {
      verification: {
        subject: 'Verify Your Email - Optimizer',
        html: this.getVerificationEmailTemplate(),
        text: this.getVerificationEmailText()
      },
      passwordReset: {
        subject: 'Reset Your Password - Optimizer',
        html: this.getPasswordResetEmailTemplate(),
        text: this.getPasswordResetEmailText()
      },
      welcome: {
        subject: 'Welcome to Optimizer!',
        html: this.getWelcomeEmailTemplate(),
        text: this.getWelcomeEmailText()
      }
    };
  }

  private static getVerificationEmailTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Optimizer</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
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
            <h2>Hi {{name}}!</h2>
            <p>Welcome to Optimizer! We're excited to help you optimize your daily routine and achieve better work-life balance.</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{{verificationUrl}}</p>
            <p><strong>This link will expire in 24 hours for security reasons.</strong></p>
            <p>If you didn't create an account with Optimizer, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 Optimizer. All rights reserved.</p>
            <p>This email was sent to {{email}}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private static getVerificationEmailText(): string {
    return `
Hi {{name}}!

Welcome to Optimizer! We're excited to help you optimize your daily routine and achieve better work-life balance.

To get started, please verify your email address by visiting this link:
{{verificationUrl}}

This link will expire in 24 hours for security reasons.

If you didn't create an account with Optimizer, you can safely ignore this email.

Best regards,
The Optimizer Team

© 2024 Optimizer. All rights reserved.
    `;
  }

  private static getPasswordResetEmailTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Optimizer</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
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
            <h2>Hi {{name}}!</h2>
            <p>We received a request to reset your password for your Optimizer account.</p>
            <p>To reset your password, click the button below:</p>
            <div style="text-align: center;">
              <a href="{{resetUrl}}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{{resetUrl}}</p>
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

  private static getPasswordResetEmailText(): string {
    return `
Hi {{name}}!

We received a request to reset your password for your Optimizer account.

To reset your password, visit this link:
{{resetUrl}}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
The Optimizer Team

© 2024 Optimizer. All rights reserved.
    `;
  }

  private static getWelcomeEmailTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Optimizer!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
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
            <h2>Hi {{name}}!</h2>
            <p>Congratulations! Your email has been verified and your Optimizer account is now active.</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>🎯 <strong>Select Your Persona:</strong> Choose from different life phases and goals</li>
              <li>⚙️ <strong>Tune Your Allocations:</strong> Customize how you want to spend your time</li>
              <li>📅 <strong>Generate Schedules:</strong> Let AI create optimized daily routines</li>
              <li>📊 <strong>Track Progress:</strong> Monitor your time usage and improvements</li>
            </ul>
            <div style="text-align: center;">
              <a href="{{baseUrl}}" class="button">Start Using Optimizer</a>
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

  private static getWelcomeEmailText(): string {
    return `
Hi {{name}}!

Congratulations! Your email has been verified and your Optimizer account is now active.

Here's what you can do next:
• Select Your Persona: Choose from different life phases and goals
• Tune Your Allocations: Customize how you want to spend your time
• Generate Schedules: Let AI create optimized daily routines
• Track Progress: Monitor your time usage and improvements

Get started: {{baseUrl}}

If you have any questions or need help getting started, don't hesitate to reach out to our support team.

Best regards,
The Optimizer Team

© 2024 Optimizer. All rights reserved.
    `;
  }
}
