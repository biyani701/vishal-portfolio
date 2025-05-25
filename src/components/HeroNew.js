import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  useTheme,
  Avatar,
  Chip,
  Stack,
  Grid,
  keyframes,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CodeIcon from "@mui/icons-material/Code";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { styled, alpha } from "@mui/material/styles";

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, #2d1b69 50%, #1a1a1a 75%, #0f0f0f 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #3b82f6 50%, #e2e8f0 75%, #f8fafc 100%)",
  backgroundSize: "400% 400%",
  animation: "gradientShift 15s ease infinite",
  color: theme.palette.text.primary,
  textAlign: "center",
  padding: theme.spacing(4, 2),
  overflow: "hidden",
  "@keyframes gradientShift": {
    "0%": {
      backgroundPosition: "0% 50%",
    },
    "50%": {
      backgroundPosition: "100% 50%",
    },
    "100%": {
      backgroundPosition: "0% 50%",
    },
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      theme.palette.mode === "dark"
        ? "radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)"
        : "radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
    zIndex: 0,
  },
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(4),
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(3),
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    gap: theme.spacing(6),
    textAlign: "left",
  },
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  width: 200,
  height: 200,
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: "all 0.3s ease",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    borderRadius: "50%",
    zIndex: -1,
    animation: "rotate 4s linear infinite",
  },
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: `0 30px 80px rgba(0,0,0,0.4), 0 0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
  [theme.breakpoints.up("md")]: {
    width: 250,
    height: 250,
  },
}));

const IntroSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  maxWidth: 600,
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
  },
}));

const Name = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: "1px",
  fontSize: "2.5rem",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(45deg, #60a5fa 30%, #a78bfa 90%)"
      : "linear-gradient(45deg, #1e40af 30%, #7c3aed 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow:
    theme.palette.mode === "dark" ? "0 0 30px rgba(96, 165, 250, 0.5)" : "none",
  [theme.breakpoints.up("md")]: {
    fontSize: "3.5rem",
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.2rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up("md")]: {
    fontSize: "1.5rem",
  },
}));

const Description = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    fontSize: "1.1rem",
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  fontWeight: 600,
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: "translateY(-2px)",
  },
  transition: "all 0.2s ease",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "50px",
  padding: "12px 32px",
  fontSize: "1rem",
  fontWeight: 700,
  textTransform: "none",
  boxShadow: theme.shadows[6],
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: theme.shadows[12],
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2, 3),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  minWidth: 120,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const ScrollDownButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: theme.spacing(4),
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  color: theme.palette.primary.main,
  width: 56,
  height: 56,
  transition: "all 0.3s ease",
  animation: "bounce 2s infinite",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: "translateY(-3px)",
  },
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateY(0)",
    },
    "40%": {
      transform: "translateY(-8px)",
    },
    "60%": {
      transform: "translateY(-4px)",
    },
  },
}));

const FloatingIcon = styled(Box)(({ theme }) => ({
  position: "absolute",
  color: alpha(theme.palette.primary.main, 0.3),
  animation: "float 6s ease-in-out infinite",
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-20px)",
    },
  },
}));

const TypewriterText = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (!isDeleting) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    textIndex,
    isDeleting,
    texts,
    speed,
    deleteSpeed,
    pauseTime,
  ]);

  return <span>{displayText}</span>;
};
TypewriterText.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  speed: PropTypes.number,
  deleteSpeed: PropTypes.number,
  pauseTime: PropTypes.number,
};

// New Addition
const TypewriterContainer = styled(Box)(({ theme, longestTextLength }) => ({
  display: "inline-block",
  minWidth: `${longestTextLength * 0.6}em`,
  textAlign: "left",
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    minWidth: "85vw",
    maxWidth: "85vw",
  },
}));

const BlinkingCursor = styled("span")(({ theme }) => ({
  animation: `${blinkAnimation} 1s infinite`,
  marginLeft: theme.spacing(0.25),
}));

const StyledTypewriterText = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (!isDeleting) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    textIndex,
    isDeleting,
    texts,
    speed,
    deleteSpeed,
    pauseTime,
  ]);

  const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b));
  
  return (
    <TypewriterContainer longestTextLength={longestText.length}>
      <span>{displayText}</span>
      <BlinkingCursor>|</BlinkingCursor>
    </TypewriterContainer>
  );
};

StyledTypewriterText.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  speed: PropTypes.number,
  deleteSpeed: PropTypes.number,
  pauseTime: PropTypes.number,
};

const blinkAnimation = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const TypewriterTextMUI = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    let timeout;

    if (!isDeleting) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, speed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    textIndex,
    isDeleting,
    texts,
    speed,
    deleteSpeed,
    pauseTime,
  ]);

  // Calculate minimum width based on longest text
  const longestText = texts.reduce((a, b) => (a.length > b.length ? a : b));

  return (
    <Box
      sx={{
        display: "inline-block",
        minWidth: {
          xs: "85vw", // Mobile: use most of screen width
          sm: `${longestText.length * 0.75}em`, // Desktop: character-based width
        },
        maxWidth: {
          xs: "85vw", // Mobile: prevent overflow
          sm: "none", // Desktop: no max width
        },
        textAlign: "left",
        position: "relative",
      }}
    >
      <span>{displayText}</span>
      <Box
        component="span"
        sx={{
          animation: `${blinkAnimation} 1s infinite`,
          marginLeft: "2px",
        }}
      >
        |
      </Box>
    </Box>
  );
};

TypewriterTextMUI.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  speed: PropTypes.number,
  deleteSpeed: PropTypes.number,
  pauseTime: PropTypes.number,
};
// End Addition
const Hero = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight =
        document.querySelector(".MuiAppBar-root")?.offsetHeight || 0;
      const sectionTop = section.offsetTop;

      window.scrollTo({
        top: sectionTop - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  const skills = ["Python", "React.js", "AWS", "Agile", "SQL", "Plotly"];
  const typewriterTexts = [
    "Technical Program Manager",
    "Full Stack Developer",
    "Agile Coach",
    "Data Visualization Expert",
  ];

  return (
    <HeroContainer>
      {/* Floating background icons */}
      <FloatingIcon sx={{ top: "15%", left: "10%", animationDelay: "0s" }}>
        <ManageAccountsIcon sx={{ fontSize: 40 }} />
      </FloatingIcon>
      <FloatingIcon sx={{ top: "25%", right: "15%", animationDelay: "2s" }}>
        <CodeIcon sx={{ fontSize: 35 }} />
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: "25%", left: "8%", animationDelay: "4s" }}>
        <TrendingUpIcon sx={{ fontSize: 38 }} />
      </FloatingIcon>

      <ContentContainer maxWidth="lg">
        <ProfileSection>
          <AnimatedAvatar src="/images/DSC_0694.jpg" alt="Vishal Biyani" />

          <IntroSection>
            <Box>
              <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
                Hi, I&apos;m
              </Typography>
              <Name variant="h1">Vishal Biyani</Name>
              {/* <Title variant="h2">
                <TypewriterText texts={typewriterTexts} />
              </Title> */}
              
<Typography variant="h2">
  <TypewriterTextMUI texts={typewriterTexts} />
</Typography>
              <Description>
                25+ years of experience driving complex software initiatives,
                leading distributed teams, and delivering transformative
                business outcomes across payments, banking, and enterprise
                solutions.
              </Description>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              {skills.map((skill) => (
                <SkillChip key={skill} label={skill} size="small" />
              ))}
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <ActionButton
                variant="contained"
                onClick={() => navigate("/contact")}
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: "white",
                }}
              >
                Let&apos;s Connect
              </ActionButton>
              <ActionButton
                variant="outlined"
                onClick={() => scrollToSection("summary")}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                View My Work
              </ActionButton>
            </Stack>
          </IntroSection>
        </ProfileSection>

        {/* Stats Section */}
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <StatCard>
              <Typography variant="h4" fontWeight="bold" color="primary">
                25+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Years Experience
              </Typography>
            </StatCard>
          </Grid>
          <Grid item>
            <StatCard>
              <Typography variant="h4" fontWeight="bold" color="primary">
                150+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team Members Coached
              </Typography>
            </StatCard>
          </Grid>
          <Grid item>
            <StatCard>
              <Typography variant="h4" fontWeight="bold" color="primary">
                50+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Applications Managed
              </Typography>
            </StatCard>
          </Grid>
        </Grid>
      </ContentContainer>

      <ScrollDownButton
        onClick={() => scrollToSection("summary")}
        aria-label="scroll down"
      >
        <KeyboardArrowDownIcon sx={{ fontSize: 28 }} />
      </ScrollDownButton>
    </HeroContainer>
  );
};

export default Hero;
