/**
 * Modern Dropdown Menu Component
 * Enhanced with modern UX patterns, animations, and improved accessibility
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Fade,
  Backdrop,
  Divider,
  Chip,
} from '@mui/material';
import {
  Home,
  Menu as MenuIcon,
  Close
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDesignSystem } from './hooks';

interface MenuCategory {
  id: string;
  label: string;
  description?: string;
  items: MenuItemData[];
  icon?: React.ReactNode;
}

interface MenuItemData {
  id: string;
  label: string;
  path: string;
  description?: string;
  external?: boolean;
  badge?: string;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const ModernDropdownMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors, spacing, transitions } = useDesignSystem();
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced menu categories with descriptions and modern structure
  const menuCategories: MenuCategory[] = [
    {
      id: 'cba',
      label: 'Core Features',
      description: 'Main application features',
      items: [
        { 
          id: 'persona', 
          label: 'Persona Selector', 
          path: '/', 
          description: 'Choose your lifestyle persona',
          badge: 'Popular'
        },
        { 
          id: 'schedule', 
          label: 'Schedule Viewer', 
          path: '/schedule', 
          description: 'View your optimized schedule' 
        },
        { 
          id: 'tuner', 
          label: 'Time Tuner', 
          path: '/tuner', 
          description: 'Adjust time allocations' 
        },
        { 
          id: 'analytics', 
          label: 'Analytics', 
          path: '/analytics', 
          description: 'Track your progress and insights' 
        }
      ]
    },
    {
      id: 'dev',
      label: 'Development',
      description: 'Development tools and guides',
      items: [
        { 
          id: 'guide', 
          label: 'Development Guide', 
          path: '/navigation-guide', 
          description: 'Comprehensive development documentation',
          badge: 'Updated'
        },
        { 
          id: 'tests', 
          label: 'Test Suite', 
          path: '/auth-demo', 
          description: 'Authentication and testing tools' 
        }
      ]
    },
    {
      id: 'admin',
      label: 'Administration',
      description: 'Admin and security tools',
      items: [
        { 
          id: 'security', 
          label: 'Security Monitor', 
          path: '/auth-activity', 
          description: 'Authentication activity tracking' 
        },
        { 
          id: 'users', 
          label: 'User Management', 
          path: '/users', 
          description: 'Manage user accounts and permissions' 
        },
        { 
          id: 'database', 
          label: 'Database Tools', 
          path: '/database-query', 
          description: 'Database query and management tools' 
        }
      ]
    },
    {
      id: 'auth',
      label: 'Authentication',
      description: 'User authentication and accounts',
      items: [
        { 
          id: 'signup', 
          label: 'Create Account', 
          path: '/signup', 
          description: 'Register a new user account' 
        },
        { 
          id: 'login', 
          label: 'Sign In', 
          path: '/auth-demo', 
          description: 'Access your account' 
        }
      ]
    }
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, categoryId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Immediately close all other menus and open the current one
    const newAnchorEl = { [categoryId]: event.currentTarget };
    setAnchorEl(newAnchorEl);
  };

  const handleMenuClose = (categoryId: string, delay = 0) => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setAnchorEl(prev => ({
          ...prev,
          [categoryId]: null
        }));
        timeoutRef.current = null;
      }, delay);
    } else {
      setAnchorEl(prev => ({
        ...prev,
        [categoryId]: null
      }));
    }
  };

  const handleMenuItemClick = (item: MenuItemData) => {
    // Close all open menus
    Object.keys(anchorEl).forEach(categoryId => {
      handleMenuClose(categoryId);
    });
    setMobileMenuOpen(false);
    
    // Navigate to the selected page
    navigate(item.path);
    
    // Ensure the page receives focus after navigation
    setTimeout(() => {
      const mainContent = document.querySelector('main') || document.body;
      if (mainContent) {
        mainContent.focus();
        // Also scroll to top to ensure proper page focus
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, item: MenuItemData) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMenuItemClick(item);
    } else if (event.key === 'Escape') {
      // Close all menus on Escape
      Object.keys(anchorEl).forEach(categoryId => {
        handleMenuClose(categoryId);
      });
      setMobileMenuOpen(false);
    }
  };

  const renderDesktopMenu = () => (
    <Box 
      sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
      onMouseLeave={() => {
        // Only close menus when leaving the entire menu container
        Object.keys(anchorEl).forEach(categoryId => {
          handleMenuClose(categoryId, 150);
        });
      }}
    >
      {menuCategories.map((category) => (
        <Box 
          key={category.id}
          onMouseEnter={(e) => {
            // Clear any pending close timeouts
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            handleMenuOpen(e, category.id);
          }}
        >
              <Box
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl[category.id])}
                aria-label={`Open ${category.label} menu`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.navigation.text,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: spacing.sm,
                  cursor: 'pointer',
                  transition: `all ${transitions.standard}`,
                  fontSize: '13px',
                  fontWeight: 500,
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-1px)',
                  },
                  '&:focus': {
                    outline: `2px solid ${colors.accent.blue}`,
                    outlineOffset: '2px'
                  }
                }}
              >
            <Typography sx={{ 
              fontSize: '13px',
              fontWeight: 500
            }}>
              {category.label}
            </Typography>
          </Box>

          <Menu
            anchorEl={anchorEl[category.id]}
            open={Boolean(anchorEl[category.id])}
            onClose={() => handleMenuClose(category.id)}
            TransitionComponent={Fade}
            PaperProps={{
              sx: {
                backgroundColor: colors.background.paper,
                border: `1px solid ${colors.accent.gray}`,
                borderRadius: spacing.md,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                minWidth: '280px',
                maxWidth: '320px',
                mt: 1,
                overflow: 'hidden'
              },
              onMouseEnter: () => {
                // Clear any pending close timeouts when hovering over the menu
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
              },
              onMouseLeave: () => {
                // Close menu when leaving the dropdown
                handleMenuClose(category.id, 150);
              }
            }}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            MenuListProps={{
              sx: { padding: 0 }
            }}
          >
            {/* Category Header */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: colors.background.light,
              borderBottom: `1px solid ${colors.accent.gray}`
            }}>
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 600,
                color: colors.text.primary,
                fontSize: '13px'
              }}>
                {category.label}
              </Typography>
              {category.description && (
                <Typography variant="caption" sx={{ 
                  color: colors.text.secondary,
                  fontSize: '10px'
                }}>
                  {category.description}
                </Typography>
              )}
            </Box>

            {category.items.map((item, index) => (
              <MenuItem
                key={item.id}
                onClick={() => handleMenuItemClick(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                tabIndex={0}
                sx={{
                  color: colors.text.primary,
                  fontSize: '12px',
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderBottom: index < category.items.length - 1 ? `1px solid ${colors.background.light}` : 'none',
                  '&:hover': {
                    backgroundColor: colors.button.background,
                    color: colors.navigation.text,
                  },
                  backgroundColor: isActive(item.path) ? colors.button.background : 'transparent',
                  transition: `all ${transitions.standard}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0.5
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  width: '100%'
                }}>
                  <Typography sx={{ 
                    fontSize: '12px',
                    fontWeight: isActive(item.path) ? 600 : 400
                  }}>
                    {item.label}
                  </Typography>
                  {item.badge && (
                    <Chip 
                      label={item.badge}
                      size="small"
                      color={item.badgeColor || 'primary'}
                      sx={{ 
                        height: '16px',
                        fontSize: '9px',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}
                </Box>
                {item.description && (
                  <Typography variant="caption" sx={{ 
                    color: colors.text.secondary,
                    fontSize: '10px',
                    lineHeight: 1.2
                  }}>
                    {item.description}
                  </Typography>
                )}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      ))}
    </Box>
  );

  const renderMobileMenu = () => (
    <>
      <IconButton
        color="inherit"
        onClick={toggleMobileMenu}
        sx={{ 
          display: { xs: 'block', md: 'none' },
          ml: 2
        }}
      >
        {mobileMenuOpen ? <Close /> : <MenuIcon />}
      </IconButton>

      <Backdrop
        open={mobileMenuOpen}
        onClick={() => setMobileMenuOpen(false)}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer - 1,
          display: { xs: 'block', md: 'none' }
        }}
      />

      <Menu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        anchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: '100vw',
            maxHeight: '80vh',
            backgroundColor: colors.background.paper,
            border: `1px solid ${colors.accent.gray}`,
            borderRadius: `${spacing.md} ${spacing.md} 0 0`,
            mt: 1,
            overflow: 'auto'
          }
        }}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {menuCategories.map((category, categoryIndex) => (
          <Box key={category.id}>
            {/* Category Header */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: colors.background.light,
              borderBottom: `1px solid ${colors.accent.gray}`
            }}>
              <Typography variant="subtitle2" sx={{ 
                fontWeight: 600,
                color: colors.text.primary,
                fontSize: '13px'
              }}>
                {category.label}
              </Typography>
              {category.description && (
                <Typography variant="caption" sx={{ 
                  color: colors.text.secondary,
                  fontSize: '10px'
                }}>
                  {category.description}
                </Typography>
              )}
            </Box>

            {category.items.map((item, itemIndex) => (
              <MenuItem
                key={item.id}
                onClick={() => handleMenuItemClick(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                tabIndex={0}
                sx={{
                  color: colors.text.primary,
                  fontSize: '12px',
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderBottom: itemIndex < category.items.length - 1 ? `1px solid ${colors.background.light}` : 'none',
                  '&:hover': {
                    backgroundColor: colors.button.background,
                    color: colors.navigation.text,
                  },
                  backgroundColor: isActive(item.path) ? colors.button.background : 'transparent',
                  transition: `all ${transitions.standard}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0.5
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  width: '100%'
                }}>
                  <Typography sx={{ 
                    fontSize: '12px',
                    fontWeight: isActive(item.path) ? 600 : 400
                  }}>
                    {item.label}
                  </Typography>
                  {item.badge && (
                    <Chip 
                      label={item.badge}
                      size="small"
                      color={item.badgeColor || 'primary'}
                      sx={{ 
                        height: '16px',
                        fontSize: '9px',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}
                </Box>
                {item.description && (
                  <Typography variant="caption" sx={{ 
                    color: colors.text.secondary,
                    fontSize: '10px',
                    lineHeight: 1.2
                  }}>
                    {item.description}
                  </Typography>
                )}
              </MenuItem>
            ))}

            {categoryIndex < menuCategories.length - 1 && (
              <Divider sx={{ my: 1 }} />
            )}
          </Box>
        ))}
      </Menu>
    </>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: colors.navigation.background,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid rgba(255, 255, 255, 0.1)`
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between', 
        minHeight: '64px',
        maxWidth: '1200px',
        mx: 'auto',
        width: '100%'
      }}>
        {/* Logo */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            transition: `all ${transitions.standard}`,
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
          onClick={() => navigate('/auth-demo')}
        >
          <Home sx={{ 
            mr: 2, 
            color: colors.navigation.text,
            fontSize: '28px',
            transition: `all ${transitions.standard}`
          }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: colors.navigation.text,
              fontSize: '20px',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.5px'
            }}
          >
            Optimizer
          </Typography>
        </Box>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {renderDesktopMenu()}
        </Box>

        {/* Mobile Menu */}
        {renderMobileMenu()}
      </Toolbar>
    </AppBar>
  );
};

export default ModernDropdownMenu;
