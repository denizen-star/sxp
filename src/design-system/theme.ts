import { createTheme } from '@mui/material/styles';

// Design System Constants
export const DESIGN_SYSTEM = {
  // Typography
  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSizes: {
      title: '15px',
      subtitle: '13px',
      body: '12px',
      small: '10px',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
    },
  },
  
  // Colors - Based on Navigation Guide palette
  colors: {
    // Primary colors from navigation guide
    primary: {
      main: '#212529',
      light: '#6C757D',
      dark: '#030707',
    },
    secondary: {
      main: '#93C5FD',
      light: '#E9ECEF',
      dark: '#1F2937',
    },
    // Navigation bar colors (preserved from current app)
    navigation: {
      background: '#2c3e50', // Dark blue-gray from current nav bar
      text: '#FFFFFF',
      icon: '#FFFFFF',
    },
    // Background colors from navigation guide
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
      light: '#F4F2F1',
      card: '#F8F9FA',
      section: '#FFFFFF',
    },
    // Text colors from navigation guide
    text: {
      primary: '#212529',
      secondary: '#6C757D',
      disabled: '#8A7D70',
      link: '#007BFF',
    },
    // Status colors from navigation guide
    status: {
      functional: '#D1ECF1',
      partial: '#F8D7DA',
      error: '#F8D7DA',
      success: '#D1ECF1',
    },
    // Accent colors from navigation guide
    accent: {
      teal: '#14B8A6',
      blue: '#93C5FD',
      gray: '#6C757D',
      linkBlue: '#007BFF',
    },
    // Button colors from navigation guide
    button: {
      background: '#93C5FD',
      text: '#6C757D',
      hover: '#1F2937',
    },
  },
  
  // Spacing
  spacing: {
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '30px',
  },
  
  // Border Radius
  borderRadius: {
    small: '10px',
    medium: '15px',
    large: '25px',
  },
  
  // Shadows
  shadows: {
    light: '0 2px 10px rgba(0,0,0,0.1)',
    medium: '0 5px 15px rgba(0,0,0,0.2)',
    heavy: '0 10px 30px rgba(0,0,0,0.1)',
  },
  
  // Transitions
  transitions: {
    standard: '0.3s ease',
    fast: '0.2s ease',
  },
};

// Material-UI Theme Configuration
export const optimizerTheme = createTheme({
  palette: {
    primary: {
      main: DESIGN_SYSTEM.colors.primary.main,
      light: DESIGN_SYSTEM.colors.primary.light,
      dark: DESIGN_SYSTEM.colors.primary.dark,
    },
    secondary: {
      main: DESIGN_SYSTEM.colors.secondary.main,
      light: DESIGN_SYSTEM.colors.secondary.light,
      dark: DESIGN_SYSTEM.colors.secondary.dark,
    },
    background: {
      default: DESIGN_SYSTEM.colors.background.default,
      paper: DESIGN_SYSTEM.colors.background.paper,
    },
    text: {
      primary: DESIGN_SYSTEM.colors.text.primary,
      secondary: DESIGN_SYSTEM.colors.text.secondary,
      disabled: DESIGN_SYSTEM.colors.text.disabled,
    },
  },
  
  // Custom colors for navigation and specific elements
  customColors: {
    navigation: DESIGN_SYSTEM.colors.navigation,
    accent: DESIGN_SYSTEM.colors.accent,
    button: DESIGN_SYSTEM.colors.button,
  },
  
  typography: {
    fontFamily: DESIGN_SYSTEM.typography.fontFamily,
    h1: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.title,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.subtitle,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.body,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.body,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.body,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.body,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.body,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.small,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.subtitle,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.3,
    },
    subtitle2: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.body,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      lineHeight: 1.4,
    },
    button: {
      fontSize: DESIGN_SYSTEM.typography.fontSizes.small,
      fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
      textTransform: 'none',
    },
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: DESIGN_SYSTEM.borderRadius.medium,
          padding: `${DESIGN_SYSTEM.spacing.xs} ${DESIGN_SYSTEM.spacing.sm}`,
          fontSize: DESIGN_SYSTEM.typography.fontSizes.small,
          fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
          textTransform: 'none',
          transition: DESIGN_SYSTEM.transitions.standard,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: DESIGN_SYSTEM.shadows.medium,
          },
        },
        contained: {
          backgroundColor: DESIGN_SYSTEM.colors.button.background,
          color: DESIGN_SYSTEM.colors.button.text,
          '&:hover': {
            backgroundColor: DESIGN_SYSTEM.colors.button.hover,
            color: DESIGN_SYSTEM.colors.background.default,
          },
        },
        outlined: {
          borderColor: DESIGN_SYSTEM.colors.text.secondary,
          color: DESIGN_SYSTEM.colors.text.secondary,
          '&:hover': {
            borderColor: DESIGN_SYSTEM.colors.text.link,
            color: DESIGN_SYSTEM.colors.text.link,
          },
        },
        text: {
          color: DESIGN_SYSTEM.colors.text.secondary,
          '&:hover': {
            color: DESIGN_SYSTEM.colors.text.link,
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: DESIGN_SYSTEM.borderRadius.medium,
          boxShadow: DESIGN_SYSTEM.shadows.light,
          backgroundColor: DESIGN_SYSTEM.colors.background.card,
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: DESIGN_SYSTEM.colors.background.section,
        },
        elevation1: {
          boxShadow: DESIGN_SYSTEM.shadows.light,
        },
        elevation2: {
          boxShadow: DESIGN_SYSTEM.shadows.medium,
        },
        elevation3: {
          boxShadow: DESIGN_SYSTEM.shadows.heavy,
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: DESIGN_SYSTEM.colors.navigation.background,
          color: DESIGN_SYSTEM.colors.navigation.text,
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: DESIGN_SYSTEM.typography.fontSizes.small,
          fontWeight: DESIGN_SYSTEM.typography.fontWeights.normal,
          borderRadius: DESIGN_SYSTEM.borderRadius.medium,
        },
      },
    },
    
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: DESIGN_SYSTEM.typography.fontFamily,
        },
      },
    },
  },
});

// Design System Guidelines
export const DESIGN_GUIDELINES = {
  // Icon Usage Rules
  icons: {
    titles: 'NEVER use icons in titles or headings',
    buttons: 'ONLY use icons when specifically requested by user',
    navigation: 'Minimal icon usage, prefer text labels',
  },
  
  // Typography Rules
  typography: {
    capitalization: 'NO ALL CAPS text anywhere',
    titles: 'Clean titles without emoji or icon clutter',
    hierarchy: 'Maintain consistent font size hierarchy',
  },
  
  // Button Rules
  buttons: {
    consistency: 'All buttons use same font size (10px) and color (#6C757D)',
    padding: 'Use consistent padding (5px 12px)',
    borderRadius: 'Use consistent border radius (15px)',
  },
  
  // Color Rules
  colors: {
    primary: 'Use #212529 for primary text',
    secondary: 'Use #6C757D for secondary text and buttons',
    background: 'Use #FFFFFF for main background, #F8F9FA for cards',
  },
};

export default optimizerTheme;
