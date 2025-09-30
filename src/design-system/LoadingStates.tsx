import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Skeleton,
  Backdrop
} from '@mui/material';
import { useDesignSystem } from './hooks';

export interface LoadingStatesProps {
  type?: 'circular' | 'linear' | 'skeleton' | 'backdrop';
  size?: 'small' | 'medium' | 'large';
  message?: string;
  progress?: number;
  variant?: 'determinate' | 'indeterminate';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  fullScreen?: boolean;
  overlay?: boolean;
  rows?: number;
  width?: string | number;
  height?: string | number;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  type = 'circular',
  size = 'medium',
  message,
  progress,
  variant = 'indeterminate',
  color = 'primary',
  fullScreen = false,
  overlay = false,
  rows = 3,
  width = '100%',
  height = 'auto'
}) => {
  const { colors, typography, helpers } = useDesignSystem();

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'medium': return 40;
      case 'large': return 60;
      default: return 40;
    }
  };

  const getColor = () => {
    switch (color) {
      case 'primary': return colors.text.link;
      case 'secondary': return colors.text.secondary;
      case 'success': return colors.status.success;
      case 'error': return colors.status.error;
      case 'warning': return colors.status.partial;
      case 'info': return colors.status.functional;
      default: return colors.text.link;
    }
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: helpers.spacing.lg,
    width: fullScreen ? '100vw' : width,
    height: fullScreen ? '100vh' : height,
    backgroundColor: overlay ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
    position: fullScreen ? 'fixed' : 'relative',
    top: fullScreen ? 0 : 'auto',
    left: fullScreen ? 0 : 'auto',
    zIndex: fullScreen ? 9999 : 'auto',
  };

  const renderLoading = () => {
    switch (type) {
      case 'circular':
        return (
          <CircularProgress
            size={getSize()}
            color={color}
            variant={variant}
            value={progress}
            sx={{ color: getColor() }}
          />
        );

      case 'linear':
        return (
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <LinearProgress
              variant={variant}
              value={progress}
              color={color}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.background.light,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getColor(),
                },
              }}
            />
            {progress !== undefined && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: typography.fontSizes.small,
                  color: colors.text.secondary,
                  textAlign: 'center',
                  mt: 1,
                }}
              >
                {Math.round(progress)}%
              </Typography>
            )}
          </Box>
        );

      case 'skeleton':
        return (
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            {Array.from({ length: rows }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={40}
                sx={{
                  mb: 1,
                  borderRadius: helpers.borderRadius.small,
                  backgroundColor: colors.background.light,
                }}
              />
            ))}
          </Box>
        );

      case 'backdrop':
        return (
          <Backdrop
            open={true}
            sx={{
              color: getColor(),
              zIndex: 9999,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress color="inherit" size={getSize()} />
              {message && (
                <Typography
                  sx={{
                    fontSize: typography.fontSizes.body,
                    color: colors.text.primary,
                    textAlign: 'center',
                  }}
                >
                  {message}
                </Typography>
              )}
            </Box>
          </Backdrop>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={containerStyles}>
      {renderLoading()}
      {message && type !== 'backdrop' && (
        <Typography
          sx={{
            fontSize: typography.fontSizes.body,
            color: colors.text.primary,
            textAlign: 'center',
            maxWidth: 300,
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingStates;
