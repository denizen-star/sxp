/**
 * User Database Service
 * Provides a simple database-like interface for user data persistence
 * Uses localStorage as the storage backend
 */

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt: string;
  role: 'user' | 'admin';
  verificationToken?: string;
  verificationTokenExpiry?: string;
}

export class UserDatabase {
  private static readonly USERS_KEY = 'optimizer_users_registry';
  private static readonly USER_DATA_KEY = 'optimizer_user_data';

  /**
   * Get all users from storage
   */
  static getAllUsers(): StoredUser[] {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Failed to get users from storage:', error);
      return [];
    }
  }

  /**
   * Get a user by ID
   */
  static getUserById(userId: string): StoredUser | null {
    const users = this.getAllUsers();
    return users.find(user => user.id === userId) || null;
  }

  /**
   * Get a user by email
   */
  static getUserByEmail(email: string): StoredUser | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  /**
   * Create a new user
   */
  static createUser(userData: Omit<StoredUser, 'id' | 'createdAt' | 'lastLoginAt'>): StoredUser {
    const users = this.getAllUsers();
    const newUser: StoredUser = {
      ...userData,
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  /**
   * Update a user
   */
  static updateUser(userId: string, updates: Partial<StoredUser>): boolean {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return false;
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    return true;
  }

  /**
   * Verify user email
   */
  static verifyUserEmail(userId: string): boolean {
    return this.updateUser(userId, { 
      emailVerified: true,
      verificationToken: undefined,
      verificationTokenExpiry: undefined
    });
  }

  /**
   * Set verification token for user
   */
  static setVerificationToken(userId: string, token: string, expiryDate: Date): boolean {
    return this.updateUser(userId, {
      verificationToken: token,
      verificationTokenExpiry: expiryDate.toISOString()
    });
  }

  /**
   * Get user by verification token
   */
  static getUserByVerificationToken(token: string): StoredUser | null {
    const users = this.getAllUsers();
    return users.find(user => 
      user.verificationToken === token && 
      user.verificationTokenExpiry && 
      new Date(user.verificationTokenExpiry) > new Date()
    ) || null;
  }

  /**
   * Save users to storage
   */
  private static saveUsers(users: StoredUser[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users to storage:', error);
    }
  }

  /**
   * Get current user data
   */
  static getCurrentUser(): StoredUser | null {
    try {
      const userData = localStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get current user from storage:', error);
      return null;
    }
  }

  /**
   * Set current user data
   */
  static setCurrentUser(user: StoredUser): void {
    try {
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to set current user in storage:', error);
    }
  }

  /**
   * Clear current user data
   */
  static clearCurrentUser(): void {
    try {
      localStorage.removeItem(this.USER_DATA_KEY);
    } catch (error) {
      console.error('Failed to clear current user from storage:', error);
    }
  }

  /**
   * Get user statistics
   */
  static getUserStats(): {
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
    adminUsers: number;
    regularUsers: number;
  } {
    const users = this.getAllUsers();
    return {
      totalUsers: users.length,
      verifiedUsers: users.filter(u => u.emailVerified).length,
      unverifiedUsers: users.filter(u => !u.emailVerified).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length
    };
  }
}
