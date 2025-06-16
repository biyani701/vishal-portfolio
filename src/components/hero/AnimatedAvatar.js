import React from "react";
import { Avatar, Box, styled, useTheme, alpha } from "@mui/material";
import { useLayoutDimensions } from "../../hooks/useLayoutDimensions";
import PropTypes from "prop-types";

const AnimatedAvatar = styled(Avatar)(({ theme }) => {
  // Get layout dimensions - you'll need to pass these as props or use a different approach
  // Since styled components can't use hooks directly, we'll handle positioning in the parent component
  
  return {
    // Base avatar styles
    width: 120,
    height: 120,
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: `0 20px 60px rgba(0,0,0,0.3), 0 0 0 10px ${alpha(theme.palette.primary.main, 0.2)}`,
    transition: "all 0.3s ease",
    position: "relative",
    flexShrink: 0,

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

    // Responsive sizing
    // Very small mobile screens
    "@media (max-width: 375px)": {
      width: 70,
      height: 70,
      border: `3px solid ${theme.palette.primary.main}`,
    },

    // Small mobile portrait
    [theme.breakpoints.down("sm")]: {
      width: 80,
      height: 80,
    },

    // Mobile landscape - smaller and positioned for space efficiency
    "@media (max-height: 500px) and (orientation: landscape)": {
      width: 60,
      height: 60,
      border: `2px solid ${theme.palette.primary.main}`,
    },

    // Tablet and larger
    [theme.breakpoints.up("sm")]: {
      width: 120,
      height: 120,
    },
    [theme.breakpoints.up("md")]: {
      width: 140,
      height: 140,
    },
    [theme.breakpoints.up("lg")]: {
      width: 160,
      height: 160,
    },
  };
});

// Wrapper component that handles positioning
const AvatarWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  
  // Default positioning - centered
  width: "100%",
  
  // Small mobile portrait - centered below header
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  
  // Mobile landscape - align left to save space
  "@media (max-height: 500px) and (orientation: landscape)": {
    justifyContent: "flex-start",
    width: "auto",
    marginRight: theme.spacing(3),
    marginBottom: 0,
  },
  
  // Tablet and up - can be centered or customized
  [theme.breakpoints.up("sm")]: {
    justifyContent: "center",
    marginBottom: theme.spacing(3),
  },
}));

// Usage component that uses the layout dimensions
const ResponsiveAvatar = ({ src, alt, ...props }) => {
  const { 
    headerHeight, 
    safeAreaInsets, 
    spacing, 
    isSmallMobile,
    isPortrait,
    breakpoints 
  } = useLayoutDimensions();

  const getAvatarContainerStyles = () => {
    const baseStyles = {
      position: 'relative',
      zIndex: 1,
    };

    // Small mobile portrait - position below header, centered
    if (breakpoints.isMobile && isPortrait) {
      return {
        ...baseStyles,
        paddingTop: `calc(${headerHeight}px + ${safeAreaInsets.top || 0}px + ${spacing.md})`,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      };
    }

    // Mobile landscape - align left, minimal top spacing
    if (breakpoints.isMobile && !isPortrait) {
      return {
        ...baseStyles,
        paddingTop: `calc(${headerHeight}px + ${safeAreaInsets.top || 0}px + ${spacing.sm})`,
        display: 'flex',
        justifyContent: 'flex-start',
        paddingLeft: spacing.lg,
      };
    }
    if (breakpoints.isTablet) {
      return {
        ...baseStyles,
        // paddingTop: `calc(${headerHeight}px + ${safeAreaInsets.top || 0}px + ${spacing.md})`,
        // paddingTop: `calc(${headerHeight}px + ${spacing.md})`,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      };
    }

    // Tablet and desktop - centered with more spacing
    return {
      ...baseStyles,
      paddingTop: `calc(${headerHeight}px + ${safeAreaInsets.top || 0}px + ${spacing.xl})`,
      display: 'flex',
    //   justifyContent: 'center',
      width: '100%',
    };
  };

  return (
    <Box sx={getAvatarContainerStyles()}>
      <AnimatedAvatar src={src} alt={alt} {...props} />
    </Box>
  );
};

ResponsiveAvatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export { AnimatedAvatar, AvatarWrapper, ResponsiveAvatar };