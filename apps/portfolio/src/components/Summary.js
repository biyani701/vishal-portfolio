import { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Container,
  Avatar,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import VerifiedIcon from '@mui/icons-material/Verified';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimelineIcon from '@mui/icons-material/Timeline';

const ProfileSummary = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };
  
  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  const profileData = {
    title: "Technical Program Manager / Delivery Director",
    experience: "25+ years",
    summary: "A results-driven Technical Program Manager / Delivery Director with over 25 years of experience steering complex, high-impact software initiatives. Proven track record of aligning strategy with execution to deliver transformative business outcomes across diverse industries.",
    keyPoints: [
      {
        icon: <TimelineIcon />,
        title: "Methodology Expert",
        description: "Expert in Agile, Waterfall, Scrum, and Kanban methodologies, leading cross-functional, globally distributed teams to deliver high-performance results and maximize client value."
      },
      {
        icon: <TaskAltIcon />,
        title: "Project Delivery",
        description: "Delivered large-scale, mission-critical programs, including regulatory, time-sensitive, and high-complexity projects — consistently achieving on-time, within-budget delivery."
      },
      {
        icon: <EngineeringIcon />,
        title: "Strategic Problem-Solver",
        description: "Strategic problem-solver, combining meticulous planning with proactive risk mitigation to ensure delivery excellence while fostering an innovation-first culture."
      },
      {
        icon: <GroupsIcon />,
        title: "Stakeholder Engagement",
        description: "Exceptional stakeholder engagement, cultivating strong partnerships and promoting transparent, outcome-focused communication to keep business and technology teams aligned."
      },
      {
        icon: <EmojiEventsIcon />,
        title: "Award-Winning Leadership",
        description: "Award-winning leadership, recognized with accolades such as \"Best Project Manager of the Quarter\" for driving measurable improvements in delivery, team performance, and client satisfaction."
      }
    ],
    passion: "Passionate about leading high-impact programs, accelerating innovation, and empowering teams to exceed expectations."
  };

  const skills = [
    "Agile", "Scrum", "Kanban", "Waterfall", "Risk Management", 
    "Stakeholder Management", "Program Management", "Project Delivery", 
    "Cross-functional Leadership", "Strategic Planning"
  ];

  return (
    <Box sx={{ py: 6, backgroundColor: "background.paper" }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={4}
          sx={{ 
            p: 4, 
            borderRadius: 2, 
            background: "linear-gradient(to right, #f5f7fa, #e4e8ed)",
            mb: 4
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 64,
                height: 64,
                mr: 2,
                fontSize: "2rem"
              }}
            >
              <VerifiedIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {profileData.title}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {profileData.experience} of Professional Experience
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", mb: 3 }}>
            {profileData.summary}
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              {skills.map((skill, index) => (
                <Grid item key={index}>
                  <Chip 
                    label={skill} 
                    color="primary" 
                    variant="outlined" 
                    sx={{ fontWeight: 500 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>

        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            mb: 3, 
            fontWeight: "bold",
            position: "relative",
            pl: 2,
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "4px",
              backgroundColor: "primary.main",
              borderRadius: 1
            }
          }}
        >
          Professional Excellence
        </Typography>

        <Grid container spacing={3}>
          {profileData.keyPoints.map((point, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                elevation={hoveredCard === index ? 4 : 1}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  transform: hoveredCard === index ? "translateY(-8px)" : "none",
                  borderLeft: hoveredCard === index ? "4px solid" : "none",
                  borderColor: "primary.main"
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 40,
                        height: 40,
                        mr: 2
                      }}
                    >
                      {point.icon}
                    </Avatar>
                    <Typography variant="h6" component="h3" fontWeight="bold">
                      {point.title}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1">
                    {point.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontStyle: "italic", 
              color: "text.secondary",
              maxWidth: "800px",
              mx: "auto",
              p: 2,
              borderRadius: 1,
              backgroundColor: "rgba(0,0,0,0.02)"
            }}
          >
            {profileData.passion}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ProfileSummary;