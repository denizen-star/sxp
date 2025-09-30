import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
  IconButton
} from '@mui/material';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useDesignSystem } from './hooks';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: SidebarItem[];
  disabled?: boolean;
  badge?: string | number;
  divider?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  open: boolean;
  onClose: () => void;
  onItemClick?: (item: SidebarItem) => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
  anchor?: 'left' | 'right';
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  showHeader?: boolean;
  headerTitle?: string;
  headerSubtitle?: string;
  showToggleButton?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullHeight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  open,
  onClose,
  onItemClick,
  variant = 'temporary',
  anchor = 'left',
  width = 280,
  minWidth = 240,
  maxWidth = 320,
  showHeader = true,
  headerTitle = 'Navigation',
  headerSubtitle,
  showToggleButton = true,
  size = 'medium',
  fullHeight = true
}) => {
  const { colors, typography, helpers } = useDesignSystem();
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: typography.fontSizes.small,
          iconSize: 20,
          padding: helpers.spacing.sm,
        };
      case 'large':
        return {
          fontSize: typography.fontSizes.body,
          iconSize: 24,
          padding: helpers.spacing.lg,
        };
      case 'medium':
      default:
        return {
          fontSize: typography.fontSizes.small,
          iconSize: 22,
          padding: helpers.spacing.md,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const handleItemClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      const newExpanded = new Set(expandedItems);
      if (expandedItems.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    } else {
      if (onItemClick) {
        onItemClick(item);
      }
      if (variant === 'temporary') {
        onClose();
      }
    }
  };

  const renderItem = (item: SidebarItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const paddingLeft = level * 20 + sizeStyles.padding;

    return (
      <React.Fragment key={item.id}>
        {item.divider && <Divider sx={{ my: 1 }} />}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            sx={{
              pl: paddingLeft,
              py: 0.5,
              '&:hover': {
                backgroundColor: colors.background.light,
              },
              '&.Mui-selected': {
                backgroundColor: colors.text.link,
                color: colors.background.default,
                '&:hover': {
                  backgroundColor: colors.text.primary,
                },
              },
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'inherit',
                  '& .MuiSvgIcon-root': {
                    fontSize: sizeStyles.iconSize,
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: sizeStyles.fontSize,
                      fontWeight: typography.fontWeights.normal,
                      color: 'inherit',
                    }}
                  >
                    {item.label}
                  </Typography>
                  {item.badge && (
                    <Box
                      sx={{
                        backgroundColor: colors.text.link,
                        color: colors.background.default,
                        borderRadius: '50%',
                        minWidth: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: typography.fontSizes.small,
                        fontWeight: typography.fontWeights.semibold,
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </Box>
              }
            />
            {hasChildren && (
              <IconButton size="small" sx={{ ml: 1 }}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children?.map((child) => renderItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawerStyles = {
    width: Math.min(Math.max(width, minWidth), maxWidth),
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: Math.min(Math.max(width, minWidth), maxWidth),
      boxSizing: 'border-box',
      backgroundColor: colors.background.paper,
      borderRight: `1px solid ${colors.background.light}`,
      height: fullHeight ? '100vh' : 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
  };

  return (
    <Drawer
      variant={variant}
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={drawerStyles}
    >
      {showHeader && (
        <Box
          sx={{
            p: sizeStyles.padding,
            borderBottom: `1px solid ${colors.background.light}`,
            backgroundColor: colors.background.card,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography
                sx={{
                  fontSize: typography.fontSizes.subtitle,
                  fontWeight: typography.fontWeights.semibold,
                  color: colors.text.primary,
                }}
              >
                {headerTitle}
              </Typography>
              {headerSubtitle && (
                <Typography
                  sx={{
                    fontSize: typography.fontSizes.small,
                    color: colors.text.secondary,
                    mt: 0.5,
                  }}
                >
                  {headerSubtitle}
                </Typography>
              )}
            </Box>
            {showToggleButton && variant === 'temporary' && (
              <IconButton onClick={onClose} size="small">
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      )}

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 0 }}>
          {items.map((item) => renderItem(item))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
