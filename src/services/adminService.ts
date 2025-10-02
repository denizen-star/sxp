interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  isAdmin?: boolean;
}

interface AdminStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentLogins: number;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  name: string;
  email: string;
  password?: string;
}

class AdminService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? '/.netlify/functions/auth/api' 
      : 'http://localhost:3001/api';
    this.token = localStorage.getItem('sxp_auth_token');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      const response = await this.makeRequest('/users');
      return response.users || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  // Get user by ID
  async getUser(id: number): Promise<User> {
    try {
      const response = await this.makeRequest(`/users/${id}`);
      return response.user;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await this.makeRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response.user;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Update user
  async updateUser(id: number, userData: UpdateUserData): Promise<void> {
    try {
      await this.makeRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user');
    }
  }

  // Delete user
  async deleteUser(id: number): Promise<void> {
    try {
      await this.makeRequest(`/users/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user');
    }
  }

  // Get admin statistics
  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await this.makeRequest('/users/stats/overview');
      return response.stats;
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      throw new Error('Failed to fetch admin statistics');
    }
  }

  // Search users
  async searchUsers(query: string): Promise<User[]> {
    try {
      const users = await this.getUsers();
      return users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Failed to search users:', error);
      throw new Error('Failed to search users');
    }
  }

  // Update token (when user logs in/out)
  updateToken(token: string | null) {
    this.token = token;
  }
}

export const adminService = new AdminService();
export type { User, AdminStats, CreateUserData, UpdateUserData };
