import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  useTheme,
  IconButton
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import domainKnowledgeData from '../../data/domainKnowledgeData';

// Domain Knowledge component
const DomainKnowledge = () => {
  const theme = useTheme();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);

  // Find the selected category based on the URL parameter
  useEffect(() => {
    if (categoryId) {
      const category = domainKnowledgeData.categories.find(cat => cat.id === categoryId);
      if (category) {
        setSelectedCategory(category);
        setSelectedTopicIndex(0); // Reset to first topic when category changes
      } else {
        // If category not found, navigate to the first category
        if (domainKnowledgeData.categories.length > 0) {
          navigate(`/knowledge/domain/${domainKnowledgeData.categories[0].id}`);
        }
      }
    } else {
      // If no category specified, navigate to the first category
      if (domainKnowledgeData.categories.length > 0) {
        navigate(`/knowledge/domain/${domainKnowledgeData.categories[0].id}`);
      }
    }
  }, [categoryId, navigate]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    // Close any open menus in the navbar
    const knowledgeMenu = document.getElementById('knowledge-menu');
    if (knowledgeMenu) {
      // Trigger a click outside event to close the menu
      document.body.click();
    }

    navigate(`/knowledge/domain/${categoryId}`);
  };

  // Handle topic change
  const handleTopicChange = (event, newValue) => {
    setSelectedTopicIndex(newValue);
  };

  if (!selectedCategory) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Loading domain knowledge...
        </Typography>
      </Container>
    );
  }

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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => navigate('/knowledge')}
            sx={{ mr: 2 }}
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              flexGrow: 1
            }}
            data-aos="fade-down"
          >
            Domain Knowledge
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Category sidebar */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 2,
                overflow: 'hidden'
              }}
              data-aos="fade-right"
            >
              <List component="nav" aria-label="domain knowledge categories">
                {domainKnowledgeData.categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <ListItem
                      button
                      selected={selectedCategory.id === category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      sx={{
                        bgcolor: selectedCategory.id === category.id ?
                          alpha(theme.palette.primary.main, 0.1) : 'inherit',
                        '&:hover': {
                          bgcolor: selectedCategory.id === category.id ?
                            alpha(theme.palette.primary.main, 0.2) :
                            alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <ListItemIcon>
                        <Icon color={selectedCategory.id === category.id ? "primary" : "inherit"}>
                          {category.icon}
                        </Icon>
                      </ListItemIcon>
                      <ListItemText
                        primary={category.name}
                        primaryTypographyProps={{
                          fontWeight: selectedCategory.id === category.id ? 600 : 400
                        }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Content area */}
          <Grid item xs={12} md={9}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2
              }}
              data-aos="fade-left"
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>{selectedCategory.icon}</Icon>
                  {selectedCategory.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedCategory.description}
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Box>

              {/* Topic tabs */}
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={selectedTopicIndex}
                    onChange={handleTopicChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="domain knowledge topics"
                  >
                    {selectedCategory.topics.map((topic, index) => (
                      <Tab
                        key={topic.id}
                        label={topic.title}
                        icon={<Icon>{topic.icon}</Icon>}
                        iconPosition="start"
                      />
                    ))}
                  </Tabs>
                </Box>

                {/* Topic content */}
                {selectedCategory.topics.map((topic, index) => (
                  <Box
                    key={topic.id}
                    role="tabpanel"
                    hidden={selectedTopicIndex !== index}
                    id={`topic-tabpanel-${index}`}
                    aria-labelledby={`topic-tab-${index}`}
                    sx={{ py: 3 }}
                  >
                    {selectedTopicIndex === index && (
                      <Box>
                        <Typography variant="h5" component="h3" gutterBottom>
                          {topic.title}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {topic.content}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};



export default DomainKnowledge;
