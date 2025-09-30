import { useTheme } from '@mui/material/styles';
import { DESIGN_SYSTEM } from './theme';

// Extend the theme type to include our custom colors
declare module '@mui/material/styles' {
  interface Theme {
    customColors: {
      navigation: {
        background: string;
        text: string;
        icon: string;
      };
      accent: {
        teal: string;
        blue: string;
        gray: string;
        linkBlue: string;
      };
      button: {
        background: string;
        text: string;
        hover: string;
      };
    };
  }
  
  interface ThemeOptions {
    customColors?: {
      navigation?: {
        background?: string;
        text?: string;
        icon?: string;
      };
      accent?: {
        teal?: string;
        blue?: string;
        gray?: string;
        linkBlue?: string;
      };
      button?: {
        background?: string;
        text?: string;
        hover?: string;
      };
    };
  }
}

// Custom hook for accessing design system values
export const useDesignSystem = () => {
  const theme = useTheme();
  
  return {
    // Typography
    typography: DESIGN_SYSTEM.typography,
    
    // Colors - combine DESIGN_SYSTEM colors with theme customColors
    colors: {
      ...DESIGN_SYSTEM.colors,
      custom: theme.customColors || {
        navigation: DESIGN_SYSTEM.colors.navigation,
        accent: DESIGN_SYSTEM.colors.accent,
        button: DESIGN_SYSTEM.colors.button,
      },
    },
    
    // Spacing
    spacing: DESIGN_SYSTEM.spacing,
    
    // Border radius
    borderRadius: DESIGN_SYSTEM.borderRadius,
    
    // Shadows
    shadows: DESIGN_SYSTEM.shadows,
    
    // Transitions
    transitions: DESIGN_SYSTEM.transitions,
    
    // Helper functions
    helpers: {
      // Direct access to design system values
      spacing: DESIGN_SYSTEM.spacing,
      borderRadius: DESIGN_SYSTEM.borderRadius,
      shadows: DESIGN_SYSTEM.shadows,
      
      // Get consistent button styles
      getButtonStyles: (variant: 'contained' | 'outlined' | 'text' = 'contained') => ({
        fontSize: DESIGN_SYSTEM.typography.fontSizes.small,
        fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
        padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
        borderRadius: DESIGN_SYSTEM.borderRadius.medium,
        textTransform: 'none' as const,
        ...(variant === 'contained' && {
          backgroundColor: DESIGN_SYSTEM.colors.button.background,
          color: DESIGN_SYSTEM.colors.button.text,
          '&:hover': {
            backgroundColor: DESIGN_SYSTEM.colors.button.hover,
            color: DESIGN_SYSTEM.colors.background.default,
            transform: 'translateY(-2px)',
            boxShadow: DESIGN_SYSTEM.shadows.medium,
          },
        }),
        ...(variant === 'outlined' && {
          borderColor: DESIGN_SYSTEM.colors.text.secondary,
          color: DESIGN_SYSTEM.colors.text.secondary,
          '&:hover': {
            borderColor: DESIGN_SYSTEM.colors.text.link,
            color: DESIGN_SYSTEM.colors.text.link,
          },
        }),
        ...(variant === 'text' && {
          color: DESIGN_SYSTEM.colors.text.secondary,
          '&:hover': {
            color: DESIGN_SYSTEM.colors.text.link,
          },
        }),
      }),
      
      // Get consistent typography styles
      getTypographyStyles: (variant: 'title' | 'subtitle' | 'body' | 'small') => ({
        fontFamily: DESIGN_SYSTEM.typography.fontFamily,
        fontSize: DESIGN_SYSTEM.typography.fontSizes[variant],
        fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
        color: DESIGN_SYSTEM.colors.text.primary,
      }),
      
      // Get consistent card styles
      getCardStyles: () => ({
        backgroundColor: DESIGN_SYSTEM.colors.background.card,
        borderRadius: DESIGN_SYSTEM.borderRadius.medium,
        boxShadow: DESIGN_SYSTEM.shadows.light,
        padding: DESIGN_SYSTEM.spacing.xl,
      }),
      
      // Get navigation styles
      getNavigationStyles: () => ({
        backgroundColor: theme.customColors?.navigation.background || DESIGN_SYSTEM.colors.navigation.background,
        color: theme.customColors?.navigation.text || DESIGN_SYSTEM.colors.navigation.text,
      }),
      
      // Get consistent spacing
      getSpacing: (multiplier: number = 1) => `${parseInt(DESIGN_SYSTEM.spacing.md) * multiplier}px`,
    },
  };
};
