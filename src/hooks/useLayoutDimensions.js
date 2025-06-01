// hooks/useLayoutDimensions.js
import React, { useState, useEffect, useMemo } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Custom hook to get responsive layout dimensions
 * @returns {Object} Object containing header height, footer height, and content height calculations
 */

const isIPhoneXSize = (width, height) => {
  const knownDimensions = [
    [375, 812], // iPhone X, XS, 12 Mini
    [414, 896], // iPhone XR, 11
  ];

  return knownDimensions.some(
    ([w, h]) => (width === w && height === h) || (width === h && height === w)
  );
};

export const useLayoutDimensions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [isIPhoneXOrSimilar, setIsIPhoneXOrSimilar] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const getDynamicHeight = (type) => {
    const layout = theme.customLayout[`${type}Height`];

    if (!layout) return 56;

    const portraitKey = (() => {
      if (isMobile) return "mobile";
      if (isTablet) return "tablet";
      return "md";
    })();

    const landscapeKey = (() => {
      if (isMobile) return "mobileLandscape";
      if (isTablet) return "tabletLandscape";
      return "md";
    })();

    return isPortrait
      ? (layout[portraitKey] ?? layout.md)
      : (layout[landscapeKey] ?? layout[portraitKey] ?? layout.md);
  };

  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 0, height: 0 };
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });
      setIsIPhoneXOrSimilar(isIPhoneXSize(width, height));
      setIsPortrait(height >= width);

      // Safe area insets using CSS env variables
      const computed = getComputedStyle(document.documentElement);
      const getInset = (prop) => {
        const val =
          computed.getPropertyValue(`env(safe-area-inset-${prop})`) || "0px";
        return parseInt(val) || 0;
      };

      setSafeAreaInsets({
        top: getInset("top"),
        bottom: getInset("bottom"),
        left: getInset("left"),
        right: getInset("right"),
      });
    };

    // Initial calculation
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Cleanup
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Get responsive heights - with fallback values
  const headerHeight = useMemo(
    () => getDynamicHeight("header"),
    [theme, isMobile, isTablet, isPortrait]
  );

  const footerHeight = useMemo(
    () => getDynamicHeight("footer"),
    [theme, isMobile, isTablet, isPortrait]
  );

  const { width, height } = windowSize;

  // Calculate content area height
  const contentHeight = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
  const contentHeightWithPadding = `calc(100vh - ${headerHeight}px - ${footerHeight}px - 2rem)`;

  // Get spacing values for consistent padding
  const spacing = {
    xs: theme.spacing(1), // 8px
    sm: theme.spacing(2), // 16px
    md: theme.spacing(3), // 24px
    lg: theme.spacing(4), // 32px
    xl: theme.spacing(6), // 48px
  };

  const sideOffset = isPortrait ? (isMobile ? 54 : 120) : 54;
  const topOffset = headerHeight + (isPortrait ? 54 : 120);
  const bottomOffset = footerHeight + (isPortrait ? 54 : 120);
  const verticalOffset = `calc(${topOffset}px + ${bottomOffset}px)`;

  const safeOffsets = {
    top: `calc(${headerHeight}px + ${safeAreaInsets.top}px + ${theme.spacing(2)})`,
    bottom: `calc(${footerHeight}px + ${safeAreaInsets.bottom}px + ${theme.spacing(2)})`,
    left: `calc(${safeAreaInsets.left}px + ${theme.spacing(2)})`,
    right: `calc(${safeAreaInsets.right}px + ${theme.spacing(2)})`,
    sideOffset,
    topOffset,
    bottomOffset,
    verticalOffset,
  };

  const isTallScreen = height > 900;
  const isIPhoneSE = width === 375 && height === 667;

  // Small screen detection logic
  const isSmallScreen = (() => {
    // Very small devices (iPhone SE and similar)
    if (height < 600) return true;

    // Small portrait screens
    if (isPortrait && height < 700 && isMobile) return true;

    // Small landscape screens
    if (!isPortrait && height < 500) return true;

    // iPhone SE specifically
    if (isIPhoneSE) return true;

    return false;
  })();

  return {
    headerHeight,
    footerHeight,
    contentHeight,
    contentHeightWithPadding,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isIPhoneXOrSimilar,
    isPortrait,
    isSmallScreen,
    spacing,
    safeAreaInsets,
    safeOffsets,
    isTallScreen,
    isIPhoneSE,
    windowSize,

    // Helper functions
    getContentHeightWithOffset: (offset = 0) =>
      `calc(100vh - ${headerHeight}px - ${footerHeight}px - ${offset}px)`,

    // CSS custom properties for use in styled components
    cssVars: {
      "--header-height": `${headerHeight}px`,
      "--footer-height": `${footerHeight}px`,
      "--content-height": contentHeight,
    },

    // Breakpoint helpers
    breakpoints: {
      isMobile,
      isTablet,
      isDesktop,
      isLargeDesktop,
    },
  };
};
