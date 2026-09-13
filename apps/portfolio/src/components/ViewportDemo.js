// components/ViewportDemo.js
import React from "react";
import { Box, Typography, Paper, Grid, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useLayoutDimensions } from "../hooks/useLayoutDimensions";
import { useViewportUnits } from "../hooks/useViewportUnits";

// Demo container using modern viewport units
const DemoContainer = styled(Box)(({ theme }) => ({
  ...theme.viewport.helpers.fullHeight(),
  padding: theme.spacing(2),
  background: theme.palette.background.default,
}));

// Content area using safe viewport calculations
const ContentArea = styled(Paper)(({ theme }) => {
  const { headerHeight, footerHeight } = theme.customLayout;
  
  return {
    ...theme.viewport.helpers.contentHeight(headerHeight.md, footerHeight.md),
    padding: theme.spacing(3),
    margin: theme.spacing(2, 0),
    overflow: "auto",
    
    // Mobile optimizations
    [theme.breakpoints.down("sm")]: {
      ...theme.viewport.helpers.safeContentHeight(headerHeight.mobile, footerHeight.mobile),
      padding: theme.spacing(2),
    },
  };
});

// Mobile-optimized container
const MobileContainer = styled(Box)(({ theme }) => ({
  ...theme.viewport.helpers.mobileOptimizedHeight(),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  
  // Safe area padding
  paddingTop: `max(${theme.spacing(2)}, env(safe-area-inset-top, 0px))`,
  paddingBottom: `max(${theme.spacing(2)}, env(safe-area-inset-bottom, 0px))`,
  paddingLeft: `max(${theme.spacing(1)}, env(safe-area-inset-left, 0px))`,
  paddingRight: `max(${theme.spacing(1)}, env(safe-area-inset-right, 0px))`,
}));

const ViewportDemo = () => {
  const {
    hasModernViewportSupport,
    safeAreaInsets,
    headerHeight,
    footerHeight,
    isSmallMobile,
    isMediumMobile,
    isLargeMobile,
    isPortrait,
    windowSize,
  } = useLayoutDimensions();

  const {
    dvh,
    svh,
    lvh,
    fullHeight,
    safeFullHeight,
    contentHeight,
    safeContentHeight,
    supportsUnit,
  } = useViewportUnits();

  const supportedUnits = [
    { unit: "dvh", supported: supportsUnit("dvh") },
    { unit: "svh", supported: supportsUnit("svh") },
    { unit: "lvh", supported: supportsUnit("lvh") },
    { unit: "dvw", supported: supportsUnit("dvw") },
    { unit: "vi", supported: supportsUnit("vi") },
    { unit: "vb", supported: supportsUnit("vb") },
  ];

  return (
    <DemoContainer>
      <Typography variant="h4" gutterBottom>
        Modern Viewport Units Demo
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Viewport Support
            </Typography>
            <Typography variant="body2" gutterBottom>
              Modern Viewport Support: {" "}
              <Chip 
                label={hasModernViewportSupport ? "Yes" : "No"} 
                color={hasModernViewportSupport ? "success" : "warning"}
                size="small"
              />
            </Typography>
            
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Supported Units:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {supportedUnits.map(({ unit, supported }) => (
                <Chip
                  key={unit}
                  label={unit}
                  color={supported ? "success" : "default"}
                  size="small"
                  variant={supported ? "filled" : "outlined"}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Device Information
            </Typography>
            <Typography variant="body2">
              Window Size: {windowSize.width} × {windowSize.height}
            </Typography>
            <Typography variant="body2">
              Orientation: {isPortrait ? "Portrait" : "Landscape"}
            </Typography>
            <Typography variant="body2">
              Device Type: {
                isSmallMobile ? "Small Mobile" :
                isMediumMobile ? "Medium Mobile" :
                isLargeMobile ? "Large Mobile" :
                "Desktop/Tablet"
              }
            </Typography>
            <Typography variant="body2">
              Header Height: {headerHeight}px
            </Typography>
            <Typography variant="body2">
              Footer Height: {footerHeight}px
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Safe Area Insets
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body2" align="center">
                  Top: {safeAreaInsets.top}px
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" align="center">
                  Right: {safeAreaInsets.right}px
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" align="center">
                  Bottom: {safeAreaInsets.bottom}px
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2" align="center">
                  Left: {safeAreaInsets.left}px
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Viewport Height Examples
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    ...dvh(20),
                    backgroundColor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="white">
                    20dvh
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    ...svh(20),
                    backgroundColor: "secondary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="white">
                    20svh
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    ...lvh(20),
                    backgroundColor: "success.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" color="white">
                    20lvh
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Mobile-specific demo */}
      {(isSmallMobile || isMediumMobile || isLargeMobile) && (
        <MobileContainer sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mobile-Optimized Container
          </Typography>
          <Typography variant="body2" align="center">
            This container uses mobile-optimized viewport units and safe area padding.
            It will adjust properly as the mobile browser UI shows/hides.
          </Typography>
        </MobileContainer>
      )}
    </DemoContainer>
  );
};

export default ViewportDemo;
