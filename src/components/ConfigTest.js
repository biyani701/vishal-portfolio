import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider, Button } from '@mui/material';
import ClickTestButton from './ClickTestButton';

const ConfigTest = () => {
  const [config, setConfig] = useState({});

  const loadConfig = () => {
    // Get the runtime config from the window object
    const runtimeConfig = window.runtimeConfig || {};
    setConfig(runtimeConfig);

    console.log('[ConfigTest] Runtime config:', runtimeConfig);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const reloadConfig = () => {
    // Create a script element to load the reload-config.js file
    const script = document.createElement('script');
    script.src = '/reload-config.js?t=' + new Date().getTime();
    script.onload = () => {
      // Wait a bit for the config to be reloaded
      setTimeout(() => {
        loadConfig();
      }, 500);
    };
    document.head.appendChild(script);
  };

  return (
    <Box sx={{ mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Runtime Configuration Test
      </Typography>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Current Configuration
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={reloadConfig}
          >
            Reload Configuration
          </Button>
        </Box>

        <pre style={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(config, null, 2)}
        </pre>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          This component displays the current runtime configuration loaded from runtime-config.json.
          The ANALYTICS_API_URL should be set to http://localhost:7000/api for local development.
        </Typography>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom>
        Click Tracking Test
      </Typography>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1" gutterBottom>
          Click the button below to test the click tracking functionality directly.
        </Typography>

        <ClickTestButton />
      </Paper>
    </Box>
  );
};

export default ConfigTest;
