import React from 'react';
import {
  Alert as MuiAlert,
  AlertTitle,
  Snackbar,
  IconButton,
  Collapse,
  Box,
  Typography
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useDesignSystem } from './hooks';

export interface AlertProps {
  severity?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  variant?: 'filled' | 'outlined' | 'standard';
  closable?: boolean;
  autoHide?: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
  action?: React.ReactNode;
  fullWidth?: boolean;
  showIcon?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  severity = 'info',
  title,
  message,
  variant = 'outlined',
  closable = true,
  autoHide = false,
  autoHideDuration = 6000,
  onClose,
  action,
  fullWidth = true,
  showIcon = true
}) => {
  const { colors, typography, helpers } = useDesignSystem();
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return colors.status.error;
      case 'warning':
        return colors.status.partial;
      case 'success':
        return colors.status.success;
      case 'info':
      default:
        return colors.status.functional;
    }
  };

  const alertStyles = {
    width: fullWidth ? '100%' : 'auto',
    fontSize: typography.fontSizes.small,
    fontFamily: typography.fontFamily,
    borderRadius: helpers.borderRadius.medium,
    '& .MuiAlert-message': {
      fontSize: typography.fontSizes.small,
      color: colors.text.primary,
    },
    '& .MuiAlert-title': {
      fontSize: typography.fontSizes.body,
      fontWeight: typography.fontWeights.semibold,
      color: colors.text.primary,
    },
    '& .MuiAlert-icon': {
      fontSize: '18px',
    },
    '& .MuiAlert-action': {
      padding: 0,
    },
  };

  return (
    <Collapse in={open}>
      <MuiAlert
        severity={severity}
        variant={variant}
        onClose={closable ? handleClose : undefined}
        action={
          action || (closable && (
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{
                color: 'inherit',
                fontSize: '16px',
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ))
        }
        icon={showIcon}
        sx={alertStyles}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </MuiAlert>
    </Collapse>
  );
};

export interface NotificationProps {
  open: boolean;
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  duration?: number;
  onClose: () => void;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

export const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  severity = 'info',
  duration = 6000,
  onClose,
  position = { vertical: 'top', horizontal: 'right' }
}) => {
  const { colors, typography } = useDesignSystem();

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
      sx={{
        '& .MuiAlert-root': {
          fontSize: typography.fontSizes.small,
          fontFamily: typography.fontFamily,
        },
      }}
    >
      <Alert
        severity={severity}
        message={message}
        closable
        onClose={onClose}
        fullWidth={false}
      />
    </Snackbar>
  );
};

export default Alert;
