import React from 'react';
import { Box, Tooltip, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../context/AuthProvider';

/**
 * AuthStatusIndicator component that displays a lock/unlock icon based on authentication status
 * @param {Object} props - Component props
 * @param {string} props.tooltipText - Custom tooltip text (optional)
 * @param {Object} props.sx - Additional styles for the container
 * @returns {React.ReactNode} - The auth status indicator component
 */
const AuthStatusIndicator = ({ tooltipText, sx = {} }) => {
  const { isAuthenticated } = useAuthContext();
  const theme = useTheme();

  const icon = isAuthenticated ? faUnlock : faLock;
  const defaultTooltipText = isAuthenticated
    ? 'You have access to this content'
    : 'Sign in to access this content';

  return (
    <Tooltip title={tooltipText || defaultTooltipText}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          width: 32,
          height: 32,
          backgroundColor: isAuthenticated
            ? alpha(theme.palette.success.main, 0.1)
            : alpha(theme.palette.warning.main, 0.1),
          color: isAuthenticated
            ? theme.palette.success.main
            : theme.palette.warning.main,
          ...sx
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </Box>
    </Tooltip>
  );
};

// Helper function to add alpha channel to colors
function alpha(color, value) {
  return color + Math.round(value * 255).toString(16).padStart(2, '0');
}

export default AuthStatusIndicator;
