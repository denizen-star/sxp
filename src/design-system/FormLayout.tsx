import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import { useDesignSystem } from './hooks';

export interface FormLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  spacing?: number;
  padding?: number;
  backgroundColor?: string;
  showDivider?: boolean;
  fullWidth?: boolean;
}

export const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  subtitle,
  children,
  columns = 1,
  spacing = 2,
  padding = 3,
  backgroundColor,
  showDivider = false,
  fullWidth = true
}) => {
  const { colors, typography, helpers } = useDesignSystem();


  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {(title || subtitle) && (
        <Box sx={{ mb: spacing }}>
          {title && (
            <Typography
              variant="h5"
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
              variant="body2"
              sx={{
                fontSize: typography.fontSizes.subtitle,
                color: colors.text.secondary,
              }}
            >
              {subtitle}
            </Typography>
          )}
          {showDivider && <Divider sx={{ mt: 2 }} />}
        </Box>
      )}
      
      <Paper
        sx={{
          ...helpers.getCardStyles(),
          backgroundColor: backgroundColor || colors.background.card,
          p: padding,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: columns === 1 ? '1fr' : columns === 2 ? '1fr 1fr' : columns === 3 ? '1fr 1fr 1fr' : '1fr 1fr 1fr 1fr',
            },
            gap: spacing,
          }}
        >
          {React.Children.map(children, (child, index) => (
            <Box key={index}>
              {child}
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default FormLayout;
