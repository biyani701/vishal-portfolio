import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Avatar, 
  Box,
  useTheme,
  Paper,
  Chip,
  IconButton,
  Fade,
  Grow
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { 
  Code as CodeIcon,
  Timeline as TimelineIcon,
  Build as BuildIcon,
  Psychology as PsychologyIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon
} from "@mui/icons-material";

const AboutMe = () => {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const skills = [
    { name: "Python", level: 90, color: "#3776ab" },
    { name: "React JS", level: 85, color: "#61dafb" },
    { name: "Jira Automation", level: 95, color: "#0052cc" },
    { name: "REST APIs", level: 88, color: "#ff6b6b" },
    { name: "Full Stack Development", level: 82, color: "#4ecdc4" }
  ];

  const projects = [
    {
      title: "Portfolio Website",
      description: "Modern responsive portfolio built with React JS and Material UI",
      tech: ["React", "Material UI", "JavaScript"],
      icon: <CodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: "Jira Dashboard Automation",
      description: "Automated dashboard creation using Python and Jira REST APIs",
      tech: ["Python", "REST APIs", "Jira"],
      icon: <TimelineIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    },
    {
      title: "Issue Transition Automation",
      description: "Python script to streamline Jira issue workflow transitions",
      tech: ["Python", "Automation", "APIs"],
      icon: <BuildIcon sx={{ fontSize: 40, color: 'primary.main' }} />
    }
  ];

  const SkillBar = ({ skill, index }) => (
    <Fade in={animate} timeout={1000 + index * 200}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
            {skill.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {skill.level}%
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: 8,
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              width: animate ? `${skill.level}%` : '0%',
              height: '100%',
              backgroundColor: skill.color,
              transition: 'width 1.5s ease-in-out',
              transitionDelay: `${index * 0.2}s`,
              borderRadius: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`,
                animation: 'shimmer 2s infinite',
              }
            }}
          />
        </Box>
      </Box>
    </Fade>
  );

  SkillBar.propTypes = {
    skill: PropTypes.shape({
      name: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    }).isRequired,
    index: PropTypes.number.isRequired,
  };

  return (
    <Container 
      maxWidth="lg" 
      id="about"
      sx={{ 
        scrollMarginTop: theme.spacing(8),
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Hero Section */}
      <Fade in={animate} timeout={800}>
        <Paper
          elevation={mode === 'dark' ? 4 : 2}
          sx={{
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(25,25,25,0.95) 0%, rgba(45,45,45,0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            borderRadius: 4,
            p: { xs: 3, sm: 4, md: 6 },
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}15, transparent)`,
              zIndex: 0
            }
          }}
        >
          <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    position: 'relative',
                    animation: 'float 3s ease-in-out infinite'
                  }}
                >
                  <Avatar 
                    src="/images/DSC_0694.jpg" 
                    sx={{ 
                      width: { xs: 180, sm: 220, md: 250 }, 
                      height: { xs: 180, sm: 220, md: 250 },
                      border: `4px solid ${theme.palette.primary.main}`,
                      boxShadow: `0 20px 40px rgba(0,0,0,0.1), 0 0 0 10px ${theme.palette.primary.main}20`,
                    }}
                    alt="Vishal Biyani"
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: theme.shadows[4]
                    }}
                  >
                    <PsychologyIcon sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  Vishal Biyani
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  {["Technical Program Manager", "Delivery Director", "Full Stack Engineer"].map((role, index) => (
                    <Chip
                      key={index}
                      label={role}
                      sx={{
                        m: 0.5,
                        px: 2,
                        py: 1,
                        fontSize: '0.9rem',
                        fontWeight: 'medium',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                        border: `1px solid ${theme.palette.primary.main}40`,
                        color: 'text.primary',
                        '&:hover': {
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}30, ${theme.palette.secondary.main}30)`,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                    />
                  ))}
                </Box>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.8,
                    fontSize: { xs: '1.1rem', sm: '1.2rem' },
                    maxWidth: 600
                  }}
                >
                  Passionate about coding and automation. I create visualization dashboards, 
                  automate workflows, and build modern web applications that solve real-world problems.
                </Typography>

                <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  {[GitHubIcon, LinkedInIcon, EmailIcon].map((Icon, index) => (
                    <IconButton
                      key={index}
                      sx={{
                        bgcolor: `${theme.palette.primary.main}15`,
                        '&:hover': {
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          transform: 'translateY(-3px)',
                          boxShadow: theme.shadows[8]
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Icon />
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      <Grid container spacing={4}>
        {/* Skills Section */}
        <Grid item xs={12} md={6}>
          <Grow in={animate} timeout={1200}>
            <Card
              elevation={mode === 'dark' ? 3 : 1}
              sx={{
                height: '100%',
                background: mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(50,50,50,0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(252,254,255,0.95) 100%)',
                borderRadius: 3,
                border: `1px solid ${theme.palette.primary.main}20`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 100,
                  height: 100,
                  background: `radial-gradient(circle, ${theme.palette.primary.main}20, transparent)`,
                  zIndex: 0
                }
              }}
            >
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 'bold',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <CodeIcon sx={{ fontSize: 35, color: 'primary.main' }} />
                  Skills & Expertise
                </Typography>
                
                {skills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Projects Section */}
        <Grid item xs={12} md={6}>
          <Grow in={animate} timeout={1400}>
            <Card
              elevation={mode === 'dark' ? 3 : 1}
              sx={{
                height: '100%',
                background: mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(50,50,50,0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(252,254,255,0.95) 100%)',
                borderRadius: 3,
                border: `1px solid ${theme.palette.secondary.main}20`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 100,
                  height: 100,
                  background: `radial-gradient(circle, ${theme.palette.secondary.main}20, transparent)`,
                  zIndex: 0
                }
              }}
            >
              <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 'bold',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <BuildIcon sx={{ fontSize: 35, color: 'secondary.main' }} />
                  Featured Projects
                </Typography>
                
                {projects.map((project, index) => (
                  <Fade in={animate} timeout={1600 + index * 200} key={project.title}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 2,
                        background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: theme.shadows[8],
                          borderColor: theme.palette.primary.main
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        {project.icon}
                        <Box>
                          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                            {project.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                            {project.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {project.tech.map((tech) => (
                          <Chip
                            key={tech}
                            label={tech}
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              bgcolor: `${theme.palette.primary.main}15`,
                              color: 'primary.main',
                              fontWeight: 'medium'
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Fade>
                ))}
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>
    </Container>
  );
};


export default AboutMe;