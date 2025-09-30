/**
 * Git Service - Real Git Data Integration
 * Fetches actual git commit history and repository information
 */

export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
}

export interface GitStatus {
  branch: string;
  lastCommit: GitCommit;
  totalCommits: number;
  uncommittedChanges: boolean;
  remoteStatus: 'ahead' | 'behind' | 'up-to-date' | 'diverged';
}

export interface RepositoryInfo {
  name: string;
  url: string;
  lastPush: string;
  contributors: number;
  languages: string[];
}

class GitService {
  private async executeGitCommand(command: string): Promise<string> {
    try {
      // This would need to be implemented with a backend service
      // since browsers can't execute git commands directly
      const response = await fetch('/api/git', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      
      if (!response.ok) {
        throw new Error(`Git command failed: ${response.statusText}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Git command execution failed:', error);
      throw error;
    }
  }

  async getRecentCommits(limit: number = 10): Promise<GitCommit[]> {
    try {
      const command = `git log --oneline --pretty=format:"%H|%h|%an|%ad|%s" --date=iso --max-count=${limit}`;
      const output = await this.executeGitCommand(command);
      
      return output.trim().split('\n').map(line => {
        const [hash, shortHash, author, date, ...messageParts] = line.split('|');
        return {
          hash,
          shortHash,
          author,
          date: new Date(date).toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) + ' EST',
          message: messageParts.join('|'),
          filesChanged: 0, // Would need additional git command
          insertions: 0,   // Would need additional git command
          deletions: 0     // Would need additional git command
        };
      });
    } catch (error) {
      console.error('Failed to fetch git commits:', error);
      return [];
    }
  }

  async getRepositoryStatus(): Promise<GitStatus> {
    try {
      const [branchOutput, statusOutput, logOutput] = await Promise.all([
        this.executeGitCommand('git branch --show-current'),
        this.executeGitCommand('git status --porcelain'),
        this.executeGitCommand('git log --oneline -1')
      ]);

      const branch = branchOutput.trim();
      const hasUncommittedChanges = statusOutput.trim().length > 0;
      const [hash, ...messageParts] = logOutput.trim().split(' ');
      const message = messageParts.join(' ');

      return {
        branch,
        lastCommit: {
          hash,
          shortHash: hash.substring(0, 7),
          author: 'Current User', // Would need git config
          date: new Date().toLocaleString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }) + ' EST',
          message,
          filesChanged: 0,
          insertions: 0,
          deletions: 0
        },
        totalCommits: 0, // Would need git rev-list --count
        uncommittedChanges: hasUncommittedChanges,
        remoteStatus: 'up-to-date' // Would need git status -uno
      };
    } catch (error) {
      console.error('Failed to fetch git status:', error);
      throw error;
    }
  }

  async getRepositoryInfo(): Promise<RepositoryInfo> {
    try {
      const [remoteUrl, lastPush] = await Promise.all([
        this.executeGitCommand('git config --get remote.origin.url'),
        this.executeGitCommand('git log -1 --format=%cd --date=iso')
      ]);

      return {
        name: remoteUrl.split('/').pop()?.replace('.git', '') || 'sxp',
        url: remoteUrl,
        lastPush: new Date(lastPush).toLocaleString('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }) + ' EST',
        contributors: 1, // Would need git shortlog -sn
        languages: ['TypeScript', 'JavaScript', 'CSS', 'HTML'] // Would need analysis
      };
    } catch (error) {
      console.error('Failed to fetch repository info:', error);
      throw error;
    }
  }

  async getFileChanges(): Promise<Array<{file: string, status: string, changes: number}>> {
    try {
      const output = await this.executeGitCommand('git diff --stat');
      return output.trim().split('\n').map(line => {
        const match = line.match(/(.+?)\s+\|\s+(\d+)\s+([+-]+)/);
        if (match) {
          return {
            file: match[1].trim(),
            status: 'modified',
            changes: parseInt(match[2])
          };
        }
        return { file: line, status: 'unknown', changes: 0 };
      });
    } catch (error) {
      console.error('Failed to fetch file changes:', error);
      return [];
    }
  }
}

export const gitService = new GitService();
