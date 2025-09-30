import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  Typography,
  TextFieldProps,
  SelectProps,
  FormControlProps
} from '@mui/material';
import { useDesignSystem } from './hooks';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  variant?: 'outlined' | 'filled' | 'standard';
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder,
  options = [],
  multiline = false,
  rows = 3,
  fullWidth = true,
  size = 'small',
  variant = 'outlined'
}) => {
  const { colors, typography, helpers } = useDesignSystem();

  const handleChange = (event: any) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const commonProps = {
    name,
    value,
    onChange: handleChange,
    error: !!error,
    disabled,
    required,
    fullWidth,
    size,
    variant,
    placeholder,
    sx: {
      '& .MuiOutlinedInput-root': {
        fontSize: typography.fontSizes.small,
        fontFamily: typography.fontFamily,
        '& fieldset': {
          borderColor: error ? colors.status.error : colors.text.secondary,
        },
        '&:hover fieldset': {
          borderColor: error ? colors.status.error : colors.text.link,
        },
        '&.Mui-focused fieldset': {
          borderColor: error ? colors.status.error : colors.text.link,
        },
      },
      '& .MuiInputLabel-root': {
        fontSize: typography.fontSizes.small,
        color: colors.text.secondary,
        '&.Mui-focused': {
          color: colors.text.link,
        },
      },
      '& .MuiFormHelperText-root': {
        fontSize: typography.fontSizes.small,
        color: error ? colors.status.error : colors.text.secondary,
      },
    },
  };

  if (type === 'select') {
    return (
      <FormControl
        fullWidth={fullWidth}
        size={size}
        variant={variant}
        error={!!error}
        disabled={disabled}
        required={required}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: typography.fontSizes.small,
            fontFamily: typography.fontFamily,
          },
          '& .MuiInputLabel-root': {
            fontSize: typography.fontSizes.small,
            color: colors.text.secondary,
            '&.Mui-focused': {
              color: colors.text.link,
            },
          },
        }}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          onChange={handleChange}
          label={label}
          name={name}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {(error || helperText) && (
          <FormHelperText>{error || helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }

  if (type === 'textarea' || multiline) {
    return (
      <TextField
        {...commonProps}
        label={label}
        multiline
        rows={rows}
        helperText={error || helperText}
      />
    );
  }

  return (
    <TextField
      {...commonProps}
      label={label}
      type={type}
      helperText={error || helperText}
    />
  );
};

export default FormField;
