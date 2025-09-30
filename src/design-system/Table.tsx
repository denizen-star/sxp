import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  Checkbox,
  IconButton,
  Chip
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { useDesignSystem } from './hooks';

export interface TableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  minWidth?: string | number;
  render?: (value: any, row: any) => React.ReactNode;
  getValue?: (row: any) => any;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedRows: string[]) => void;
  getRowId?: (row: any) => string;
  size?: 'small' | 'medium';
  variant?: 'default' | 'striped' | 'bordered';
  stickyHeader?: boolean;
  maxHeight?: string | number;
  loading?: boolean;
  emptyMessage?: string;
  showHeader?: boolean;
  dense?: boolean;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  sortBy,
  sortDirection = 'asc',
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId = (row) => row.id || row.key,
  size = 'medium',
  variant = 'default',
  stickyHeader = false,
  maxHeight,
  loading = false,
  emptyMessage = 'No data available',
  showHeader = true,
  dense = false
}) => {
  const { colors, typography, helpers } = useDesignSystem();

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: typography.fontSizes.small,
          padding: helpers.spacing.xs,
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

  const handleSort = (columnId: string) => {
    if (onSort) {
      const newDirection = sortBy === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(columnId, newDirection);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectionChange) {
      if (event.target.checked) {
        onSelectionChange(data.map(getRowId));
      } else {
        onSelectionChange([]);
      }
    }
  };

  const handleSelectRow = (rowId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectionChange) {
      if (event.target.checked) {
        onSelectionChange([...selectedRows, rowId]);
      } else {
        onSelectionChange(selectedRows.filter(id => id !== rowId));
      }
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;


  const tableStyles = {
    '& .MuiTableHead-root': {
      backgroundColor: colors.background.card,
    },
    '& .MuiTableCell-root': {
      fontSize: sizeStyles.fontSize,
      fontFamily: typography.fontFamily,
      padding: dense ? helpers.spacing.xs : sizeStyles.padding,
      borderBottom: `1px solid ${colors.background.light}`,
    },
    '& .MuiTableHead-root .MuiTableCell-root': {
      fontWeight: typography.fontWeights.semibold,
      color: colors.text.primary,
      backgroundColor: colors.background.card,
    },
    '& .MuiTableBody-root .MuiTableCell-root': {
      color: colors.text.primary,
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: colors.background.light,
    },
    ...(variant === 'striped' && {
      '& .MuiTableRow-root:nth-of-type(odd)': {
        backgroundColor: colors.background.light,
      },
    }),
    ...(variant === 'bordered' && {
      '& .MuiTableCell-root': {
        border: `1px solid ${colors.background.light}`,
      },
    }),
  };

  const containerStyles = {
    maxHeight: maxHeight || 'none',
    overflow: maxHeight ? 'auto' : 'visible',
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: colors.text.secondary }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: colors.text.secondary }}>
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={containerStyles}>
      <MuiTable stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'} sx={tableStyles}>
        {showHeader && (
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                      sx={{
                        fontSize: sizeStyles.fontSize,
                        fontWeight: typography.fontWeights.semibold,
                        color: colors.text.primary,
                        '&:hover': {
                          color: colors.text.link,
                        },
                        '&.Mui-active': {
                          color: colors.text.link,
                        },
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: sizeStyles.fontSize,
                        fontWeight: typography.fontWeights.semibold,
                        color: colors.text.primary,
                      }}
                    >
                      {column.label}
                    </Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {data.map((row, index) => {
            const rowId = getRowId(row);
            const isSelected = selectedRows.includes(rowId);
            
            return (
              <TableRow key={rowId} selected={isSelected}>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => handleSelectRow(rowId, event)}
                      color="primary"
                    />
                  </TableCell>
                )}
                {columns.map((column) => {
                  const value = column.getValue ? column.getValue(row) : row[column.id];
                  
                  return (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      sx={{
                        fontSize: sizeStyles.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      {column.render ? column.render(value, row) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
