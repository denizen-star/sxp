import React from 'react';
import { Box, Typography, Divider, FormControlLabel, Checkbox, Radio, RadioGroup } from '@mui/material';
import { useDesignSystem } from './hooks';

export interface FormGroupProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  type?: 'fieldset' | 'checkbox' | 'radio';
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  orientation?: 'horizontal' | 'vertical';
  spacing?: number;
  showDivider?: boolean;
  required?: boolean;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  title,
  subtitle,
  children,
  type = 'fieldset',
  options = [],
  value,
  onChange,
  orientation = 'vertical',
  spacing = 2,
  showDivider = false,
  required = false
}) => {
  const { colors, typography } = useDesignSystem();

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;
    
    const currentValues = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValues, optionValue]);
    } else {
      onChange(currentValues.filter(v => v !== optionValue));
    }
  };

  const handleRadioChange = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  return (
    <Box sx={{ mb: spacing }}>
      {(title || subtitle) && (
        <Box sx={{ mb: 2 }}>
          {title && (
            <Typography
              variant="h6"
              sx={{
                fontSize: typography.fontSizes.subtitle,
                fontWeight: typography.fontWeights.semibold,
                color: colors.text.primary,
                mb: subtitle ? 1 : 0,
              }}
            >
              {title}
              {required && (
                <Typography component="span" sx={{ color: colors.status.error, ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                fontSize: typography.fontSizes.body,
                color: colors.text.secondary,
              }}
            >
              {subtitle}
            </Typography>
          )}
          {showDivider && <Divider sx={{ mt: 2 }} />}
        </Box>
      )}

      {type === 'checkbox' && (
        <Box sx={{ display: 'flex', flexDirection: orientation === 'horizontal' ? 'row' : 'column', gap: 1 }}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  disabled={option.disabled}
                  sx={{
                    '&.Mui-checked': {
                      color: colors.text.link,
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: typography.fontSizes.small,
                    color: option.disabled ? colors.text.disabled : colors.text.primary,
                  }}
                >
                  {option.label}
                </Typography>
              }
            />
          ))}
        </Box>
      )}

      {type === 'radio' && (
        <RadioGroup
          value={value}
          onChange={(e) => handleRadioChange(e.target.value)}
          sx={{ display: 'flex', flexDirection: orientation === 'horizontal' ? 'row' : 'column', gap: 1 }}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  disabled={option.disabled}
                  sx={{
                    '&.Mui-checked': {
                      color: colors.text.link,
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontSize: typography.fontSizes.small,
                    color: option.disabled ? colors.text.disabled : colors.text.primary,
                  }}
                >
                  {option.label}
                </Typography>
              }
            />
          ))}
        </RadioGroup>
      )}

      {type === 'fieldset' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default FormGroup;
