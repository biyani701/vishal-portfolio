import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  useTheme
} from '@mui/material';

const Recognition = () => {
  const theme = useTheme();
  
  const awards = [
    {
      title: 'Manager of the Quarter',
      period: 'Q3 2021'
    },
    {
      title: 'Project of the Year',
      period: '2013'
    },
    {
      title: 'Guiding Star',
      period: 'Q4 2009'
    }
  ];

  return (
    <Box 
      id="recognition" 
      component="section"
      sx={{ 
        py: 5,
        backgroundColor: theme.palette.mode === 'dark' ? 'background.default' : '#fafafa'
      }}
    >
      <Container maxWidth="md">
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 4,
            fontWeight: 500,
            color: theme.palette.primary.main
          }}
        >
          Awards & Recognition
        </Typography>
        
        <List sx={{ 
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
          borderRadius: 1,
          boxShadow: 1
        }}>
          {awards.map((award, index) => (
            <ListItem key={index} divider={index !== awards.length - 1}>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {award.title}
                  </Typography>
                }
                secondary={award.period}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default Recognition;