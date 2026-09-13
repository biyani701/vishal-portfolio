// hooks/useLayoutDimensions.js
import { useState, useEffect, useMemo } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

/**
 * Custom hook to get responsive layout dimensions with modern viewport units
 * @returns {Object} Object containing header height, footer height, and content height calculations
 */

// Generic device detection system for all mobile devices
const DEVICE_DATABASE = {
  // iOS Devices
  '375x812': { name: 'iPhone X/XS/11 Pro/12 Mini/13 Mini', type: 'ios', hasNotch: true, safeArea: { top: 44, bottom: 34 } },
  '390x844': { name: 'iPhone 12/12 Pro/13/13 Pro/14/14 Pro', type: 'ios', hasNotch: true, safeArea: { top: 47, bottom: 34 } },
  '414x896': { name: 'iPhone XR/11', type: 'ios', hasNotch: true, safeArea: { top: 44, bottom: 34 } },
  '428x926': { name: 'iPhone 12 Pro Max/13 Pro Max/14 Plus', type: 'ios', hasNotch: true, safeArea: { top: 47, bottom: 34 } },
  '430x932': { name: 'iPhone 14 Pro Max/15 Pro Max', type: 'ios', hasNotch: true, safeArea: { top: 59, bottom: 34 } },
  '393x852': { name: 'iPhone 15/15 Pro', type: 'ios', hasNotch: true, safeArea: { top: 59, bottom: 34 } },
  '375x667': { name: 'iPhone SE 2/3', type: 'ios', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '414x736': { name: 'iPhone 8 Plus', type: 'ios', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  
  // Popular Android Devices
  '360x640': { name: 'Samsung Galaxy S5/J3', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '375x667': { name: 'Samsung Galaxy A50/A51', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x869': { name: 'Samsung Galaxy S20/S21', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x915': { name: 'Samsung Galaxy S22/S23', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '384x854': { name: 'Google Pixel 3/4', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '393x851': { name: 'Google Pixel 5/6/7', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '360x780': { name: 'Samsung Galaxy Note 10', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x883': { name: 'OnePlus 8/9', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '411x731': { name: 'Xiaomi Mi 11', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },

  // OnePlus Devices
  '412x869': { name: 'OnePlus 7/7 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x883': { name: 'OnePlus 8/8 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x915': { name: 'OnePlus 9/9 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x919': { name: 'OnePlus 10/10 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x892': { name: 'OnePlus 11/11 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '384x824': { name: 'OnePlus Nord', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x876': { name: 'OnePlus Nord 2/3', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  
  // Xiaomi Devices
  '393x851': { name: 'Xiaomi Mi 10/10 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '411x869': { name: 'Xiaomi Mi 11/11 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x892': { name: 'Xiaomi 12/12 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '393x873': { name: 'Xiaomi 13/13 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x915': { name: 'Xiaomi 14/14 Pro', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '393x786': { name: 'Xiaomi Redmi Note 10/11', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x824': { name: 'Xiaomi Redmi Note 12/13', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '384x854': { name: 'Xiaomi POCO F3/F4', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '412x869': { name: 'Xiaomi POCO X3/X4', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
  '393x851': { name: 'Xiaomi POCO M3/M4', type: 'android', hasNotch: false, safeArea: { top: 0, bottom: 0 } },
};



// Generic device detection function
const detectDevice = (width, height) => {
  const isPortrait = height > width;
  const isLandscape = width > height;
  
  // Check both orientations
  const portraitKey = `${Math.min(width, height)}x${Math.max(width, height)}`;
  const currentKey = `${width}x${height}`;
  
  // Try to find exact match first
  let deviceInfo = DEVICE_DATABASE[currentKey];
  
  // If not found, try portrait orientation
  if (!deviceInfo) {
    deviceInfo = DEVICE_DATABASE[portraitKey];
  }
  
  // Determine device category based on screen size
  const deviceCategory = getDeviceCategory(width, height);
  
  return {
    isPortrait,
    isLandscape,
    orientation: isLandscape ? 'landscape' : 'portrait',
    
    // Device identification
    deviceInfo: deviceInfo || null,
    deviceName: deviceInfo?.name || 'Unknown Device',
    deviceType: deviceInfo?.type || detectDeviceType(),
    deviceCategory,
    
    // Physical characteristics
    hasNotch: deviceInfo?.hasNotch || false,
    hasSafeArea: deviceInfo?.hasNotch || false,
    
    // Screen characteristics
    isSmallScreen: deviceCategory === 'small',
    isMediumScreen: deviceCategory === 'medium', 
    isLargeScreen: deviceCategory === 'large',
    isExtraLargeScreen: deviceCategory === 'xlarge',
    
    // Aspect ratio
    aspectRatio: Math.max(width, height) / Math.min(width, height),
    isWideScreen: (Math.max(width, height) / Math.min(width, height)) > 2,
    
    // Safe area insets
    safeAreaInsets: deviceInfo?.safeArea || { top: 0, bottom: 0, left: 0, right: 0 },
    
    // Dimensions
    dimensions: { width, height, portraitKey, currentKey }
  };
}

// Categorize device based on screen size
const getDeviceCategory = (width, height) => {
  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);
  
  // Small phones (iPhone SE, older Android)
  if (minDimension <= 375 && maxDimension <= 667) return 'small';
  
  // Medium phones (standard size)
  if (minDimension <= 390 && maxDimension <= 844) return 'medium';
  
  // Large phones (Plus/Max sizes)
  if (minDimension <= 430 && maxDimension <= 932) return 'large';
  
  // Extra large or tablets
  return 'xlarge';
};

// Detect device type from user agent if device not in database
const detectDeviceType = () => {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  if (/windows phone/.test(userAgent)) return 'windows';
  
  return 'unknown';
};

// Detect if device supports modern viewport units
const supportsModernViewport = () => {
  if (typeof window === "undefined") return false;

  try {
    // Test for dvh support
    const testEl = document.createElement("div");
    testEl.style.height = "100dvh";
    return testEl.style.height === "100dvh";
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

  const [deviceState, setDeviceState] = useState({
    deviceInfo: null,
    safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
    hasModernViewportSupport: false
  });

  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 0, height: 0 };
  });

  const [isPortrait, setIsPortrait] = useState(true);

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

  

  useEffect(() => {
    if (typeof window === "undefined") return;



    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Get comprehensive device information
      const detectedDevice = detectDevice(width, height);

      setWindowSize({ width, height });
      // Calculate safe area insets
      const computed = getComputedStyle(document.documentElement);

      // Enhanced safe area insets calculation
      
      const getInset = (prop) => {
        // Try modern CSS env() function
        let val = computed.getPropertyValue(`env(safe-area-inset-${prop})`);

        // Fallback to constant() for older browsers
        if (!val || val === "0px") {
          val = computed.getPropertyValue(`constant(safe-area-inset-${prop})`);
        }

        // Parse the value, handling different units
        if (val && val !== "0px") {
          const numVal = parseFloat(val);
          return isNaN(numVal) ? 0 : numVal;
        }

        // Use device-specific fallbacks
        if (detectedDevice.hasSafeArea) {
          const safeArea = detectedDevice.safeAreaInsets;
          switch (prop) {
            case "top":
              return detectedDevice.isPortrait ? safeArea.top : 0;
            case "bottom":
              return detectedDevice.isPortrait ? safeArea.bottom : (safeArea.bottom > 0 ? 21 : 0);
            case "left":
              return detectedDevice.isLandscape ? safeArea.bottom : 0;
            case "right":
              return detectedDevice.isLandscape ? safeArea.bottom : 0;
            default:
              return 0;
          }
        }        

        return 0;
      };

      setDeviceState({
        deviceInfo: detectedDevice,
        safeAreaInsets: {
          top: getInset("top"),
          bottom: getInset("bottom"),
          left: getInset("left"),
          right: getInset("right"),
        },
        hasModernViewportSupport: supportsModernViewport()
      });

      // Debug logging
      console.log('Device Detection:', {
        dimensions: `${width}x${height}`,
        device: detectedDevice.deviceName,
        type: detectedDevice.deviceType,
        orientation: detectedDevice.orientation,
        category: detectedDevice.deviceCategory,
        hasNotch: detectedDevice.hasNotch,
        aspectRatio: detectedDevice.aspectRatio.toFixed(2)
      });

      setIsPortrait(detectedDevice.isPortrait);

      // Debug logging for iPhone 12 Pro detection
      if (detectedDevice.deviceName?.includes('iPhone 12 Pro')) {
        console.log("iPhone 12 Pro detected:", {
          dimensions: `${width}x${height}`,
          orientation: detectedDevice.isLandscape ? "landscape" : "portrait",
          deviceName: detectedDevice.deviceName,
        });
      }


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
    if (deviceState.hasModernViewportSupport) {
      return `calc(100dvh - ${headerHeight}px - ${footerHeight}px)`;
    }
    return `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
  }, [deviceState.hasModernViewportSupport, headerHeight, footerHeight]);


  const contentHeightWithPadding = useMemo(() => {
    if (deviceState.hasModernViewportSupport) {
      return `calc(100dvh - ${headerHeight}px - ${footerHeight}px - 2rem)`;
    }
    return `calc(100vh - ${headerHeight}px - ${footerHeight}px - 2rem)`;
  }, [deviceState.hasModernViewportSupport, headerHeight, footerHeight]);

  // Safe content height that accounts for safe areas
  const safeContentHeight = useMemo(() => {
    const safeTop = deviceState.safeAreaInsets.top || 0;
    const safeBottom = deviceState.safeAreaInsets.bottom || 0;

    if (deviceState.hasModernViewportSupport) {
      return `calc(100dvh - ${headerHeight}px - ${footerHeight}px - env(safe-area-inset-top, ${safeTop}px) - env(safe-area-inset-bottom, ${safeBottom}px))`;
    }
    return `calc(100vh - ${headerHeight}px - ${footerHeight}px - ${safeTop}px - ${safeBottom}px)`;
  }, [deviceState.hasModernViewportSupport, headerHeight, footerHeight, deviceState.safeAreaInsets]);

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
  const topOffset = headerHeight + responsiveOffset + deviceState.safeAreaInsets.top;
  const bottomOffset = footerHeight + responsiveOffset + deviceState.safeAreaInsets.bottom;
  const verticalOffset = `calc(${topOffset}px + ${bottomOffset}px)`;

  // Enhanced safe offsets with proper mobile calculations
  const safeOffsets = {
    top: `calc(${headerHeight}px + env(safe-area-inset-top, ${deviceState.safeAreaInsets.top}px) + ${theme.spacing(2)})`,
    bottom: `calc(${footerHeight}px + env(safe-area-inset-bottom, ${deviceState.safeAreaInsets.bottom}px) + ${theme.spacing(2)})`,
    left: `calc(env(safe-area-inset-left, ${deviceState.safeAreaInsets.left}px) + ${theme.spacing(2)})`,
    right: `calc(env(safe-area-inset-right, ${deviceState.safeAreaInsets.right}px) + ${theme.spacing(2)})`,
    sideOffset,
    topOffset,
    bottomOffset,
    verticalOffset,
    // Additional mobile-specific offsets
    mobileTop: `calc(${headerHeight}px + ${Math.max(deviceState.safeAreaInsets.top, 8)}px + ${theme.spacing(1)})`,
    mobileBottom: `calc(${footerHeight}px + ${Math.max(deviceState.safeAreaInsets.bottom, 8)}px + ${theme.spacing(1)})`,
  };



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
    // Generic device information
    device: deviceState.deviceInfo || {},

    // Quick access to common properties
    isPortrait: deviceState.deviceInfo?.isPortrait || height >= width,
    isLandscape: deviceState.deviceInfo?.isLandscape || width > height,
    orientation: deviceState.deviceInfo?.orientation || (width > height ? 'landscape' : 'portrait'),

    // Device characteristics
    deviceName: deviceState.deviceInfo?.deviceName || 'Unknown Device',
    deviceType: deviceState.deviceInfo?.deviceType || 'unknown',
    deviceCategory: deviceState.deviceInfo?.deviceCategory || 'unknown',
    hasNotch: deviceState.deviceInfo?.hasNotch || false,
    hasSafeArea: deviceState.deviceInfo?.hasSafeArea || false,
    aspectRatio: deviceState.deviceInfo?.aspectRatio || 1,

    // Screen size categories
    isSmallScreen: deviceState.deviceInfo?.isSmallScreen || false,
    isMediumScreen: deviceState.deviceInfo?.isMediumScreen || false,
    isLargeScreen: deviceState.deviceInfo?.isLargeScreen || false,
    isWideScreen: deviceState.deviceInfo?.isWideScreen || false,
    // Safe areas
    safeAreaInsets: deviceState.safeAreaInsets,
    hasModernViewportSupport: deviceState.hasModernViewportSupport,

    // Utility functions
    isSpecificDevice: (deviceName) => {
      return deviceState.deviceInfo?.deviceName?.toLowerCase().includes(deviceName.toLowerCase()) || false;
    },

    isDeviceInLandscape: () => {
      return deviceState.deviceInfo?.isLandscape || false;
    },

    isDeviceInPortrait: () => {
      return deviceState.deviceInfo?.isPortrait || false;
    },

    // Helper to check if current device matches specific dimensions
    matchesDimensions: (targetWidth, targetHeight) => {
      return (width === targetWidth && height === targetHeight) ||
             (width === targetHeight && height === targetWidth);
    },

    // Get device-specific safe offsets
    getSafeOffset: (side) => {
      const spacing = theme.spacing(2);
      const inset = deviceState.safeAreaInsets[side] || 0;

      switch (side) {
        case 'top':
          return `calc(${headerHeight}px + ${inset}px + ${spacing})`;
        case 'bottom':
          return `calc(${footerHeight}px + ${inset}px + ${spacing})`;
        default:
          return `calc(${inset}px + ${spacing})`;
      }
    },

    // Layout utilities
    spacing,
    // safeAreaInsets,
    safeOffsets,
    windowSize,

    // Modern viewport helper functions
    getContentHeightWithOffset: (offset = 0) => {
      if (deviceState.hasModernViewportSupport) {
        return `calc(100dvh - ${headerHeight}px - ${footerHeight}px - ${offset}px)`;
      }
      return `calc(100vh - ${headerHeight}px - ${footerHeight}px - ${offset}px)`;
    },

    getSafeContentHeightWithOffset: (offset = 0) => {
      const safeTop = deviceState.safeAreaInsets.top || 0;
      const safeBottom = deviceState.safeAreaInsets.bottom || 0;

      if (deviceState.hasModernViewportSupport) {
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
      "--safe-area-inset-top": `${deviceState.safeAreaInsets.top}px`,
      "--safe-area-inset-bottom": `${deviceState.safeAreaInsets.bottom}px`,
      "--safe-area-inset-left": `${deviceState.safeAreaInsets.left}px`,
      "--safe-area-inset-right": `${deviceState.safeAreaInsets.right}px`,
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
