/**
 * Validation Utilities
 * Comprehensive input validation for authentication
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationUtils {
  /**
   * Validate email format
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email || email.trim() === '') {
      errors.push('Email is required');
      return { isValid: false, errors };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (email.length > 254) {
      errors.push('Email address is too long');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate name
   */
  static validateName(name: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name || name.trim() === '') {
      errors.push('Name is required');
      return { isValid: false, errors };
    }
    
    if (name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (name.trim().length > 50) {
      errors.push('Name must be less than 50 characters');
    }
    
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      errors.push('Name can only contain letters, spaces, hyphens, and apostrophes');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate password
   */
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password || password === '') {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate signup data
   */
  static validateSignupData(data: {
    email: string;
    password: string;
    name: string;
    acceptTerms: boolean;
  }): ValidationResult {
    const errors: string[] = [];
    
    // Validate email
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }
    
    // Validate password
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
    
    // Validate name
    const nameValidation = this.validateName(data.name);
    if (!nameValidation.isValid) {
      errors.push(...nameValidation.errors);
    }
    
    // Validate terms acceptance
    if (!data.acceptTerms) {
      errors.push('You must accept the terms and conditions');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate login credentials
   */
  static validateLoginCredentials(credentials: {
    email: string;
    password: string;
  }): ValidationResult {
    const errors: string[] = [];
    
    if (!credentials.email || credentials.email.trim() === '') {
      errors.push('Email is required');
    }
    
    if (!credentials.password || credentials.password === '') {
      errors.push('Password is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize input
   */
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .slice(0, 255); // Limit length
  }

  /**
   * Check for common weak passwords
   */
  static isWeakPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      '1234567890', 'password1', 'qwerty123', 'dragon', 'master'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
  }
}
