import React, { useState, useMemo } from 'react';
import {
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Box,
  useTheme,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';

// Icons
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import LayersIcon from '@mui/icons-material/Layers';
import CloudIcon from '@mui/icons-material/Cloud';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

// Enhanced skill data with usage and project experience
const skillSections = {
  "Tools": [
    { name: "Jira", years: 10, usage: "current", projectUse: true },
    { name: "Confluence", years: 5, usage: "current", projectUse: true },
    { name: "MS Project", years: 13, usage: "past", projectUse: true }
  ],
  "Programming": [
    { name: "Python", years: 5, usage: "current", projectUse: true },
    { name: "SQL", years: 9, usage: "current", projectUse: true },
    { name: "C", years: 12, usage: "past", projectUse: true },
    { name: "C++", years: 12, usage: "past", projectUse: true }
  ],
  "Databases": [
    { name: "Oracle", years: 9, usage: "current", projectUse: true },
    { name: "PostgreSQL", years: 3, usage: "current", projectUse: true },
    { name: "MS SQL", years: 4, usage: "past", projectUse: true }
  ],
  "Libraries": [
    { name: "React.js", years: 1, usage: "current", projectUse: true },
    { name: "Dash", years: 5, usage: "current", projectUse: true },
    { name: "CSS3", years: 4, usage: "current", projectUse: true },
    { name: "Tailwind CSS", years: 2, usage: "current", projectUse: false }
  ],
  "Repositories": [
    { name: "Git", years: 5, usage: "current", projectUse: true },
    { name: "SVN", years: 5, usage: "past", projectUse: true },
    { name: "GitHub", years: 5, usage: "current", projectUse: true },
    { name: "Bitbucket", years: 5, usage: "current", projectUse: true },
    { name: "GitLab", years: 5, usage: "past", projectUse: false }
  ],
  "Data Visualization": [
    { name: "Plotly", years: 5, usage: "current", projectUse: true }
  ],
  "Domain Knowledge": [
    { name: "Credit Card & Payments", years: 8, usage: "current", projectUse: true },
    { name: "Market Reference Data", years: 6, usage: "past", projectUse: true }
  ]
};

// Icons for different categories
const categoryIcons = {
  "Tools": <BuildIcon />,
  "Programming": <CodeIcon />,
  "Databases": <StorageIcon />,
  "Libraries": <LayersIcon />,
  "Repositories": <CloudIcon />,
  "Data Visualization": <AssessmentIcon />,
  "Domain Knowledge": <BusinessIcon />
};

// Colors for periodic table view
const getSkillColor = (category) => {
  const colors = {
    "Tools": "success",
    "Programming": "primary",
    "Databases": "secondary", 
    "Libraries": "info",
    "Repositories": "warning",
    "Data Visualization": "error",
    "Domain Knowledge": "default"
  };
  return colors[category] || "default";
};

// Skill usage badge text
const getUsageBadge = (usage) => {
  return usage === "current" ? "Active" : "Past";
};

const SkillsWithNiceVisuals = () => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Process and sort skills data
  const processedSkills = useMemo(() => {
    const result = {};
    
    Object.entries(skillSections).forEach(([category, skills]) => {
      // Sort by years of experience (descending)
      result[category] = [...skills].sort((a, b) => b.years - a.years);
    });
    
    return result;
  }, []);

  // Get all skills as a flat array for periodic table view
  const allSkills = useMemo(() => {
    const skills = [];
    
    Object.entries(skillSections).forEach(([category, categorySkills]) => {
      categorySkills.forEach(skill => {
        skills.push({
          ...skill,
          category
        });
      });
    });
    
    // Sort by years (descending), then by name
    return skills.sort((a, b) => b.years - a.years || a.name.localeCompare(b.name));
  }, []);

  // Filter skills based on search and category
  const filteredSkills = useMemo(() => {
    return allSkills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [allSkills, searchTerm, selectedCategory]);

  // Handle view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Get all categories for filter
  const categories = ['All', ...Object.keys(skillSections)];

  return (
    <section id="skills" className="py-5">
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          sx={{ mb: 3, fontWeight: theme.typography.fontWeightBold }}
        >
          Technical Skills
        </Typography>

        {/* View Toggle and Search */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2
        }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
          >
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon /> <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>List</Box>
            </ToggleButton>
            <ToggleButton value="periodic" aria-label="periodic table view">
              <ViewModuleIcon /> <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>Periodic Table</Box>
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search skills..."
            size="small"
            sx={{ width: { xs: '100%', sm: 'auto', md: '25%' } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch} edge="end">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
        </Box>

        {/* Category Filters */}
        {viewMode === 'periodic' && (
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {categories.map(category => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategoryChange(category)}
                color={category === selectedCategory ? "primary" : "default"}
                variant={category === selectedCategory ? "filled" : "outlined"}
                icon={category !== 'All' ? categoryIcons[category] : undefined}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <Grid container spacing={3}>
            {Object.entries(processedSkills).map(([category, skills]) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: '100%',
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? theme.palette.background.paper 
                      : theme.palette.grey[50],
                    borderRadius: theme.shape.borderRadius,
                    transition: theme.transitions.create(['box-shadow']),
                    '&:hover': {
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    pb: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}>
                    <Box sx={{ 
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 1,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? theme.palette.background.default
                        : theme.palette.primary.light + '20'
                    }}>
                      {categoryIcons[category]}
                    </Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        ml: 1,
                        fontWeight: theme.typography.fontWeightMedium
                      }}
                    >
                      {category}
                    </Typography>
                  </Box>
                  
                  {/* Skills Tags */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mb: 3
                  }}>
                    {skills.map((skill) => (
                      <Chip
                        key={skill.name}
                        label={`${skill.name}`}
                        color={skill.usage === "current" ? "primary" : "default"}
                        variant={skill.projectUse ? "filled" : "outlined"}
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </Box>
                  
                  {/* Skill Progress Bars */}
                  {skills.map((skill) => (
                    <Box key={skill.name} sx={{ mb: 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 0.5 
                      }}>
                        <Typography variant="body2" fontWeight={theme.typography.fontWeightMedium}>
                          {skill.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip 
                            label={getUsageBadge(skill.usage)}
                            size="small"
                            color={skill.usage === "current" ? "success" : "default"}
                            sx={{ 
                              height: 20, 
                              '& .MuiChip-label': { 
                                px: 1,
                                fontSize: theme.typography.pxToRem(10) 
                              } 
                            }}
                          />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            fontWeight={theme.typography.fontWeightMedium}
                          >
                            {skill.years}+ yrs
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((skill.years / 15) * 100, 100)}
                        color={skill.usage === "current" ? "primary" : "secondary"}
                        sx={{
                          height: 8,
                          borderRadius: theme.shape.borderRadius,
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? theme.palette.grey[700] 
                            : theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            borderRadius: theme.shape.borderRadius,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Periodic Table View */}
        {viewMode === 'periodic' && (
          <Box sx={{ mt: 2 }}>
            {filteredSkills.length === 0 ? (
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                No skills found matching your criteria.
              </Typography>
            ) : (
              <Grid 
                container 
                spacing={2}
                justifyContent="center"
              >
                {filteredSkills.map((skill) => (
                  <Grid item key={`${skill.category}-${skill.name}`} xs={6} sm={4} md={3} lg={2}>
                    <Tooltip 
                      title={`${skill.category} • ${skill.years}+ years • ${skill.usage} • ${skill.projectUse ? 'Project experience' : 'Training only'}`}
                      arrow
                    >
                      <Card
                        elevation={2}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          transition: theme.transitions.create(['transform', 'box-shadow']),
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8]
                          },
                          border: `1px solid ${theme.palette[getSkillColor(skill.category)].main}20`
                        }}
                      >
                        <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          {/* Top section with category icon and years */}
                          <Box sx={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                          }}>
                            <Box 
                              sx={{ 
                                bgcolor: theme.palette[getSkillColor(skill.category)].main + '20',
                                color: theme.palette[getSkillColor(skill.category)].main,
                                p: 0.5,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: theme.typography.pxToRem(14)
                              }}
                            >
                              {categoryIcons[skill.category]}
                            </Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontWeight: 'bold',
                                bgcolor: theme.palette.mode === 'dark' 
                                  ? theme.palette.grey[800] 
                                  : theme.palette.grey[100],
                                px: 1,
                                py: 0.5,
                                borderRadius: theme.shape.borderRadius,
                              }}
                            >
                              {skill.years}yr
                            </Typography>
                          </Box>
                          
                          {/* Skill name */}
                          <Typography 
                            variant="subtitle1" 
                            component="h3" 
                            align="center"
                            sx={{ 
                              mt: 'auto',
                              mb: 'auto',
                              fontWeight: theme.typography.fontWeightMedium,
                              fontSize: { xs: '0.875rem', md: '1rem' }
                            }}
                          >
                            {skill.name}
                          </Typography>
                          
                          {/* Bottom status indicators */}
                          <Stack 
                            direction="row" 
                            spacing={0.5} 
                            justifyContent="center"
                            mt={1}
                          >
                            <Chip
                              label={skill.usage === "current" ? "Active" : "Past"}
                              size="small"
                              color={skill.usage === "current" ? "success" : "default"}
                              sx={{ 
                                height: 20, 
                                '& .MuiChip-label': { 
                                  px: 1,
                                  fontSize: theme.typography.pxToRem(10)
                                } 
                              }}
                            />
                            <Chip
                              label={skill.projectUse ? "Project" : "Training"}
                              size="small"
                              color={skill.projectUse ? "info" : "default"}
                              variant="outlined"
                              sx={{ 
                                height: 20, 
                                '& .MuiChip-label': { 
                                  px: 1,
                                  fontSize: theme.typography.pxToRem(10)
                                } 
                              }}
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Box>
    </section>
  );
};

export default SkillsWithNiceVisuals;