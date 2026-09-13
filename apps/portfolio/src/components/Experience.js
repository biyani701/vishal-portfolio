import React from 'react';
import { 
  Timeline, 
  TimelineItem, 
  TimelineSeparator, 
  TimelineConnector, 
  TimelineContent, 
  TimelineDot, 
  TimelineOppositeContent 
} from '@mui/lab';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import BusinessIcon from '@mui/icons-material/Business';

const ExperienceTimeline = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = React.useState(false);
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const experiences = [
    {
      company: "CoreCard Software India Pvt. Ltd",
      period: "Nov 2019 – Present",
      title: "Principal Project Analyst",
      location: "Mumbai",
      responsibilities: [
        "Led Agile PMO, mentored 150+ members, aligned product delivery with client goals.",
        "Owned delivery for key accounts like Cookie & Jazz projects.",
        "Improved operational efficiency, established release best practices."
      ]
    },
    {
      company: "Cognizant Technology Solutions India Pvt. Ltd",
      period: "Oct 2003 – Sep 2019",
      title: "Delivery Lead",
      location: "Multiple Locations",
      subExperiences: [
        {
          client: "BFS UK Accounts",
          period: "Dec 2014 - Sep 2019",
          title: "Delivery Lead",
          achievements: [
            "Multi-Client Delivery Leadership: Directed scope, timelines, and deliverables for eight UK banking clients, managing both Time & Material and Fixed Price engagements.",
            "Portfolio Profitability Management: Oversaw P&L performance for key portfolios, consistently achieving top-line growth and bottom-line targets.",
            "Cross-Functional Dependency Management: Led resolution of cross-team dependencies and proactively removed blockers to maintain project momentum.",
            "Process Optimization & Resource Efficiency: Drove continuous process improvements, enhancing resource utilization and streamlining delivery pipelines.",
            "Agile Transformation: Championed agile adoption across diverse teams, fostering a culture of iterative delivery and continuous improvement.",
            "Strategic RFP & RFI Collaboration: Partnered with cross-functional teams to craft compelling, data-driven responses, contributing to new business wins."
          ]
        },
        {
          client: "International Finance Corporation, World Bank Group",
          period: "Nov 2012 - Dec 2014",
          title: "Senior Manager",
          achievements: [
            "Managed a suite of 50+ applications and led a team of 24 onsite and 26 offshore resources.",
            "Transformed unstructured processes to structured processes, improving operational efficiency.",
            "Created reporting dashboards using Tableau with data source as BMC Remedy.",
            "Successfully managed development and releases for 50+ applications.",
            "Directed production support activities, incident management, work prioritization, and root cause analysis."
          ]
        },
        {
          client: "JP Morgan Chase",
          period: "Oct 2003 - Nov 2012",
          title: "Technical Project Manager",
          achievements: [
            "Re-architected applications to be horizontally scalable, quadrupling system throughput and improving stability.",
            "Proposed and led 10+ initiatives to automate manual work, reducing cost and increasing productivity.",
            "Managed project and technical delivery, leading developer teams across onsite & offshore locations."
          ]
        }
      ]
    },
    {
      company: "Tata Infotech Ltd",
      period: "2000 – 2003",
      title: "Senior Software Engineer",
      location: "Mumbai, Singapore",
      responsibilities: []
    }
  ];

  return (
    <section id="experience" className="py-5">
      <Box sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[50],
        borderRadius: 2,
        p: 4
      }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Professional Experience
        </Typography>
        
        <Timeline position={isMobile ? "right" : "alternate"} sx={{ p: 0 }}>
          {experiences.map((exp, index) => (
            <TimelineItem key={index}>
              {!isMobile && (
                <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                  <Typography variant="h6" component="span" color="primary">
                    {exp.period}
                  </Typography>
                </TimelineOppositeContent>
              )}
              
              <TimelineSeparator>
                <TimelineDot color="primary" variant="outlined">
                  <WorkIcon />
                </TimelineDot>
                {index < experiences.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper elevation={3} sx={{ 
                  p: 3, 
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.paper
                }}>
                  {isMobile && (
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      {exp.period}
                    </Typography>
                  )}
                  
                  <Typography variant="h6" component="h3" gutterBottom>
                    {exp.company}
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ fontStyle: 'italic', mb: 1 }}>
                    {exp.title} {exp.location && `– ${exp.location}`}
                  </Typography>
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <List dense sx={{ pl: 1 }}>
                      {exp.responsibilities.map((resp, idx) => (
                        <ListItem key={idx} sx={{ p: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <ArrowRightIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={resp} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  
                  {exp.subExperiences && exp.subExperiences.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      {exp.subExperiences.map((subExp, idx) => (
                        <Accordion 
                          key={idx} 
                          expanded={expanded === `panel-${idx}`} 
                          onChange={handleChange(`panel-${idx}`)}
                          sx={{ 
                            mb: 2, 
                            boxShadow: expanded === `panel-${idx}` ? 3 : 1,
                            '&:before': { display: 'none' },
                            backgroundColor: theme.palette.mode === 'dark' 
                              ? theme.palette.grey[900] 
                              : theme.palette.grey[50]
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ 
                              flexDirection: 'row',
                              '& .MuiAccordionSummary-content': { 
                                flexDirection: isMobile ? 'column' : 'row',
                                justifyContent: 'space-between',
                                alignItems: isMobile ? 'flex-start' : 'center',
                                gap: 1
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BusinessIcon color="primary" fontSize="small" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  {subExp.client}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {subExp.period}
                              </Typography>
                            </Box>
                            
                            <Chip 
                              label={subExp.title} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </AccordionSummary>
                          <AccordionDetails>
                            <List dense sx={{ pl: 1, pt: 0 }}>
                              {subExp.achievements.map((achievement, aIdx) => (
                                <ListItem key={aIdx} sx={{ p: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 28 }}>
                                    <ArrowRightIcon color="primary" fontSize="small" />
                                  </ListItemIcon>
                                  <ListItemText primary={achievement} />
                                </ListItem>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    </section>
  );
};

export default ExperienceTimeline;