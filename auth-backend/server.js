const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'sxp-simple-secret-key';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3004',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database setup
const db = new sqlite3.Database('./auth.db');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Auth events table
  db.run(`
    CREATE TABLE IF NOT EXISTS auth_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address TEXT,
      success BOOLEAN,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create default admin user
  const adminEmail = 'admin@sxp.com';
  const adminPassword = 'Admin123!';
  bcrypt.hash(adminPassword, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing admin password:', err);
      return;
    }
    db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
      if (err) {
        console.error('Database error checking admin user:', err);
        return;
      }
      if (!row) {
        db.run(
          'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
          [adminEmail, hash, 'Admin User'],
          (err) => {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('✅ Admin user created: admin@sxp.com / Admin123!');
            }
          }
        );
      }
    });
  });
});

// Helper functions
const logAuthEvent = (userId, action, success, req) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  db.run(
    'INSERT INTO auth_events (user_id, action, ip_address, success) VALUES (?, ?, ?, ?)',
    [userId, action, ipAddress, success],
    (err) => {
      if (err) console.error('Error logging auth event:', err);
    }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Password hash error:', err);
      return res.status(500).json({ error: 'Password processing error' });
    }
    
    db.run(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, hash, name],
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(400).json({ error: 'Email already exists' });
          }
          console.error('User creation error:', err);
          return res.status(500).json({ error: 'User creation failed' });
        }
        
        const userId = this.lastID;
        logAuthEvent(userId, 'register', true, req);
        
        const token = jwt.sign(
          { userId, email, name },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.json({
          success: true,
          token,
          user: {
            id: userId,
            email,
            name,
            createdAt: new Date().toISOString()
          }
        });
      }
    );
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      logAuthEvent(null, 'login_attempt', false, req);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      logAuthEvent(null, 'login_attempt', false, req);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err) {
        console.error('Bcrypt error:', err);
        logAuthEvent(user.id, 'login_attempt', false, req);
        return res.status(500).json({ error: 'Authentication error' });
      }
      
      if (!result) {
        logAuthEvent(user.id, 'login_attempt', false, req);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update last login
      db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);
      
      logAuthEvent(user.id, 'login', true, req);
      
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
          lastLogin: new Date().toISOString()
        }
      });
    });
  });
});

// Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  logAuthEvent(req.user.userId, 'logout', true, req);
  res.json({ success: true, message: 'Logged out successfully' });
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, email, name, created_at, last_login FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

// Get auth events (admin only)
app.get('/api/auth/events', authenticateToken, (req, res) => {
  db.all('SELECT * FROM auth_events ORDER BY timestamp DESC LIMIT 100', [], (err, events) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(events);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SXP Auth Server running on port ${PORT}`);
  console.log(`📊 Database: ./auth.db`);
  console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
});
