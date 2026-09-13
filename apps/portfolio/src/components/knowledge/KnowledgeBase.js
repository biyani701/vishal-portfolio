import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  Paper,
  Icon
} from '@mui/material';
import domainKnowledgeData from '../../data/domainKnowledgeData';
import glossaryData from '../../data/glossaryData';

// Knowledge Base landing page component
const KnowledgeBase = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: 6,
        minHeight: 'calc(100vh - 64px)',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ 
            fontWeight: 600,
            mb: 4,
            color: 'primary.main',
            textAlign: 'center'
          }}
          data-aos="fade-down"
        >
          Knowledge Base
        </Typography>
        
        <Typography
          variant="h6"
          component="p"
          gutterBottom
          sx={{ 
            mb: 6,
            color: 'text.secondary',
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto'
          }}
          data-aos="fade-up"
        >
          Explore our comprehensive knowledge resources, including a glossary of industry terms and detailed domain knowledge across various financial and technical areas.
        </Typography>
        
        <Grid container spacing={4}>
          {/* Glossary Card */}
          <Grid item xs={12} md={6} data-aos="fade-right">
            <Card 
              elevation={4}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                },
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Icon sx={{ fontSize: 32, mr: 1 }}>menu_book</Icon>
                <Typography variant="h4" component="h2">
                  Glossary
                </Typography>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="body1" paragraph>
                  A comprehensive collection of {glossaryData.length} industry terms, acronyms, and definitions to help you understand the specialized language used in finance and technology.
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1, 
                  my: 2 
                }}>
                  {['A', 'B', 'K', 'P'].map(letter => (
                    <Paper 
                      key={letter}
                      elevation={2}
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'primary.main'
                      }}
                    >
                      {letter}
                    </Paper>
                  ))}
                  <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                    ...and more
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Each entry includes the full form, detailed explanation, and category classification.
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={RouterLink} 
                  to="/knowledge/glossary"
                  size="large"
                  fullWidth
                >
                  Explore Glossary
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Domain Knowledge Card */}
          <Grid item xs={12} md={6} data-aos="fade-left">
            <Card 
              elevation={4}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                },
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Icon sx={{ fontSize: 32, mr: 1 }}>psychology</Icon>
                <Typography variant="h4" component="h2">
                  Domain Knowledge
                </Typography>
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="body1" paragraph>
                  Detailed information about various domains in finance and technology, organized by categories for easy navigation and learning.
                </Typography>
                
                <Grid container spacing={2} sx={{ my: 2 }}>
                  {domainKnowledgeData.categories.map((category) => (
                    <Grid item xs={12} sm={6} key={category.id}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Icon color="secondary">{category.icon}</Icon>
                        <Typography variant="body2" fontWeight="medium">
                          {category.name}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                
                <Typography variant="body2" color="text.secondary">
                  Each domain includes multiple topics with detailed explanations and key concepts.
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  component={RouterLink} 
                  to={`/knowledge/domain/${domainKnowledgeData.categories[0]?.id || ''}`}
                  size="large"
                  fullWidth
                >
                  Explore Domain Knowledge
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default KnowledgeBase;
