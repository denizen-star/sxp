/**
 * Authentication Tracking Service
 * Tracks all user authentication actions with timestamps for security and analytics
 */

export interface AuthEvent {
  id: string;
  userId?: string;
  email?: string;
  action: AuthAction;
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

export enum AuthAction {
  LOGIN_ATTEMPT = 'login_attempt',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGOUT = 'logout',
  SIGNUP_ATTEMPT = 'signup_attempt',
  SIGNUP_SUCCESS = 'signup_success',
  SIGNUP_FAILURE = 'signup_failure',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  PASSWORD_RESET_SUCCESS = 'password_reset_success',
  PASSWORD_CHANGE = 'password_change',
  EMAIL_VERIFICATION_SENT = 'email_verification_sent',
  EMAIL_VERIFICATION_SUCCESS = 'email_verification_success',
  TWO_FACTOR_ENABLED = 'two_factor_enabled',
  TWO_FACTOR_DISABLED = 'two_factor_disabled',
  TWO_FACTOR_VERIFICATION = 'two_factor_verification',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',
  SESSION_EXPIRED = 'session_expired',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  PROFILE_UPDATE = 'profile_update',
  SECURITY_SETTINGS_CHANGE = 'security_settings_change'
}

export interface AuthTrackingConfig {
  enableGeolocation: boolean;
  enableDeviceFingerprinting: boolean;
  retentionDays: number;
  alertOnSuspiciousActivity: boolean;
  maxFailedAttempts: number;
  lockoutDurationMinutes: number;
}

export class AuthTrackingService {
  private static instance: AuthTrackingService;
  private events: AuthEvent[] = [];
  private config: AuthTrackingConfig = {
    enableGeolocation: true,
    enableDeviceFingerprinting: true,
    retentionDays: 90,
    alertOnSuspiciousActivity: true,
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 15
  };

  private constructor() {
    this.loadEventsFromStorage();
  }

  public static getInstance(): AuthTrackingService {
    if (!AuthTrackingService.instance) {
      AuthTrackingService.instance = new AuthTrackingService();
    }
    return AuthTrackingService.instance;
  }

  /**
   * Track an authentication event
   */
  public async trackAuthEvent(
    action: AuthAction,
    options: {
      userId?: string;
      email?: string;
      success: boolean;
      errorReason?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    const event: AuthEvent = {
      id: this.generateEventId(),
      userId: options.userId,
      email: options.email,
      action,
      timestamp: new Date(),
      success: options.success,
      errorReason: options.errorReason,
      metadata: options.metadata,
      sessionId: this.getSessionId(),
      ...await this.collectContextualData()
    };

    // Store the event
    this.events.push(event);
    this.saveEventsToStorage();

    // Check for suspicious activity
    if (this.config.alertOnSuspiciousActivity) {
      this.checkSuspiciousActivity(event);
    }

    // Clean up old events
    this.cleanupOldEvents();

    // Log for debugging (remove in production)
    console.log(`🔐 Auth Event Tracked:`, {
      action: event.action,
      success: event.success,
      timestamp: event.timestamp.toISOString(),
      userId: event.userId,
      email: event.email
    });
  }

  /**
   * Get authentication events for a user
   */
  public getEventsForUser(userId: string): AuthEvent[] {
    return this.events
      .filter(event => event.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get all authentication events
   */
  public getAllEvents(): AuthEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get recent failed login attempts for security monitoring
   */
  public getRecentFailedAttempts(email: string, minutes: number = 15): AuthEvent[] {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return this.events.filter(event => 
      event.email === email &&
      event.action === AuthAction.LOGIN_FAILURE &&
      event.timestamp > cutoffTime
    );
  }

  /**
   * Check if account should be locked due to failed attempts
   */
  public shouldLockAccount(email: string): boolean {
    const recentFailures = this.getRecentFailedAttempts(email, this.config.lockoutDurationMinutes);
    return recentFailures.length >= this.config.maxFailedAttempts;
  }

  /**
   * Get authentication statistics
   */
  public getAuthStats(timeframeHours: number = 24): {
    totalEvents: number;
    successfulLogins: number;
    failedLogins: number;
    signups: number;
    passwordResets: number;
    suspiciousActivities: number;
  } {
    const cutoffTime = new Date(Date.now() - timeframeHours * 60 * 60 * 1000);
    const recentEvents = this.events.filter(event => event.timestamp > cutoffTime);

    return {
      totalEvents: recentEvents.length,
      successfulLogins: recentEvents.filter(e => e.action === AuthAction.LOGIN_SUCCESS).length,
      failedLogins: recentEvents.filter(e => e.action === AuthAction.LOGIN_FAILURE).length,
      signups: recentEvents.filter(e => e.action === AuthAction.SIGNUP_SUCCESS).length,
      passwordResets: recentEvents.filter(e => e.action === AuthAction.PASSWORD_RESET_REQUEST).length,
      suspiciousActivities: recentEvents.filter(e => e.action === AuthAction.SUSPICIOUS_ACTIVITY).length
    };
  }

  /**
   * Export authentication events for compliance/auditing
   */
  public exportEvents(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['ID', 'User ID', 'Email', 'Action', 'Timestamp', 'Success', 'IP Address', 'User Agent', 'Error Reason'];
      const csvRows = [
        headers.join(','),
        ...this.events.map(event => [
          event.id,
          event.userId || '',
          event.email || '',
          event.action,
          event.timestamp.toISOString(),
          event.success,
          event.ipAddress || '',
          event.userAgent || '',
          event.errorReason || ''
        ].map(field => `"${field}"`).join(','))
      ];
      return csvRows.join('\n');
    }

    return JSON.stringify(this.events, null, 2);
  }

  /**
   * Clear all events (admin function)
   */
  public clearAllEvents(): void {
    this.events = [];
    this.saveEventsToStorage();
  }

  /**
   * Update tracking configuration
   */
  public updateConfig(newConfig: Partial<AuthTrackingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem('optimizer_auth_config', JSON.stringify(this.config));
  }

  // Private helper methods
  private generateEventId(): string {
    return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('optimizer_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('optimizer_session_id', sessionId);
    }
    return sessionId;
  }

  private async collectContextualData(): Promise<Partial<AuthEvent>> {
    const contextData: Partial<AuthEvent> = {};

    // Collect IP address (in real app, this would come from backend)
    try {
      if (this.config.enableGeolocation) {
        // In production, get this from your backend API
        contextData.ipAddress = 'client-side-placeholder';
        contextData.location = {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      }
    } catch (error) {
      console.warn('Failed to collect location data:', error);
    }

    // Collect device and browser info
    if (this.config.enableDeviceFingerprinting) {
      contextData.userAgent = navigator.userAgent;
      contextData.deviceInfo = {
        type: this.getDeviceType(),
        browser: this.getBrowserInfo(),
        os: this.getOSInfo()
      };
    }

    return contextData;
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOSInfo(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private checkSuspiciousActivity(event: AuthEvent): void {
    // Check for rapid failed login attempts
    if (event.action === AuthAction.LOGIN_FAILURE && event.email) {
      const recentFailures = this.getRecentFailedAttempts(event.email, 5);
      if (recentFailures.length >= 3) {
        this.trackAuthEvent(AuthAction.SUSPICIOUS_ACTIVITY, {
          email: event.email,
          success: false,
          errorReason: 'Multiple rapid failed login attempts',
          metadata: { failedAttempts: recentFailures.length }
        });
      }
    }

    // Check for login from new location (simplified check)
    if (event.action === AuthAction.LOGIN_SUCCESS && event.userId) {
      const userEvents = this.getEventsForUser(event.userId);
      const previousLogins = userEvents.filter(e => 
        e.action === AuthAction.LOGIN_SUCCESS && 
        e.location?.timezone !== event.location?.timezone
      );
      
      if (previousLogins.length > 0 && event.location?.timezone) {
        this.trackAuthEvent(AuthAction.SUSPICIOUS_ACTIVITY, {
          userId: event.userId,
          success: false,
          errorReason: 'Login from new timezone',
          metadata: { 
            newTimezone: event.location.timezone,
            previousTimezone: previousLogins[0].location?.timezone
          }
        });
      }
    }
  }

  private cleanupOldEvents(): void {
    const cutoffDate = new Date(Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000);
    const initialCount = this.events.length;
    this.events = this.events.filter(event => event.timestamp > cutoffDate);
    
    if (this.events.length < initialCount) {
      this.saveEventsToStorage();
      console.log(`🧹 Cleaned up ${initialCount - this.events.length} old auth events`);
    }
  }

  private loadEventsFromStorage(): void {
    try {
      const stored = localStorage.getItem('optimizer_auth_events');
      if (stored) {
        const parsedEvents = JSON.parse(stored);
        this.events = parsedEvents.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      }

      const storedConfig = localStorage.getItem('optimizer_auth_config');
      if (storedConfig) {
        this.config = { ...this.config, ...JSON.parse(storedConfig) };
      }
    } catch (error) {
      console.warn('Failed to load auth events from storage:', error);
      this.events = [];
    }
  }

  private saveEventsToStorage(): void {
    try {
      localStorage.setItem('optimizer_auth_events', JSON.stringify(this.events));
    } catch (error) {
      console.warn('Failed to save auth events to storage:', error);
    }
  }
}

// Export singleton instance
export const authTrackingService = AuthTrackingService.getInstance();
