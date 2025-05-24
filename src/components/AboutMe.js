import React, { useState } from "react";
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  Box,
  useTheme,
  Tabs,
  Tab,
  Paper,
  Divider
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

const AboutMe = () => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const CurrentDesign = () => (
    <Card 
      elevation={mode === 'dark' ? 2 : 1}
      sx={{ 
        marginTop: { xs: 3, sm: 4, md: 5 }, 
        padding: { xs: 2, sm: 3 },
        backgroundColor: 'background.paper',
        borderRadius: theme.shape.borderRadius,
        width: '100%'
      }}
    >
      <CardContent>
        <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
          <Grid 
            item 
            xs={12} 
            sm={3}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', sm: 'flex-start' }
            }}
          >
            <Avatar 
              src="/images/DSC_0694.jpg" 
              sx={{ 
                width: { xs: 100, sm: 80 }, 
                height: { xs: 100, sm: 80 },
                border: `2px solid ${theme.palette.primary.main}`
              }}
              alt="Vishal Biyani"
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
                Vishal Biyani
              </Typography>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Technical Program Manager | Delivery Director | Full Stack Engineer
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography 
          variant="body1" 
          component="p" 
          sx={{ 
            marginTop: { xs: 2, sm: 3 }, 
            textAlign: { xs: 'left', sm: "justify" },
            color: 'text.primary',
            fontSize: { xs: '0.95rem', sm: '1rem' }
          }}
        >
          I have a passion for coding and automation. Created visualization dashboards using Python Plotly Dash, automated Jira workflows with REST APIs, and developed portfolio projects with React JS.
        </Typography>

        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            marginTop: { xs: 3, sm: 4 },
            color: 'text.primary',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Key Skills
        </Typography>
        <Typography 
          variant="body2" 
          component="p"
          sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '0.875rem' }
          }}
        >
          Python, React JS, Jira Automation, REST APIs, Full Stack Development
        </Typography>

        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            marginTop: { xs: 3, sm: 4 },
            color: 'text.primary',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}
        >
          Personal Projects
        </Typography>
        <Typography 
          variant="body2" 
          component="p" 
          sx={{ 
            textAlign: { xs: 'left', sm: "justify" },
            color: 'text.secondary',
            lineHeight: 1.6,
            fontSize: { xs: '0.875rem', sm: '0.875rem' }
          }}
        >
          Developed a portfolio website using React JS and Material UI.<br/>
          Automated creation of Jira dashboard using python and Jira REST APIs.<br/>
          Created a Python script to automate Jira issue transitions.<br/>
          Created Jira dashboards using Python and REST APIs.<br/>            
        </Typography>
      </CardContent>
    </Card>
  );

  const NewDesign = () => (
    <Paper 
      elevation={mode === 'dark' ? 2 : 1}
      sx={{ 
        marginTop: { xs: 3, sm: 4, md: 5 }, 
        padding: { xs: 2, sm: 3 },
        backgroundColor: 'background.paper',
        borderRadius: theme.shape.borderRadius,
        width: '100%'
      }}
    >
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                src="/images/DSC_0694.jpg" 
                sx={{ 
                  width: 200, 
                  height: 200,
                  border: `3px solid ${theme.palette.primary.main}`,
                  marginBottom: 2
                }}
                alt="Vishal Biyani"
              />
              <Typography variant="h4" component="h1" sx={{ color: 'text.primary', textAlign: 'center' }}>
                Vishal Biyani
              </Typography>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  color: 'text.secondary',
                  textAlign: 'center',
                  marginTop: 1
                }}
              >
                Technical Program Manager | Delivery Director | Full Stack Engineer
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ pl: { md: 4 } }}>
              <Typography 
                variant="h5" 
                component="h3" 
                sx={{ 
                  color: 'text.primary',
                  marginBottom: 2,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  pb: 1
                }}
              >
                About Me
              </Typography>
              <Typography 
                variant="body1" 
                component="p" 
                sx={{ 
                  color: 'text.primary',
                  marginBottom: 3,
                  lineHeight: 1.8
                }}
              >
                I have a passion for coding and automation. Created visualization dashboards using Python Plotly Dash, automated Jira workflows with REST APIs, and developed portfolio projects with React JS.
              </Typography>

              <Typography 
                variant="h5" 
                component="h3" 
                sx={{ 
                  color: 'text.primary',
                  marginBottom: 2,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  pb: 1
                }}
              >
                Key Skills
              </Typography>
              <Typography 
                variant="body1" 
                component="p"
                sx={{ 
                  color: 'text.secondary',
                  marginBottom: 3,
                  lineHeight: 1.8
                }}
              >
                Python, React JS, Jira Automation, REST APIs, Full Stack Development
              </Typography>

              <Typography 
                variant="h5" 
                component="h3" 
                sx={{ 
                  color: 'text.primary',
                  marginBottom: 2,
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  pb: 1
                }}
              >
                Personal Projects
              </Typography>
              <Typography 
                variant="body1" 
                component="p" 
                sx={{ 
                  color: 'text.secondary',
                  lineHeight: 1.8
                }}
              >
                • Developed a portfolio website using React JS and Material UI<br/>
                • Automated creation of Jira dashboard using python and Jira REST APIs<br/>
                • Created a Python script to automate Jira issue transitions<br/>
                • Created Jira dashboards using Python and REST APIs
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );

  const ThreeSectionDesign = () => (
    <Paper 
      elevation={mode === 'dark' ? 2 : 1}
      sx={{ 
        marginTop: { xs: 3, sm: 4, md: 5 }, 
        padding: { xs: 2, sm: 3 },
        backgroundColor: 'background.paper',
        borderRadius: theme.shape.borderRadius,
        width: '100%'
      }}
    >
      <CardContent>
        <Grid container spacing={4}>
          {/* Left Section - Profile */}
          <Grid item xs={12} md={4}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80%',
                  height: '1px',
                  backgroundColor: theme.palette.divider,
                  display: { xs: 'block', md: 'none' }
                }
              }}
            >
              <Avatar 
                src="/images/DSC_0694.jpg" 
                sx={{ 
                  width: { xs: 150, sm: 200 }, 
                  height: { xs: 150, sm: 200 },
                  border: `4px solid ${theme.palette.primary.main}`,
                  marginBottom: 3,
                  boxShadow: theme.shadows[4]
                }}
                alt="Vishal Biyani"
              />
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  color: 'text.primary', 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginBottom: 1
                }}
              >
                Vishal Biyani
              </Typography>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  color: 'text.secondary',
                  textAlign: 'center',
                  marginBottom: 2,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                Technical Program Manager
              </Typography>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  color: 'text.secondary',
                  textAlign: 'center',
                  marginBottom: 1,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                Delivery Director
              </Typography>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  color: 'text.secondary',
                  textAlign: 'center',
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                Full Stack Engineer
              </Typography>
            </Box>
          </Grid>

          {/* Right Section - Content */}
          <Grid item xs={12} md={8}>
            <Box sx={{ pl: { md: 4 } }}>
              {/* About Me Section */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h3" 
                  sx={{ 
                    color: 'text.primary',
                    marginBottom: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: 60,
                      height: 3,
                      backgroundColor: theme.palette.primary.main
                    }
                  }}
                >
                  About Me
                </Typography>
                <Typography 
                  variant="body1" 
                  component="p" 
                  sx={{ 
                    color: 'text.primary',
                    lineHeight: 1.8,
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  I have a passion for coding and automation. Created visualization dashboards using Python Plotly Dash, automated Jira workflows with REST APIs, and developed portfolio projects with React JS.
                </Typography>
              </Box>

              {/* What I Do Section */}
              <Box>
                <Typography 
                  variant="h4" 
                  component="h3" 
                  sx={{ 
                    color: 'text.primary',
                    marginBottom: 2,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: 60,
                      height: 3,
                      backgroundColor: theme.palette.primary.main
                    }
                  }}
                >
                  What I Do
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        backgroundColor: 'background.default',
                        height: '100%',
                        p: 2
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'primary.main',
                          mb: 1
                        }}
                      >
                        Development
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        Full stack development using React JS, Python, and various modern technologies.
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        backgroundColor: 'background.default',
                        height: '100%',
                        p: 2
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'primary.main',
                          mb: 1
                        }}
                      >
                        Automation
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        Creating automated workflows and dashboards using Python and REST APIs.
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );

  return (
    <Container 
      maxWidth="md" 
      id="about"
      sx={{ 
        scrollMarginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        marginTop: { xs: 8, sm: 10, md: 12 },
      }}
    >
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 'bold',
              textTransform: 'none',
            }
          }}
        >
          <Tab label="Current Design" />
          <Tab label="New Design" />
          <Tab label="Three Section" />
        </Tabs>
      </Box>

      {selectedTab === 0 ? <CurrentDesign /> : 
       selectedTab === 1 ? <NewDesign /> : 
       <ThreeSectionDesign />}
    </Container>
  );
};

export default AboutMe;