// Simple authentication function for Netlify
// This is a temporary solution that uses in-memory storage

// In-memory storage (will reset on each function invocation)
let users = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@sxp.com',
    password: 'Admin123!', // In production, this should be hashed
    createdAt: new Date().toISOString(),
    lastLogin: null
  }
];

let authEvents = [];

// Simple JWT-like token generation (not secure, for demo only)
function generateToken(userId) {
  const payload = {
    userId: userId,
    email: users.find(u => u.id === userId)?.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  // Simple base64 encoding (not secure, for demo only)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// Simple token verification
function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      return null; // Token expired
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

// Helper function to log auth events
function logAuthEvent(userId, action, success, req, errorReason = null) {
  const event = {
    id: authEvents.length + 1,
    userId: userId,
    action: action,
    success: success,
    timestamp: new Date().toISOString(),
    ipAddress: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    errorReason: errorReason
  };
  
  authEvents.push(event);
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
      headers,
      body: JSON.stringify({ error: 'Name, email, and password are required' })
    };
  }
  
  if (password.length < 6) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Password must be at least 6 characters' })
    };
  }
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    logAuthEvent(null, 'register', false, { headers }, 'Email already exists');
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Registration failed. Email may already exist.' })
    };
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    name: name,
    email: email,
    password: password, // In production, this should be hashed
    createdAt: new Date().toISOString(),
    lastLogin: null
  };
  
  users.push(newUser);
  logAuthEvent(newUser.id, 'register', true, { headers });
  
  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({ 
      message: 'User registered successfully',
      userId: newUser.id 
    })
  };
}

// Login handler
async function handleLogin(data, headers) {
  const { email, password } = data;
  
  if (!email || !password) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Email and password are required' })
    };
  }
  
  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    logAuthEvent(null, 'login', false, { headers }, 'User not found');
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Login failed. Please check your credentials.' })
    };
  }
  
  // Check password (in production, this should use bcrypt)
  if (user.password !== password) {
    logAuthEvent(user.id, 'login', false, { headers }, 'Invalid password');
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Login failed. Please check your credentials.' })
    };
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString();
  
  // Generate token
  const token = generateToken(user.id);
  
  logAuthEvent(user.id, 'login', true, { headers });
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    })
  };
}

// Logout handler
async function handleLogout(headers) {
  const authHeader = headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (user) {
      logAuthEvent(user.userId, 'logout', true, { headers });
    }
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Logged out successfully' })
  };
}

// Get profile handler
async function handleGetProfile(headers) {
  const authHeader = headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid token' })
    };
  }
  
  const userData = users.find(u => u.id === user.userId);
  if (!userData) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'User not found' })
    };
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      createdAt: userData.createdAt,
      lastLogin: userData.lastLogin
    })
  };
}

// Get auth events handler
async function handleGetEvents(headers) {
  const authHeader = headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  const token = authHeader.substring(7);
  const user = verifyToken(token);
  if (!user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Invalid token' })
    };
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(authEvents.slice(-50)) // Return last 50 events
  };
}