import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  SvgIcon
} from '@mui/material';
import { useDesignSystem } from './hooks';

export interface EmptyStatesProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'minimal' | 'card';
  fullWidth?: boolean;
  maxWidth?: string | number;
}

export const EmptyStates: React.FC<EmptyStatesProps> = ({
  title,
  description,
  icon,
  action,
  secondaryAction,
  size = 'medium',
  variant = 'default',
  fullWidth = false,
  maxWidth = 400
}) => {
  const { colors, typography, helpers } = useDesignSystem();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 48,
          titleSize: typography.fontSizes.body,
          descriptionSize: typography.fontSizes.small,
          padding: helpers.spacing.md,
        };
      case 'large':
        return {
          iconSize: 96,
          titleSize: typography.fontSizes.title,
          descriptionSize: typography.fontSizes.body,
          padding: helpers.spacing.xl,
        };
      case 'medium':
      default:
        return {
          iconSize: 64,
          titleSize: typography.fontSizes.subtitle,
          descriptionSize: typography.fontSizes.small,
          padding: helpers.spacing.lg,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: sizeStyles.padding,
    width: fullWidth ? '100%' : 'auto',
    maxWidth: maxWidth,
    margin: '0 auto',
  };

  const cardStyles = variant === 'card' ? {
    ...helpers.getCardStyles(),
    backgroundColor: colors.background.card,
  } : {};

  const iconStyles = {
    fontSize: sizeStyles.iconSize,
    color: colors.text.secondary,
    mb: 2,
    opacity: 0.6,
  };

  const titleStyles = {
    fontSize: sizeStyles.titleSize,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    mb: description ? 1 : 2,
  };

  const descriptionStyles = {
    fontSize: sizeStyles.descriptionSize,
    color: colors.text.secondary,
    mb: (action || secondaryAction) ? 3 : 0,
    lineHeight: 1.5,
  };

  const actionContainerStyles = {
    display: 'flex',
    gap: 2,
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Paper
      elevation={variant === 'card' ? 1 : 0}
      sx={{
        ...containerStyles,
        ...cardStyles,
        backgroundColor: variant === 'card' ? colors.background.card : 'transparent',
      }}
    >
      {icon && (
        <Box sx={iconStyles}>
          {icon}
        </Box>
      )}

      <Typography sx={titleStyles}>
        {title}
      </Typography>

      {description && (
        <Typography sx={descriptionStyles}>
          {description}
        </Typography>
      )}

      {(action || secondaryAction) && (
        <Box sx={actionContainerStyles}>
          {action && (
            <Button
              variant={action.variant || 'contained'}
              onClick={action.onClick}
              sx={helpers.getButtonStyles(action.variant || 'contained')}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'outlined'}
              onClick={secondaryAction.onClick}
              sx={helpers.getButtonStyles(secondaryAction.variant || 'outlined')}
            >
              {secondaryAction.label}
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

// Predefined empty state components
export const NoDataEmptyState: React.FC<{
  onRefresh?: () => void;
  onAdd?: () => void;
}> = ({ onRefresh, onAdd }) => (
  <EmptyStates
    title="No data available"
    description="There's no data to display at the moment. Try refreshing or adding new content."
    icon={
      <SvgIcon>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </SvgIcon>
    }
    action={onAdd ? { label: 'Add Data', onClick: onAdd } : undefined}
    secondaryAction={onRefresh ? { label: 'Refresh', onClick: onRefresh, variant: 'outlined' } : undefined}
  />
);

export const ErrorEmptyState: React.FC<{
  onRetry?: () => void;
  onGoBack?: () => void;
}> = ({ onRetry, onGoBack }) => (
  <EmptyStates
    title="Something went wrong"
    description="We encountered an error while loading your data. Please try again."
    icon={
      <SvgIcon>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </SvgIcon>
    }
    action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    secondaryAction={onGoBack ? { label: 'Go Back', onClick: onGoBack, variant: 'outlined' } : undefined}
  />
);

export const SearchEmptyState: React.FC<{
  onClearSearch?: () => void;
  searchTerm?: string;
}> = ({ onClearSearch, searchTerm }) => (
  <EmptyStates
    title="No results found"
    description={searchTerm ? `No results found for "${searchTerm}". Try adjusting your search terms.` : 'No results found for your search.'}
    icon={
      <SvgIcon>
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </SvgIcon>
    }
    action={onClearSearch ? { label: 'Clear Search', onClick: onClearSearch, variant: 'outlined' } : undefined}
  />
);

export default EmptyStates;
