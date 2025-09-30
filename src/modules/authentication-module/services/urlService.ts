/**
 * URL Service
 * Handles URL generation for different environments
 */

export class UrlService {
  /**
   * Get the base URL for the application
   */
  static getBaseUrl(): string {
    // In production, use the actual domain
    if (process.env.NODE_ENV === 'production') {
      return 'https://optimizer.kervinapps.com';
    }
    
    // In development, use localhost
    return 'http://localhost:3000';
  }

  /**
   * Generate email verification URL
   */
  static generateEmailVerificationUrl(token: string): string {
    return `${this.getBaseUrl()}/verify-email/${token}`;
  }

  /**
   * Generate password reset URL
   */
  static generatePasswordResetUrl(token: string): string {
    return `${this.getBaseUrl()}/reset-password/${token}`;
  }

  /**
   * Generate account activation URL
   */
  static generateAccountActivationUrl(token: string): string {
    return `${this.getBaseUrl()}/activate-account/${token}`;
  }

  /**
   * Check if we're in production environment
   */
  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Check if we're in development environment
   */
  static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }
}
