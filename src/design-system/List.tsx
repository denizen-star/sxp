import React from 'react';
import {
  List as MuiList,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Box,
  Typography,
  Divider,
  Chip,
  Checkbox
} from '@mui/material';
import { useDesignSystem } from './hooks';

export interface ListItemData {
  id: string;
  primary: string;
  secondary?: string;
  avatar?: string | React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
  href?: string;
}

export interface ListProps {
  items: ListItemData[];
  onItemClick?: (item: ListItemData) => void;
  selectable?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedItems: string[]) => void;
  variant?: 'default' | 'dense' | 'comfortable';
  size?: 'small' | 'medium' | 'large';
  showDividers?: boolean;
  showAvatars?: boolean;
  showIcons?: boolean;
  showActions?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  maxHeight?: string | number;
  fullWidth?: boolean;
}

export const List: React.FC<ListProps> = ({
  items,
  onItemClick,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  variant = 'default',
  size = 'medium',
  showDividers = true,
  showAvatars = true,
  showIcons = true,
  showActions = true,
  loading = false,
  emptyMessage = 'No items available',
  maxHeight,
  fullWidth = true
}) => {
  const { colors, typography, helpers } = useDesignSystem();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: typography.fontSizes.small,
          padding: helpers.spacing.xs,
          avatarSize: 32,
        };
      case 'large':
        return {
          fontSize: typography.fontSizes.body,
          padding: helpers.spacing.lg,
          avatarSize: 48,
        };
      case 'medium':
      default:
        return {
          fontSize: typography.fontSizes.small,
          padding: helpers.spacing.sm,
          avatarSize: 40,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getVariantStyles = () => {
    switch (variant) {
      case 'dense':
        return {
          padding: helpers.spacing.xs,
        };
      case 'comfortable':
        return {
          padding: helpers.spacing.lg,
        };
      default:
        return {
          padding: sizeStyles.padding,
        };
    }
  };

  const handleItemClick = (item: ListItemData) => {
    if (onItemClick) {
      onItemClick(item);
    }
    if (item.onClick) {
      item.onClick();
    }
  };

  const handleSelectionChange = (itemId: string, checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange([...selectedItems, itemId]);
      } else {
        onSelectionChange(selectedItems.filter(id => id !== itemId));
      }
    }
  };

  const containerStyles = {
    width: fullWidth ? '100%' : 'auto',
    maxHeight: maxHeight || 'none',
    overflow: maxHeight ? 'auto' : 'visible',
    backgroundColor: colors.background.section,
    borderRadius: helpers.borderRadius.medium,
    border: `1px solid ${colors.background.light}`,
  };

  const listItemStyles = {
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
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: colors.text.secondary }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: colors.text.secondary }}>
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={containerStyles}>
      <MuiList sx={{ p: 0 }}>
        {items.map((item, index) => {
          const isSelected = selectedItems.includes(item.id);
          
          return (
            <React.Fragment key={item.id}>
              <ListItem
                disablePadding
                sx={listItemStyles}
              >
                {selectable && (
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => handleSelectionChange(item.id, event.target.checked)}
                      color="primary"
                    />
                  </ListItemIcon>
                )}

                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  sx={{
                    ...getVariantStyles(),
                    '&:hover': {
                      backgroundColor: isSelected ? colors.text.primary : colors.background.light,
                    },
                  }}
                >
                  {showAvatars && item.avatar && (
                    <ListItemIcon sx={{ minWidth: 50 }}>
                      {typeof item.avatar === 'string' ? (
                        <Avatar
                          src={item.avatar}
                          sx={{
                            width: sizeStyles.avatarSize,
                            height: sizeStyles.avatarSize,
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: sizeStyles.avatarSize,
                            height: sizeStyles.avatarSize,
                            backgroundColor: colors.text.link,
                            color: colors.background.default,
                          }}
                        >
                          {item.avatar}
                        </Avatar>
                      )}
                    </ListItemIcon>
                  )}

                  {showIcons && item.icon && !item.avatar && (
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isSelected ? colors.background.default : colors.text.secondary,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  )}

                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: sizeStyles.fontSize,
                          fontWeight: typography.fontWeights.normal,
                          color: isSelected ? colors.background.default : colors.text.primary,
                        }}
                      >
                        {item.primary}
                      </Typography>
                    }
                    secondary={
                      item.secondary && (
                        <Typography
                          sx={{
                            fontSize: typography.fontSizes.small,
                            color: isSelected ? colors.background.default : colors.text.secondary,
                            mt: 0.5,
                          }}
                        >
                          {item.secondary}
                        </Typography>
                      )
                    }
                  />

                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        backgroundColor: isSelected ? colors.background.default : colors.text.link,
                        color: isSelected ? colors.text.link : colors.background.default,
                        fontSize: typography.fontSizes.small,
                        height: 20,
                        '& .MuiChip-label': {
                          fontSize: typography.fontSizes.small,
                        },
                      }}
                    />
                  )}

                  {showActions && item.action && (
                    <ListItemSecondaryAction>
                      {item.action}
                    </ListItemSecondaryAction>
                  )}
                </ListItemButton>
              </ListItem>
              {showDividers && index < items.length - 1 && (
                <Divider sx={{ mx: 2 }} />
              )}
            </React.Fragment>
          );
        })}
      </MuiList>
    </Box>
  );
};

export default List;
