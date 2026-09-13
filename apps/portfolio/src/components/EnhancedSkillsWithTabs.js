import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  Tooltip,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';

// Import Material UI icons for categories and fallbacks
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
// import PaymentIcon from '@mui/icons-material/Payment';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CategoryIcon from '@mui/icons-material/Category';
import GridViewIcon from '@mui/icons-material/GridView';

// Custom skill icons using devicon
const getSkillIcon = (skillName) => {
  const iconMap = {
    // Programming
    "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "SQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "C": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    "C++": "https://cdn.jsdelivr.net/npm/@programming-languages-logos/cpp@0.0.2/cpp.svg",
    "JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "HTML5": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    "CSS3": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    "Java": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",

    // Libraries & Frameworks
    "React.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "dash": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg",
    "Bootstrap": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    "Tailwind CSS": "/images/tailwindcss-original.svg",
    "Sass": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
    "Flask": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
    "Node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",

    // Databases
    "Oracle": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
    "PostgreSQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    "MS SQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
    "MySQL": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "MongoDB": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",

    // IDEs & Editors
    "PyCharm": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg",
    "VS Code": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    "IntelliJ": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg",
    "Eclipse": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg",

    // Version Control & CI/CD
    "Git": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    "SVN": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/subversion/subversion-original.svg",
    "GitHub": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    "GitLab": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
    "Bitbucket": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
    "Jenkins": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",
    "Bitbucket Pipelines": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
    "GitHub Actions": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",

    // Project Management
    "Jira": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg",
    "MS Project": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg",    
    "Trello": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg",

    // Documentation & Collaboration
    "Confluence": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg",
    // "SharePoint": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg",
    "SharePoint": "/images/sharepoint.svg",
    
    "Notion": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg",
    "Google Docs": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",

    // Testing & QA
    "Selenium": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg",
    "Pytest": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "Postman": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
    "SonarQube": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sonarqube/sonarqube-original.svg",
    // "Allure": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/allure/allure-original.svg",

    // Data Visualization & Analytics
    "Plotly Dash": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    // "Excel": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg",
    "Excel": "/images/excel.svg",
    "Pandas": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    // "Power BI": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/powerbi/powerbi-original.svg",
    "Power BI": "/images/PowerBi.svg",
    // "Tableau": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tableau/tableau-original.svg",
    "Tableau": "/images/tableau.svg",    

    // Cloud & DevOps
    "AWS": "/images/aws.svg",
    "Azure": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    "Docker": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    "Terraform": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",

    // Package Managers
    "pip": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "npm": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg"
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
  "Databases": [
    { "name": "PostgreSQL", "years": 4 }, { "name": "Oracle", "years": 4 }, { "name": "MySQL", "years": 1 }, { "name": "MongoDB", "years": 1 }, { "name": "MS SQL", "years": 1 }], 
    "Version Control & CI/CD": [
      { "name": "Git", "years": 5 }, { "name": "SVN", "years": 5 }, { "name": "Bitbucket", "years": 4 }, { "name": "Bitbucket Pipelines", "years": 3 }, { "name": "Jenkins", "years": 1 }, { "name": "GitHub Actions", "years": 1 }], 
      "Project & Portfolio Management (PPM)": [{ "name": "Jira", "years": 10 }, { "name": "MS Project", "years": 13 }, { "name": "Trello", "years": 1 }], 
      "Documentation & Collaboration": [{ "name": "Confluence", "years": 5 }, { "name": "SharePoint", "years": 5 }, { "name": "Notion", "years": 1 }, { "name": "Google Docs", "years": 1 }], 
      "Testing & Quality Assurance": [{ "name": "Selenium", "years": 3 }, { "name": "Pytest", "years": 3 }, { "name": "Postman", "years": 1 }, { "name": "SonarQube", "years": 1 }], 
      "Data Visualization & Analytics": [{ "name": "Plotly Dash", "years": 3 }, { "name": "Excel", "years": 10 }, { "name": "Pandas", "years": 4 }, { "name": "Power BI", "years": 1 }, { "name": "Tableau", "years": 1 },], 
      "Cloud & DevOps": [{ "name": "AWS", "years": 1 }, { "name": "Azure", "years": 1 }, { "name": "Docker", "years": 1 }, { "name": "Terraform", "years": 1 }],
      "Package Managers": [ {"name": "pip", "years": 5}, {"name": "npm", "years": 1}]
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
      return <CategoryIcon />;
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

// Tab Panel component to handle tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`skills-tabpanel-${index}`}
      aria-labelledby={`skills-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper function for tab accessibility
function a11yProps(index) {
  return {
    id: `skills-tab-${index}`,
    'aria-controls': `skills-tabpanel-${index}`,
  };
}

// Periodic Table Layout
const periodicTableLayout = {
  row1: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  row2: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  row3: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  row4: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  row5: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  row6: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  row7: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
};

// Function to organize skills into periodic table layout
const organizeSkillsIntoPeriodicTable = (skills) => {
  const organizedSkills = { ...periodicTableLayout };
  let currentRow = 1;
  let skillIndex = 0;
  const uniqueSkills = [...new Set(skills.map(skill => skill.name))].map(name => 
    skills.find(skill => skill.name === name)
  );

  // First row (2 elements)
  if (uniqueSkills.length > 0) organizedSkills.row1[0] = uniqueSkills[0];
  if (uniqueSkills.length > 1) organizedSkills.row1[17] = uniqueSkills[1];
  currentRow++;
  skillIndex = 2;

  // Next two rows (2 elements on left, 6 on right)
  for (let i = 0; i < 2 && currentRow <= 3; i++) {
    if (skillIndex < uniqueSkills.length) organizedSkills[`row${currentRow}`][0] = uniqueSkills[skillIndex++];
    if (skillIndex < uniqueSkills.length) organizedSkills[`row${currentRow}`][1] = uniqueSkills[skillIndex++];
    for (let j = 12; j < 18 && skillIndex < uniqueSkills.length; j++) {
      organizedSkills[`row${currentRow}`][j] = uniqueSkills[skillIndex++];
    }
    currentRow++;
  }

  // Remaining rows (18 elements each)
  while (currentRow <= 7 && skillIndex < uniqueSkills.length) {
    for (let i = 0; i < 18 && skillIndex < uniqueSkills.length; i++) {
      organizedSkills[`row${currentRow}`][i] = uniqueSkills[skillIndex++];
    }
    currentRow++;
  }

  return organizedSkills;
};

const EnhancedSkillsWithTabs = () => {
  const theme = useTheme();
  // State to track active tab
  const [tabValue, setTabValue] = useState(0);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <section id="skills" className="py-5">
      <div className="container">
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Technical Skills
        </Typography>
        
        {/* Tabs Navigation */}
        <Paper
          elevation={3}
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
            mb: 3
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            textColor="primary"
            indicatorColor="primary"
            aria-label="skills tabs"
          >
            <Tab 
              icon={<CategoryIcon />} 
              label="Skills by Category" 
              {...a11yProps(0)} 
              sx={{ py: 2 }}
            />
            <Tab 
              icon={<GridViewIcon />} 
              label="Periodic Table View" 
              {...a11yProps(1)} 
              sx={{ py: 2 }}
            />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <TabPanel value={tabValue} index={0}>
          {/* Detailed Skills by Category */}
          <Grid container spacing={4}>
            {Object.entries(skillSections).map(([category, skills]) => {
              // Calculate optimal number of columns based on screen size
              const getOptimalColumns = () => {
                if (window.innerWidth >= 1200) return 6; // xl
                if (window.innerWidth >= 900) return 4;  // md
                if (window.innerWidth >= 600) return 3;  // sm
                return 2; // xs
              };

              const optimalColumns = getOptimalColumns();
              const itemsPerRow = optimalColumns;
              const totalItems = Math.ceil(skills.length / itemsPerRow) * itemsPerRow;
              const dummyItems = Array(totalItems - skills.length).fill(null);

              return (
                <Grid key={category} size={12}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
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
                    
                      <Grid container spacing={2}>
                        {[...skills, ...dummyItems].map((skill, index) => (
                          <Grid key={skill ? skill.name : `dummy-${index}`} size={12 / itemsPerRow}>
                            {skill ? (
                              <Tooltip
                                title={`${skill.years}+ years | ${calculateSkillLevel(skill.years)}`}
                                arrow
                              >
                                <Paper
                                  elevation={1}
                                  sx={{
                                    p: 2,
                                    height: 120,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
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
                                  <Box
                                    component="img"
                                    src={getSkillIcon(skill.name)}
                                    alt={skill.name}
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      mb: 1,
                                      objectFit: 'contain'
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{
                                      fontWeight: 'medium',
                                      lineHeight: 1.2,
                                      maxWidth: '100%',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      mb: 0.5
                                    }}
                                  >
                                    {skill.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: getColorByYears(skill.years, theme),
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {skill.years}+ years
                                  </Typography>
                                </Paper>
                              </Tooltip>
                            ) : (
                              <Box sx={{ height: 120 }} />
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ maxWidth: '100%', overflowX: 'auto' }}>
            <Grid container spacing={1} sx={{ width: 'fit-content', margin: '0 auto' }}>
              {Object.entries(organizeSkillsIntoPeriodicTable(Object.values(skillSections).flat())).map(([row, skills]) => (
                <Grid container key={row} spacing={1} sx={{ width: 'fit-content' }}>
                  {skills.map((skill, index) => (
                    <Grid key={`${row}-${index}`}>
                      {skill ? (
                        <Tooltip
                          title={`${skill.years}+ years | ${calculateSkillLevel(skill.years)}`}
                          arrow
                        >
                          <Paper
                            elevation={1}
                            sx={{
                              p: 1,
                              width: 60,
                              height: 60,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
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
                            <img
                                src={getSkillIcon(skill.name)}
                                alt={skill.name}
                              style={{ width: 24, height: 24 }}
                            />
                            <Typography variant="caption" sx={{ mt: 0.5 }}>
                              {skill.name}
                            </Typography>
                          </Paper>
                        </Tooltip>
                      ) : (
                        <Box sx={{ width: 60, height: 60 }} />
                      )}
                      </Grid>
                    ))}
              </Grid>
            ))}
          </Grid>
            </Box>
        </TabPanel>
      </div>
    </section>
  );
};

export default EnhancedSkillsWithTabs;