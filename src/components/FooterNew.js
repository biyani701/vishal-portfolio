import React, { useState } from "react";
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Link,
  Typography,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import { MoreHoriz as MoreIcon, ExpandLess } from "@mui/icons-material";
import SvgIcon from "@mui/material/SvgIcon";
import PrivacyPreferencesButton from "./PrivacyPreferencesButton";
import CopilotChatBubble from "../components/CopilotChatBubble";
import { alpha } from "@mui/material/styles";

import { useResponsiveHeight } from "../hooks/useResponsiveHeight";

const Footer = () => {
  const theme = useTheme();
  const footerHeight = useResponsiveHeight("footer");
  const currentYear = new Date().getFullYear();
  const [socialExpanded, setSocialExpanded] = useState(false);

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("smallMobile"));
  const isVerySmall = useMediaQuery("(max-width:360px)"); // For very small screens

  const FooterContainer = styled(Grid)(({ theme }) => ({
    width: "100%",
    position: "fixed",
    height: `${footerHeight}px`,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar + 1,
    backgroundColor: theme.palette.primary.main, // Example background
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center", // Changed from "stretch" to "center"
    justifyContent: "space-between",
    borderTop: `1px solid ${theme.palette.divider}`,
    backdropFilter: "blur(8px)",
    transition: theme.transitions.create(["background-color", "border-color"], {
      duration: theme.transitions.duration.standard,
    }),
    px: { xs: 1, sm: 3, md: 4 },
    // Ensure it's above other content
    isolation: 'auto',
  }));

  return (
    <>
      <FooterContainer container component="footer">
        {/* First Column - Mobile: 1, Others: 4 */}
        <Grid
          item
          xs={1}
          sm={4}
          md={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <PrivacyPreferencesButton />
        </Grid>

        {/* Second Column - Mobile: 10, Others: 4 */}
        <Grid item xs={10} sm={4} md={4}>
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              fontSize: isSmallMobile ? "0.7rem" : "0.75rem",
              textAlign: "center",
            }}
          >
            2nd eleemnt
          </Typography>
        </Grid>

        {/* Third Column - Mobile: 1, Others: 4 */}
        <Grid item xs={1} sm={4} md={4}>
          <Box
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
          <CopilotChatBubble />
          </Box>
        </Grid>
      </FooterContainer>
    </>
  );
};

export default Footer;
