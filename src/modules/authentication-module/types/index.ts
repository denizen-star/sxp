/**
 * Authentication Module Types
 * All type definitions for the authentication system
 */

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  role: 'user' | 'admin';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthHookReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<boolean>;
  enableTwoFactor: () => Promise<boolean>;
  disableTwoFactor: (password: string) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  getAuthEvents: () => any[];
  getAuthStats: () => any;
}

// Email service types
export interface EmailVerificationData {
  email: string;
  name: string;
  verificationToken: string;
}

export interface PasswordResetData {
  email: string;
  name: string;
  resetToken: string;
}

// Auth tracking types
export interface AuthEvent {
  id: string;
  userId?: string;
  email?: string;
  action: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: {
    country?: string;
    city?: string;
    timezone?: string;
  };
  deviceInfo?: {
    type: 'desktop' | 'mobile' | 'tablet';
    browser?: string;
    os?: string;
  };
  sessionId?: string;
  success: boolean;
  errorReason?: string;
  metadata?: Record<string, any>;
}

export interface AuthTrackingConfig {
  maxEvents: number;
  retentionDays: number;
  enableLocationTracking: boolean;
  enableDeviceTracking: boolean;
}
