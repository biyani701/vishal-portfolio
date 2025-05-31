import { useMemo } from "react";
import { useTheme, useMediaQuery } from '@mui/material';

export const useHeaderHeight = () => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('smallMobile'));
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return useMemo(() => {
    const heights = theme.customLayout.headerHeight;
    
    // Define fallback logic
    const getHeight = (portraitKey, landscapeKey, fallbackReduction = 8) => {
      if (isLandscape) {
        return heights[landscapeKey] || (heights[portraitKey] - fallbackReduction);
      }
      return heights[portraitKey];
    };
    
    if (isSmallMobile) {
      return getHeight('smallMobile', 'smallMobileLandscape');
    }
    if (isMobile) {
      return getHeight('xs', 'xsLandscape');
    }
    if (isTablet) {
      return getHeight('sm', 'smLandscape');
    }
    
    return heights.md; // Desktop doesn't change between orientations
    
  }, [theme.customLayout.headerHeight, isSmallMobile, isMobile, isTablet, isLandscape]);
};