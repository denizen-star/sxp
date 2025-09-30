/**
 * Password Utilities
 * Simple password hashing and validation
 */

// Simple hash function for demo purposes
// In production, use a proper library like bcrypt
export class PasswordUtils {
  /**
   * Hash a password using a simple algorithm
   * Note: This is for demo purposes. In production, use bcrypt or similar
   */
  static hashPassword(password: string): string {
    // Simple hash implementation for demo
    // In production, use: bcrypt.hash(password, 12)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return 'hashed_' + Math.abs(hash).toString(36) + '_' + password.length;
  }

  /**
   * Verify a password against its hash
   */
  static verifyPassword(password: string, hash: string): boolean {
    const computedHash = this.hashPassword(password);
    return computedHash === hash;
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
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
   * Check if password meets minimum requirements
   */
  static isPasswordValid(password: string): boolean {
    return this.validatePasswordStrength(password).isValid;
  }
}
