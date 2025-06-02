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
import { useLayoutDimensions } from "../hooks/useLayoutDimensions";

const Footer = () => {
  const theme = useTheme();
  const footerHeight = useResponsiveHeight("footer");
  const currentYear = new Date().getFullYear();
  const [socialExpanded, setSocialExpanded] = useState(false);
  const [linkxExpanded, setLinkExpanded] = useState(false);

  // Responsive breakpoints
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("smallMobile"));
  const isVerySmall = useMediaQuery("(max-width:360px)"); // For very small screens
  const { isPortrait, isSmallScreen, isIPhoneSE, isMobile } =
    useLayoutDimensions();

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
    isolation: "auto",
  }));

  return (
    <>
      <FooterContainer container component="footer">
        {/* First Column - Mobile: 1, Others: 4 */}
        <Grid
          item
          xs={1}
          // sm={4}
          // md={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <PrivacyPreferencesButton />
        </Grid>

        {/* Second Column - Mobile: 10, Others: 4 */}
        <Grid
          item
          xs={10}          
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 2
          }}
        >
          {isMobile && isPortrait ? (
            <>
              <Tooltip title="More links">
                <IconButton
                  onClick={() => setLinkExpanded(!linkxExpanded)}
                  size="small"
                  sx={{
                    color: theme.palette.common.white,
                    p: 0.5,
                  }}
                >
                  {linkxExpanded ? (
                    <ExpandLess fontSize="small" />
                  ) : (
                    <MoreIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Collapse in={linkxExpanded} orientation="horizontal">
                <Box
                  sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}
                >
                  <Link
                    href="https://vishal.biyani.xyz/docs/policies"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: alpha(theme.palette.common.white, 0.9),
                      fontSize: isSmallMobile ? "0.7rem" : "0.75rem",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                        color: theme.palette.common.white,
                      },
                    }}
                  >
                    Policies
                  </Link>
                  <Link
                    href="https://vishal.biyani.xyz/docs/credits"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: alpha(theme.palette.common.white, 0.9),
                      fontSize: isSmallMobile ? "0.7rem" : "0.75rem",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                        color: theme.palette.common.white,
                      },
                    }}
                  >
                    Credits
                  </Link>
                </Box>
              </Collapse>
            </>
          ) : (
            <>
              <Link
                href="https://vishal.biyani.xyz/docs/policies"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: alpha(theme.palette.common.white, 0.9),
                  fontSize: isSmallMobile ? "0.7rem" : "0.75rem",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    color: theme.palette.common.white,
                  },
                }}
              >
                Policies
              </Link>
              <Link
                href="https://vishal.biyani.xyz/docs/credits"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: alpha(theme.palette.common.white, 0.9),
                  fontSize: isSmallMobile ? "0.7rem" : "0.75rem",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    color: theme.palette.common.white,
                  },
                }}
              >
                Credits
              </Link>
            </>
          )}

          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              fontSize: isSmallMobile ? "0.7rem" : "0.75rem",
              textAlign: "center",
            }}
          >
            © {currentYear} Vishal Biyani
          </Typography>
          {/* Social Icons - Collapsible on very small screens */}
          {isMobile && isPortrait ? (
            <>
              <Tooltip title="More social links">
                <IconButton
                  onClick={() => setSocialExpanded(!socialExpanded)}
                  size="small"
                  sx={{
                    color: theme.palette.common.white,
                    p: 0.5,
                  }}
                >
                  {socialExpanded ? (
                    <ExpandLess fontSize="small" />
                  ) : (
                    <MoreIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Collapse in={socialExpanded} orientation="horizontal">
                <Box
                  sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}
                >
                  <IconButton
                    component="a"
                    href="https://www.linkedin.com/in/vishalbiyani2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: theme.palette.common.white,
                      p: 0.3,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
                  >
                    <LinkedInIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://github.com/biyani701"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: theme.palette.common.white,
                      p: 0.3,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
                  >
                    <GitHubIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    component="a"
                    href="https://bitbucket.org/visby8em/workspace/overview/"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      color: theme.palette.common.white,
                      p: 0.3,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      },
                    }}
                  >
                    <SvgIcon fontSize="small">
                      <path d="M0.86,2C0.41,2 0.02,2.34 0,2.78C0,2.81 0,2.84 0,2.88L3.66,21.26C3.73,21.69 4.1,22 4.54,22H19.94C20.28,22 20.57,21.78 20.65,21.45L24,2.88V2.8C23.99,2.36 23.62,2.01 23.18,2C23.16,2 23.14,2 23.12,2H0.86ZM14.93,14.6H9.06L7.85,9.4H16.12L14.93,14.6Z" />
                    </SvgIcon>
                  </IconButton>
                </Box>
              </Collapse>
            </>
          ) : (
            // Normal social icons for larger mobile screens
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                flexWrap: "wrap",
                flexDirection: "column",
              }}
            >
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/vishalbiyani2/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: theme.palette.common.white,
                  p: 0.5,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://github.com/biyani701"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: theme.palette.common.white,
                  p: 0.5,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://bitbucket.org/visby8em/workspace/overview/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: theme.palette.common.white,
                  p: 0.5,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <SvgIcon fontSize="small">
                  <path d="M0.86,2C0.41,2 0.02,2.34 0,2.78C0,2.81 0,2.84 0,2.88L3.66,21.26C3.73,21.69 4.1,22 4.54,22H19.94C20.28,22 20.57,21.78 20.65,21.45L24,2.88V2.8C23.99,2.36 23.62,2.01 23.18,2C23.16,2 23.14,2 23.12,2H0.86ZM14.93,14.6H9.06L7.85,9.4H16.12L14.93,14.6Z" />
                </SvgIcon>
              </IconButton>
            </Box>
          )}
        </Grid>

        {/* Third Column - Mobile: 1, Others: 4 */}
        <Grid
          item
          xs={1}
          // sm={4} md={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
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
