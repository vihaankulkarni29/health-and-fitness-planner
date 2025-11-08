/**
 * Input Component - Notion-Inspired
 * 
 * Clean input field with focus ring and consistent styling.
 */

import React from 'react';
import { TextField } from '@mui/material';
import { colors, radii, focusRing, typography } from '../../theme/tokens';

const Input = ({ 
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error = false,
  helperText,
  fullWidth = true,
  disabled = false,
  multiline = false,
  rows = 1,
  sx = {},
  ...props 
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: `${radii.md}px`,
          fontSize: typography.fontSize.base,
          backgroundColor: colors.pureWhite,
          height: multiline ? 'auto' : '40px',
          '& fieldset': {
            borderColor: colors.dividerGray,
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: colors.dividerGray,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.deepOrange,
            borderWidth: '1px',
          },
          '&.Mui-focused': {
            boxShadow: focusRing.style,
          },
        },
        '& .MuiInputBase-input': {
          padding: '10px 12px',
          fontSize: typography.fontSize.base,
          color: colors.charcoal,
          '&::placeholder': {
            color: colors.mediumGray,
            opacity: 1,
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: typography.fontSize.sm,
          color: colors.slateGray,
          '&.Mui-focused': {
            color: colors.deepOrange,
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default Input;
