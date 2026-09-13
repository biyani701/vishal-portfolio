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

const skillSections = 
{ 
  "Programming Languages & Markup": [
    { "name": "Python", "years": 5 }, { "name": "C", "years": 10 }, { "name": "C++", "years": 10 }, { "name": "JavaScript", "years": 4 }, { "name": "HTML5", "years": 4 }, { "name": "CSS3", "years": 4 }, { "name": "SQL", "years": 9 }, { "name": "Java", "years": 1 }
  ], 
  "Frontend Styling Frameworks": [
    { "name": "Bootstrap", "years": 4 }, { "name": "Tailwind CSS", "years": 1 }, { "name": "Sass", "years": 1 }
  ], 
  "Web & Backend Frameworks": [
    { "name": "Flask", "years": 3 }, { "name": "Node.js", "years": 1 }
  ],
   "IDEs & Code Editors": [
    { "name": "PyCharm", "years": 5 }, { "name": "VS Code", "years": 4 }, { "name": "IntelliJ", "years": 1 }, { "name": "Eclipse", "years": 1 }
  ], 
  "Databases": [{ "name": "PostgreSQL", "years": 4 }, { "name": "Oracle", "years": 4 }, { "name": "MySQL", "years": 1 }, { "name": "MongoDB", "years": 1 }, { "name": "MS SQL", "years": 1 }], "Version Control & CI/CD": [{ "name": "Git", "years": 5 }, { "name": "SVN", "years": 5 }, { "name": "Bitbucket", "years": 4 }, { "name": "Bitbucket Pipelines", "years": 3 }, { "name": "Jenkins", "years": 1 }, { "name": "GitHub Actions", "years": 1 }], "Project & Portfolio Management (PPM)": [{ "name": "Jira", "years": 10 }, { "name": "MS Project", "years": 13 }, { "name": "Asana", "years": 1 }, { "name": "Trello", "years": 1 }], "Documentation & Collaboration": [{ "name": "Confluence", "years": 5 }, { "name": "SharePoint", "years": 5 }, { "name": "Notion", "years": 1 }, { "name": "Google Docs", "years": 1 }], "Testing & Quality Assurance": [{ "name": "Selenium", "years": 3 }, { "name": "Pytest", "years": 3 }, { "name": "Postman", "years": 1 }, { "name": "SonarQube", "years": 1 }, { "name": "Allure", "years": 1 }], "Data Visualization & Analytics": [{ "name": "Plotly Dash", "years": 3 }, { "name": "Excel", "years": 10 }, { "name": "Pandas", "years": 4 }, { "name": "Power BI", "years": 1 }, { "name": "Tableau", "years": 1 }, { "name": "Matplotlib", "years": 1 }, { "name": "Seaborn", "years": 1 }], "Cloud & DevOps": [{ "name": "AWS", "years": 1 }, { "name": "Azure", "years": 1 }, { "name": "Docker", "years": 1 }, { "name": "Terraform", "years": 1 }] };

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

const EnhancedSkillsUpdated = () => {
  const theme = useTheme();

  // Add filter based on dark/light mode for SVG icons if needed
  // const iconFilter = theme.palette.mode === 'dark' ? 'brightness(1.5)' : 'none';

  return (
    <section id="skills" className="py-5">
      <div className="container">
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Technical Skills
        </Typography>

        {/* Periodic Table Style Skills Overview */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
          }}
        >
          <Typography variant="h6" component="h3" gutterBottom>
            Skills Overview - Periodic Table Style
          </Typography>
          
          <Box sx={{ overflowX: 'auto' }}>
            {/* Create a periodic table-like grid */}
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(auto-fill, minmax(80px, 1fr))',
                  sm: 'repeat(8, 80px)',
                  md: 'repeat(12, 80px)',
                  lg: 'repeat(15, 80px)',
                },
                gridGap: 1.5,
                justifyContent: 'center',
                mx: 'auto'
              }}
            >
              {/* Create a flat array of all skills */}
              {Object.entries(skillSections).reduce((allSkills, [category, skills]) => {
                skills.forEach(skill => {
                  allSkills.push({
                    ...skill,
                    category: category
                  });
                });
                return allSkills;
              }, []).map((skill, index) => {
                // Calculate skill level based on years
                const level = calculateSkillLevel(skill.years);
                // Get color based on skill level
                const color = getColorByYears(skill.years, theme);
                
                // Element symbol - first 2 letters or first letter + next consonant
                let symbol = skill.name.substring(0, 2);
                if (skill.name.length > 2) {
                  const firstLetter = skill.name.charAt(0);
                  let secondChar = '';
                  for (let i = 1; i < skill.name.length; i++) {
                    const char = skill.name.charAt(i);
                    if (!'aeiou'.includes(char.toLowerCase())) {
                      secondChar = char;
                      break;
                    }
                  }
                  // If no consonant found, use the second letter
                  if (!secondChar) secondChar = skill.name.charAt(1);
                  symbol = firstLetter + secondChar;
                }
                
                // Use sequential numbering (1, 2, 3...) for atomic number
                const atomicNumber = index + 1;
                
                return (
                  <Tooltip
                    key={skill.name}
                    title={
                      <React.Fragment>
                        <Typography color="inherit">{skill.name}</Typography>
                        <Typography variant="body2">{skill.years}+ years experience</Typography>
                        <Typography variant="body2">Level: {level}</Typography>
                        <Typography variant="body2">Category: {skill.category}</Typography>
                      </React.Fragment>
                    }
                    arrow
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        width: 80,
                        height: 80,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        border: `2px solid ${color}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px) scale(1.05)',
                          boxShadow: theme.shadows[8],
                          zIndex: 1
                        },
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? `${color}22` // Add transparency in dark mode
                          : `${color}11`  // More subtle in light mode
                      }}
                    >
                      {/* Atomic number */}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute',
                          top: 2,
                          left: 4,
                          fontSize: '0.6rem',
                          opacity: 0.8
                        }}
                      >
                        {atomicNumber}
                      </Typography>
                      
                      {/* Experience years */}
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute',
                          top: 2,
                          right: 4,
                          fontSize: '0.6rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {skill.years}y
                      </Typography>
                      
                      {/* Element Symbol */}
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold',
                          lineHeight: 1,
                          mb: 0.5
                        }}
                      >
                        {symbol.toUpperCase()}
                      </Typography>
                      
                      {/* Skill Name */}
                      <Typography
                        variant="caption"
                        align="center"
                        sx={{ 
                          fontSize: '0.6rem',
                          lineHeight: 1,
                          px: 0.5,
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {skill.name}
                      </Typography>
                      
                      {/* Mini icon in bottom right */}
                      {getSkillIcon(skill.name) && (
                        <Box
                          component="img"
                          src={getSkillIcon(skill.name)}
                          sx={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 16,
                            height: 16,
                            opacity: 0.7,
                            filter: theme.palette.mode === 'dark' ? 'brightness(1.2)' : 'none'
                          }}
                          alt={skill.name}
                        />
                      )}
                    </Paper>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>

          {/* Legend */}
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
              mt: 3 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: theme.palette.primary.main,
                  mr: 1
                }} 
              />
              <Typography variant="caption">Expert (10+ years)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: theme.palette.secondary.main,
                  mr: 1
                }} 
              />
              <Typography variant="caption">Advanced (7-9 years)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: theme.palette.success.main,
                  mr: 1
                }} 
              />
              <Typography variant="caption">Intermediate (4-6 years)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: theme.palette.info.main,
                  mr: 1
                }} 
              />
              <Typography variant="caption">Beginner (1-3 years)</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Detailed Skills by Category - REFACTORED SECTION */}
        <Typography variant="h6" component="h3" align="center" gutterBottom>
          Skills by Category
        </Typography>
        
        {/* Use Grid with 2 columns */}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {Object.entries(skillSections).map(([category, skills]) => (
            <Grid item xs={12} md={6} key={category}>
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
                
                {/* Set up Grid with 4 icons per row maximum */}
                <Grid container spacing={1}>
                  {skills.map((skill) => (
                    <Grid item xs={6} sm={6} md={3} key={skill.name}>
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

export default EnhancedSkillsUpdated;