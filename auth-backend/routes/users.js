const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Database connection
const dbPath = path.join(__dirname, '../auth.db');
const db = new sqlite3.Database(dbPath);

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sxp-simple-secret');
    
    // Check if user is admin
    db.get(
      'SELECT email FROM users WHERE id = ? AND (email = ? OR email = ?)',
      [decoded.userId, 'admin@sxp.com', 'optimumoptimizer@gmail.com'],
      (err, row) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (!row) {
          return res.status(403).json({ success: false, message: 'Admin access required' });
        }
        
        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Get all users (admin only)
router.get('/', verifyAdminToken, (req, res) => {
  db.all(
    'SELECT id, name, email, created_at, last_login FROM users ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      const users = rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        createdAt: row.created_at,
        lastLogin: row.last_login,
        isAdmin: row.email === 'admin@sxp.com' || row.email === 'optimumoptimizer@gmail.com'
      }));
      
      res.json({ success: true, users });
    }
  );
});

// Get user by ID (admin only)
router.get('/:id', verifyAdminToken, (req, res) => {
  const userId = req.params.id;
  
  db.get(
    'SELECT id, name, email, created_at, last_login FROM users WHERE id = ?',
    [userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      const user = {
        id: row.id,
        name: row.name,
        email: row.email,
        createdAt: row.created_at,
        lastLogin: row.last_login,
        isAdmin: row.email === 'admin@sxp.com' || row.email === 'optimumoptimizer@gmail.com'
      };
      
      res.json({ success: true, user });
    }
  );
});

// Create new user (admin only)
router.post('/', verifyAdminToken, async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }
  
  try {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (row) {
        return res.status(409).json({ success: false, message: 'User with this email already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insert new user
      db.run(
        'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, new Date().toISOString()],
        function(err) {
          if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
          }
          
          // Log admin action
          db.run(
            'INSERT INTO auth_events (user_id, email, action, success, timestamp, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.userId, req.user.email, 'ADMIN_CREATE_USER', true, new Date().toISOString(), req.ip || 'unknown']
          );
          
          res.json({ 
            success: true, 
            message: 'User created successfully',
            user: {
              id: this.lastID,
              name,
              email,
              createdAt: new Date().toISOString()
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user (admin only)
router.put('/:id', verifyAdminToken, async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }
  
  try {
    // Check if user exists
    db.get('SELECT id, email FROM users WHERE id = ?', [userId], async (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      if (!row) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      // Check if email is being changed and if new email already exists
      if (email !== row.email) {
        db.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId], (err, existingUser) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
          }
          
          if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already in use' });
          }
          
          updateUser();
        });
      } else {
        updateUser();
      }
      
      async function updateUser() {
        let updateQuery = 'UPDATE users SET name = ?, email = ?';
        let params = [name, email];
        
        // Update password if provided
        if (password && password.length >= 6) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updateQuery += ', password = ?';
          params.push(hashedPassword);
        }
        
        updateQuery += ' WHERE id = ?';
        params.push(userId);
        
        db.run(updateQuery, params, function(err) {
          if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
          }
          
          // Log admin action
          db.run(
            'INSERT INTO auth_events (user_id, email, action, success, timestamp, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.userId, req.user.email, 'ADMIN_UPDATE_USER', true, new Date().toISOString(), req.ip || 'unknown']
          );
          
          res.json({ success: true, message: 'User updated successfully' });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', verifyAdminToken, (req, res) => {
  const userId = req.params.id;
  
  // Check if user exists and is not an admin
  db.get('SELECT id, email FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Prevent deletion of admin users
    if (row.email === 'admin@sxp.com' || row.email === 'optimumoptimizer@gmail.com') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
    }
    
    // Delete user
    db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      // Log admin action
      db.run(
        'INSERT INTO auth_events (user_id, email, action, success, timestamp, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.userId, req.user.email, 'ADMIN_DELETE_USER', true, new Date().toISOString(), req.ip || 'unknown']
      );
      
      res.json({ success: true, message: 'User deleted successfully' });
    });
  });
});

// Get admin statistics
router.get('/stats/overview', verifyAdminToken, (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total FROM users',
    'SELECT COUNT(*) as admins FROM users WHERE email = ? OR email = ?',
    'SELECT COUNT(*) as recent FROM auth_events WHERE action = ? AND timestamp > ?'
  ];
  
  const adminEmails = ['admin@sxp.com', 'optimumoptimizer@gmail.com'];
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  Promise.all([
    new Promise((resolve, reject) => {
      db.get(queries[0], [], (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries[1], adminEmails, (err, row) => {
        if (err) reject(err);
        else resolve(row.admins);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries[2], ['LOGIN_SUCCESS', oneDayAgo], (err, row) => {
        if (err) reject(err);
        else resolve(row.recent);
      });
    })
  ]).then(([totalUsers, adminUsers, recentLogins]) => {
    res.json({
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        regularUsers: totalUsers - adminUsers,
        recentLogins
      }
    });
  }).catch(err => {
    res.status(500).json({ success: false, message: 'Database error' });
  });
});

module.exports = router;
