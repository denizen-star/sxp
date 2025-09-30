import React from 'react';
import {
  Pagination as MuiPagination,
  PaginationItem,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft as PrevIcon,
  KeyboardArrowRight as NextIcon
} from '@mui/icons-material';
import { useDesignSystem } from './hooks';

export interface PaginationProps {
  page: number;
  count: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  showFirstLast?: boolean;
  showPageSize?: boolean;
  showInfo?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'standard';
  shape?: 'rounded' | 'circular';
  disabled?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  hidePrevButton?: boolean;
  hideNextButton?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  count,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  showFirstLast = true,
  showPageSize = true,
  showInfo = true,
  onPageChange,
  onPageSizeChange,
  size = 'medium',
  variant = 'outlined',
  color = 'primary',
  shape = 'rounded',
  disabled = false,
  siblingCount = 1,
  boundaryCount = 1,
  hidePrevButton = false,
  hideNextButton = false
}) => {
  const { colors, typography, helpers } = useDesignSystem();

  const totalPages = Math.ceil(count / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, count);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: typography.fontSizes.small,
          padding: helpers.spacing.xs,
        };
      case 'large':
        return {
          fontSize: typography.fontSizes.body,
          padding: helpers.spacing.md,
        };
      case 'medium':
      default:
        return {
          fontSize: typography.fontSizes.small,
          padding: helpers.spacing.sm,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const handlePageSizeChange = (event: any) => {
    if (onPageSizeChange) {
      onPageSizeChange(event.target.value);
    }
  };

  const paginationStyles = {
    '& .MuiPaginationItem-root': {
      fontSize: sizeStyles.fontSize,
      fontFamily: typography.fontFamily,
      color: colors.text.primary,
      '&.Mui-selected': {
        backgroundColor: colors.text.link,
        color: colors.background.default,
        '&:hover': {
          backgroundColor: colors.text.primary,
        },
      },
      '&:hover': {
        backgroundColor: colors.background.light,
      },
    },
    '& .MuiPaginationItem-ellipsis': {
      color: colors.text.secondary,
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <MuiPagination
        page={page}
        count={totalPages}
        onChange={handlePageChange}
        size={size}
        variant={variant}
        color={color}
        shape={shape}
        disabled={disabled}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        hidePrevButton={hidePrevButton}
        hideNextButton={hideNextButton}
        showFirstButton={showFirstLast}
        showLastButton={showFirstLast}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            slots={{
              previous: PrevIcon,
              next: NextIcon,
              first: FirstPageIcon,
              last: LastPageIcon,
            }}
          />
        )}
        sx={paginationStyles}
      />

      {(showPageSize || showInfo) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          {showPageSize && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel
                sx={{
                  fontSize: sizeStyles.fontSize,
                  color: colors.text.secondary,
                }}
              >
                Items per page
              </InputLabel>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                label="Items per page"
                sx={{
                  fontSize: sizeStyles.fontSize,
                  '& .MuiSelect-select': {
                    fontSize: sizeStyles.fontSize,
                  },
                }}
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {showInfo && (
            <Typography
              sx={{
                fontSize: sizeStyles.fontSize,
                color: colors.text.secondary,
                whiteSpace: 'nowrap',
              }}
            >
              {startItem}-{endItem} of {count} items
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Pagination;
