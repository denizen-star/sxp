import React from 'react';
import { Box, Container as MuiContainer } from '@mui/material';
import { useDesignSystem } from './hooks';

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  padding?: number;
  margin?: number;
  backgroundColor?: string;
  fullHeight?: boolean;
  centerContent?: boolean;
  spacing?: number;
  direction?: 'row' | 'column';
  wrap?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 3,
  margin = 0,
  backgroundColor,
  fullHeight = false,
  centerContent = false,
  spacing = 2,
  direction = 'column',
  wrap = false
}) => {
  const { colors, helpers } = useDesignSystem();

  const containerStyles = {
    padding: helpers.getSpacing(padding),
    margin: helpers.getSpacing(margin),
    backgroundColor: backgroundColor || colors.background.default,
    minHeight: fullHeight ? '100vh' : 'auto',
    display: 'flex',
    flexDirection: direction,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    alignItems: centerContent ? 'center' : 'flex-start',
    justifyContent: centerContent ? 'center' : 'flex-start',
    gap: helpers.getSpacing(spacing),
  };

  if (maxWidth === false) {
    return (
      <Box sx={containerStyles}>
        {children}
      </Box>
    );
  }

  return (
    <MuiContainer maxWidth={maxWidth} sx={containerStyles}>
      {children}
    </MuiContainer>
  );
};

export default Container;
