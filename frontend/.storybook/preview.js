import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../src/theme/theme';

const withThemeProvider = (Story, context) => {
  const themeMode = context.globals.themeMode || 'light';
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  );
};

export const decorators = [withThemeProvider];

export const globalTypes = {
  themeMode: {
    name: 'Theme',
    description: 'Global theme mode',
    defaultValue: 'light',
    toolbar: {
      icon: 'lightning',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      showName: true,
    },
  },
};
