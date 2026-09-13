import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Paper,
  useTheme
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';

const Recognition = () => {
  const theme = useTheme();
  
  const awards = [
    {
      title: 'Manager of the Quarter',
      period: 'Q3 2021',
      icon: <EmojiEventsIcon color="primary" />
    },
    {
      title: 'Project of the Year',
      period: '2013',
      icon: <WorkspacePremiumIcon color="primary" />
    },
    {
      title: 'Guiding Star',
      period: 'Q4 2009',
      icon: <StarIcon color="primary" />
    }
  ];

  return (
    <Box 
      id="recognition" 
      component="section"
      sx={{ 
        py: 5,
        backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#f8f9fa'
      }}
    >
      <Container maxWidth="md">
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4,
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark',
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Awards & Recognition
        </Typography>
        
        <Paper 
          elevation={2}
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : '#fff'
          }}
        >
          <List sx={{ p: 0 }}>
            {awards.map((award, index) => (
              <ListItem 
                key={index}
                divider={index !== awards.length - 1}
                sx={{
                  py: 2,
                  px: 3,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                  {award.icon}
                </Box>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="span" sx={{ fontWeight: 'medium' }}>
                      {award.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {award.period}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default Recognition;