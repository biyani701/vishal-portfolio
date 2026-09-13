import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Container,
  Fade,
  Zoom,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";

// Career data
const careerData = [
  {
    company: "Tata Infotech Ltd.",
    duration: "May 2000 – Oct 2003",
    title: "Senior Software Engineer",
    description: "Started career journey in software development",
    logoLight: "/images/tata-infotech-logo-light.png", // Logo for light mode
    logoDark: "/images/tata-infotech-logo-dark.png", // Logo for dark mode
  },
  {
    company: "Cognizant Technology Solutions",
    duration: "Oct 2003 – Sep 2019",
    title: "Delivery Lead",
    description: "Led multiple project teams and initiatives",
    logoLight: "/images/cognizant-logo-light.svg", // Logo for light mode
    logoDark: "/images/cognizant-logo-dark.png", // Logo for dark mode
  },
  {
    company: "CoreCard India Software",
    duration: "Nov 2019 – Present",
    title: "Principal Project Analyst",
    description: "Driving technical solutions and project analysis",
    logoLight: "/images/corecard-logo-light.png", // Logo for light mode
    logoDark: "/images/corecard-logo-dark.png", // Logo for dark mode
  },
];

export default function CareerTimeline() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const [activeIndex, setActiveIndex] = useState(null);
  const [animatedItems, setAnimatedItems] = useState([]);
  const [timelineVariant, setTimelineVariant] = useState("default"); // 'default', 'alternating', or 'zigzag'

  // Animation effect for staggered item appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAnimatedItems = [];
      const interval = setInterval(() => {
        if (newAnimatedItems.length < careerData.length) {
          newAnimatedItems.push(newAnimatedItems.length);
          setAnimatedItems([...newAnimatedItems]);
        } else {
          clearInterval(interval);
        }
      }, 300);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Renders horizontal timeline for desktop
  const HorizontalTimeline = () => (
    <Box
      sx={{
        position: "relative",
        py: 8,
        px: { xs: 2, md: 4 },
        overflow: "hidden",
      }}
    >
      {/* The horizontal line */}
      <Box
        sx={{
          position: "absolute",
          height: "4px",
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main || theme.palette.primary.light})`,
          top: "120px",
          left: "5%",
          right: "5%",
          zIndex: 1,
          borderRadius: "4px",
          boxShadow: `0 0 8px ${theme.palette.primary.main}`,
        }}
      />

      {/* Timeline items */}
      <Grid
        container
        spacing={isTablet ? 2 : 4}
        justifyContent="space-around"
        alignItems="flex-start"
      >
        {careerData.map((item, index) => (
          <Grid
            item
            key={index}
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              opacity: animatedItems.includes(index) ? 1 : 0,
              transform: animatedItems.includes(index)
                ? "translateY(0)"
                : "translateY(20px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
                width: "100%",
                maxWidth: 300,
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Timeline node with pulse animation */}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: theme.palette.primary.main,
                  borderRadius: "50%",
                  zIndex: 2,
                  mb: 2,
                  mt: 10,
                  position: "relative",
                  boxShadow: `0 0 0 4px ${theme.palette.background.paper}, 0 0 0 6px ${theme.palette.primary.main}30`,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    animation: "pulse 2s infinite",
                    backgroundColor: theme.palette.primary.main,
                    opacity: 0.6,
                    top: 0,
                    left: 0,
                    zIndex: -1,
                  },
                  "@keyframes pulse": {
                    "0%": {
                      transform: "scale(1)",
                      opacity: 0.6,
                    },
                    "70%": {
                      transform: "scale(2)",
                      opacity: 0,
                    },
                    "100%": {
                      transform: "scale(2.5)",
                      opacity: 0,
                    },
                  },
                }}
              />

              {/* Card */}
              <Paper
                elevation={activeIndex === index ? 8 : 3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  width: "100%",
                  textAlign: "center",
                  transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(45, 45, 45, 0.9)"
                      : "background.paper",
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "none",
                  position: "relative",
                  overflow: "hidden",
                  "&::before":
                    activeIndex === index
                      ? {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "4px",
                          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main || theme.palette.primary.light})`,
                        }
                      : {},
                }}
              >
                {/* Logo */}
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(30, 30, 30, 0.8)"
                        : "rgba(245, 245, 245, 0.8)",
                    borderRadius: "50%",
                    mx: "auto",
                    mb: 2,
                    p: 1.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    boxShadow: `0 4px 8px rgba(0,0,0,0.1)`,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {item.logoLight || item.logoDark ? (
                    <img
                      src={
                        theme.palette.mode === "dark"
                          ? item.logoDark
                          : item.logoLight
                      }
                      alt={`${item.company} logo`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter:
                          theme.palette.mode === "dark"
                            ? "brightness(1.2)"
                            : "none",
                      }}
                    />
                  ) : (
                    <WorkIcon
                      color="primary"
                      sx={{
                        fontSize: 36,
                        filter: `drop-shadow(0 2px 2px ${theme.palette.primary.main}40)`,
                      }}
                    />
                  )}
                </Box>

                {/* Content */}
                <Typography
                  variant="h6"
                  color="primary"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    textShadow:
                      theme.palette.mode === "dark"
                        ? "0 2px 4px rgba(0,0,0,0.5)"
                        : "none",
                  }}
                >
                  {item.company}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "text.primary",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 1.5,
                    fontStyle: "italic",
                  }}
                >
                  {item.duration}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.875rem",
                    opacity: 0.9,
                  }}
                >
                  {item.description}
                </Typography>
              </Paper>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Renders alternating vertical timeline (CodePen example 1)
  const AlternatingTimeline = () => (
    <Box
      sx={{
        position: "relative",
        py: 6,
        px: { xs: 2, sm: 3 },
        mx: "auto",
        maxWidth: 1000,
        "&::before": {
          content: '""',
          position: "absolute",
          width: "4px",
          background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main || theme.palette.primary.light})`,
          top: 0,
          bottom: 0,
          left: "50%",
          marginLeft: "-2px",
          borderRadius: "4px",
          zIndex: 1,
          display: { xs: "none", md: "block" },
        },
      }}
    >
      {careerData.map((item, index) => (
        <Box
          key={index}
          sx={{
            position: "relative",
            mb: 8,
            opacity: animatedItems.includes(index) ? 1 : 0,
            transform: animatedItems.includes(index)
              ? "translateY(0)"
              : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            "&::after": {
              content: '""',
              display: "table",
              clear: "both",
            },
            // Alternate left/right positioning for desktop
            "& .timeline-content": {
              position: "relative",
              width: { xs: "100%", md: "45%" },
              float: { md: index % 2 === 0 ? "left" : "right" },
              textAlign: { md: index % 2 === 0 ? "right" : "left" },
              pl: { md: index % 2 === 0 ? 0 : 3 },
              pr: { md: index % 2 === 0 ? 3 : 0 },
            },
            // Mobile is always left-aligned
            "& .timeline-mobile": {
              display: { xs: "block", md: "none" },
              position: "relative",
              pl: 4,
              "&::before": {
                content: '""',
                position: "absolute",
                width: "4px",
                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main || theme.palette.primary.light})`,
                top: 0,
                bottom: 0,
                left: "10px",
                borderRadius: "4px",
                zIndex: 1,
              },
            },
          }}
        >
          {/* Desktop timeline node */}
          <Box
            sx={{
              position: "absolute",
              width: 24,
              height: 24,
              bgcolor: theme.palette.primary.main,
              borderRadius: "50%",
              left: "calc(50% - 12px)",
              top: 20,
              zIndex: 2,
              boxShadow: `0 0 0 4px ${theme.palette.background.paper}, 0 0 0 6px ${theme.palette.primary.main}30`,
              display: { xs: "none", md: "block" },
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
                backgroundColor: theme.palette.primary.main,
                opacity: 0.6,
                top: 0,
                left: 0,
                zIndex: -1,
              },
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  opacity: 0.6,
                },
                "70%": {
                  transform: "scale(2)",
                  opacity: 0,
                },
                "100%": {
                  transform: "scale(2.5)",
                  opacity: 0,
                },
              },
            }}
          />

          {/* Desktop timeline content */}
          <Box className="timeline-content">
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 2,
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(45, 45, 45, 0.9)"
                    : "background.paper",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "none",
                // Arrow for desktop
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 20,
                  width: 0,
                  height: 0,
                  borderTop: "10px solid transparent",
                  borderBottom: "10px solid transparent",
                  ...(index % 2 === 0
                    ? {
                        right: "-10px",
                        borderLeft: `10px solid ${theme.palette.mode === "dark" ? "rgba(45, 45, 45, 0.9)" : theme.palette.background.paper}`,
                      }
                    : {
                        left: "-10px",
                        borderRight: `10px solid ${theme.palette.mode === "dark" ? "rgba(45, 45, 45, 0.9)" : theme.palette.background.paper}`,
                      }),
                  display: { xs: "none", md: "block" },
                },
              }}
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
                direction={index % 2 === 0 ? "row" : "row-reverse"}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Grid item xs={3}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 30, 30, 0.8)"
                          : "rgba(245, 245, 245, 0.8)",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1,
                      overflow: "hidden",
                      boxShadow: `0 4px 8px rgba(0,0,0,0.1)`,
                      border: `1px solid ${theme.palette.divider}`,
                      mx: "auto",
                    }}
                  >
                    {item.logoLight || item.logoDark ? (
                      <img
                        src={
                          theme.palette.mode === "dark"
                            ? item.logoDark
                            : item.logoLight
                        }
                        alt={`${item.company} logo`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          filter:
                            theme.palette.mode === "dark"
                              ? "brightness(1.2)"
                              : "none",
                        }}
                      />
                    ) : (
                      <WorkIcon
                        color="primary"
                        sx={{
                          fontSize: 30,
                          filter: `drop-shadow(0 2px 2px ${theme.palette.primary.main}40)`,
                        }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      textShadow:
                        theme.palette.mode === "dark"
                          ? "0 1px 2px rgba(0,0,0,0.5)"
                          : "none",
                      textAlign: { xs: "center", md: "inherit" },
                    }}
                  >
                    {item.company}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.9)"
                          : "text.primary",
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mb: 1,
                      fontStyle: "italic",
                    }}
                  >
                    {item.duration}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.875rem",
                      opacity: 0.9,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Mobile timeline view */}
          <Box className="timeline-mobile">
            {/* Mobile timeline node */}
            <Box
              sx={{
                position: "absolute",
                width: 20,
                height: 20,
                bgcolor: theme.palette.primary.main,
                borderRadius: "50%",
                left: 10,
                top: 24,
                zIndex: 2,
                transform: "translateX(-50%)",
                boxShadow: `0 0 0 4px ${theme.palette.background.paper}, 0 0 0 6px ${theme.palette.primary.main}30`,
              }}
            />

            <Paper
              elevation={4}
              sx={{
                p: 2,
                borderRadius: 2,
                ml: 2,
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(45, 45, 45, 0.9)"
                    : "background.paper",
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "none",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3} sm={2}>
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 30, 30, 0.8)"
                          : "rgba(245, 245, 245, 0.8)",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1,
                      overflow: "hidden",
                      boxShadow: `0 4px 8px rgba(0,0,0,0.1)`,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {item.logoLight || item.logoDark ? (
                      <img
                        src={
                          theme.palette.mode === "dark"
                            ? item.logoDark
                            : item.logoLight
                        }
                        alt={`${item.company} logo`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          filter:
                            theme.palette.mode === "dark"
                              ? "brightness(1.2)"
                              : "none",
                        }}
                      />
                    ) : (
                      <WorkIcon
                        color="primary"
                        sx={{
                          fontSize: 24,
                          filter: `drop-shadow(0 2px 2px ${theme.palette.primary.main}40)`,
                        }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={9} sm={10}>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      textShadow:
                        theme.palette.mode === "dark"
                          ? "0 1px 2px rgba(0,0,0,0.5)"
                          : "none",
                    }}
                  >
                    {item.company}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.9)"
                          : "text.primary",
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: "block",
                      mb: 0.5,
                      fontStyle: "italic",
                    }}
                  >
                    {item.duration}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      opacity: 0.9,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Box>
      ))}
    </Box>
  );

  // Renders zigzag horizontal timeline with ribbon effects (CodePen example 2)
  const ZigzagTimeline = () => (
    <Box
      sx={{
        position: "relative",
        py: 6,
        px: { xs: 2, sm: 3 },
        mx: "auto",
        maxWidth: 1200,
        overflow: "hidden",
        "--col-gap": "2rem",
        "--row-gap": "10rem",
        "--line-w": "0.25rem",
      }}
    >
      {/* Timeline list with ribbon effects */}
      <Box
        component="ul"
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "var(--line-w) 1fr",
            md: "1fr var(--line-w) 1fr",
          },
          gridAutoColumns: "max-content",
          columnGap: "var(--col-gap)",
          listStyle: "none",
          width: "min(60rem, 90%)",
          marginInline: "auto",
          // Line
          "&::before": {
            content: '""',
            gridColumn: { xs: 1, md: 2 },
            gridRow: "1 / span 20",
            background:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgb(225, 225, 225)",
            borderRadius: "calc(var(--line-w) / 2)",
          },
          // Row gaps
          "& li:not(:last-child)": {
            marginBottom: "var(--row-gap)",
          },
        }}
      >
        {/* Reverse the array to show most recent experience first */}
        {[...careerData].reverse().map((item, index) => {
          // Generate a unique accent color for each item
          const accentColors = [
            "#41516C",
            "#FBCA3E",
            "#E24A68",
            "#1B5F8C",
            "#4CADAD",
          ];
          const accentColor = accentColors[index % accentColors.length];

          return (
            <Box
              component="li"
              key={index}
              sx={{
                gridColumn: {
                  xs: 2,
                  md: index % 2 === 0 ? 3 : 1,
                },
                // Start second card
                // gridRow: {
                //   md: index === 1 ? "2/4" : "auto",
                // },
                "--inlineP": "1.5rem",
                marginInline: "var(--inlineP)",
                gridRow: "span 2",
                display: "grid",
                gridTemplateRows: "min-content min-content min-content",
                opacity: animatedItems.includes(index) ? 1 : 0,
                transform: animatedItems.includes(index)
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                // Define accent color as a custom property
                "--accent-color": accentColor,
              }}
            >
              {/* Date with ribbon effect */}
              <Box
                className="date"
                sx={{
                  "--dateH": "3rem",
                  height: "var(--dateH)",
                  marginInline: "calc(var(--inlineP) * -1)",
                  textAlign: "center",
                  backgroundColor: "var(--accent-color)",
                  color: "white",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  display: "grid",
                  placeContent: "center",
                  position: "relative",
                  borderRadius: {
                    xs: "calc(var(--dateH) / 2) 0 0 calc(var(--dateH) / 2)",
                    md:
                      index % 2 === 0
                        ? "calc(var(--dateH) / 2) 0 0 calc(var(--dateH) / 2)"
                        : "0 calc(var(--dateH) / 2) calc(var(--dateH) / 2) 0",
                  },
                  // Date flap (ribbon effect)
                  "&::before": {
                    content: '""',
                    width: "var(--inlineP)",
                    aspectRatio: 1,
                    background: "var(--accent-color)",
                    backgroundImage:
                      "linear-gradient(rgba(0, 0, 0, 0.2) 100%, transparent)",
                    position: "absolute",
                    top: "100%",
                    clipPath: {
                      xs: "polygon(0 0, 100% 0, 0 100%)",
                      md:
                        index % 2 === 0
                          ? "polygon(0 0, 100% 0, 100% 100%)" // Right side points to circle
                          : "polygon(0 0, 100% 0, 0 100%)", // Left side points to circle
                    },
                    right: { xs: 0, md: index % 2 === 0 ? 0 : "auto" },
                    left: { xs: "auto", md: index % 2 === 0 ? "auto" : 0 },
                  },
                  // Circle on timeline
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: "2rem",
                    aspectRatio: 1,
                    background: theme.palette.background.paper,
                    border: "0.3rem solid var(--accent-color)",
                    borderRadius: "50%",
                    top: "50%",
                    transform: {
                      xs: "translate(50%, -50%)",
                      md:
                        index % 2 === 0
                          ? "translate(50%, -50%)"
                          : "translate(-50%, -50%)",
                    },
                    // Position the circle directly on the timeline
                    right: {
                      xs: "calc(100% + var(--col-gap) + var(--line-w) / 2)",
                      md:
                        index % 2 === 0
                          ? "calc(100% + var(--col-gap))"
                          : "auto",
                    },
                    left: {
                      xs: "auto",
                      md:
                        index % 2 === 0
                          ? "auto"
                          : "calc(100% + var(--col-gap))",
                    },
                    zIndex: 1,
                    boxShadow: "0 0 0 4px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {item.duration.split(" – ")[0]}
              </Box>

              {/* Title with shadow effect */}
              <Box
                className="title"
                sx={{
                  background: theme.palette.background.paper,
                  position: "relative",
                  paddingInline: "1.5rem",
                  overflow: "hidden",
                  paddingBlockStart: "1.5rem",
                  paddingBlockEnd: "1rem",
                  fontWeight: 500,
                  // Shadow effect
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "90%",
                    height: "0.5rem",
                    background: "rgba(0, 0, 0, 0.5)",
                    left: "50%",
                    borderRadius: "50%",
                    filter: "blur(4px)",
                    transform: "translate(-50%, 50%)",
                    bottom: "calc(100% + 0.125rem)",
                    zIndex: -1,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* Logo */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(30, 30, 30, 0.8)"
                          : "rgba(245, 245, 245, 0.8)",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 0.5,
                      overflow: "hidden",
                      boxShadow: `0 4px 8px rgba(0,0,0,0.1)`,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {item.logoLight || item.logoDark ? (
                      <img
                        src={
                          theme.palette.mode === "dark"
                            ? item.logoDark
                            : item.logoLight
                        }
                        alt={`${item.company} logo`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          filter:
                            theme.palette.mode === "dark"
                              ? "brightness(1.2)"
                              : "none",
                        }}
                      />
                    ) : (
                      <WorkIcon
                        color="primary"
                        sx={{
                          fontSize: 24,
                          filter: `drop-shadow(0 2px 2px ${theme.palette.primary.main}40)`,
                        }}
                      />
                    )}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      color: "var(--accent-color)",
                      fontWeight: 600,
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    }}
                  >
                    {item.company}
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    mt: 1,
                  }}
                >
                  {item.title}
                </Typography>
              </Box>

              {/* Description with shadow effect */}
              <Box
                className="descr"
                sx={{
                  background: theme.palette.background.paper,
                  position: "relative",
                  paddingInline: "1.5rem",
                  paddingBlockEnd: "1.5rem",
                  fontWeight: 300,
                  // Shadow effect
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    width: "90%",
                    height: "0.5rem",
                    background: "rgba(0, 0, 0, 0.5)",
                    left: "50%",
                    borderRadius: "50%",
                    filter: "blur(4px)",
                    transform: "translate(-50%, 50%)",
                    bottom: "0.25rem",
                    zIndex: -1,
                  },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: "0.875rem",
                    opacity: 0.9,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );

  // Renders vertical timeline for mobile
  const VerticalTimeline = () => (
    <Box
      sx={{
        position: "relative",
        pl: { xs: 3, sm: 5 },
        pr: { xs: 1, sm: 2 },
        py: 4,
        mx: "auto",
        maxWidth: 600,
      }}
    >
      {/* Vertical line */}
      <Box
        sx={{
          position: "absolute",
          width: "4px",
          background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main || theme.palette.primary.light})`,
          top: 0,
          bottom: 0,
          left: { xs: "12px", sm: "20px" },
          zIndex: 1,
          borderRadius: "4px",
          boxShadow: `0 0 8px ${theme.palette.primary.main}`,
        }}
      />

      {/* Timeline items */}
      {careerData.map((item, index) => (
        <Box
          key={index}
          sx={{
            mb: 5,
            position: "relative",
            opacity: animatedItems.includes(index) ? 1 : 0,
            transform: animatedItems.includes(index)
              ? "translateX(0)"
              : "translateX(-20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Timeline node with pulse animation */}
          <Box
            sx={{
              position: "absolute",
              width: 20,
              height: 20,
              bgcolor: theme.palette.primary.main,
              borderRadius: "50%",
              left: { xs: -26, sm: -34 },
              top: 24,
              zIndex: 2,
              boxShadow: `0 0 0 4px ${theme.palette.background.paper}, 0 0 0 6px ${theme.palette.primary.main}30`,
              "&::after": {
                content: '""',
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
                backgroundColor: theme.palette.primary.main,
                opacity: 0.6,
                top: 0,
                left: 0,
                zIndex: -1,
              },
              "@keyframes pulse": {
                "0%": {
                  transform: "scale(1)",
                  opacity: 0.6,
                },
                "70%": {
                  transform: "scale(2)",
                  opacity: 0,
                },
                "100%": {
                  transform: "scale(2.5)",
                  opacity: 0,
                },
              },
            }}
          />

          {/* Card */}
          <Paper
            elevation={4}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              ml: 1,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(45, 45, 45, 0.9)"
                  : "background.paper",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "none",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "4px",
                height: "100%",
                background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main || theme.palette.primary.light})`,
              },
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Logo */}
              <Grid item xs={3} sm={2}>
                <Box
                  sx={{
                    width: { xs: 45, sm: 55 },
                    height: { xs: 45, sm: 55 },
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(30, 30, 30, 0.8)"
                        : "rgba(245, 245, 245, 0.8)",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1,
                    overflow: "hidden",
                    boxShadow: `0 4px 8px rgba(0,0,0,0.1)`,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {item.logoLight || item.logoDark ? (
                    <img
                      src={
                        theme.palette.mode === "dark"
                          ? item.logoDark
                          : item.logoLight
                      }
                      alt={`${item.company} logo`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter:
                          theme.palette.mode === "dark"
                            ? "brightness(1.2)"
                            : "none",
                      }}
                    />
                  ) : (
                    <WorkIcon
                      color="primary"
                      sx={{
                        fontSize: { xs: 24, sm: 30 },
                        filter: `drop-shadow(0 2px 2px ${theme.palette.primary.main}40)`,
                      }}
                    />
                  )}
                </Box>
              </Grid>

              {/* Content */}
              <Grid item xs={9} sm={10}>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    textShadow:
                      theme.palette.mode === "dark"
                        ? "0 1px 2px rgba(0,0,0,0.5)"
                        : "none",
                  }}
                >
                  {item.company}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.9)"
                        : "text.primary",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    display: "block",
                    mb: 0.5,
                    fontStyle: "italic",
                  }}
                >
                  {item.duration}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    opacity: 0.9,
                  }}
                >
                  {item.description}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ))}
    </Box>
  );

  // Render the appropriate timeline based on variant and screen size
  const renderTimeline = () => {
    if (isMobile) {
      return <VerticalTimeline />;
    }

    switch (timelineVariant) {
      case "alternating":
        return <AlternatingTimeline />;
      case "zigzag":
        return <ZigzagTimeline />;
      default:
        return <HorizontalTimeline />;
    }
  };

  return (
    <Box
      id="timeline"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, md: 6 },
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "center", sm: "flex-end" },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            position: "relative",
            display: "inline-block",
            mb: { xs: 3, sm: 0 },
            "&::after": {
              content: '""',
              position: "absolute",
              width: "60px",
              height: "4px",
              background: theme.palette.primary.main,
              bottom: "-10px",
              left: "calc(50% - 30px)",
              borderRadius: "2px",
            },
          }}
        >
          Career Timeline
        </Typography>

        {/* Timeline variant selector */}
        {!isMobile && (
          <ToggleButtonGroup
            value={timelineVariant}
            exclusive
            onChange={(_, newVariant) => {
              if (newVariant !== null) {
                setTimelineVariant(newVariant);
              }
            }}
            size="small"
            aria-label="timeline style"
            sx={{
              bgcolor: theme.palette.background.paper,
              boxShadow: 1,
              borderRadius: 1,
              "& .MuiToggleButton-root": {
                px: 1.5,
                py: 0.5,
              },
            }}
          >
            <ToggleButton value="default" aria-label="default timeline">
              <Tooltip title="Default Timeline">
                <ViewDayIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>

            <ToggleButton value="zigzag" aria-label="zigzag timeline">
              <Tooltip title="Zigzag Timeline">
                <ViewWeekIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>

            <ToggleButton value="alternating" aria-label="alternating timeline">
              <Tooltip title="Alternating Timeline">
                <ViewTimelineIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {/* Render the selected timeline */}
      {renderTimeline()}
    </Box>
  );
}
