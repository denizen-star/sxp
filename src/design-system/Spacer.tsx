import React from 'react';
import { Box } from '@mui/material';
import { useDesignSystem } from './hooks';

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  direction?: 'vertical' | 'horizontal';
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  direction = 'vertical',
  fullWidth = false,
  fullHeight = false
}) => {
  const { helpers } = useDesignSystem();

  const getSpacingValue = () => {
    if (typeof size === 'number') {
      return helpers.getSpacing(size);
    }
    
    const spacingMap = {
      xs: helpers.spacing.xs,
      sm: helpers.spacing.sm,
      md: helpers.spacing.md,
      lg: helpers.spacing.lg,
      xl: helpers.spacing.xl,
    };
    
    return spacingMap[size];
  };

  const spacerStyles = {
    [direction === 'vertical' ? 'height' : 'width']: fullWidth || fullHeight ? '100%' : getSpacingValue(),
    [direction === 'vertical' ? 'width' : 'height']: '1px',
    display: 'block',
  };

  return <Box sx={spacerStyles} />;
};

export default Spacer;
