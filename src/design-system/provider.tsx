import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { optimizerTheme } from './theme';

interface DesignSystemProviderProps {
  children: React.ReactNode;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={optimizerTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
