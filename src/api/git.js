/**
 * Git API Endpoint - Backend service for git operations
 * This would be deployed as a separate service or integrated into your backend
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Git API endpoint handler
async function handleGitRequest(req, res) {
  try {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Git command is required' });
    }

    // Security: Only allow specific git commands
    const allowedCommands = [
      'git log',
      'git status',
      'git branch',
      'git config',
      'git diff',
      'git rev-list'
    ];

    const isAllowed = allowedCommands.some(allowed => command.startsWith(allowed));
    
    if (!isAllowed) {
      return res.status(403).json({ error: 'Command not allowed' });
    }

    // Execute git command
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(), // Or specify your project directory
      timeout: 10000 // 10 second timeout
    });

    if (stderr) {
      console.warn('Git command stderr:', stderr);
    }

    res.json({ 
      success: true, 
      output: stdout,
      stderr: stderr 
    });

  } catch (error) {
    console.error('Git command failed:', error);
    res.status(500).json({ 
      error: 'Git command execution failed',
      message: error.message 
    });
  }
}

// Alternative: Simple file-based approach for development
function getMockGitData() {
  return {
    commits: [
      {
        hash: '741a48f35894164ea8821428f30884f6c079dfd7',
        shortHash: '741a48f',
        author: 'denizen-star',
        date: new Date().toISOString(),
        message: 'feat: Add detailed change descriptions and enhanced commit information',
        filesChanged: 1,
        insertions: 124,
        deletions: 35
      }
    ],
    status: {
      branch: 'main',
      uncommittedChanges: false,
      remoteStatus: 'up-to-date'
    }
  };
}

module.exports = {
  handleGitRequest,
  getMockGitData
};
