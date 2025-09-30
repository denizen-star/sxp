/**
 * Netlify Deployment Logs Service
 * 
 * This service provides real-time access to Netlify deployment logs
 * using WebSocket connections and REST API endpoints.
 */

export interface DeploymentStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  logs: string[];
  error?: string;
}

export interface DeploymentInfo {
  id: string;
  siteId: string;
  status: 'building' | 'ready' | 'error';
  deployUrl?: string;
  stages: DeploymentStage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NetlifyConfig {
  accessToken: string;
  siteId: string;
  deployId?: string;
}

class NetlifyDeploymentService {
  private config: NetlifyConfig | null = null;
  private websocket: WebSocket | null = null;
  private isConnected = false;
  private listeners: ((data: any) => void)[] = [];

  /**
   * Initialize the service with Netlify configuration
   */
  initialize(config: NetlifyConfig) {
    this.config = config;
  }

  /**
   * Connect to Netlify WebSocket for real-time logs
   */
  async connectToDeploymentLogs(deployId?: string): Promise<void> {
    if (!this.config) {
      throw new Error('Service not initialized. Call initialize() first.');
    }

    const targetDeployId = deployId || this.config.deployId;
    if (!targetDeployId) {
      throw new Error('Deploy ID is required');
    }

    return new Promise((resolve, reject) => {
      try {
        // Netlify WebSocket endpoint for deployment logs
        const wsUrl = `wss://api.netlify.com/build/logs`;
        
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
          console.log('Connected to Netlify deployment logs');
          this.isConnected = true;
          
          // Send authentication and deployment info
          const payload = {
            access_token: this.config!.accessToken,
            deploy_id: targetDeployId,
            site_id: this.config!.siteId
          };
          
          this.websocket!.send(JSON.stringify(payload));
          resolve();
        };

        this.websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.notifyListeners(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          reject(error);
        };

        this.websocket.onclose = () => {
          console.log('WebSocket connection closed');
          this.isConnected = false;
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get deployment information via REST API
   */
  async getDeploymentInfo(deployId?: string): Promise<DeploymentInfo> {
    if (!this.config) {
      throw new Error('Service not initialized');
    }

    const targetDeployId = deployId || this.config.deployId;
    if (!targetDeployId) {
      throw new Error('Deploy ID is required');
    }

    try {
      const response = await fetch(
        `https://api.netlify.com/api/v1/deploys/${targetDeployId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.parseDeploymentInfo(data);
    } catch (error) {
      console.error('Error fetching deployment info:', error);
      throw error;
    }
  }

  /**
   * Get recent deployments for a site
   */
  async getRecentDeployments(limit: number = 10): Promise<DeploymentInfo[]> {
    if (!this.config) {
      throw new Error('Service not initialized');
    }

    try {
      const response = await fetch(
        `https://api.netlify.com/api/v1/sites/${this.config.siteId}/deploys?per_page=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.map((deploy: any) => this.parseDeploymentInfo(deploy));
    } catch (error) {
      console.error('Error fetching recent deployments:', error);
      throw error;
    }
  }

  /**
   * Add listener for real-time updates
   */
  addListener(callback: (data: any) => void) {
    this.listeners.push(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback: (data: any) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if connected to WebSocket
   */
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Parse deployment data from Netlify API
   */
  private parseDeploymentInfo(data: any): DeploymentInfo {
    const stages: DeploymentStage[] = [
      {
        id: 'initializing',
        name: 'Initializing',
        status: this.getStageStatus(data.state, 'initializing'),
        logs: [],
        startTime: data.created_at ? new Date(data.created_at) : undefined
      },
      {
        id: 'building',
        name: 'Building',
        status: this.getStageStatus(data.state, 'building'),
        logs: [],
        startTime: data.created_at ? new Date(data.created_at) : undefined
      },
      {
        id: 'deploying',
        name: 'Deploying',
        status: this.getStageStatus(data.state, 'deploying'),
        logs: [],
        startTime: data.created_at ? new Date(data.created_at) : undefined
      },
      {
        id: 'cleanup',
        name: 'Cleanup',
        status: this.getStageStatus(data.state, 'cleanup'),
        logs: [],
        startTime: data.created_at ? new Date(data.created_at) : undefined
      },
      {
        id: 'post-processing',
        name: 'Post-processing',
        status: this.getStageStatus(data.state, 'post-processing'),
        logs: [],
        startTime: data.created_at ? new Date(data.created_at) : undefined
      }
    ];

    return {
      id: data.id,
      siteId: data.site_id,
      status: this.mapDeploymentStatus(data.state),
      deployUrl: data.deploy_url,
      stages,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  /**
   * Map Netlify deployment state to our status
   */
  private mapDeploymentStatus(state: string): 'building' | 'ready' | 'error' {
    switch (state) {
      case 'building':
      case 'preparing':
        return 'building';
      case 'ready':
      case 'published':
        return 'ready';
      case 'error':
      case 'failed':
        return 'error';
      default:
        return 'building';
    }
  }

  /**
   * Get stage status based on deployment state
   */
  private getStageStatus(deploymentState: string, stageName: string): 'pending' | 'running' | 'completed' | 'failed' {
    if (deploymentState === 'error' || deploymentState === 'failed') {
      return 'failed';
    }

    if (deploymentState === 'ready' || deploymentState === 'published') {
      return 'completed';
    }

    // For building state, determine which stages are active
    if (deploymentState === 'building') {
      const stageOrder = ['initializing', 'building', 'deploying', 'cleanup', 'post-processing'];
      const currentStageIndex = stageOrder.indexOf(stageName);
      
      if (currentStageIndex === 0) {
        return 'running';
      } else if (currentStageIndex > 0) {
        return 'pending';
      }
    }

    return 'pending';
  }

  /**
   * Notify all listeners of new data
   */
  private notifyListeners(data: any) {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in listener:', error);
      }
    });
  }

  /**
   * Create mock deployment data for testing
   */
  createMockDeployment(): DeploymentInfo {
    const now = new Date();
    const stages: DeploymentStage[] = [
      {
        id: 'initializing',
        name: 'Initializing',
        status: 'completed',
        startTime: new Date(now.getTime() - 30000),
        endTime: new Date(now.getTime() - 25000),
        duration: 5000,
        logs: [
          'Starting deployment process...',
          'Checking build environment...',
          'Preparing build context...',
          'Initialization complete'
        ]
      },
      {
        id: 'building',
        name: 'Building',
        status: 'completed',
        startTime: new Date(now.getTime() - 25000),
        endTime: new Date(now.getTime() - 15000),
        duration: 10000,
        logs: [
          'Installing dependencies...',
          'Running build scripts...',
          'Compiling assets...',
          'Build completed successfully'
        ]
      },
      {
        id: 'deploying',
        name: 'Deploying',
        status: 'running',
        startTime: new Date(now.getTime() - 15000),
        logs: [
          'Uploading files to CDN...',
          'Updating DNS records...',
          'Deploying to edge locations...'
        ]
      },
      {
        id: 'cleanup',
        name: 'Cleanup',
        status: 'pending',
        logs: []
      },
      {
        id: 'post-processing',
        name: 'Post-processing',
        status: 'pending',
        logs: []
      }
    ];

    return {
      id: 'mock-deploy-' + Date.now(),
      siteId: 'mock-site-id',
      status: 'building',
      deployUrl: 'https://mock-deploy.netlify.app',
      stages,
      createdAt: new Date(now.getTime() - 30000),
      updatedAt: now
    };
  }
}

// Export singleton instance
export const netlifyDeploymentService = new NetlifyDeploymentService();
export default netlifyDeploymentService;
