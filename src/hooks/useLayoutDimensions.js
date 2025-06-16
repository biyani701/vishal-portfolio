// hooks/useLayoutDimensions.js
import { useState, useEffect, useMemo } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Custom hook to get responsive layout dimensions with modern viewport units
 * @returns {Object} Object containing header height, footer height, and content height calculations
 */

const isIPhoneXSize = (width, height) => {
  const knownDimensions = [
    [375, 812], // iPhone X, XS, 12 Mini
    [414, 896], // iPhone XR, 11
    [390, 844], // iPhone 12, 12 Pro, 13, 13 Pro, 14, 14 Pro
    [428, 926], // iPhone 12 Pro Max, 13 Pro Max, 14 Plus, 14 Pro Max
  ];

  return knownDimensions.some(
    ([w, h]) => (width === w && height === h) || (width === h && height === w)
  );
};

// Detect if browser supports modern viewport units
const supportsModernViewport = () => {
  if (typeof window === "undefined") return false;

  try {
    // Test for dvh support
    const testEl = document.createElement('div');
    testEl.style.height = '100dvh';
    return testEl.style.height === '100dvh';
  } catch {
    return false;
  }
};

export const useLayoutDimensions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // Enhanced mobile breakpoint detection
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("smallMobile"));
  const isMediumMobile = useMediaQuery(theme.breakpoints.between("smallMobile", "mobile"));
  const isLargeMobile = useMediaQuery(theme.breakpoints.between("mobile", "largeMobile"));

  const [isIPhoneXOrSimilar, setIsIPhoneXOrSimilar] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [hasModernViewportSupport, setHasModernViewportSupport] = useState(false);

  const getDynamicHeight = (type) => {
    const layout = theme.customLayout[`${type}Height`];

    if (!layout) return 56;

    const portraitKey = (() => {
      if (isSmallMobile) return "smallMobile";
      if (isMediumMobile) return "mobile";
      if (isLargeMobile) return "largeMobile";
      if (isMobile) return "mobile";
      if (isTablet) return "tablet";
      return "md";
    })();

    const landscapeKey = (() => {
      if (isSmallMobile) return "smallMobileLandscape";
      if (isMediumMobile) return "mobileLandscape";
      if (isLargeMobile) return "largeMobileLandscape";
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

    // Check for modern viewport support
    setHasModernViewportSupport(supportsModernViewport());

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });
      setIsIPhoneXOrSimilar(isIPhoneXSize(width, height));
      setIsPortrait(height >= width);

      // Enhanced safe area insets calculation
      const computed = getComputedStyle(document.documentElement);
      const getInset = (prop) => {
        // Try multiple approaches to get safe area insets
        let val = computed.getPropertyValue(`env(safe-area-inset-${prop})`);

        // Fallback for older syntax
        if (!val || val === "0px") {
          val = computed.getPropertyValue(`constant(safe-area-inset-${prop})`);
        }

        // Parse the value, handling different units
        if (val && val !== "0px") {
          const numVal = parseFloat(val);
          return isNaN(numVal) ? 0 : numVal;
        }

        // Fallback values for known devices when safe area isn't detected
        if (isIPhoneXSize(width, height)) {
          switch (prop) {
            case "top":
              return isPortrait ? 44 : 0;
            case "bottom":
              return isPortrait ? 34 : 21;
            default:
              return 0;
          }
        }

        return 0;
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

    // Add resize listener with debouncing for better performance
    let timeoutId;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("orientationchange", updateDimensions);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("orientationchange", updateDimensions);
    };
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

  // Modern viewport-aware content height calculations
  const contentHeight = useMemo(() => {
    if (hasModernViewportSupport) {
      return `calc(100dvh - ${headerHeight}px - ${footerHeight}px)`;
    }
    return `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
  }, [hasModernViewportSupport, headerHeight, footerHeight]);

  const contentHeightWithPadding = useMemo(() => {
    if (hasModernViewportSupport) {
      return `calc(100dvh - ${headerHeight}px - ${footerHeight}px - 2rem)`;
    }
    return `calc(100vh - ${headerHeight}px - ${footerHeight}px - 2rem)`;
  }, [hasModernViewportSupport, headerHeight, footerHeight]);

  // Safe content height that accounts for safe areas
  const safeContentHeight = useMemo(() => {
    const safeTop = safeAreaInsets.top || 0;
    const safeBottom = safeAreaInsets.bottom || 0;

    if (hasModernViewportSupport) {
      return `calc(100dvh - ${headerHeight}px - ${footerHeight}px - env(safe-area-inset-top, ${safeTop}px) - env(safe-area-inset-bottom, ${safeBottom}px))`;
    }
    return `calc(100vh - ${headerHeight}px - ${footerHeight}px - ${safeTop}px - ${safeBottom}px)`;
  }, [hasModernViewportSupport, headerHeight, footerHeight, safeAreaInsets]);

  // Get spacing values for consistent padding
  const spacing = {
    xs: theme.spacing(1), // 8px
    sm: theme.spacing(2), // 16px
    md: theme.spacing(3), // 24px
    lg: theme.spacing(4), // 32px
    xl: theme.spacing(6), // 48px
  };

  // Improved offset calculations based on device type and orientation
  const getResponsiveOffset = () => {
    if (isSmallMobile) {
      return isPortrait ? 32 : 24;
    }
    if (isMediumMobile) {
      return isPortrait ? 40 : 32;
    }
    if (isLargeMobile) {
      return isPortrait ? 48 : 36;
    }
    if (isMobile) {
      return isPortrait ? 54 : 40;
    }
    return isPortrait ? 120 : 54;
  };

  const responsiveOffset = getResponsiveOffset();
  const sideOffset = responsiveOffset;
  const topOffset = headerHeight + responsiveOffset + safeAreaInsets.top;
  const bottomOffset = footerHeight + responsiveOffset + safeAreaInsets.bottom;
  const verticalOffset = `calc(${topOffset}px + ${bottomOffset}px)`;

  // Enhanced safe offsets with proper mobile calculations
  const safeOffsets = {
    top: `calc(${headerHeight}px + env(safe-area-inset-top, ${safeAreaInsets.top}px) + ${theme.spacing(2)})`,
    bottom: `calc(${footerHeight}px + env(safe-area-inset-bottom, ${safeAreaInsets.bottom}px) + ${theme.spacing(2)})`,
    left: `calc(env(safe-area-inset-left, ${safeAreaInsets.left}px) + ${theme.spacing(2)})`,
    right: `calc(env(safe-area-inset-right, ${safeAreaInsets.right}px) + ${theme.spacing(2)})`,
    sideOffset,
    topOffset,
    bottomOffset,
    verticalOffset,
    // Additional mobile-specific offsets
    mobileTop: `calc(${headerHeight}px + ${Math.max(safeAreaInsets.top, 8)}px + ${theme.spacing(1)})`,
    mobileBottom: `calc(${footerHeight}px + ${Math.max(safeAreaInsets.bottom, 8)}px + ${theme.spacing(1)})`,
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
    // Basic dimensions
    headerHeight,
    footerHeight,
    contentHeight,
    contentHeightWithPadding,
    safeContentHeight,

    // Breakpoint detection
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isSmallMobile,
    isMediumMobile,
    isLargeMobile,

    // Device detection
    isIPhoneXOrSimilar,
    isPortrait,
    isSmallScreen,
    isTallScreen,
    isIPhoneSE,

    // Viewport support
    hasModernViewportSupport,

    // Layout utilities
    spacing,
    safeAreaInsets,
    safeOffsets,
    windowSize,

    // Modern viewport helper functions
    getContentHeightWithOffset: (offset = 0) => {
      if (hasModernViewportSupport) {
        return `calc(100dvh - ${headerHeight}px - ${footerHeight}px - ${offset}px)`;
      }
      return `calc(100vh - ${headerHeight}px - ${footerHeight}px - ${offset}px)`;
    },

    getSafeContentHeightWithOffset: (offset = 0) => {
      const safeTop = safeAreaInsets.top || 0;
      const safeBottom = safeAreaInsets.bottom || 0;

      if (hasModernViewportSupport) {
        return `calc(100dvh - ${headerHeight}px - ${footerHeight}px - env(safe-area-inset-top, ${safeTop}px) - env(safe-area-inset-bottom, ${safeBottom}px) - ${offset}px)`;
      }
      return `calc(100vh - ${headerHeight}px - ${footerHeight}px - ${safeTop}px - ${safeBottom}px - ${offset}px)`;
    },

    // Viewport utilities from theme
    viewport: theme.viewport,

    // CSS custom properties for use in styled components
    cssVars: {
      "--header-height": `${headerHeight}px`,
      "--footer-height": `${footerHeight}px`,
      "--content-height": contentHeight,
      "--safe-content-height": safeContentHeight,
      "--safe-area-inset-top": `${safeAreaInsets.top}px`,
      "--safe-area-inset-bottom": `${safeAreaInsets.bottom}px`,
      "--safe-area-inset-left": `${safeAreaInsets.left}px`,
      "--safe-area-inset-right": `${safeAreaInsets.right}px`,
    },

    // Enhanced breakpoint helpers
    breakpoints: {
      isMobile,
      isTablet,
      isDesktop,
      isLargeDesktop,
      isSmallMobile,
      isMediumMobile,
      isLargeMobile,
    },
  };
};
