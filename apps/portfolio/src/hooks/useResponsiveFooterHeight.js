import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const useResponsiveFooterHeight = (offset = 24) => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  let footerHeight = theme.customLayout.footerHeight.md; // default fallback

  if (isXs) {
    footerHeight = theme.customLayout.footerHeight.xs;
  } else if (isSm) {
    footerHeight = theme.customLayout.footerHeight.sm;
  } else if (isMd) {
    footerHeight = theme.customLayout.footerHeight.md;
  } else if (isLg || isXl) {
    footerHeight = theme.customLayout.footerHeight.lg;
  }

  return footerHeight + offset;
};

export default useResponsiveFooterHeight;
