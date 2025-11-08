/**
 * Table Component - Notion-Inspired
 * 
 * Clean table with subtle header styling, hover states, and empty state support.
 * Designed for data-dense views with excellent readability.
 */

import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography
} from '@mui/material';
import { colors, radii, typography } from '../../theme/tokens';
import EmptyState from './EmptyState';

const Table = ({
  columns = [],
  data = [],
  emptyMessage = 'No data available',
  emptyDescription = 'There are no items to display.',
  onRowClick,
  stickyHeader = false,
  dense = false,
  sx = {},
  ...props
}) => {
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <EmptyState
          message={emptyMessage}
          description={emptyDescription}
        />
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        borderRadius: `${radii.md}px`,
        border: `1px solid ${colors.dividerGray}`,
        boxShadow: 'none',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      <MuiTable stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={column.id || index}
                align={column.align || 'left'}
                sx={{
                  backgroundColor: colors.lightGray,
                  borderBottom: `1px solid ${colors.dividerGray}`,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.slateGray,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: dense ? '10px 12px' : '14px 16px',
                  whiteSpace: 'nowrap',
                  '&:first-of-type': {
                    paddingLeft: dense ? '16px' : '20px',
                  },
                  '&:last-of-type': {
                    paddingRight: dense ? '16px' : '20px',
                  },
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row.id || rowIndex}
              hover
              onClick={() => onRowClick && onRowClick(row)}
              sx={{
                cursor: onRowClick ? 'pointer' : 'default',
                '&:hover': {
                  backgroundColor: onRowClick ? colors.offWhite : 'transparent',
                },
                '&:last-child td': {
                  borderBottom: 0,
                },
              }}
            >
              {columns.map((column, colIndex) => {
                const cellValue = column.render
                  ? column.render(row)
                  : row[column.field];

                return (
                  <TableCell
                    key={column.id || colIndex}
                    align={column.align || 'left'}
                    sx={{
                      fontSize: typography.fontSize.sm,
                      color: colors.charcoal,
                      padding: dense ? '10px 12px' : '14px 16px',
                      borderBottom: `1px solid ${colors.dividerGray}`,
                      '&:first-of-type': {
                        paddingLeft: dense ? '16px' : '20px',
                      },
                      '&:last-of-type': {
                        paddingRight: dense ? '16px' : '20px',
                      },
                    }}
                  >
                    {cellValue}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
