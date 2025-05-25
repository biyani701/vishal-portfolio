import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Avatar,
  Divider,
  Card,
  CardContent,
  Chip,
  Box,
  Tabs,
  Tab,
  LinearProgress,
  Badge,
  IconButton,
  Container,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { styled, alpha } from '@mui/material/styles';

// Icons
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupIcon from '@mui/icons-material/Group';
import StarIcon from '@mui/icons-material/Star';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloudIcon from '@mui/icons-material/Cloud';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  fontSize: '3rem',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
}));

const ContactChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  }
}));

const SkillCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.95)})`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
    borderColor: alpha(theme.palette.primary.main, 0.3),
  }
}));

const ExperienceCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha(theme.palette.primary.main, 0.02)})`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
    borderLeftColor: theme.palette.primary.main,
    borderLeftWidth: '4px',
  }
}));

const AwardBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
    fontSize: '0.6rem',
    minWidth: '16px',
    height: '16px',
  }
}));

const ProfileSummary = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const profileData = {
    name: "Vishal Biyani",
    title: "Principal Project Analyst",
    subtitle: "Technical Program Manager / Delivery Director",
    experience: "25+ years",
    location: "Mumbai, India",
    email: "vishalbiyani@gmail.com",
    phone: "+91 77 20 02 85 22",
    summary: "A results-driven Technical Program Manager / Delivery Director with over 25 years of experience steering complex, high-impact software initiatives. Proven track record of aligning strategy with execution to deliver transformative business outcomes across diverse industries.",
    passion: "Passionate about leading high-impact programs, accelerating innovation, and empowering teams to exceed expectations."
  };

  const achievements = [
    {
      icon: <TrendingUpIcon />,
      title: "Multi-Client Leadership",
      description: "Directed scope, timelines, and deliverables for 8 UK banking clients, managing both Time & Material and Fixed Price engagements",
      highlight: "8 Banking Clients"
    },
    {
      icon: <GroupIcon />,
      title: "Large-Scale Team Management",
      description: "Managed teams of 50+ resources including 24 onsite and 26 offshore developers across multiple time zones",
      highlight: "50+ Team Members"
    },
    {
      icon: <ManageAccountsIcon />,
      title: "Application Portfolio Management",
      description: "Successfully managed development and releases for 50+ applications with comprehensive incident management",
      highlight: "50+ Applications"
    },
    {
      icon: <BusinessIcon />,
      title: "Agile Coaching Excellence",
      description: "Coached and mentored 150+ team members across cross-functional teams on Agile principles and cultural transformation",
      highlight: "150+ Mentees"
    }
  ];

  const skills = {
    tools: [
      { name: "Jira", years: "10+ yrs", level: 95 },
      { name: "Confluence", years: "5+ yrs", level: 85 },
      { name: "MS Project", years: "13+ yrs", level: 90 }
    ],
    programming: [
      { name: "Python", years: "5+ yrs", level: 80 },
      { name: "SQL", years: "9+ yrs", level: 90 },
      { name: "Unix C/C++", years: "12+ yrs", level: 85 }
    ],
    databases: [
      { name: "Oracle", years: "9+ yrs", level: 90 },
      { name: "MS SQL", years: "4+ yrs", level: 75 },
      { name: "PostgreSQL", years: "3+ yrs", level: 70 }
    ],
    visualization: [
      { name: "Plotly", years: "5+ yrs", level: 80 },
      { name: "Tableau", years: "3+ yrs", level: 75 }
    ]
  };

  const workExperience = [
    {
      company: "CoreCard Software India Pvt. Ltd.",
      role: "Principal Project Analyst",
      period: "Nov 2019 - Present",
      location: "Mumbai",
      achievements: [
        "Built and maintained strong client relationships for Cookie and Jazz projects",
        "Established Agile PMO to foster innovation and accelerate time to market",
        "Enhanced release management processes and improved operational efficiency",
        "Coached 150+ team members on Agile principles driving cultural transformation"
      ]
    },
    {
      company: "Cognizant Technology Solutions",
      role: "Delivery Lead",
      period: "Oct 2003 - Sep 2019",
      location: "Pune / Dallas TX / Washington DC",
      achievements: [
        "Managed 8 UK banking clients with consistent on-time delivery",
        "Achieved top-line growth and bottom-line targets for key portfolios",
        "Led agile transformation across diverse teams",
        "Partnered on strategic RFP & RFI responses contributing to business wins"
      ]
    },
    {
      company: "Tata Infotech Ltd.",
      role: "Senior Systems Engineer",
      period: "May 2000 - Oct 2003",
      location: "Mumbai / Singapore",
      achievements: [
        "Developed scalable enterprise solutions",
        "Contributed to system architecture and design",
        "Managed technical delivery and offshore coordination"
      ]
    }
  ];

  const awards = [
    { title: "Manager of the Quarter", year: "Q3 2021", icon: <EmojiEventsIcon /> },
    { title: "Project of the Year", year: "2013", icon: <StarIcon /> },
    { title: "Guiding Star", year: "Q4 2009", icon: <StarIcon /> }
  ];

  const certifications = [
    { name: "AWS Certified Solutions Architect - Associate", issuer: "Amazon Web Services", year: "Sep 2020" }
  ];

  const renderProfileHeader = () => (
    <Paper 
      elevation={6} 
      sx={{ 
        p: 4, 
        mb: 4, 
        background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }
      }}
    >
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <StyledAvatar>
            VB
          </StyledAvatar>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {profileData.name}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            {profileData.title}
          </Typography>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontStyle: 'italic' }}>
            {profileData.subtitle}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            {profileData.summary}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack spacing={1}>
            <ContactChip icon={<EmailIcon />} label={profileData.email} size="small" />
            <ContactChip icon={<PhoneIcon />} label={profileData.phone} size="small" />
            <ContactChip icon={<LocationOnIcon />} label={profileData.location} size="small" />
            <ContactChip icon={<CloudIcon />} label="AWS Certified" size="small" />
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderSkillsSection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Technical Expertise
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(skills).map(([category, skillList]) => (
          <Grid item xs={12} sm={6} md={3} key={category}>
            <SkillCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 40, height: 40 }}>
                    {category === 'tools' && <AssessmentIcon />}
                    {category === 'programming' && <CodeIcon />}
                    {category === 'databases' && <StorageIcon />}
                    {category === 'visualization' && <TrendingUpIcon />}
                  </Avatar>
                  <Typography variant="h6" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                    {category === 'visualization' ? 'Data Viz' : category}
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  {skillList.map((skill, idx) => (
                    <Box key={idx}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={500}>{skill.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{skill.years}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={skill.level}
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </SkillCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderAchievements = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Key Achievements
      </Typography>
      <Grid container spacing={3}>
        {achievements.map((achievement, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <SkillCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 48, height: 48 }}>
                    {achievement.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {achievement.title}
                    </Typography>
                    <Chip 
                      label={achievement.highlight} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {achievement.description}
                </Typography>
              </CardContent>
            </SkillCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderExperience = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
        Professional Journey
      </Typography>
      {workExperience.map((exp, index) => (
        <ExperienceCard key={index}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight={600} color="primary">
                  {exp.company}
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {exp.role}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Chip icon={<WorkIcon />} label={exp.period} size="small" />
                  <Chip icon={<LocationOnIcon />} label={exp.location} size="small" variant="outlined" />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="h2" sx={{ opacity: 0.1, fontWeight: 700, fontSize: '4rem' }}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>
              </Grid>
            </Grid>
            <List dense>
              {exp.achievements.map((achievement, idx) => (
                <ListItem key={idx} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={achievement}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </ExperienceCard>
      ))}
    </Box>
  );

  const renderAwardsAndCertifications = () => (
    <Grid container spacing={4} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ mr: 1, color: 'warning.main' }} />
            Awards & Recognition
          </Typography>
          <Stack spacing={2}>
            {awards.map((award, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: alpha('#f50057', 0.05), borderRadius: 2 }}>
                <AwardBadge badgeContent="★" color="warning">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    {award.icon}
                  </Avatar>
                </AwardBadge>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {award.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {award.year}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
            Certifications & Education
          </Typography>
          <Stack spacing={2}>
            {certifications.map((cert, index) => (
              <Box key={index} sx={{ p: 2, bgcolor: alpha('#2196f3', 0.05), borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {cert.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cert.issuer} • {cert.year}
                </Typography>
              </Box>
            ))}
            <Divider />
            <Box sx={{ p: 2, bgcolor: alpha('#2196f3', 0.05), borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                M. Tech, ESE
              </Typography>
              <Typography variant="body2" color="text.secondary">
                IIT Bombay • 1998-2000
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: alpha('#2196f3', 0.05), borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                B.E., Chemical Engineering
              </Typography>
              <Typography variant="body2" color="text.secondary">
                G.E.C Raipur • 1994-1998
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box id="summary" sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ 
            mb: 4,
            '& .MuiTab-root': {
              fontSize: '1.1rem',
              fontWeight: 600,
              minWidth: 200,
            }
          }}
          TabIndicatorProps={{
            sx: {
              height: 4,
              borderRadius: 2,
              background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }
          }}
        >
          <Tab label="Complete Profile" />
          <Tab label="Executive Summary" />
        </Tabs>

        {activeTab === 0 ? (
          <>
            {renderProfileHeader()}
            {renderAchievements()}
            {renderSkillsSection()}
            {renderExperience()}
            {renderAwardsAndCertifications()}
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                borderRadius: 3
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontStyle: 'italic',
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                {profileData.passion}
              </Typography>
            </Paper>
          </>
        ) : (
          <>
            {renderProfileHeader()}
            <Timeline position="alternate" sx={{ mt: 4 }}>
              {achievements.map((achievement, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: 'primary.main', p: 1 }}>
                      {achievement.icon}
                    </TimelineDot>
                    {index < achievements.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {achievement.title}
                      </Typography>
                      <Chip 
                        label={achievement.highlight} 
                        size="small" 
                        color="primary" 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2">
                        {achievement.description}
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ProfileSummary;