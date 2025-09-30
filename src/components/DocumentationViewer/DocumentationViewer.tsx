/**
 * Documentation Viewer Component
 * Displays documentation content with proper formatting
 */

import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip
} from '@mui/material';
import { ArrowBack, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDesignSystem } from '../../design-system';

interface DocumentationViewerProps {
  title: string;
  content: string;
  category: string;
  lastUpdated?: string;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  title,
  content,
  category,
  lastUpdated
}) => {
  const { colors, helpers } = useDesignSystem();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/services-available');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            sx={{ ...helpers.getButtonStyles() }}
          >
            Back to Services
          </Button>
          <Button
            variant="text"
            startIcon={<Home />}
            onClick={handleHomeClick}
            sx={{ color: colors.text.secondary }}
          >
            Home
          </Button>
        </Box>
        <Chip
          label={category}
          sx={{
            backgroundColor: colors.accent.teal,
            color: 'white',
            fontWeight: 500
          }}
        />
      </Box>

      {/* Title */}
      <Typography variant="h4" sx={{ color: colors.text.primary, fontWeight: 600, mb: 2 }}>
        {title}
      </Typography>

      {lastUpdated && (
        <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 3 }}>
          Last updated: {lastUpdated}
        </Typography>
      )}

      {/* Content */}
      <Card sx={{ ...helpers.getCardStyles() }}>
        <CardContent>
          <Box sx={{ 
            '& h1': { fontSize: '24px', fontWeight: 600, color: colors.text.primary, mb: 2 },
            '& h2': { fontSize: '20px', fontWeight: 600, color: colors.text.primary, mb: 1.5, mt: 3 },
            '& h3': { fontSize: '18px', fontWeight: 600, color: colors.text.primary, mb: 1, mt: 2 },
            '& p': { color: colors.text.secondary, mb: 1.5, lineHeight: 1.6 },
            '& ul': { color: colors.text.secondary, mb: 1.5 },
            '& ol': { color: colors.text.secondary, mb: 1.5 },
            '& li': { mb: 0.5 },
            '& code': { 
              backgroundColor: colors.background.light, 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px'
            },
            '& pre': { 
              backgroundColor: colors.background.light, 
              padding: '12px', 
              borderRadius: '8px',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '12px'
            },
            '& blockquote': {
              borderLeft: `4px solid ${colors.accent.blue}`,
              paddingLeft: '16px',
              margin: '16px 0',
              fontStyle: 'italic',
              color: colors.text.secondary
            }
          }}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DocumentationViewer;
