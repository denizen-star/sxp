/**
 * Standardized Dropdown Menu Component
 * Reusable across all pages with consistent styling and behavior
 */

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import {
  Home
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDesignSystem } from './hooks';

interface MenuCategory {
  id: string;
  label: string;
  items: MenuItemData[];
}

interface MenuItemData {
  id: string;
  label: string;
  path: string;
  external?: boolean;
}

const DropdownMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useDesignSystem();
  
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  // Menu categories with 30 character limit
  const menuCategories: MenuCategory[] = [
    {
      id: 'cba',
      label: 'CBA',
      items: [
        { id: 'persona', label: 'Current Persona Selector', path: '/' },
        { id: 'schedule', label: 'Schedule', path: '/schedule' },
        { id: 'tuner', label: 'Tuner', path: '/tuner' }
      ]
    },
    {
      id: 'dev',
      label: 'Dev',
      items: [
        { id: 'guide', label: 'Dev Guide', path: '/navigation-guide', external: false },
        { id: 'tests', label: 'All Test Links', path: '/auth-demo' }
      ]
    },
    {
      id: 'admin',
      label: 'Admin',
      items: [
        { id: 'security', label: 'Security', path: '/auth-activity' },
        { id: 'users', label: 'Users', path: '/users' },
        { id: 'database', label: 'Database', path: '/database-query' }
      ]
    },
    {
      id: 'auth',
      label: 'Sign-up/In',
      items: [
        { id: 'signup', label: 'User Creation', path: '/signup' },
        { id: 'login', label: 'Authentication', path: '/auth-demo' }
      ]
    }
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, categoryId: string) => {
    setAnchorEl(prev => ({
      ...prev,
      [categoryId]: event.currentTarget
    }));
  };

  const handleMenuClose = (categoryId: string) => {
    setAnchorEl(prev => ({
      ...prev,
      [categoryId]: null
    }));
  };

          const handleMenuItemClick = (item: MenuItemData) => {
    handleMenuClose(item.id.split('_')[0]); // Close menu based on category
    navigate(item.path);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: colors.navigation.background }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 2, color: colors.navigation.text }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: colors.navigation.text,
              fontSize: '20px',
              fontWeight: 'normal',
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            onClick={() => navigate('/auth-demo')}
          >
            Optimizer
          </Typography>
        </Box>

        {/* Menu Categories */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {menuCategories.map((category) => (
            <Box key={category.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.navigation.text,
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  fontSize: '14px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                onClick={(e) => handleMenuOpen(e, category.id)}
              >
                <Typography sx={{ fontSize: '14px' }}>
                  {category.label}
                </Typography>
              </Box>

              <Menu
                anchorEl={anchorEl[category.id]}
                open={Boolean(anchorEl[category.id])}
                onClose={() => handleMenuClose(category.id)}
                PaperProps={{
                  sx: {
                    backgroundColor: colors.background.paper,
                    border: `1px solid ${colors.accent.gray}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: '200px'
                  }
                }}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
              >
                {category.items.map((item) => (
                  <MenuItem
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    sx={{
                      color: colors.text.primary,
                      fontSize: '12px',
                      padding: '8px 16px',
                      '&:hover': {
                        backgroundColor: colors.button.background,
                        color: colors.navigation.text
                      },
                      backgroundColor: isActive(item.path) ? colors.button.background : 'transparent'
                    }}
                  >
                    <Typography sx={{ fontSize: '12px' }}>
                      {item.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DropdownMenu;
