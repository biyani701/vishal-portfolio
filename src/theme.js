// theme.js
import { createTheme } from "@mui/material/styles";
import { generateSemanticColors } from "./utilities/colorUtils"; // Import the color utility function
// Define multiple palettes for light and dark modes

export const palettes = {
  light: [
    {
      name: "Sunny Day",
      primary: "#FFEB3B",
      secondary: "#FFC107",
      background: {
        default: "#FFFDE7",
        paper: "#FFFFFF",
        header: "#F57F17",
        footer: "#F57F17",
      },
      text: { primary: "#212121", secondary: "#757575" },
      appLink: "#FFEB3B",
    },
    {
      name: "Salt & Pepper",
      primary: "#4A4A4A",
      secondary: "#A1A1A1",
      background: {
        default: "#F9FAFB",
        paper: "#FFFFFF",
        header: "#1a237e",
        footer: "#1a237e",
      },
      text: { primary: "#1A1A1A", secondary: "#6B6B6B" },
      appLink: "#61dafb",
    },
    {
      name: "Lush Forest",
      primary: "#2E6F40",
      secondary: "#68BA7F",
      background: {
        default: "#CFFEDC",
        paper: "#FFFFFF",
        header: "#253D2C",
        footer: "#253D2C",
      },
      text: { primary: "#253D2C", secondary: "#2E6F40" },
      appLink: "#2E6F40",
    },
    {
      name: "Ocean Breeze",
      primary: "#1976D2",
      secondary: "#64B5F6",
      background: {
        default: "#E3F2FD",
        paper: "#FFFFFF",
        header: "#1565C0",
        footer: "#1565C0",
      },
      text: { primary: "#0D47A1", secondary: "#1976D2" },
      appLink: "#1976D2",
    },
    {
      name: "Sunset Coral",
      primary: "#F06292",
      secondary: "#FFB74D",
      background: {
        default: "#FFF4F0",
        paper: "#FFFFFF",
        header: "#E91E63",
        footer: "#E91E63",
      },
      text: {
        primary: "#4A1F1F",
        secondary: "#7B2F2F",
      },
      appLink: "#F06292",
    },
    {
      name: "Lavender Mist",
      primary: "#7E57C2",
      secondary: "#CE93D8",
      background: {
        default: "#F3E5F5",
        paper: "#FFFFFF",
        header: "#512DA8",
        footer: "#512DA8",
      },
      text: {
        primary: "#2A2A2A",
        secondary: "#5A5A5A",
      },
      appLink: "#7E57C2",
    },
    {
      name: "Desert Clay",
      primary: "#D2691E",
      secondary: "#F4A261",
      background: {
        default: "#FFF5E1",
        paper: "#FFFFFF",
        header: "#C1550E",
        footer: "#C1550E",
      },
      text: {
        primary: "#4B2E22",
        secondary: "#8B5E3C",
      },
      appLink: "#F4A261",
    },
    {
      name: "Stormy Morning",
      primary: "#6A89A7",
      secondary: "#88BDF2",
      background: {
        default: "#BDDDFC",
        paper: "#FFFFFF",
        header: "#384959",
        footer: "#384959",
      },
      text: {
        primary: "#212121",
        secondary: "#455A64",
      },
      appLink: "#6A89A7",
    },
    {
      name: "Zesty Lemon",
      primary: "#FFFF66",
      secondary: "#FFE566",
      background: {
        default: "#FFFDE7",
        paper: "#FFFFFF",
        header: "#B3B347",
        footer: "#B3B347",
      },
      text: {
        primary: "#212121",
        secondary: "#5F5F00",
      },
      appLink: "#D6D58B",
    },
  ],
  dark: [
    {
      name: "Blue Eclipse",
      primary: "#90CAF9",
      secondary: "#3949AB",
      background: {
        default: "#121212",
        paper: "#1E1E1E",
        header: "#121212",
        footer: "#121212",
      },
      text: { primary: "#E0E0E0", secondary: "#B0B0B0" },
      appLink: "#90CAF9",
    },
    {
      name: "Gothic Noir",
      primary: "#000000",
      secondary: "#988686",
      background: {
        default: "#5C4E4E",
        paper: "#1E1E1E",
        header: "#000000",
        footer: "#000000",
      },
      text: { primary: "#D1D0D0", secondary: "#988686" },
      appLink: "#988686",
    },
    {
      name: "Deep Ocean",
      primary: "#64B5F6",
      secondary: "#1976D2",
      background: {
        default: "#0A1929",
        paper: "#132F4C",
        header: "#0A1929",
        footer: "#0A1929",
      },
      text: { primary: "#E3F2FD", secondary: "#90CAF9" },
      appLink: "#64B5F6",
    },
    {
      name: "Crimson Night",
      primary: "#EF5350",
      secondary: "#B71C1C",
      background: {
        default: "#1A0000",
        paper: "#2C0A0A",
        header: "#0D0000",
        footer: "#0D0000",
      },
      text: {
        primary: "#F8DAD9",
        secondary: "#EF9A9A",
      },
      appLink: "#EF5350",
    },
    {
      name: "Violet Twilight",
      primary: "#9575CD",
      secondary: "#7B1FA2",
      background: {
        default: "#1B1425",
        paper: "#2A1B3D",
        header: "#1B1425",
        footer: "#1B1425",
      },
      text: {
        primary: "#EDE7F6",
        secondary: "#B39DDB",
      },
      appLink: "#9575CD",
    },
    {
      name: "Emerald Night",
      primary: "#66BB6A",
      secondary: "#2E7D32",
      background: {
        default: "#0C1B0C",
        paper: "#1A3320",
        header: "#0C1B0C",
        footer: "#0C1B0C",
      },
      text: {
        primary: "#D0F2D0",
        secondary: "#A5D6A7",
      },
      appLink: "#66BB6A",
    },
    {
      name: "Cappuccino",
      primary: "#705E46",
      secondary: "#C6C0B9",
      background: {
        default: "#F5F0EB",
        paper: "#FFFFFF",
        header: "#422701",
        footer: "#422701",
      },
      text: {
        primary: "#3E2723",
        secondary: "#5D4037",
      },
      appLink: "#D6B588",
    },
    {
      name: "Calm Blue",
      primary: "#57B9FF",
      secondary: "#90D5FF",
      background: {
        default: "#E1F5FE",
        paper: "#FFFFFF",
        header: "#517891",
        footer: "#517891",
      },
      text: {
        primary: "#0D47A1",
        secondary: "#1976D2",
      },
      appLink: "#77B1D4",
    },
  ],
};

/**
 * Creates a theme based on the specified mode and palette index
 * @param {('light'|'dark')} mode - The theme mode
 * @param {number} paletteIndex - Index of the palette to use (defaults to 0)
 * @returns {Theme} The created theme object
 */
export const getTheme = (mode, paletteIndex = 0) => {
  // Get the selected palette or fallback to the first one if index is invalid
  const selectedPalettes = palettes[mode] || palettes.light;
  const selectedPalette = selectedPalettes[paletteIndex] || selectedPalettes[0];

  const semanticColors = generateSemanticColors(selectedPalette.primary, mode);

  return createTheme({
    // Start Newly Added Theme Properties
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        smallMobile: 320, // Small mobile phones
        mobile: 480, // Most mobile phones
        largeMobile: 540, // Large mobile phones
        tablet: 768, // Tablets
      },
    },
    spacing: 8, // 8px grid, so theme.spacing(2) = 16px
    // mixins: {
    //   toolbar: {
    //     minHeight: 64, // Match your navbar height
    //     "@media (max-width:600px)": {
    //       minHeight: 56,
    //     },
    //   },
    // },
    customLayout: {
      headerHeight: {
        xs: 56, // Mobile
        sm: 60, // Small tablets
        md: 64, // // 900px+ - desktop
        lg: 64, // Large desktop
        smallMobile: 48, // 320px - very compact (iPhone SE)
        mobile: 52, // 480px - standard mobile (iPhone 12 mini)
        largeMobile: 56, // 540px - large phones (iPhone 14 Pro Max)
        tablet: 60, // 768px - tablets
        // Landscape heights
        smallMobileLandscape: 40, // Very compact
        mobileLandscape: 44, // Standard mobile landscape
        largeMobileLandscape: 48, // Large mobile landscape
        tabletLandscape: 52, // Tablet landscape
      },
      footerHeight: {
        xs: 80, // Mobile (2 rows: copyright + social/links)
        sm: 72, // Small tablets (2 rows but more compact)
        md: 56, // Desktop (single row)
        lg: 56, // Large desktop
        smallMobile: 96, // 320px breakpoint
        mobile: 80, // 480px breakpoint
        largeMobile: 80, // 540px - large phones have more space
        tablet: 72, // 768px - tablets

        // Landscape heights - significantly reduced
        smallMobileLandscape: 72, // Still need reasonable touch targets
        mobileLandscape: 64, // Standard mobile landscape
        largeMobileLandscape: 56, // Large phones can be more compact
        tabletLandscape: 48, // Tablets very compact in landscape
      },
      // Alternative: Fixed heights for simpler calculations
      // fixedHeaderHeight: 64,
      // fixedFooterHeight: 56,
      // mobileHeaderHeight: 56,
      // mobileFooterHeight: 72,

      // Orientation-aware content height calculator
      // Usage: const { height, header, footer } = theme.customLayout.getContentHeight(theme)("sm", false);
      // Don't use getContentHeight. Instead use hooks
      getContentHeight: function (theme) {
        let cache = {};

        if (typeof window !== "undefined") {
          window.addEventListener("resize", () => {
            cache = {};
          });
        }

        return (breakpoint, isLandscape = false) => {
          // Dynamically infer breakpoint from screen width if not provided
          if (!breakpoint && theme?.breakpoints?.values) {
            const width = window.innerWidth;
            const bpEntries = Object.entries(theme.breakpoints.values)
              .filter(([k]) => !k.includes("Landscape")) // skip custom ones
              .sort((a, b) => b[1] - a[1]); // sort descending

            for (const [bp, minWidth] of bpEntries) {
              if (width >= minWidth) {
                breakpoint = bp;
                break;
              }
            }

            // Fallback if none match
            breakpoint = breakpoint || "md";
          }

          const key = `${breakpoint}_${isLandscape ? "landscape" : "portrait"}`;
          if (cache[key]) return cache[key];

          const header =
            this.headerHeight[
              isLandscape ? `${breakpoint}Landscape` : breakpoint
            ] ??
            this.headerHeight[breakpoint] ??
            this.headerHeight.md;

          const footer =
            this.footerHeight[
              isLandscape ? `${breakpoint}Landscape` : breakpoint
            ] ??
            this.footerHeight[breakpoint] ??
            this.footerHeight.md;

          const height = window.innerHeight - header - footer;

          cache[key] = { height, header, footer };
          return cache[key];
        };
      },

      // Content area calculations helper
      // getContentHeight: (isDesktop = true) => {
      //   const headerHeight = isDesktop ? 64 : 56;
      //   const footerHeight = isDesktop ? 56 : 120;
      //   return `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;
      // },
    },
    zIndex: {
      // appBar: 1100,
      // drawer: 1200,
      // footer: 1050,
      appBar: 10,
      drawer: 1500,
      footer: 10,
    },
    // End Newly Added Theme Properties
    palette: {
      mode,
      primary: { main: selectedPalette.primary },
      secondary: { main: selectedPalette.secondary },
      success: { main: "#4caf50" }, // Add these color options
      info: { main: "#2196f3" },
      warning: { main: "#ff9800" },
      error: { main: "#f44336" },

      default: { main: selectedPalette.primary },
      alpha: semanticColors.alpha,
      beta: semanticColors.beta,
      gamma: semanticColors.gamma,
      theta: semanticColors.theta,
      epsilon: semanticColors.epsilon,
      background: {
        default: selectedPalette.background.default,
        paper: selectedPalette.background.paper,
        header: selectedPalette.background.header,
        footer: selectedPalette.background.footer,
      },
      text: {
        primary: selectedPalette.text.primary,
        secondary: selectedPalette.text.secondary,
      },
      appLink: selectedPalette.appLink,
      divider:
        mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)",
      action: {
        hover:
          mode === "light"
            ? "rgba(0, 0, 0, 0.04)"
            : "rgba(255, 255, 255, 0.08)",
        selected:
          mode === "light"
            ? "rgba(0, 0, 0, 0.08)"
            : "rgba(255, 255, 255, 0.16)",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontFamily:
          '"Orbitron", "Teko", "Rajdhani", "Roboto", "Helvetica", sans-serif',
        fontWeight: 700,
        fontSize: "2.8rem",
        "@media (max-width:600px)": {
          fontSize: "2.3rem",
        },
      },
      h2: {
        fontFamily:
          '"Orbitron", "Teko", "Rajdhani", "Roboto", "Helvetica", sans-serif',
        fontWeight: 600,
        fontSize: "2.4rem",
        "@media (max-width:600px)": {
          fontSize: "2rem",
        },
      },
      h3: {
        fontFamily:
          '"Orbitron", "Teko", "Rajdhani", "Roboto", "Helvetica", sans-serif',
        fontWeight: 600,
        fontSize: "2rem",
        "@media (max-width:600px)": {
          fontSize: "1.8rem",
        },
      },
      h4: {
        fontFamily:
          '"Orbitron", "Teko", "Rajdhani", "Roboto", "Helvetica", sans-serif',
        fontWeight: 600,
      },
      h5: {
        fontFamily:
          '"Orbitron", "Teko", "Rajdhani", "Roboto", "Helvetica", sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily:
          '"Orbitron", "Teko", "Rajdhani", "Roboto", "Helvetica", sans-serif',
        fontWeight: 600,
      },
      body1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      body2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      button: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        textTransform: "none",
        fontWeight: 500,
      },
      caption: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      subtitle1: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      subtitle2: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
      // Start Newly Added Typography Styles
      allVariants: {
        lineHeight: 1.5,
      },
      htmlFontSize: 16,
      fontSize: 14,
      // End Newly Added Typography Styles
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      // Start Newly Added Component Styles
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: "1rem",
            paddingRight: "1rem",
            "@media (min-width:600px)": {
              paddingLeft: "2rem",
              paddingRight: "2rem",
            },
          },
        },
      },
      // End Newly Added Component Styles
      MuiAppBar: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(0,0,0,0.5)"
                : "0 2px 10px rgba(0,0,0,0.1)",
            backdropFilter: "blur(8px)",
            background: theme.palette.background.header,
            color: theme.palette.common.white,
            transition: "all 0.3s ease",
            height: theme.customLayout.fixedHeaderHeight,
            [theme.breakpoints.down("sm")]: {
              height: theme.customLayout.mobileHeaderHeight,
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: "none",
            transition: "all 0.3s ease",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 40px rgba(0,0,0,0.5)"
                : "0 4px 20px rgba(0,0,0,0.1)",
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 500,
            transition: "all 0.3s ease",
            color: theme.palette.text.primary,
            ":hover": {
              transform: "translateY(-2px)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 15px rgba(0,0,0,0.5)"
                  : "0 5px 15px rgba(0,0,0,0.1)",
            },
          }),
          contained: ({ theme }) => ({
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 10px rgba(0,0,0,0.4)"
                : "0 2px 5px rgba(0,0,0,0.1)",
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            overflow: "hidden",
            transition: "all 0.3s ease",
            ":hover": {
              transform: "translateY(-5px)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 12px 30px rgba(0,0,0,0.6)"
                  : "0 10px 25px rgba(0,0,0,0.15)",
            },
          }),
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
            minWidth: 40,
          }),
        },
      },
      MuiListItemText: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            // Newly Added Styles
            width: "80vw",
            maxWidth: 300,
            [theme.breakpoints.up("sm")]: {
              width: 240,
            },
            // End Newly Added Styles
          }),
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: ({ theme }) => ({
            color: theme.palette.common.white,
            "&:focus": {
              backgroundColor: "transparent",
            },
          }),
          icon: ({ theme }) => ({
            color: theme.palette.common.white,
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.common.white,
            "&.Mui-focused": {
              color: theme.palette.common.white,
            },
          }),
        },
      },
    },
  });
};
