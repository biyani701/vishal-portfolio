import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Link,
  Grid,
  Paper,
  Chip,
  useTheme,
  alpha,
  Fade,
  Grow,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Code as CodeIcon,
  EmojiObjects as LightbulbIcon,
  Layers as LayersIcon,
  Launch as ExternalLinkIcon,
  GitHub as GitHubIcon,
  AutoAwesome as SparklesIcon,
  Favorite as HeartIcon,
  EmojiEvents as AwardIcon,
} from '@mui/icons-material';

const creditsData = [
  {
    id: 1,
    icon: ArticleIcon,
    title: "Periodic Table Filter Logic",
    description: "The filter logic in my Periodic Table of Skills was inspired by Mads Stoumann's innovative approach to CSS-based periodic tables.",
    link: {
      url: "https://dev.to/madsstoumann/the-periodic-table-in-css-3lmm",
      text: "View Original Article"
    },
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "inspiration",
    categoryColor: "primary"
  },
  {
    id: 2,
    icon: CodeIcon,
    title: "Responsive Skill Icons",
    description: "The responsive icon system was adapted from Chris Benjamin's tutorial, reimagined for modern React architecture.",
    link: {
      url: "https://dev.to/chrisbenjamin/responsive-skill-icons-for-your-portfolio-tutorial-2270",
      text: "Read Tutorial"
    },
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    category: "tutorial",
    categoryColor: "secondary"
  },
  {
    id: 3,
    icon: LightbulbIcon,
    title: "AI-Powered Development",
    description: "This portfolio leverages cutting-edge AI tools for code generation, optimization, and user experience enhancement.",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    category: "tools",
    categoryColor: "info"
  },
  {
    id: 4,
    icon: LayersIcon,
    title: "Modern Tech Stack",
    description: "Built with React 19, styled using Material-UI v7, and deployed on GitHub Pages for optimal performance.",
    link: {
      url: "https://pages.github.com/",
      text: "Learn About GitHub Pages"
    },
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    category: "technology",
    categoryColor: "success"
  },
  {
    id: 5,
    icon: CodeIcon,
    title: "About Me",
    description: "This template was used as a reference for the design of the About Me section.",
    link: {
      url: "https://nicepage.com/html5-template/preview/resume-information-154529",
      text: "View Template"
    },
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    category: "inspiration",
    categoryColor: "secondary"
  }
];

const categoryIcons = {
  inspiration: SparklesIcon,
  tutorial: AwardIcon,
  tools: HeartIcon,
  technology: GitHubIcon
};

function Hero() {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 50%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        py: { xs: 8, md: 12 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite alternate',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box textAlign="center">
          <Fade in timeout={1000}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #fff 30%, rgba(255,255,255,0.8) 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Credits & Inspirations
            </Typography>
          </Fade>
          
          <Box
            sx={{
              width: 80,
              height: 4,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 100%)',
              mx: 'auto',
              mb: 3,
              borderRadius: 2
            }}
          />
          
          <Fade in timeout={1500}>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Acknowledging the brilliant minds, innovative ideas, and powerful tools that shaped this portfolio
            </Typography>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
}

function CreditCard({ credit, index }) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = credit.icon;
  const CategoryIcon = categoryIcons[credit.category];

  return (
    <Grow in timeout={500 + index * 200}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: '100%',          
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered 
            ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`
            : theme.shadows[2],
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: credit.gradient,
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease'
          }
        }}
      >
        {/* Category Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2
          }}
        >
          <Chip
            icon={<CategoryIcon sx={{ fontSize: 16 }} />}
            label={credit.category}
            size="small"
            color={credit.categoryColor || 'primary'}
            sx={{
              textTransform: 'capitalize',
              fontWeight: 500,
              opacity: isHovered ? 1 : 0.8,
              transition: 'opacity 0.3s ease'
            }}
          />
        </Box>

        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Icon and Title */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Paper
              elevation={isHovered ? 8 : 3}
              sx={{
                p: 1.5,
                mr: 2,
                background: credit.gradient,
                color: 'white',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                flexShrink: 0
              }}
            >
              <IconComponent sx={{ fontSize: 24 }} />
            </Paper>
            
            <Box sx={{ flex: 1, mt: 0.5 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.3,
                  minHeight: '3.2rem', // Ensures consistent title height
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {credit.title}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
              lineHeight: 1.6,
              flex: 1,
              minHeight: '4.8rem', // Ensures consistent description area
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {credit.description}
          </Typography>

          {/* Link Button */}
          {credit.link && (
            <Link
              href={credit.link.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
            >
              <Paper
                elevation={isHovered ? 4 : 1}
                sx={{
                  p: 1.5,
                  background: credit.gradient,
                  color: 'white',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {credit.link.text}
                </Typography>
                <ExternalLinkIcon sx={{ fontSize: 16 }} />
              </Paper>
            </Link>
          )}
        </CardContent>
      </Card>
    </Grow>
  );
}

function StatsSection() {
  const theme = useTheme();
  
  const stats = [
    { label: "Inspirations", value: "4", icon: SparklesIcon, color: "primary" },
    { label: "Technologies", value: "3+", icon: LayersIcon, color: "secondary" },
    { label: "AI Tools", value: "Multiple", icon: LightbulbIcon, color: "info" },
    { label: "Open Source", value: "100%", icon: HeartIcon, color: "success" }
  ];

  return (
    <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02), py: 8 }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Portfolio Stats
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A quick overview of what powers this portfolio
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Grid item xs={6} md={3} key={index}>
                <Grow in timeout={800 + index * 200}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        bgcolor: theme.palette[stat.color].main,
                        color: 'white',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <IconComponent sx={{ fontSize: 28 }} />
                    </Paper>
                    
                    <Typography variant="h4" component="div" fontWeight={700} color="primary" gutterBottom>
                      {stat.value}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                </Grow>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

function ThankYouSection() {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}
    >
      <Container maxWidth="md">
        <HeartIcon 
          sx={{ 
            fontSize: 48, 
            mb: 2, 
            color: 'rgba(255,255,255,0.9)',
            animation: 'pulse 2s ease-in-out infinite'
          }} 
        />
        
        <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
          Thank You!
        </Typography>
        
        <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
          Special thanks to the open-source community, content creators, and AI tools that make 
          modern web development an exciting journey of continuous learning and innovation.
        </Typography>
      </Container>
    </Box>
  );
}

export default function CreditsPage() {
  return (
    <Box>
      <Hero />
      
      {/* Main credits section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {creditsData.map((credit, index) => (
            <Grid item xs={12} md={6} xl={3} key={credit.id}>
              <CreditCard credit={credit} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
      
      <StatsSection />
      <ThankYouSection />
      
      {/* Add global styles for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </Box>
  );
}

CreditCard.propTypes = {
  credit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.shape({
      url: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
    color: PropTypes.string.isRequired,
    bgColor: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    gradient: PropTypes.string.isRequired,
    categoryColor: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};