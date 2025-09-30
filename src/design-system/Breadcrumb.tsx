import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box
} from '@mui/material';
import { NavigateNext as NavigateNextIcon, Home as HomeIcon } from '@mui/icons-material';
import { useDesignSystem } from './hooks';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHome?: boolean;
  homeHref?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal';
  fullWidth?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <NavigateNextIcon fontSize="small" />,
  maxItems = 8,
  showHome = true,
  homeHref = '/',
  onItemClick,
  size = 'medium',
  variant = 'default',
  fullWidth = false
}) => {
  const { colors, typography, helpers } = useDesignSystem();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: typography.fontSizes.small,
          padding: helpers.spacing.xs,
        };
      case 'large':
        return {
          fontSize: typography.fontSizes.body,
          padding: helpers.spacing.md,
        };
      case 'medium':
      default:
        return {
          fontSize: typography.fontSizes.small,
          padding: helpers.spacing.sm,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const isClickable = item.href && !item.disabled && !isLast;

    if (isLast) {
      return (
        <Typography
          key={index}
          sx={{
            fontSize: sizeStyles.fontSize,
            color: colors.text.primary,
            fontWeight: typography.fontWeights.semibold,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {item.icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{item.icon}</Box>}
          {item.label}
        </Typography>
      );
    }

    if (isClickable) {
      return (
        <Link
          key={index}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            handleItemClick(item, index);
          }}
          sx={{
            fontSize: sizeStyles.fontSize,
            color: colors.text.link,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': {
              textDecoration: 'underline',
              color: colors.text.primary,
            },
          }}
        >
          {item.icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{item.icon}</Box>}
          {item.label}
        </Link>
      );
    }

    return (
      <Typography
        key={index}
        sx={{
          fontSize: sizeStyles.fontSize,
          color: colors.text.secondary,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        {item.icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{item.icon}</Box>}
        {item.label}
      </Typography>
    );
  };

  const allItems = showHome 
    ? [{ label: 'Home', href: homeHref, icon: <HomeIcon fontSize="small" /> }, ...items]
    : items;

  const containerStyles = {
    width: fullWidth ? '100%' : 'auto',
    padding: variant === 'minimal' ? 0 : sizeStyles.padding,
    backgroundColor: variant === 'minimal' ? 'transparent' : colors.background.paper,
    borderRadius: variant === 'minimal' ? 0 : helpers.borderRadius.small,
  };

  return (
    <Box sx={containerStyles}>
      <MuiBreadcrumbs
        separator={separator}
        maxItems={maxItems}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: colors.text.secondary,
            fontSize: sizeStyles.fontSize,
          },
        }}
      >
        {allItems.map((item, index) => renderItem(item, index, index === allItems.length - 1))}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumb;
