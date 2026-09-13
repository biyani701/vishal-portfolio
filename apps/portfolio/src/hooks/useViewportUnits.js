// hooks/useViewportUnits.js
import { useMemo } from "react";
import { useTheme } from "@mui/material";
import { useLayoutDimensions } from "./useLayoutDimensions";

/**
 * Custom hook for modern viewport units with fallbacks
 * Provides utilities for using new viewport units (dvh, svh, lvh, etc.) with proper fallbacks
 */
export const useViewportUnits = () => {
  const theme = useTheme();
  const { hasModernViewportSupport, safeAreaInsets } = useLayoutDimensions();

  const viewportUtils = useMemo(() => ({
    // Dynamic viewport height - best for mobile as it adjusts to browser UI
    dvh: (value) => ({
      height: `${value}vh`, // Fallback
      ...(hasModernViewportSupport && { height: `${value}dvh` }),
    }),

    // Small viewport height - consistent mobile experience
    svh: (value) => ({
      height: `${value}vh`, // Fallback
      ...(hasModernViewportSupport && { height: `${value}svh` }),
    }),

    // Large viewport height - maximum available space
    lvh: (value) => ({
      height: `${value}vh`, // Fallback
      ...(hasModernViewportSupport && { height: `${value}lvh` }),
    }),

    // Dynamic viewport width
    dvw: (value) => ({
      width: `${value}vw`, // Fallback
      ...(hasModernViewportSupport && { width: `${value}dvw` }),
    }),

    // Viewport inline (width in horizontal writing mode)
    vi: (value) => ({
      width: `${value}vw`, // Fallback
      ...(hasModernViewportSupport && { width: `${value}vi` }),
    }),

    // Viewport block (height in horizontal writing mode)
    vb: (value) => ({
      height: `${value}vh`, // Fallback
      ...(hasModernViewportSupport && { height: `${value}vb` }),
    }),

    // Helper for full viewport height with mobile optimization
    fullHeight: () => ({
      minHeight: "100vh", // Fallback
      ...(hasModernViewportSupport && { 
        minHeight: "100dvh", // Dynamic for mobile
        "@supports (height: 100svh)": {
          minHeight: "100svh", // Small viewport for consistency
        },
      }),
    }),

    // Safe area aware full height
    safeFullHeight: () => {
      const safeTop = safeAreaInsets.top || 0;
      const safeBottom = safeAreaInsets.bottom || 0;
      
      return {
        minHeight: `calc(100vh - ${safeTop}px - ${safeBottom}px)`, // Fallback
        ...(hasModernViewportSupport && {
          minHeight: `calc(100dvh - env(safe-area-inset-top, ${safeTop}px) - env(safe-area-inset-bottom, ${safeBottom}px))`,
        }),
      };
    },

    // Content area with header/footer
    contentHeight: (headerPx, footerPx) => ({
      height: `calc(100vh - ${headerPx}px - ${footerPx}px)`, // Fallback
      ...(hasModernViewportSupport && {
        height: `calc(100dvh - ${headerPx}px - ${footerPx}px)`,
      }),
    }),

    // Safe content area with header/footer and safe areas
    safeContentHeight: (headerPx, footerPx) => {
      const safeTop = safeAreaInsets.top || 0;
      const safeBottom = safeAreaInsets.bottom || 0;
      
      return {
        height: `calc(100vh - ${headerPx}px - ${footerPx}px - ${safeTop}px - ${safeBottom}px)`, // Fallback
        ...(hasModernViewportSupport && {
          height: `calc(100dvh - ${headerPx}px - ${footerPx}px - env(safe-area-inset-top, ${safeTop}px) - env(safe-area-inset-bottom, ${safeBottom}px))`,
        }),
      };
    },

    // Mobile-optimized container
    mobileContainer: () => ({
      ...theme.viewport.helpers.mobileOptimizedHeight(),
      paddingTop: `max(${theme.spacing(2)}, env(safe-area-inset-top, 0px))`,
      paddingBottom: `max(${theme.spacing(2)}, env(safe-area-inset-bottom, 0px))`,
      paddingLeft: `max(${theme.spacing(1)}, env(safe-area-inset-left, 0px))`,
      paddingRight: `max(${theme.spacing(1)}, env(safe-area-inset-right, 0px))`,
    }),

    // CSS custom properties for styled components
    cssVars: () => ({
      "--viewport-height": hasModernViewportSupport ? "100dvh" : "100vh",
      "--viewport-width": hasModernViewportSupport ? "100dvw" : "100vw",
      "--small-viewport-height": hasModernViewportSupport ? "100svh" : "100vh",
      "--large-viewport-height": hasModernViewportSupport ? "100lvh" : "100vh",
      "--safe-area-top": `${safeAreaInsets.top}px`,
      "--safe-area-bottom": `${safeAreaInsets.bottom}px`,
      "--safe-area-left": `${safeAreaInsets.left}px`,
      "--safe-area-right": `${safeAreaInsets.right}px`,
    }),
  }), [hasModernViewportSupport, safeAreaInsets, theme]);

  return {
    ...viewportUtils,
    hasModernViewportSupport,
    safeAreaInsets,
    
    // Utility to check if a specific viewport unit is supported
    supportsUnit: (unit) => {
      if (typeof window === "undefined") return false;
      
      try {
        const testEl = document.createElement('div');
        testEl.style.height = `100${unit}`;
        return testEl.style.height === `100${unit}`;
      } catch {
        return false;
      }
    },
  };
};

export default useViewportUnits;
