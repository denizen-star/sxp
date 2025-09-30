import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useDesignSystem } from './hooks';

export interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  spacing?: number;
  showDivider?: boolean;
  dividerPosition?: 'top' | 'bottom' | 'both';
  fullWidth?: boolean;
  centerContent?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  children,
  backgroundColor,
  padding = 3,
  margin = 2,
  spacing = 2,
  showDivider = false,
  dividerPosition = 'bottom',
  fullWidth = true,
  centerContent = false
}) => {
  const { colors, typography, helpers } = useDesignSystem();

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : 'auto',
        backgroundColor: backgroundColor || colors.background.section,
        padding: helpers.getSpacing(padding),
        margin: helpers.getSpacing(margin),
        borderRadius: helpers.borderRadius.medium,
        boxShadow: helpers.shadows.light,
        display: 'flex',
        flexDirection: 'column',
        alignItems: centerContent ? 'center' : 'flex-start',
        gap: helpers.getSpacing(spacing),
      }}
    >
      {showDivider && dividerPosition === 'top' && <Divider sx={{ width: '100%' }} />}
      
      {(title || subtitle) && (
        <Box sx={{ width: '100%', textAlign: centerContent ? 'center' : 'left' }}>
          {title && (
            <Typography
              variant="h4"
              sx={{
                fontSize: typography.fontSizes.title,
                fontWeight: typography.fontWeights.semibold,
                color: colors.text.primary,
                mb: subtitle ? 1 : 0,
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body1"
              sx={{
                fontSize: typography.fontSizes.subtitle,
                color: colors.text.secondary,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ width: '100%' }}>
        {children}
      </Box>

      {showDivider && dividerPosition === 'bottom' && <Divider sx={{ width: '100%' }} />}
    </Box>
  );
};

export default Section;
