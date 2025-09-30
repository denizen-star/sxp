import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useDesignSystem } from './hooks';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} showDetails={this.props.showDetails} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
  showDetails?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onRetry, showDetails = false }) => {
  const { colors, typography, helpers } = useDesignSystem();

  return (
    <Paper
      sx={{
        ...helpers.getCardStyles(),
        backgroundColor: colors.background.card,
        p: 4,
        textAlign: 'center',
        maxWidth: 600,
        margin: '2rem auto',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontSize: typography.fontSizes.title,
          fontWeight: typography.fontWeights.semibold,
          color: colors.status.error,
          mb: 2,
        }}
      >
        Something went wrong
      </Typography>

      <Typography
        sx={{
          fontSize: typography.fontSizes.body,
          color: colors.text.secondary,
          mb: 3,
          lineHeight: 1.5,
        }}
      >
        We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          onClick={onRetry}
          sx={helpers.getButtonStyles('contained')}
        >
          Try Again
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={helpers.getButtonStyles('outlined')}
        >
          Refresh Page
        </Button>
      </Box>

      {showDetails && error && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: colors.background.light,
            borderRadius: helpers.borderRadius.small,
            textAlign: 'left',
          }}
        >
          <Typography
            sx={{
              fontSize: typography.fontSizes.small,
              fontWeight: typography.fontWeights.semibold,
              color: colors.text.primary,
              mb: 1,
            }}
          >
            Error Details:
          </Typography>
          <Typography
            sx={{
              fontSize: typography.fontSizes.small,
              color: colors.text.secondary,
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {error.message}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Hook-based error boundary for functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Higher-order component for error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundaryClass {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundaryClass>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export const ErrorBoundary = ErrorBoundaryClass;
export default ErrorBoundary;
