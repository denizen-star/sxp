import React from 'react';
import {
  Tabs as MuiTabs,
  Tab as MuiTab,
  Box,
  Typography,
  Paper
} from '@mui/material';
import { useDesignSystem } from './hooks';

export interface TabItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
  content?: React.ReactNode;
}

export interface TabSystemProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  indicatorColor?: 'primary' | 'secondary';
  textColor?: 'primary' | 'secondary' | 'inherit';
  centered?: boolean;
  scrollButtons?: 'auto' | boolean;
  allowScrollButtonsMobile?: boolean;
  showContent?: boolean;
  fullWidth?: boolean;
  minHeight?: string | number;
}

export const TabSystem: React.FC<TabSystemProps> = ({
  tabs,
  value,
  onChange,
  orientation = 'horizontal',
  variant = 'standard',
  size = 'medium',
  color = 'primary',
  indicatorColor = 'primary',
  textColor = 'inherit',
  centered = false,
  scrollButtons = 'auto',
  allowScrollButtonsMobile = false,
  showContent = true,
  fullWidth = false,
  minHeight = 200
}) => {
  const { colors, typography, helpers } = useDesignSystem();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: typography.fontSizes.small,
          minHeight: 40,
          padding: helpers.spacing.xs,
        };
      case 'large':
        return {
          fontSize: typography.fontSizes.body,
          minHeight: 60,
          padding: helpers.spacing.md,
        };
      case 'medium':
      default:
        return {
          fontSize: typography.fontSizes.small,
          minHeight: 48,
          padding: helpers.spacing.sm,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    onChange(newValue);
  };

  const currentTab = tabs.find(tab => tab.value === value);

  const tabStyles = {
    fontSize: sizeStyles.fontSize,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.normal,
    textTransform: 'none',
    minHeight: sizeStyles.minHeight,
    padding: sizeStyles.padding,
    color: colors.text.secondary,
    '&.Mui-selected': {
      color: colors.text.link,
      fontWeight: typography.fontWeights.semibold,
    },
    '&:hover': {
      color: colors.text.primary,
    },
    '&.Mui-disabled': {
      color: colors.text.disabled,
    },
  };

  const tabsStyles = {
    '& .MuiTabs-indicator': {
      backgroundColor: colors.text.link,
      height: 2,
    },
    '& .MuiTabs-scrollButtons': {
      color: colors.text.secondary,
      '&.Mui-disabled': {
        color: colors.text.disabled,
      },
    },
  };

  const contentStyles = {
    minHeight: showContent ? minHeight : 'auto',
    padding: showContent ? helpers.spacing.lg : 0,
    backgroundColor: colors.background.section,
    borderRadius: helpers.borderRadius.medium,
  };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <MuiTabs
        value={value}
        onChange={handleChange}
        orientation={orientation}
        variant={variant}
        color={color}
        indicatorColor={indicatorColor}
        textColor={textColor}
        centered={centered}
        scrollButtons={scrollButtons}
        allowScrollButtonsMobile={allowScrollButtonsMobile}
        sx={tabsStyles}
      >
        {tabs.map((tab) => (
          <MuiTab
            key={tab.value}
            value={tab.value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {tab.icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{tab.icon}</Box>}
                <Typography sx={{ fontSize: sizeStyles.fontSize }}>
                  {tab.label}
                </Typography>
                {tab.badge && (
                  <Box
                    sx={{
                      backgroundColor: colors.text.link,
                      color: colors.background.default,
                      borderRadius: '50%',
                      minWidth: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: typography.fontSizes.small,
                      fontWeight: typography.fontWeights.semibold,
                      ml: 0.5,
                    }}
                  >
                    {tab.badge}
                  </Box>
                )}
              </Box>
            }
            disabled={tab.disabled}
            sx={tabStyles}
          />
        ))}
      </MuiTabs>

      {showContent && currentTab?.content && (
        <Paper sx={contentStyles}>
          {currentTab.content}
        </Paper>
      )}
    </Box>
  );
};

export default TabSystem;
