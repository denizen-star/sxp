/**
 * Token Service
 * Secure token management for email verification and password reset
 */

export interface TokenData {
  token: string;
  userId: string;
  email: string;
  type: 'email_verification' | 'password_reset';
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export class TokenService {
  private static readonly TOKEN_EXPIRY_HOURS = 24;
  private static readonly PASSWORD_RESET_EXPIRY_HOURS = 1;

  /**
   * Generate a secure verification token
   */
  static generateToken(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 9);
    const securePart = Math.random().toString(36).substr(2, 9);
    return `verify_${timestamp}_${randomPart}_${securePart}`;
  }

  /**
   * Generate a secure password reset token
   */
  static generatePasswordResetToken(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 9);
    const securePart = Math.random().toString(36).substr(2, 9);
    return `reset_${timestamp}_${randomPart}_${securePart}`;
  }

  /**
   * Store a token with expiration
   */
  static storeToken(tokenData: Omit<TokenData, 'createdAt' | 'used'>): void {
    const fullTokenData: TokenData = {
      ...tokenData,
      createdAt: new Date(),
      used: false
    };

    try {
      const existingTokens = this.getAllTokens();
      existingTokens.push(fullTokenData);
      localStorage.setItem('optimizer_verification_tokens', JSON.stringify(existingTokens));
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }

  /**
   * Verify a token and mark as used
   */
  static verifyToken(token: string, type: 'email_verification' | 'password_reset'): {
    isValid: boolean;
    tokenData?: TokenData;
    error?: string;
  } {
    try {
      const tokens = this.getAllTokens();
      const tokenData = tokens.find(t => t.token === token && t.type === type);

      if (!tokenData) {
        return { isValid: false, error: 'Token not found' };
      }

      if (tokenData.used) {
        return { isValid: false, error: 'Token has already been used' };
      }

      if (new Date() > tokenData.expiresAt) {
        return { isValid: false, error: 'Token has expired' };
      }

      // Mark token as used
      tokenData.used = true;
      this.updateToken(tokenData);

      return { isValid: true, tokenData };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { isValid: false, error: 'Token verification failed' };
    }
  }

  /**
   * Get all stored tokens
   */
  static getAllTokens(): TokenData[] {
    try {
      const stored = localStorage.getItem('optimizer_verification_tokens');
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((token: any) => ({
        ...token,
        expiresAt: new Date(token.expiresAt),
        createdAt: new Date(token.createdAt)
      }));
    } catch (error) {
      console.error('Failed to load tokens:', error);
      return [];
    }
  }

  /**
   * Update a token in storage
   */
  private static updateToken(updatedToken: TokenData): void {
    try {
      const tokens = this.getAllTokens();
      const index = tokens.findIndex(t => t.token === updatedToken.token);
      if (index !== -1) {
        tokens[index] = updatedToken;
        localStorage.setItem('optimizer_verification_tokens', JSON.stringify(tokens));
      }
    } catch (error) {
      console.error('Failed to update token:', error);
    }
  }

  /**
   * Clean up expired tokens
   */
  static cleanupExpiredTokens(): void {
    try {
      const tokens = this.getAllTokens();
      const now = new Date();
      const validTokens = tokens.filter(token => token.expiresAt > now);
      
      if (validTokens.length !== tokens.length) {
        localStorage.setItem('optimizer_verification_tokens', JSON.stringify(validTokens));
        console.log(`Cleaned up ${tokens.length - validTokens.length} expired tokens`);
      }
    } catch (error) {
      console.error('Failed to cleanup tokens:', error);
    }
  }

  /**
   * Get tokens for a specific user
   */
  static getTokensForUser(userId: string, type?: 'email_verification' | 'password_reset'): TokenData[] {
    const tokens = this.getAllTokens();
    return tokens.filter(token => 
      token.userId === userId && 
      (!type || token.type === type)
    );
  }

  /**
   * Revoke all tokens for a user
   */
  static revokeUserTokens(userId: string): void {
    try {
      const tokens = this.getAllTokens();
      const updatedTokens = tokens.filter(token => token.userId !== userId);
      localStorage.setItem('optimizer_verification_tokens', JSON.stringify(updatedTokens));
    } catch (error) {
      console.error('Failed to revoke user tokens:', error);
    }
  }

  /**
   * Check if user has pending verification
   */
  static hasPendingVerification(userId: string): boolean {
    const tokens = this.getTokensForUser(userId, 'email_verification');
    return tokens.some(token => !token.used && token.expiresAt > new Date());
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(type: 'email_verification' | 'password_reset'): Date {
    const hours = type === 'email_verification' 
      ? this.TOKEN_EXPIRY_HOURS 
      : this.PASSWORD_RESET_EXPIRY_HOURS;
    
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }
}
