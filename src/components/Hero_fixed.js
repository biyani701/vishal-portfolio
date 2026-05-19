// This is a corrected version of the Hero component with proper mobile landscape layout
// The key fixes are:
// 1. Fixed malformed JSX tag
// 2. Improved flexbox layout for mobile landscape
// 3. Better space distribution using flex-grow
// 4. Proper alignment to prevent content going under header

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  IconButton,
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
import { useLayoutDimensions } from "../hooks/useLayoutDimensions";
import {
  ResponsiveAvatar,
} from "./hero/AnimatedAvatar";

// Styled components with improved mobile landscape layout
const HeroContainer = styled(Box)(({ theme }) => ({
  // Use modern viewport units with fallbacks
  ...theme.viewport.helpers.fullHeight(),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  padding: theme.spacing(2, 1),
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, #2d1b69 50%, #1a1a1a 75%, #0f0f0f 100%)"
      : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #3b82f6 50%, #e2e8f0 75%, #f8fafc 100%)",
  backgroundSize: "400% 400%",
  animation: "gradientShift 30s ease infinite",
  color: theme.palette.text.primary,
  textAlign: "center",
  overflow: "hidden",

  // Enhanced mobile support with safe areas
  paddingTop: `max(${theme.spacing(2)}, env(safe-area-inset-top, 0px))`,
  paddingBottom: `max(${theme.spacing(2)}, env(safe-area-inset-bottom, 0px))`,
  paddingLeft: `max(${theme.spacing(1)}, env(safe-area-inset-left, 0px))`,
  paddingRight: `max(${theme.spacing(1)}, env(safe-area-inset-right, 0px))`,

  // Mobile portrait optimizations
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1, 0.5),
    minHeight:
      "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
    minHeight:
      "calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
  },

  // Very small mobile screens
  "@media (max-width: 375px)": {
    padding: theme.spacing(0.5, 0.25),
  },

  // Mobile landscape optimizations - FIXED
  "@media (max-height: 500px) and (orientation: landscape)": {
    minHeight: "100vh",
    minHeight: "100dvh", // Use dynamic viewport height
    padding: theme.spacing(0.5, 1),
    justifyContent: "flex-start",
    paddingTop: `calc(env(safe-area-inset-top, 0px) + ${theme.spacing(1)})`,
    paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + ${theme.spacing(1)})`,
    gap: theme.spacing(1),
  },

  "@keyframes gradientShift": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
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
  gap: theme.spacing(2),
  width: "100%",
  maxWidth: "100%",
  flex: "1 1 auto",
  minHeight: 0,

  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(2),
    padding: theme.spacing(0, 1),
  },

  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    textAlign: "left",
  },

  // Very small screens
  "@media (max-width: 375px)": {
    gap: theme.spacing(1.5),
    padding: theme.spacing(0, 0.5),
  },

  // Mobile landscape - FIXED
  "@media (max-height: 500px) and (orientation: landscape)": {
    gap: theme.spacing(1),
    padding: theme.spacing(0, 1),
    justifyContent: "flex-start",
    alignItems: "stretch",
    height: "100%",
  },
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(3),
  width: "100%",
  maxWidth: "100%",
  flex: "1 1 auto",
  minHeight: 0,

  // Mobile optimizations
  [theme.breakpoints.down("md")]: {
    gap: theme.spacing(2),
    padding: theme.spacing(1, 0),
    "& .MuiAvatar-root": {
      alignSelf: "center",
    },
  },

  // Very small screens
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1.5),
    padding: theme.spacing(0.5, 0),
  },

  // Mobile landscape - FIXED: proper flexbox layout
  "@media (max-height: 500px) and (orientation: landscape)": {
    flexDirection: "row",
    gap: theme.spacing(2),
    padding: theme.spacing(1, 1),
    alignItems: "flex-start", // Align to top to avoid going under header
    justifyContent: "flex-start",
    textAlign: "left",
    minHeight: "auto",
    flex: "1 1 auto",

    "& .MuiAvatar-root": {
      alignSelf: "flex-start",
      flexShrink: 0,
      marginTop: theme.spacing(1),
    },
  },

  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
    gap: theme.spacing(6),
    textAlign: "left",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
}));

const IntroSection = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  flex: "1 1 auto", // Allow the section to grow and take available space
  minWidth: 0, // Allow shrinking
  width: "100%", // Take full width in mobile portrait

  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1.5),
  },

  // Very small screens
  "@media (max-width: 375px)": {
    gap: theme.spacing(1),
  },

  // Mobile landscape - FIXED: proper flexbox layout
  "@media (max-height: 500px) and (orientation: landscape)": {
    gap: theme.spacing(1),
    alignItems: "flex-start",
    textAlign: "left",
    flex: "1 1 0", // Take equal space with avatar, allow shrinking to 0
    minWidth: 0, // Allow shrinking below content size
    width: "auto", // Let flexbox handle the width
    paddingLeft: theme.spacing(1), // Small padding from avatar
    
    // Ensure content doesn't overflow
    "& > *": {
      maxWidth: "100%",
      overflow: "hidden",
    },
  },

  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    flex: "1 1 0", // Take remaining space after avatar
    minWidth: 0,
  },
}));

// Continue with the Name component and other styled components...
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
  textAlign: "center",

  // Very small screens
  "@media (max-width: 375px)": {
    fontSize: "clamp(1.2rem, 6vw, 1.8rem)",
    letterSpacing: "0.5px",
  },

  // Mobile specific
  [theme.breakpoints.down("md")]: {
    fontSize: "clamp(1.5rem, 5.5vw, 2.5rem)",
    width: "100%",
    display: "block",
  },

  // Mobile landscape - smaller text and left align
  "@media (max-height: 500px) and (orientation: landscape)": {
    fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
    textAlign: "left",
  },

  [theme.breakpoints.up("md")]: {
    fontSize: "3.5rem",
    display: "inline-block",
    width: "auto",
    textAlign: "left",
  },
}));

export default function HeroFixed() {
  // Component implementation would continue here...
  // This is just showing the key structural fixes
  return (
    <HeroContainer>
      <ContentContainer maxWidth="lg">
        <ProfileSection>
          <ResponsiveAvatar
            src="/images/MakePassportPhoto.jpg"
            alt="Vishal Biyani"
          />
          <IntroSection>
            {/* FIXED: Proper conditional rendering with correct JSX */}
            <Box>
              <Typography variant="h6" sx={{ color: "text.secondary", mb: 0.5 }}>
                Hi, I'm
              </Typography>
              <Name variant="h1">Vishal Biyani</Name>
            </Box>
            {/* Rest of the content... */}
          </IntroSection>
        </ProfileSection>
      </ContentContainer>
    </HeroContainer>
  );
}
