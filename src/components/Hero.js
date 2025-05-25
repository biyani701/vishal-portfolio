import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, IconButton, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';


// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  backgroundImage: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #121212 0%, #1E1E1E 50%, #2C2C2C 100%)'
    : 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 50%, #F5F5F5 100%)',
  color: theme.palette.text.primary,
  textAlign: 'center',
  padding: theme.spacing(2),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? 'radial-gradient(circle at center, rgba(144, 202, 249, 0.1) 0%, transparent 70%)'
      : 'radial-gradient(circle at center, rgba(74, 74, 74, 0.05) 0%, transparent 70%)',
    zIndex: 0,
  },
}));

const ScrollDownButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(8),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
  }),
  animation: 'bounce 2s infinite',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: 'translateY(5px)',
  },
  '@keyframes bounce': {
    '0%, 20%, 50%, 80%, 100%': {
      transform: 'translateY(0)',
    },
    '40%': {
      transform: 'translateY(-10px)',
    },
    '60%': {
      transform: 'translateY(-5px)',
    },
  },
}));

const Name = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '2px',
  marginBottom: theme.spacing(1),
  fontSize: '3.5rem',
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(45deg, #90CAF9 30%, #3949AB 90%)'
    : 'linear-gradient(45deg, #4A4A4A 30%, #1A1A1A 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  marginBottom: theme.spacing(4),
  fontSize: '1.5rem',
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  },
}));

const ContactButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '10px 25px',
  fontSize: '1rem',
  fontWeight: 600,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[4],
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[8],
    backgroundColor: theme.palette.primary.dark,
  },
}));



// New styled component for catchline items
// const CatchlineItem = styled(Box)(({ theme }) => ({

//   padding: theme.spacing(2),
//   backgroundColor: 'rgba(255, 255, 255, 0.15)',
//   backdropFilter: 'blur(5px)',
//   color: '#ffffff',
//   borderRadius: '8px',
//   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//   maxWidth: '250px',
//   width: 350,
//   height: 120,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   textAlign: 'center',
//   transition: 'all 0.3s ease',
//   border: '4px solid rgba(255, 255, 255, 0.7)',
//   position: 'absolute',
//   zIndex: 10,
//   '&:hover': {
//     transform: 'scale(1.05)',
//     boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
//     backgroundColor: 'rgba(255, 255, 255, 0.25)',
//   },
//   [theme.breakpoints.down('sm')]: {
//     width: 140,
//     height: 100,
//     padding: theme.spacing(1),
//   },
// }));

// const CatchlineText = styled(Typography)(({ theme }) => ({
//   fontWeight: 600,
//   fontSize: '0.95rem',
//   textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
//   lineHeight: 1.4,
//   [theme.breakpoints.down('sm')]: {
//     fontSize: '0.8rem',
//   },
// }));


const HeroRef = () => {
  // const [ref, shouldAnimate] = useAnimateOnScroll();
  const navigate = useNavigate();
  const theme = useTheme();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = document.querySelector('.MuiAppBar-root')?.offsetHeight || 0;
      const sectionTop = section.offsetTop;

      window.scrollTo({
        top: sectionTop - navbarHeight,
        behavior: 'smooth'
      });
    }
  };

  // Catchline data
  // const catchlines = [
  //   "Experienced Technical Program Manager, Delivery Manager, Agilist",
  //   "Domain knowledge in Payments & Cards, Market Reference Data",
  //   "Developed visual dashboard using Python, Plotly Dash for data analysis",
  //   "Vibe coding using React.js"
  // ];

  return (
    <HeroContainer>

      <Container maxWidth="md">
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Name variant="h1" data-aos="fade-down" data-aos-duration="1000">
            Hi<br></br>
            I&apos;m Vishal Biyani
          </Name>
          <Title variant="h2" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200">
            Technical Program Manager & Full Stack Developer
          </Title>
          <Box sx={{ mt: 4 }} data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
            <ContactButton
              variant="contained"
              onClick={() => navigate('/contact')}
              sx={{
                mr: 2,
                mb: { xs: 2, sm: 0 },
              }}
            >
              Contact Me
            </ContactButton>
            <ContactButton
              variant="outlined"
              onClick={() => scrollToSection('summary')}
              sx={{
                // In dark mode, use filled style; in light mode, use outlined style
                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'transparent',
                borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.primary.main,
                // Invert text colors based on mode
                color: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.text.primary, 0.8)  // Slightly transparent version of text.primary
                    : alpha(theme.palette.primary.main, 0.1), // Slightly visible primary color
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.primary.main,
                },
              }}
            >
              Learn More
            </ContactButton>
          </Box>
        </Box>
      </Container>

      <ScrollDownButton
        onClick={() => scrollToSection('summary')}
        aria-label="scroll down"
      >
        <KeyboardArrowDownIcon />
      </ScrollDownButton>
    </HeroContainer>
  );
};

export default HeroRef;