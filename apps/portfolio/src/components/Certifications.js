import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme,
  Avatar
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';

const Certifications = () => {
  const theme = useTheme();
  
  const certifications = [
    {
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: 'Sep 2020',
      logo: 'AWS' // This could be replaced with an actual image path
    }
    // You can easily add more certifications here as needed
  ];

  return (
    <Box
      id="certifications"
      component="section"
      sx={{
        py: 5,
        backgroundColor: theme.palette.mode === 'dark' ? 'background.default' : '#f5f7fa'
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 4,
            fontWeight: 500,
            color: theme.palette.primary.main,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Certifications
        </Typography>

        <Grid container spacing={3}>
          {certifications.map((cert, index) => (
            <Grid item xs={12} key={index}>
              <Card 
                elevation={2}
                sx={{
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar
                        sx={{
                          bgcolor: '#FF9900', // AWS orange color
                          width: 56,
                          height: 56
                        }}
                      >
                        {cert.logo}
                      </Avatar>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {cert.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {cert.issuer}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Chip
                          icon={<VerifiedIcon />}
                          label={cert.date}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Certifications;