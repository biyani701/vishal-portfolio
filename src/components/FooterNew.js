import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Link,
  Typography,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

import {
  MoreHoriz as MoreIcon,
  Policy as PolicyIcon,
  Star as CreditsIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import SvgIcon from "@mui/material/SvgIcon";
import PrivacyPreferencesButton from "./PrivacyPreferencesButton";
import CopilotChatBubble from "../components/CopilotChatBubble";
import { alpha } from "@mui/material/styles";

import { useResponsiveHeight } from "../hooks/useResponsiveHeight";
import { useLayoutDimensions } from "../hooks/useLayoutDimensions";

// BitBucket Icon Component
const BitBucketIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M0.86,2C0.41,2 0.02,2.34 0,2.78C0,2.81 0,2.84 0,2.88L3.66,21.26C3.73,21.69 4.1,22 4.54,22H19.94C20.28,22 20.57,21.78 20.65,21.45L24,2.88V2.8C23.99,2.36 23.62,2.01 23.18,2C23.16,2 23.14,2 23.12,2H0.86ZM14.93,14.6H9.06L7.85,9.4H16.12L14.93,14.6Z" />
  </SvgIcon>
);

// Footer data configuration
const FOOTER_LINKS = [
  {
    id: 'policies',
    label: 'Policies',
    href: 'https://vishal.biyani.xyz/docs/policies',
    icon: PolicyIcon,
  },
  {
    id: 'credits',
    label: 'Credits',
    href: 'https://vishal.biyani.xyz/docs/credits',
    icon: CreditsIcon,
  },
];

const SOCIAL_LINKS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vishalbiyani2/',
    icon: LinkedInIcon,
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/biyani701',
    icon: GitHubIcon,
  },
  {
    id: 'bitbucket',
    label: 'BitBucket',
    href: 'https://bitbucket.org/visby8em/workspace/overview/',
    icon: BitBucketIcon,
  },
];

// Reusable Link Component
const FooterLink = ({ href, children, fontSize = "0.75rem", ...props }) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      color: alpha('#ffffff', 0.9),
      fontSize,
      textDecoration: "none",
      transition: "all 0.2s ease",
      "&:hover": {
        textDecoration: "underline",
        color: '#ffffff',
        transform: "translateY(-1px)",
      },
      ...props.sx,
    }}
    {...props}
  >
    {children}
  </Link>
);

FooterLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  fontSize: PropTypes.string,
  sx: PropTypes.object,
};

// Reusable Social Icon Component
const SocialIconButton = ({ href, icon: Icon, label, size = "small", ...props }) => (
  <Tooltip title={label} arrow>
    <IconButton
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      size={size}
      sx={{
        color: '#ffffff',
        p: 0.5,
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: alpha('#ffffff', 0.1),
          transform: "translateY(-2px) scale(1.05)",
        },
        ...props.sx,
      }}
      {...props}
    >
      <Icon fontSize={size} />
    </IconButton>
  </Tooltip>
);
SocialIconButton.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  sx: PropTypes.object,
};

// Enhanced Drawer Component for Mobile
const FooterDrawer = ({ open, onClose, title, children }) => {
  const theme = useTheme();

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '50vh',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'inherit' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2, borderColor: alpha('#ffffff', 0.2) }} />
        {children}
      </Box>
    </Drawer>
  );
};

FooterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const Footer = () => {
  const theme = useTheme();
  const footerHeight = useResponsiveHeight("footer");
  const currentYear = new Date().getFullYear();

  // State management
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);

  // Responsive breakpoints
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("smallMobile"));
  const { isPortrait, isMobile } = useLayoutDimensions();

  // Determine if we should use compact mode
  const useCompactMode = isMobile && isPortrait;

  // Helper functions
  const openDrawer = (content, title) => {
    setDrawerContent({ content, title });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerContent(null);
  };

  const handleLinksDrawer = () => {
    const content = (
      <List sx={{ p: 0 }}>
        {FOOTER_LINKS.map((link) => (
          <ListItem key={link.id} sx={{ px: 0, py: 1 }}>
            <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
              <link.icon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <FooterLink href={link.href} fontSize="0.9rem">
                {link.label}
              </FooterLink>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    );
    openDrawer(content, "Quick Links");
  };

  const handleSocialDrawer = () => {
    const content = (
      <Box sx={{
        display: 'flex',
        gap: 2,
        justifyContent: 'center',
        flexWrap: 'wrap',        
      }}>
        {SOCIAL_LINKS.map((social) => (
          <SocialIconButton
            key={social.id}
            href={social.href}
            icon={social.icon}
            label={social.label}
            size="medium"
            sx={{
              width: 48,
              height: 48,
              backgroundColor: alpha('#ffffff', 0.1),              
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.2),
              }
            }}
          />
        ))}
      </Box>
    );
    openDrawer(content, "Connect With Me");
  };

  const FooterContainer = styled(Grid)(({ theme }) => ({
    width: "100%",
    position: "fixed",
    height: `${footerHeight}px`,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.footer + 1,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: `1px solid ${theme.palette.divider}`,
    backdropFilter: "blur(8px)",
    transition: theme.transitions.create(["background-color", "border-color"], {
      duration: theme.transitions.duration.standard,
    }),
    px: { xs: 1, sm: 3, md: 4 },
    isolation: "auto",
  }));

  return (
    <>
      <FooterContainer container component="footer">
        {/* Left Section - Privacy Button */}
        <Grid
          item
          xs={useCompactMode ? 3 : 2}
          sm={3}
          md={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: "100%",
          }}
        >
          <PrivacyPreferencesButton />
        </Grid>

        {/* Center Section - Links, Copyright, Social */}
        <Grid
          item
          xs={useCompactMode ? 8 : 9}
          sm={6}
          md={4}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: useCompactMode ? 1 : 2,
            minHeight: "100%",
            px: 1,
          }}
        >
          {/* Links Section */}
          {useCompactMode ? (
            <Tooltip title="Quick Links" arrow>
              <IconButton
                onClick={handleLinksDrawer}
                size="small"
                sx={{
                  color: '#ffffff',
                  p: 0.5,
                  backgroundColor: alpha('#ffffff', 0.1),
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.2),
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <PolicyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              {FOOTER_LINKS.map((link) => (
                <FooterLink
                  key={link.id}
                  href={link.href}
                  fontSize={isSmallMobile ? "0.7rem" : "0.75rem"}
                >
                  {link.label}
                </FooterLink>
              ))}
            </Box>
          )}

          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{
              color: alpha('#ffffff', 0.9),
              fontSize: isSmallMobile ? "0.65rem" : "0.75rem",
              textAlign: "center",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            © {currentYear} Vishal Biyani
          </Typography>

          {/* Social Icons */}
          {useCompactMode ? (
            <Tooltip title="Social Links" arrow>
              <IconButton
                onClick={handleSocialDrawer}
                size="small"
                sx={{
                  color: '#ffffff',
                  p: 0.5,
                  backgroundColor: alpha('#ffffff', 0.1),                  
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.2),
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <MoreIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                alignItems: "center",
              }}
            >
              {SOCIAL_LINKS.map((social) => (
                <SocialIconButton
                  key={social.id}
                  href={social.href}
                  icon={social.icon}
                  label={social.label}
                  size="small"
                  sx={{ p: 0.3 }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Right Section - Empty space for chat bubble to position independently */}
        <Grid
          item
          xs={1}
          sm={3}
          md={4}
          sx={{
            display: { xs: "flex", sm: "flex" },
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: "100%",
            minWidth: '45px',
          }}
        >
          &nbsp;
          </Grid>
      </FooterContainer>

      {/* Chat Bubble - Positioned independently outside Grid constraints */}
      <Box
        sx={{
          position: "fixed",
          bottom: '16px',
          right: '16px',
          zIndex: Math.max(theme.zIndex.footer + 10, theme.zIndex.modal - 50),
          // Ensure it doesn't interfere with touch events
          pointerEvents: "none",
          "& > *": {
            pointerEvents: "auto", // Re-enable pointer events for the chat bubble itself
          },
        }}
      >
        <CopilotChatBubble />
      </Box>

      {/* Enhanced Drawer for Mobile */}
      {drawerContent && (
        <FooterDrawer
          open={drawerOpen}
          onClose={closeDrawer}
          title={drawerContent.title}
        >
          {drawerContent.content}
        </FooterDrawer>
      )}
    </>
  );
};

export default Footer;