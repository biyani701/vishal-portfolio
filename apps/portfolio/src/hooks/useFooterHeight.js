// hooks/useFooterHeight.js
import {useMemo} from "react";
import { useTheme, useMediaQuery } from '@mui/material';

export const useFooterHeight = () => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('smallMobile'));
  const isMobile = useMediaQuery(theme.breakpoints.down('mobile'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return useMemo(() => {
    const heights = theme.customLayout.footerHeight;
    
    if (isLandscape) {
      if (isSmallMobile) return heights.smallMobileLandscape;
      if (isMobile) return heights.mobileLandscape;
      if (isTablet) return heights.smLandscape;
      return heights.md;
    } else {
      if (isSmallMobile) return heights.smallMobile;
      if (isMobile) return heights.mobile;
      if (isTablet) return heights.sm;
      return heights.md;
    }
  }, [theme, isSmallMobile, isMobile, isTablet, isLandscape]);
};
