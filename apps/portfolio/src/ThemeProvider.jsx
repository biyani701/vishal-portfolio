// ThemeProvider.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme } from './theme';
import { CssBaseline } from '@mui/material';

export default function ThemeProvider({ children, mode, paletteIndex  }) {
  const theme = getTheme(mode, paletteIndex);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('themePaletteIndex', paletteIndex);
  }, [mode, paletteIndex]);

  // Provide theme context to children
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

ThemeProvider.propTypes  = {
  children: PropTypes.node,
  mode: PropTypes.string.isRequired,
  paletteIndex: PropTypes.number.isRequired,
};