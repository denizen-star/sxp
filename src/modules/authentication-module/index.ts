/**
 * Authentication Module
 * Independent, portable authentication system
 * 
 * This module provides complete authentication functionality including:
 * - User registration and login
 * - Email verification
 * - Password management
 * - Session management
 * - Security tracking
 * 
 * Usage:
 * import { AuthenticationModule } from './modules/authentication-module';
 * 
 * const auth = new AuthenticationModule();
 * await auth.initialize();
 */

// Export main authentication hook
export { useAuth } from './hooks/useAuth';

// Export authentication components
export { default as AuthDemo } from './components/AuthDemo/AuthDemo';
export { default as EnhancedSignup } from './components/EnhancedSignup/EnhancedSignup';
export { default as EmailTest } from './components/EmailTest/EmailTest';
export { default as EmailVerification } from './components/EmailVerification/EmailVerification';
export { default as UserManagement } from './components/UserManagement/UserManagement';
export { default as AuthActivity } from './components/AuthActivity/AuthActivity';

// Export authentication services
export { AuthTrackingService, AuthAction } from './services/authTrackingService';
export { SimpleEmailService } from './services/simpleEmailService';

// Export types
export type { User, LoginCredentials, SignupData, AuthHookReturn } from './types';

// Export utilities
export * from './utils';

// Export main authentication class
export { AuthenticationModule } from './AuthenticationModule';
