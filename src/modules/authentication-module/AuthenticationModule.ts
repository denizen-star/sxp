/**
 * Authentication Module Class
 * Main interface for the authentication system
 */

import { useAuth } from './hooks/useAuth';
import { AuthTrackingService } from './services/authTrackingService';
import { SimpleEmailService } from './services/simpleEmailService';

export class AuthenticationModule {
  private isInitialized = false;

  /**
   * Initialize the authentication module
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Services are ready to use without initialization
    this.isInitialized = true;
    console.log('Authentication module initialized');
  }

  /**
   * Get the authentication hook for React components
   */
  getAuthHook() {
    return useAuth;
  }

  /**
   * Get authentication services
   */
  getServices() {
    return {
      authTracking: AuthTrackingService,
      emailService: SimpleEmailService
    };
  }

  /**
   * Check if module is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get module information
   */
  getModuleInfo() {
    return {
      name: 'Authentication Module',
      version: '1.0.0',
      description: 'Independent authentication system for user management',
      features: [
        'User registration and login',
        'Email verification',
        'Password management',
        'Session management',
        'Security tracking',
        'User management'
      ],
      dependencies: [
        'React',
        'Material-UI',
        'Zustand (for state management)'
      ]
    };
  }
}

// Default export
export default AuthenticationModule;
