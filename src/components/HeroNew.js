import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  IconButton,
  Avatar,
  Chip,
  Stack,
  Grid,
  keyframes,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CodeIcon from "@mui/icons-material/Code";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { styled, alpha } from "@mui/material/styles";

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  paddingTop: theme.spacing(8), // Standard top padding
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(4),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, #2d1b69 50%, #1a1a1a 75%, #0f0f0f 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #3b82f6 50%, #e2e8f0 75%, #f8fafc 100%)",
  backgroundSize: "400% 400%",
  animation: "gradientShift 15s ease infinite",
  color: theme.palette.text.primary,
  textAlign: "center",
  overflow: "hidden",
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(6),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
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
  justifyContent: "center",
  gap: theme.spacing(3),
  minHeight: "50vh", // Optional: gives some minimum height to work with
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    gap: theme.spacing(6),
    textAlign: "left",
    justifyContent: "flex-start", // Reset for desktop
  },
}));

const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: "all 0.3s ease",
  position: "relative",
  marginBottom: theme.spacing(2),

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
  [theme.breakpoints.down("sm")]: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing(1),
  },
  [theme.breakpoints.up("sm")]: {
    width: 140,
    height: 140,
  },
  [theme.breakpoints.up("md")]: {
    width: 180,
    height: 180,
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
  fontSize: "2rem",
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(45deg, #60a5fa 30%, #a78bfa 90%)"
      : "linear-gradient(45deg, #1e40af 30%, #7c3aed 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textShadow:
    theme.palette.mode === "dark" ? "0 0 30px rgba(96, 165, 250, 0.5)" : "none",
  // Mobile specific
  [theme.breakpoints.down("md")]: {
    fontSize: "clamp(1.5rem, 5.5vw, 2.5rem)", // Responsive sizing
    width: "100%",
    display: "block",
  },

  [theme.breakpoints.up("md")]: {
    fontSize: "3.5rem",
    display: "inline-block",
    width: "auto",
  },
}));



const Description = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "center" && prop !== "highlight",
})(({ theme, center, highlight }) => ({
  color: highlight ? theme.palette.primary.main : theme.palette.text.secondary,
  textAlign: center ? "center" : "justify",
  lineHeight: 1.2,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.up("md")]: {
    fontSize: "1.0rem",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
    lineHeight: 1.0,
    marginBottom: theme.spacing(1),
    width: "100%",
    display: "block",
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
  whiteSpace: "nowrap",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: theme.shadows[12],
  },
  // Mobile optimizations
  [theme.breakpoints.down("md")]: {
    padding: "10px 20px",
    fontSize: "0.875rem",
    borderRadius: "25px", // Slightly less rounded on mobile
    minWidth: "120px", // Minimum width to prevent too narrow buttons
    maxWidth: "90vw", // Prevent overflow on very small screens
  },

  // Very small screens
  [theme.breakpoints.down("sm")]: {
    padding: "8px 16px",
    fontSize: "0.8rem",
    minWidth: "100px",
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  // padding: theme.spacing(2, 3),
  padding: theme.spacing(3, 2),
  textAlign: "center",
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  minHeight: "120px",
  minWidth: 125,
  width: "100%",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  // Mobile adjustments
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2, 1.5),
    minHeight: "100px", // Slightly smaller on mobile
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
          // xs: "85vw",
          xs: "100vw",
          sm: "none", // Desktop: no max width
        },
        textAlign: "left",
        position: "relative",
        whiteSpace: "nowrap",
        overflow: "hidden",
        px: { xs: 1, sm: 0 }, // Small horizontal padding on mobile
        fontSize: {
          xs: "clamp(1rem, 4vw, 1.8rem)", // Responsive font that scales with viewport
          sm: "inherit",
        },
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

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

  const skills = [
    "Python",
    "Plotly Dash",
    "SQL",
    "Agile",
    "Jira",
    "Confluence",
  ];
  const typewriterTexts = [
    "Technical Program Manager",
    "Full Stack Developer",
    "Agile Coach",
    "Data Visualization Expert",
  ];

  return (
    <HeroContainer>
      {/* Floating background icons */}
      <FloatingIcon
        sx={{
          top: { xs: 20, sm: 40 },
          left: { xs: 20, sm: 40 },
          animationDelay: "2s",
        }}
      >
        <ManageAccountsIcon sx={{ fontSize: { xs: 28, sm: 36, md: 40 } }} />
      </FloatingIcon>

      <FloatingIcon
        sx={{
          top: { xs: 20, sm: 40 },
          right: { xs: 20, sm: 40 },
          animationDelay: "2s",
        }}
      >
        <CodeIcon sx={{ fontSize: { xs: 28, sm: 36, md: 40 } }} />
      </FloatingIcon>

      <FloatingIcon
        sx={{
          bottom: { xs: 120, sm: 140 },
          left: { xs: 20, sm: 40 },
          animationDelay: "4s",
        }}
      >
        <TipsAndUpdatesIcon sx={{ fontSize: { xs: 28, sm: 36, md: 40 } }} />
      </FloatingIcon>

      <FloatingIcon
        sx={{
          bottom: { xs: 120, sm: 140 },
          right: { xs: 20, sm: 40 },
          animationDelay: "4s",
        }}
      >
        <TrendingUpIcon sx={{ fontSize: { xs: 28, sm: 36, md: 40 } }} />
      </FloatingIcon>

      <ContentContainer maxWidth="lg">
        <ProfileSection>
          <AnimatedAvatar
            src="/images/DSC_0694.jpg"
            alt="Vishal Biyani"
          />
          <IntroSection>
            <Box>
              <Typography variant="h6" sx={{ color: "text.secondary", mb: 0.5 }}>
                Hi, I&apos;m
              </Typography>
              <Name variant="h1">Vishal Biyani</Name>

              <Typography variant="h2">
                <TypewriterTextMUI texts={typewriterTexts} />
              </Typography>
              <Description>
                {isSmallScreen
                  ? "Seasoned software executive with 25+ years in fintech, banking, and enterprise delivery."
                  : "25+ years of experience driving complex software initiatives, leading distributed teams, and delivering transformative business outcomes across payments, banking, and enterprise solutions."}
              </Description>
            </Box>
            {!isMobile && (
              <Box
                spacing={{ xs: 0.5, sm: 2 }}
                sx={{
                  display: "grid",

                  gap: 1,
                  mb: 2,
                  gridTemplateColumns: {
                    xs: "repeat(4, 1fr)", // 3 columns on mobile
                    md: "repeat(8, 1fr)", // 6 columns on medium and up
                  },
                  justifyItems: "center", // Center chips in cells
                }}
              >
                {skills.map((skill) => (
                  <SkillChip key={skill} label={skill} size="small" />
                ))}
              </Box>
            )}

            <Stack direction="row" spacing={2.5} sx={{ mb: 1 }}>
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
        {!isSmallScreen && (
          <Grid
            container
            spacing={{ xs: 1, sm: 2 }}
            justifyContent="center"
            sx={{
              mt: 1,
              maxWidth: { xs: "100%", sm: "600px" },
              mx: "auto",
            }}
          >
            {[
              { number: "25+", text: "Years Experience" },
              { number: "150+", text: "Team Members Coached" },
              { number: "50+", text: "Applications Managed" },
            ].map((stat, index) => (
              <React.Fragment key={index}>
                {isMobile ? (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1,
                      py: 0.5,
                      borderRadius: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "background.paper",
                      minWidth: "fit-content",
                      maxWidth: { xs: "32%", sm: "auto" },
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      color="primary.main"
                      sx={{
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.65rem",
                        lineHeight: 1.1,
                        textAlign: "center",
                      }}
                    >
                      {stat.text}
                    </Typography>
                  </Paper>
                ) : (
                  <Grid item xs={6} sm={6} md={4} lg={3}>
                    <StatCard>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="primary"
                        sx={{
                          fontSize: {
                            xs: "clamp(0.9rem, 2.5vw, 1.25rem)",
                            sm: "1.25rem",
                            md: "1.5rem",
                          },
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: {
                            xs: "clamp(0.65rem, 2.5vw, 0.75rem)",
                            sm: "0.75rem",
                          },
                          lineHeight: 1.0,
                          mt: 0.2,
                          textAlign: "center",
                        }}
                      >
                        {stat.text}
                      </Typography>
                    </StatCard>
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
        )}
      </ContentContainer>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: { xs: 4, sm: 6 },
        }}
      >
        <ScrollDownButton
          onClick={() => scrollToSection("summary")}
          aria-label="scroll down"
        >
          <KeyboardArrowDownIcon sx={{ fontSize: 32 }} />
        </ScrollDownButton>
      </Box>
    </HeroContainer>
  );
};

export default Hero;
