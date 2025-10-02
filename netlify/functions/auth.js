const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// JWT Secret (in production, this should be an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'sxp-simple-auth-secret-key';

// Initialize SQLite database
const dbPath = path.join(__dirname, '..', 'auth.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    lastLogin DATETIME
  )`);

  // Create auth_events table
  db.run(`CREATE TABLE IF NOT EXISTS auth_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    action TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ipAddress TEXT,
    userAgent TEXT,
    errorReason TEXT,
    metadata TEXT
  )`);

  // Create admin user if it doesn't exist
  const adminPassword = bcrypt.hashSync('Admin123!', 10);
  db.run(`INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)`, 
    ['Admin', 'admin@sxp.com', adminPassword]);
});

// Helper function to log auth events
function logAuthEvent(userId, action, success, req, errorReason = null, metadata = null) {
  const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  
  db.run(`INSERT INTO auth_events (userId, action, success, ipAddress, userAgent, errorReason, metadata) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, action, success, ipAddress, userAgent, errorReason, JSON.stringify(metadata)]);
}

// Helper function to verify JWT token
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const { httpMethod, path, body, headers: reqHeaders } = event;
  const pathParts = path.split('/').filter(part => part);
  
  try {
    // Route handling
    if (pathParts[0] === 'api' && pathParts[1] === 'auth') {
      const endpoint = pathParts[2];
      
      switch (endpoint) {
        case 'register':
          if (httpMethod === 'POST') {
            return await handleRegister(JSON.parse(body), reqHeaders);
          }
          break;
          
        case 'login':
          if (httpMethod === 'POST') {
            return await handleLogin(JSON.parse(body), reqHeaders);
          }
          break;
          
        case 'logout':
          if (httpMethod === 'POST') {
            return await handleLogout(reqHeaders);
          }
          break;
          
        case 'profile':
          if (httpMethod === 'GET') {
            return await handleGetProfile(reqHeaders);
          }
          break;
          
        case 'events':
          if (httpMethod === 'GET') {
            return await handleGetEvents(reqHeaders);
          }
          break;
      }
    }
    
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
    
  } catch (error) {
    console.error('Auth function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Register handler
async function handleRegister(data, headers) {
  const { name, email, password } = data;
  
  if (!name || !email || !password) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Name, email, and password are required' })
    };
  }
  
  if (password.length < 6) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Password must be at least 6 characters' })
    };
  }
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    return new Promise((resolve) => {
      db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword], function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              logAuthEvent(null, 'register', false, { headers }, 'Email already exists');
              resolve({
                statusCode: 400,
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Registration failed. Email may already exist.' })
              });
            } else {
              logAuthEvent(null, 'register', false, { headers }, err.message);
              resolve({
                statusCode: 500,
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Registration failed' })
              });
            }
          } else {
            logAuthEvent(this.lastID, 'register', true, { headers });
            resolve({
              statusCode: 201,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                message: 'User registered successfully',
                userId: this.lastID 
              })
            });
          }
        });
    });
  } catch (error) {
    logAuthEvent(null, 'register', false, { headers }, error.message);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Registration failed' })
    };
  }
}

// Login handler
async function handleLogin(data, headers) {
  const { email, password } = data;
  
  if (!email || !password) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Email and password are required' })
    };
  }
  
  return new Promise((resolve) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
      if (err) {
        logAuthEvent(null, 'login', false, { headers }, err.message);
        resolve({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Login failed' })
        });
        return;
      }
      
      if (!user) {
        logAuthEvent(null, 'login', false, { headers }, 'User not found');
        resolve({
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Login failed. Please check your credentials.' })
        });
        return;
      }
      
      if (!bcrypt.compareSync(password, user.password)) {
        logAuthEvent(user.id, 'login', false, { headers }, 'Invalid password');
        resolve({
          statusCode: 401,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Login failed. Please check your credentials.' })
        });
        return;
      }
      
      // Update last login
      db.run(`UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE id = ?`, [user.id]);
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      logAuthEvent(user.id, 'login', true, { headers });
      
      resolve({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            lastLogin: new Date().toISOString()
          }
        })
      });
    });
  });
}

// Logout handler
async function handleLogout(headers) {
  const user = verifyToken({ headers });
  if (user) {
    logAuthEvent(user.userId, 'logout', true, { headers });
  }
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: 'Logged out successfully' })
  };
}

// Get profile handler
async function handleGetProfile(headers) {
  const user = verifyToken({ headers });
  if (!user) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  return new Promise((resolve) => {
    db.get(`SELECT id, name, email, createdAt, lastLogin FROM users WHERE id = ?`, 
      [user.userId], (err, userData) => {
        if (err || !userData) {
          resolve({
            statusCode: 404,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'User not found' })
          });
          return;
        }
        
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            createdAt: userData.createdAt,
            lastLogin: userData.lastLogin
          })
        });
      });
  });
}

// Get auth events handler
async function handleGetEvents(headers) {
  const user = verifyToken({ headers });
  if (!user) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  return new Promise((resolve) => {
    db.all(`SELECT * FROM auth_events ORDER BY timestamp DESC LIMIT 50`, (err, events) => {
      if (err) {
        resolve({
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ error: 'Failed to fetch events' })
        });
        return;
      }
      
      resolve({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(events)
      });
    });
  });
}
