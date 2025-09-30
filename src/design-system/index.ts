// Design System Export Hub
export { optimizerTheme, DESIGN_SYSTEM, DESIGN_GUIDELINES } from './theme';
export { useDesignSystem } from './hooks';
export { DesignSystemProvider } from './provider';
export { default as DropdownMenu } from './DropdownMenu';
export { default as ModernDropdownMenu } from './ModernDropdownMenu';

// Form Components
export { FormField } from './FormField';
export { FormLayout } from './FormLayout';
export { FormGroup } from './FormGroup';

// Layout Components
export { Container } from './Container';
export { Section } from './Section';
export { Spacer } from './Spacer';

// Feedback Components
export { Alert, Notification } from './Alert';
export { LoadingStates } from './LoadingStates';
export { EmptyStates, NoDataEmptyState, ErrorEmptyState, SearchEmptyState } from './EmptyStates';
export { ErrorBoundary, withErrorBoundary, useErrorHandler } from './ErrorBoundary';

// Navigation Components
export { Breadcrumb } from './Breadcrumb';
export { Pagination } from './Pagination';
export { TabSystem } from './TabSystem';
export { Sidebar } from './Sidebar';

// Data Display Components
export { Table } from './Table';
export { List } from './List';

// Design System Documentation
export const DESIGN_SYSTEM_VERSION = '1.0.0';
export const LAST_UPDATED = 'December 19, 2024';

// Quick Reference for Developers
export const QUICK_REFERENCE = {
  // Font Sizes
  fontSizes: {
    title: '15px',      // Main page titles
    subtitle: '13px',   // Section headers
    body: '12px',       // Regular content
    small: '10px',      // Buttons, labels, small text
  },
  
  // Colors - Navigation Guide Color Scheme
  colors: {
    // Primary colors
    primaryText: '#212529',
    secondaryText: '#6C757D',
    linkColor: '#007BFF',
    
    // Button colors
    buttonBackground: '#93C5FD',
    buttonText: '#6C757D',
    buttonHover: '#1F2937',
    
    // Background colors
    mainBackground: '#FFFFFF',
    cardBackground: '#F8F9FA',
    sectionBackground: '#FFFFFF',
    
    // Navigation colors (preserved from current app)
    navigationBackground: '#2c3e50',
    navigationText: '#FFFFFF',
    
    // Accent colors
    teal: '#14B8A6',
    statusFunctional: '#D1ECF1',
    statusPartial: '#F8D7DA',
  },
  
  // Rules
  rules: {
    noIconsInTitles: 'Never add icons to titles unless specifically requested',
    noAllCaps: 'Never use ALL CAPS text',
    consistentButtons: 'All buttons use 10px font, #6C757D color, #93C5FD background, 5px 12px padding',
    cleanTypography: 'Use Plus Jakarta Sans throughout the application',
  },
};

// Usage Examples
export const USAGE_EXAMPLES = {
  // Correct Button Usage
  button: `
    <Button
      variant="contained"
      sx={{ 
        fontSize: '10px',
        color: '#6C757D',
        backgroundColor: '#93C5FD',
        padding: '5px 12px',
        borderRadius: '15px',
        '&:hover': {
          backgroundColor: '#1F2937',
          color: '#FFFFFF'
        }
      }}
    >
      Button Text (no icon unless requested)
    </Button>
  `,
  
  // Correct Typography Usage
  typography: `
    <Typography variant="h1" sx={{ fontSize: '15px' }}>
      Page Title (no icon, no emoji)
    </Typography>
    <Typography variant="h2" sx={{ fontSize: '13px' }}>
      Section Header
    </Typography>
    <Typography variant="body1" sx={{ fontSize: '12px' }}>
      Regular content text
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '10px' }}>
      Small text, labels, descriptions
    </Typography>
  `,
};
