/**
 * User Management Component
 * Allows viewing and deleting users with authentication tracking
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Delete,
  Search,
  Person,
  Warning
} from '@mui/icons-material';
import { format } from 'date-fns';
import { authTrackingService, AuthAction } from '../../services/authTrackingService';

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  emailVerified: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<StoredUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<StoredUser | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, searchTerm]);

  const loadUsers = () => {
    try {
      // Check localStorage for stored users
      const storedUserData = localStorage.getItem('optimizer_users_registry');
      if (storedUserData) {
        const parsedUsers = JSON.parse(storedUserData).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt)
        }));
        setUsers(parsedUsers);
      } else {
        // Create initial registry if it doesn't exist
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleDeleteUser = async (user: StoredUser) => {
    try {
      // Remove from users array
      const updatedUsers = users.filter(u => u.id !== user.id);
      setUsers(updatedUsers);
      
      // Update localStorage
      localStorage.setItem('optimizer_users_registry', JSON.stringify(updatedUsers));
      
      // Remove user's individual data
      localStorage.removeItem(`optimizer_user_${user.id}`);
      
      // Track the deletion
      await authTrackingService.trackAuthEvent(AuthAction.PROFILE_UPDATE, {
        userId: user.id,
        email: user.email,
        success: true,
        metadata: { 
          action: 'user_deleted',
          deletedBy: 'admin',
          reason: 'admin_deletion'
        }
      });

      setMessage(`User ${user.email} has been deleted successfully.`);
      setDeleteDialog(null);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Failed to delete user:', error);
      setMessage('Failed to delete user. Please try again.');
    }
  };

  const addTestUsers = () => {
    const testUsers: StoredUser[] = [
      {
        id: 'user_optim_123',
        email: 'optimumoptimizer@gmail.com',
        name: 'Optim Optimizer',
        role: 'user',
        createdAt: new Date('2025-09-19'),
        emailVerified: false
      },
      {
        id: 'user_kyle_456',
        email: 'vglve@yahoo.com',
        name: 'Kyle Smith',
        role: 'user',
        createdAt: new Date('2025-09-19'),
        emailVerified: false
      }
    ];

    const updatedUsers = [...users, ...testUsers];
    setUsers(updatedUsers);
    localStorage.setItem('optimizer_users_registry', JSON.stringify(updatedUsers));
    setMessage('Test users added for demonstration.');
  };

  const clearAllUsers = async () => {
    try {
      // Track bulk deletion
      await authTrackingService.trackAuthEvent(AuthAction.PROFILE_UPDATE, {
        success: true,
        metadata: { 
          action: 'bulk_user_deletion',
          deletedCount: users.length,
          deletedBy: 'admin'
        }
      });

      setUsers([]);
      localStorage.removeItem('optimizer_users_registry');
      
      // Clear individual user data
      users.forEach(user => {
        localStorage.removeItem(`optimizer_user_${user.id}`);
      });

      setMessage('All users have been deleted.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to clear users:', error);
      setMessage('Failed to clear users.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: '15px', fontWeight: 'normal' }}>
        User Management
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom sx={{ fontSize: '12px' }}>
        Manage user accounts, permissions, and system access
      </Typography>
      
      <Box sx={{ 
        borderTop: '0.05px solid #2c3e50', 
        margin: '30px 0' 
      }} />

      {/* Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={addTestUsers}
            variant="outlined"
            size="small"
          >
            Add Test Users
          </Button>
          <Button
            onClick={clearAllUsers}
            variant="outlined"
            color="warning"
            size="small"
          >
            Clear All Users
          </Button>
        </Box>
      </Box>

      {message && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <TextField
        fullWidth
        placeholder="Search users by email, name, or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(user.createdAt, 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.emailVerified ? 'Verified' : 'Unverified'}
                    color={user.emailVerified ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => setDeleteDialog(user)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredUsers.length === 0 && !searchTerm && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Users will appear here once they sign up for the application.
          </Typography>
          <Button onClick={addTestUsers} variant="outlined">
            Add Test Users for Demo
          </Button>
        </Paper>
      )}

      {filteredUsers.length === 0 && searchTerm && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No users match your search
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms.
          </Typography>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            Confirm User Deletion
          </Box>
        </DialogTitle>
        <DialogContent>
          {deleteDialog && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This action cannot be undone. All user data will be permanently deleted.
              </Alert>
              <Typography variant="body1" paragraph>
                Are you sure you want to delete this user?
              </Typography>
              <Box sx={{ backgroundColor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Name:</strong> {deleteDialog.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {deleteDialog.email}
                </Typography>
                <Typography variant="body2">
                  <strong>ID:</strong> {deleteDialog.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Created:</strong> {format(deleteDialog.createdAt, 'PPP')}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteDialog && handleDeleteUser(deleteDialog)}
            color="error"
            variant="contained"
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
