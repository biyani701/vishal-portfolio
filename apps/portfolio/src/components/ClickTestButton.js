import React, { useState } from 'react';
import { Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { trackClick } from '../utils/analytics';

const ClickTestButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing click tracking...');
      const result = await trackClick(
        'test-button-direct',
        'test-button',
        window.location.pathname
      );

      console.log('Click tracking result:', result);

      // The trackClick function now returns a promise that resolves to either
      // a success object or an error object, not a Response object
      if (result && (result.success || result.trackingId)) {
        setResult(result);
      } else if (result && result.error) {
        setError(`Error: ${result.error}`);
      } else {
        setError('Unknown response format');
      }
    } catch (err) {
      console.error('Error in click test:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Test Click Tracking Directly'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Success! {result.trackingId ? `Tracking ID: ${result.trackingId}` :
                   result.success ? 'Click tracked successfully' :
                   JSON.stringify(result)}
        </Alert>
      )}

      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        This button tests the click tracking functionality directly by calling the trackClick function.
        Check the browser console for detailed logs.
      </Typography>
    </Box>
  );
};

export default ClickTestButton;
