/**
 * Authentication Hook with Comprehensive Tracking
 * Handles user authentication with detailed timestamp tracking for all actions
 */

import { useState, useEffect, useCallback } from 'react';
import { authTrackingService, AuthAction } from '../services/authTrackingService';
import { SimpleEmailService } from '../services/simpleEmailService';
import { User, LoginCredentials, SignupData, AuthState, AuthHookReturn } from '../types';
import { PasswordUtils } from '../utils/passwordUtils';
import { ValidationUtils } from '../utils/validationUtils';
import { TokenService } from '../services/tokenService';
import { UserDatabase } from '../services/userDatabase';
// import { UrlService } from '../services/urlService'; // Will be used for email URL generation

// User interface is now imported from ../types

// All interfaces are now imported from ../types

export const useAuth = (): AuthHookReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeAuth = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Check for existing session
      const token = localStorage.getItem('optimizer_auth_token');
      const userData = localStorage.getItem('optimizer_user_data');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Track session restoration
        await authTrackingService.trackAuthEvent(AuthAction.LOGIN_SUCCESS, {
          userId: user.id,
          email: user.email,
          success: true,
          metadata: { type: 'session_restore' }
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication'
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    // Validate input
    const validation = ValidationUtils.validateLoginCredentials(credentials);
    if (!validation.isValid) {
      const errorMessage = validation.errors.join(', ');
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      await authTrackingService.trackAuthEvent(AuthAction.LOGIN_FAILURE, {
        email: credentials.email,
        success: false,
        errorReason: errorMessage
      });
      
      return false;
    }

    // Track login attempt
    await authTrackingService.trackAuthEvent(AuthAction.LOGIN_ATTEMPT, {
      email: credentials.email,
      success: false, // Will update if successful
      metadata: { rememberMe: credentials.rememberMe }
    });

    try {
      // Check for account lockout
      if (authTrackingService.shouldLockAccount(credentials.email)) {
        const error = 'Account temporarily locked due to multiple failed attempts';
        
        await authTrackingService.trackAuthEvent(AuthAction.ACCOUNT_LOCKED, {
          email: credentials.email,
          success: false,
          errorReason: error
        });

        setAuthState(prev => ({ ...prev, isLoading: false, error }));
        return false;
      }

      // Simulate API call (replace with actual authentication API)
      const response = await simulateAuthAPI('login', credentials);
      
      if (response.success && response.user) {
        const user: User = {
          ...response.user,
          lastLoginAt: new Date()
        };

        // Store authentication data
        localStorage.setItem('optimizer_auth_token', response.token);
        localStorage.setItem('optimizer_user_data', JSON.stringify(user));
        
        if (credentials.rememberMe) {
          localStorage.setItem('optimizer_remember_me', 'true');
        }

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Track successful login
        await authTrackingService.trackAuthEvent(AuthAction.LOGIN_SUCCESS, {
          userId: user.id,
          email: user.email,
          success: true,
          metadata: { 
            rememberMe: credentials.rememberMe,
            loginMethod: 'password'
          }
        });

        return true;
      } else {
        const errorReason = response.error || 'Invalid credentials';
        
        // Track failed login
        await authTrackingService.trackAuthEvent(AuthAction.LOGIN_FAILURE, {
          email: credentials.email,
          success: false,
          errorReason
        });

        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorReason 
        }));
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      await authTrackingService.trackAuthEvent(AuthAction.LOGIN_FAILURE, {
        email: credentials.email,
        success: false,
        errorReason: errorMessage
      });

      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      return false;
    }
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    // Comprehensive validation
    const validation = ValidationUtils.validateSignupData(data);
    if (!validation.isValid) {
      const errorMessage = validation.errors.join(', ');
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_FAILURE, {
        email: data.email,
        success: false,
        errorReason: errorMessage
      });
      
      return false;
    }

    // Check for weak passwords
    if (ValidationUtils.isWeakPassword(data.password)) {
      const errorMessage = 'Password is too common. Please choose a stronger password.';
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_FAILURE, {
        email: data.email,
        success: false,
        errorReason: errorMessage
      });
      
      return false;
    }

    // Track signup attempt
    await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_ATTEMPT, {
      email: data.email,
      success: false,
      metadata: { name: data.name }
    });

    try {
      const response = await simulateAuthAPI('signup', data);
      
      if (response.success && response.user) {
        const user: User = response.user;

        // Store authentication data
        localStorage.setItem('optimizer_auth_token', response.token);
        localStorage.setItem('optimizer_user_data', JSON.stringify(user));

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });

        // Send verification email using Simple Email Service
        const emailSent = await SimpleEmailService.sendVerificationEmail({
          email: user.email,
          name: user.name,
          userId: user.id
        });

        if (emailSent) {
          console.log('Verification email sent successfully');
          // Track email verification sent event
          await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SENT, {
            userId: user.id,
            email: user.email,
            success: true,
            metadata: { name: user.name, emailType: 'verification' }
          });
        } else {
          console.warn('Failed to send verification email, but user account created');
          // Track email verification failure
          await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SENT, {
            userId: user.id,
            email: user.email,
            success: false,
            errorReason: 'Failed to send verification email',
            metadata: { name: user.name, emailType: 'verification' }
          });
        }

        // Track successful signup
        await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_SUCCESS, {
          userId: user.id,
          email: user.email,
          success: true,
          metadata: { name: user.name, emailSent }
        });

        return true;
      } else {
        const errorReason = response.error || 'Signup failed';
        
        await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_FAILURE, {
          email: data.email,
          success: false,
          errorReason
        });

        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: errorReason 
        }));
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      
      await authTrackingService.trackAuthEvent(AuthAction.SIGNUP_FAILURE, {
        email: data.email,
        success: false,
        errorReason: errorMessage
      });

      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const currentUser = authState.user;
    
    // Track logout
    if (currentUser) {
      await authTrackingService.trackAuthEvent(AuthAction.LOGOUT, {
        userId: currentUser.id,
        email: currentUser.email,
        success: true
      });
    }

    // Clear authentication data
    localStorage.removeItem('optimizer_auth_token');
    localStorage.removeItem('optimizer_user_data');
    localStorage.removeItem('optimizer_remember_me');
    sessionStorage.clear();

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }, [authState.user]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    await authTrackingService.trackAuthEvent(AuthAction.PASSWORD_RESET_REQUEST, {
      email,
      success: true
    });

    try {
      const response = await simulateAuthAPI('resetPassword', { email });
      return response.success;
    } catch (error) {
      console.error('Password reset failed:', error);
      return false;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const response = await simulateAuthAPI('changePassword', {
        currentPassword,
        newPassword,
        userId: authState.user.id
      });

      if (response.success) {
        await authTrackingService.trackAuthEvent(AuthAction.PASSWORD_CHANGE, {
          userId: authState.user.id,
          email: authState.user.email,
          success: true
        });
        return true;
      }
      
      return false;
    } catch (error) {
      await authTrackingService.trackAuthEvent(AuthAction.PASSWORD_CHANGE, {
        userId: authState.user.id,
        email: authState.user.email,
        success: false,
        errorReason: error instanceof Error ? error.message : 'Password change failed'
      });
      return false;
    }
  }, [authState.user]);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const response = await simulateAuthAPI('updateProfile', {
        userId: authState.user.id,
        updates
      });

      if (response.success && response.user) {
        const updatedUser = { ...authState.user, ...response.user };
        localStorage.setItem('optimizer_user_data', JSON.stringify(updatedUser));
        
        setAuthState(prev => ({ ...prev, user: updatedUser }));

        await authTrackingService.trackAuthEvent(AuthAction.PROFILE_UPDATE, {
          userId: authState.user.id,
          email: authState.user.email,
          success: true,
          metadata: { updatedFields: Object.keys(updates) }
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  }, [authState.user]);

  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    try {
      // Verify token using TokenService
      const tokenResult = TokenService.verifyToken(token, 'email_verification');
      
      if (!tokenResult.isValid) {
        await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SUCCESS, {
          success: false,
          errorReason: tokenResult.error || 'Invalid or expired token'
        });
        return false;
      }

      const tokenData = tokenResult.tokenData!;
      
      // Update user verification status using UserDatabase
      const userToVerify = UserDatabase.getUserById(tokenData.userId);
      
      if (userToVerify) {
        // Verify the user's email
        const success = UserDatabase.verifyUserEmail(tokenData.userId);
        
        if (success) {
          // Update current user if logged in
          if (authState.user && authState.user.id === tokenData.userId) {
            const updatedUser = { ...authState.user, emailVerified: true };
            // Don't use UserDatabase.setCurrentUser here as it expects StoredUser type
            localStorage.setItem('optimizer_user_data', JSON.stringify(updatedUser));
            setAuthState(prev => ({ ...prev, user: updatedUser }));
          }
        }

        // Send welcome email
        await SimpleEmailService.sendWelcomeEmail(tokenData.email, userToVerify.name);

        await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SUCCESS, {
          userId: tokenData.userId,
          email: tokenData.email,
          success: true,
          metadata: { loggedIn: !!authState.user }
        });

        return true;
      } else {
        await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SUCCESS, {
          email: tokenData.email,
          success: false,
          errorReason: 'User not found',
          metadata: { token: token.substring(0, 8) + '...' }
        });
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Email verification failed';
      
      await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SUCCESS, {
        success: false,
        errorReason: errorMessage,
        metadata: { token: token.substring(0, 8) + '...' }
      });
      
      console.error('Email verification failed:', error);
      return false;
    }
  }, [authState.user]);

  const resendVerificationEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      // Find user by email
      const users = JSON.parse(localStorage.getItem('optimizer_users_registry') || '[]');
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SENT, {
          email,
          success: false,
          errorReason: 'User not found'
        });
        return false;
      }
      
      // Send verification email using Simple Email Service
      const emailSent = await SimpleEmailService.sendVerificationEmail({
        email,
        name: user.name,
        userId: user.id
      });

      if (emailSent) {
        // Track email verification sent
        await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SENT, {
          email,
          success: true,
          metadata: { type: 'resend', userId: user.id }
        });
        
        return true;
      } else {
        await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SENT, {
          email,
          success: false,
          errorReason: 'Failed to send verification email'
        });
        
        return false;
      }
    } catch (error) {
      await authTrackingService.trackAuthEvent(AuthAction.EMAIL_VERIFICATION_SENT, {
        email,
        success: false,
        errorReason: error instanceof Error ? error.message : 'Failed to resend verification email'
      });
      
      console.error('Resend verification failed:', error);
      return false;
    }
  }, []);

  const enableTwoFactor = useCallback(async (): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const response = await simulateAuthAPI('enableTwoFactor', {
        userId: authState.user.id
      });
      
      if (response.success) {
        const updatedUser = { ...authState.user, twoFactorEnabled: true };
        localStorage.setItem('optimizer_user_data', JSON.stringify(updatedUser));
        setAuthState(prev => ({ ...prev, user: updatedUser }));

        await authTrackingService.trackAuthEvent(AuthAction.TWO_FACTOR_ENABLED, {
          userId: authState.user.id,
          email: authState.user.email,
          success: true
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Two-factor enable failed:', error);
      return false;
    }
  }, [authState.user]);

  const disableTwoFactor = useCallback(async (password: string): Promise<boolean> => {
    if (!authState.user) return false;

    try {
      const response = await simulateAuthAPI('disableTwoFactor', {
        userId: authState.user.id,
        password
      });
      
      if (response.success) {
        const updatedUser = { ...authState.user, twoFactorEnabled: false };
        localStorage.setItem('optimizer_user_data', JSON.stringify(updatedUser));
        setAuthState(prev => ({ ...prev, user: updatedUser }));

        await authTrackingService.trackAuthEvent(AuthAction.TWO_FACTOR_DISABLED, {
          userId: authState.user.id,
          email: authState.user.email,
          success: true
        });

        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Two-factor disable failed:', error);
      return false;
    }
  }, [authState.user]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await simulateAuthAPI('refreshToken', {});
      
      if (response.success && response.token) {
        localStorage.setItem('optimizer_auth_token', response.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  const getAuthEvents = useCallback(() => {
    if (!authState.user) return [];
    return authTrackingService.getEventsForUser(authState.user.id);
  }, [authState.user]);

  const getAuthStats = useCallback(() => {
    const authStats = authTrackingService.getAuthStats();
    const userStats = UserDatabase.getUserStats();
    
    return {
      ...authStats,
      userStats: {
        totalUsers: userStats.totalUsers,
        verifiedUsers: userStats.verifiedUsers,
        unverifiedUsers: userStats.unverifiedUsers,
        adminUsers: userStats.adminUsers,
        regularUsers: userStats.regularUsers
      }
    };
  }, []);

  const refreshUserData = useCallback(async () => {
    if (!authState.user) return;
    
    try {
      // Get fresh user data from UserDatabase
      const freshUser = UserDatabase.getUserById(authState.user.id);
      
      if (freshUser) {
        const updatedUser = {
          ...freshUser,
          createdAt: new Date(freshUser.createdAt),
          lastLoginAt: new Date(freshUser.lastLoginAt)
        };
        
        // Store in localStorage for current user session
        localStorage.setItem('optimizer_user_data', JSON.stringify(updatedUser));
        setAuthState(prev => ({ ...prev, user: updatedUser }));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [authState.user]);

  return {
    ...authState,
    login,
    signup,
    logout,
    resetPassword,
    changePassword,
    updateProfile,
    verifyEmail,
    resendVerificationEmail,
    enableTwoFactor,
    disableTwoFactor,
    refreshToken,
    refreshUserData,
    getAuthEvents,
    getAuthStats
  };
};

// Real API calls with localStorage persistence
async function simulateAuthAPI(endpoint: string, data: any): Promise<any> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  switch (endpoint) {
    case 'login':
      // Check against stored users using UserDatabase
      const user = UserDatabase.getUserByEmail(data.email);
      
      if (user && PasswordUtils.verifyPassword(data.password, user.passwordHash)) {
        // Update last login using UserDatabase
        UserDatabase.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
        
        return {
          success: true,
          token: 'jwt_token_' + Date.now(),
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified || false,
            twoFactorEnabled: user.twoFactorEnabled || false,
            createdAt: new Date(user.createdAt),
            lastLoginAt: new Date(),
            role: user.role || 'user'
          }
        };
      }
      return { success: false, error: 'Invalid credentials' };

    case 'signup':
      // Check if user already exists using UserDatabase
      const existingUser = UserDatabase.getUserByEmail(data.email);
      
      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Create new user with hashed password using UserDatabase
      const newUser = UserDatabase.createUser({
        email: data.email,
        name: data.name,
        passwordHash: PasswordUtils.hashPassword(data.password),
        emailVerified: false,
        twoFactorEnabled: false,
        role: 'user'
      });

      return {
        success: true,
        token: 'jwt_token_' + Date.now(),
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          emailVerified: false,
          twoFactorEnabled: false,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          role: 'user'
        }
      };

    case 'resetPassword':
      return { success: true };

    case 'verifyEmail':
      // Check if token matches stored token
      const storedToken = localStorage.getItem('optimizer_verification_token');
      if (data.token === storedToken) {
        // Update user as verified
        const users = JSON.parse(localStorage.getItem('optimizer_users_registry') || '[]');
        const userToVerify = users.find((u: any) => u.id === localStorage.getItem('optimizer_current_user_id'));
        if (userToVerify) {
          userToVerify.emailVerified = true;
          localStorage.setItem('optimizer_users_registry', JSON.stringify(users));
        }
        
        return { 
          success: true, 
          userId: userToVerify?.id,
          email: userToVerify?.email
        };
      }
      
      // Handle test tokens
      if (data.token === 'expired_token') {
        return { success: false, error: 'expired', email: 'demo@optimizer.com' };
      }
      if (data.token === 'invalid_token') {
        return { success: false, error: 'invalid', email: 'demo@optimizer.com' };
      }
      if (data.token === 'used_token') {
        return { success: false, error: 'used', email: 'demo@optimizer.com' };
      }
      
      return { success: false, error: 'Invalid token' };

    case 'resendVerification':
      return { success: true };

    case 'changePassword':
    case 'updateProfile':
    case 'enableTwoFactor':
    case 'disableTwoFactor':
    case 'refreshToken':
      return { success: true };

    default:
      return { success: false, error: 'Unknown endpoint' };
  }
}
