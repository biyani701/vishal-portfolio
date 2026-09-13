import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  Tooltip,
  Avatar
} from '@mui/material';

// Import Material UI icons for categories and fallbacks
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
// import PaymentIcon from '@mui/icons-material/Payment';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// Custom skill icons using devicon
const getSkillIcon = (skillName) => {
  const iconMap = {
    // Programming
    "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "SQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "Unix C/C++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    
    // Libraries
    "React.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "dash": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg",
    "css3": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    "Tailwind CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    
    // Databases
    "Oracle": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
    "PostgreSQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    "MS SQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
    
    // Repositories
    "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    "SVN": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/subversion/subversion-original.svg", 
    "GitHub": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    "GitLab": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
    "Bitbucket": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
    
    // Tools
    "Jira": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg",
    "Confluence": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg",
    "MS Project": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg",
    
    // Data Visualization
    "Plotly": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  };
  
  return iconMap[skillName] || null;
};

const skillSections = {
  "Tools": [
    { name: "Jira", years: 10 },
    { name: "Confluence", years: 5 },
    { name: "MS Project", years: 13 }
  ],
  "Programming": [
    { name: "Python", years: 5 },
    { name: "SQL", years: 9 },
    { name: "Unix C/C++", years: 12 }
  ],
  "Databases": [
    { name: "Oracle", years: 9 },
    { name: "PostgreSQL", years: 3 },
    { name: "MS SQL", years: 4 }
  ],
  "Libraries": [
    { name: "React.js", years: 1 },
    { name: "dash", years: 5 },
    { name: "css3", years: 4 },
    { name: "Tailwind CSS", years: 2 },
  ],
  "Repositories": [
    { name: "Git", years: 5 },
    { name: "SVN", years: 5 },
    { name: "GitHub", years: 5 },
    { name: "Bitbucket", years: 5 },
    { name: "GitLab", years: 5 }
  ],
  "Data Visualization": [
    { name: "Plotly", years: 5 }
  ],
  "Domain Knowledge": [
    { name: "Credit Card & Payments", years: 8 },
    { name: "Market Reference Data", years: 6 }
  ]
};

const getIconForCategory = (category) => {
  switch (category) {
    case "Tools":
      return <BuildIcon />;
    case "Programming":
      return <CodeIcon />;
    case "Databases":
      return <StorageIcon />;
    case "Data Visualization":
      return <AssessmentIcon />;
    case "Domain Knowledge":
      return <BusinessIcon />;
    default:
      return null;
  }
};

const calculateSkillLevel = (years) => {
  if (years >= 10) return 'Expert';
  if (years >= 7) return 'Advanced';
  if (years >= 4) return 'Intermediate';
  return 'Beginner';
};

const getColorByYears = (years, theme) => {
  if (years >= 10) return theme.palette.primary.main;
  if (years >= 7) return theme.palette.secondary.main;
  if (years >= 4) return theme.palette.success.main;
  return theme.palette.info.main;
};

const EnhancedSkills = () => {
  const theme = useTheme();
  
  // Add filter based on dark/light mode for SVG icons if needed
  const iconFilter = theme.palette.mode === 'dark' ? 'brightness(1.5)' : 'none';

  return (
    <section id="skills" className="py-5">
      <div className="container">
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Technical Skills
        </Typography>
        
        {/* Icon Grid View */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50' 
          }}
        >
          <Typography variant="h6" component="h3" gutterBottom>
            Skills Overview
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {Object.entries(skillSections).flatMap(([category, skills]) => 
              skills.map((skill) => (
                <Grid item key={skill.name}>
                  <Tooltip 
                    title={
                      <React.Fragment>
                        <Typography color="inherit">{skill.name}</Typography>
                        <Typography variant="body2">{skill.years}+ years experience</Typography>
                        <Typography variant="body2">Level: {calculateSkillLevel(skill.years)}</Typography>
                      </React.Fragment>
                    } 
                    arrow
                  >
                    <Paper 
                      elevation={2}
                      sx={{
                        width: 64,
                        height: 64,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: theme.shadows[8],
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? theme.palette.grey[700] 
                            : theme.palette.grey[100]
                        }
                      }}
                    >
                      {getSkillIcon(skill.name) ? (
                        <Box
                          component="img"
                          src={getSkillIcon(skill.name)}
                          sx={{
                            width: 40,
                            height: 40,
                            mb: 0.5,
                            filter: theme.palette.mode === 'dark' ? 'brightness(1.2)' : 'none'
                          }}
                          alt={skill.name}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            bgcolor: getColorByYears(skill.years, theme),
                            width: 40,
                            height: 40,
                            mb: 0.5
                          }}
                        >
                          <CodeIcon />
                        </Avatar>
                      )}
                      <Typography 
                        variant="caption" 
                        align="center" 
                        sx={{ fontSize: '0.6rem', lineHeight: 1 }}
                      >
                        {skill.name}
                      </Typography>
                    </Paper>
                  </Tooltip>
                </Grid>
              ))
            )}
          </Grid>
        </Paper>
        
        {/* Detailed Skills by Category */}
        <Typography variant="h6" component="h3" align="center" gutterBottom>
          Skills by Category
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {Object.entries(skillSections).map(([category, skills]) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {getIconForCategory(category)}
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
                    {category}
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  {skills.map((skill) => (
                    <Grid item xs={6} key={skill.name}>
                      <Tooltip 
                        title={`${skill.years}+ years | ${calculateSkillLevel(skill.years)}`}
                        arrow
                      >
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            border: `2px solid ${getColorByYears(skill.years, theme)}`,
                            '&:hover': {
                              backgroundColor: theme.palette.mode === 'dark' 
                                ? theme.palette.grey[700] 
                                : theme.palette.grey[100]
                            }
                          }}
                        >
                          {getSkillIcon(skill.name) ? (
                            <Box
                              component="img"
                              src={getSkillIcon(skill.name)}
                              sx={{
                                width: 30,
                                height: 30,
                                mb: 1,
                                filter: theme.palette.mode === 'dark' ? 'brightness(1.2)' : 'none'
                              }}
                              alt={skill.name}
                            />
                          ) : (
                            <Avatar
                              sx={{
                                width: 30,
                                height: 30,
                                bgcolor: getColorByYears(skill.years, theme),
                                mb: 1
                              }}
                            >
                              <CodeIcon />
                            </Avatar>
                          )}
                          <Typography variant="body2" align="center" sx={{ fontWeight: 'bold' }}>
                            {skill.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {skill.years}+ years
                          </Typography>
                        </Paper>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </div>
    </section>
  );
};

export default EnhancedSkills;  