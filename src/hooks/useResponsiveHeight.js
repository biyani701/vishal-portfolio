// hooks/useResponsiveHeight.js
import { useMemo } from "react";
import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsiveHeight = (heightType) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('smallMobile'));
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile')); // Use xs consistently
  const isLargeMobile = useMediaQuery(theme.breakpoints.down('largeMobile')); // 540px
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet')); 
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return useMemo(() => {
    const heights = theme.customLayout[`${heightType}Height`];
    
    const getHeight = (portraitKey, landscapeKey, fallbackReduction = 16) => {
      if (isLandscape) {
        return heights[landscapeKey] || (heights[portraitKey] - fallbackReduction);
      }
      return heights[portraitKey];
    };
    
    if (isSmallMobile) {
      return getHeight('smallMobile', 'mobileLandscape');
    }
    if (isMobile) {             // 321-480px (iPhone 12 mini, most phones)
      return getHeight('mobile', 'mobileLandscape');
    }
    if (isLargeMobile) {        // 481-540px (iPhone 14 Pro Max, large phones)
      return getHeight('largeMobile', 'largeMobileLandscape');
    }    
    if (isTablet) {
      return getHeight('sm', 'smLandscape');
    }
    
    return heights.md;
    
  }, [theme.customLayout, isSmallMobile, isMobile, isLargeMobile, isTablet, isLandscape]);
};

