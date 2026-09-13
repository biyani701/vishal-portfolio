import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { trackClick, getClickStats } from '../utils/analytics';

const ClickTest = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch click stats
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const clickStats = await getClickStats('test-button');
      setStats(clickStats || []);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch click statistics');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Handle test button click
  const handleTestClick = async () => {
    try {
      await trackClick('test-button', 'test-button', window.location.pathname);
      // Fetch updated stats after a short delay
      setTimeout(fetchStats, 1000);
    } catch (err) {
      console.error('Error tracking click:', err);
      setError('Failed to track click');
    }
  };

  return (
    <Box sx={{ mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Click Tracker Test
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleTestClick}
        sx={{ mb: 3 }}
      >
        Test Click Tracking
      </Button>
      
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={fetchStats}
        sx={{ ml: 2, mb: 3 }}
      >
        Refresh Stats
      </Button>
      
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Click Statistics
        </Typography>
        
        {loading && <Typography>Loading stats...</Typography>}
        
        {error && (
          <Typography color="error">
            {error}
          </Typography>
        )}
        
        {!loading && !error && (
          <>
            {stats.length === 0 ? (
              <Typography>No click statistics found. Try clicking the test button!</Typography>
            ) : (
              <List>
                {stats.map((stat, index) => (
                  <ListItem key={index} divider={index < stats.length - 1}>
                    <ListItemText
                      primary={`${stat.element_id} (${stat.element_type})`}
                      secondary={`Clicks: ${stat.click_count}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ClickTest;
