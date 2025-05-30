import React from 'react';
import { Box, useTheme, useMediaQuery, IconButton, Link, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import SvgIcon from '@mui/material/SvgIcon';
import PrivacyPreferencesButton from './PrivacyPreferencesButton';
import CopilotChatBubble from "../components/CopilotChatBubble";
import { alpha } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();

  // Get responsive footer height from theme
  const footerHeight = isMobile 
    ? theme.customLayout.mobileFooterHeight 
    : theme.customLayout.fixedFooterHeight;

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: theme.zIndex.footer,
        backgroundColor: theme.palette.background.footer,
        color: theme.palette.common.white,
        borderTop: `1px solid ${theme.palette.divider}`,
        height: `${footerHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        transition: theme.transitions.create(['background-color', 'border-color'], {
          duration: theme.transitions.duration.standard,
        }),
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: 'lg',
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* Left: Copyright */}
        <Box sx={{ 
          order: { xs: 2, sm: 1 },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <Typography
            variant="body2"
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
            }}
          >
            © {currentYear} Vishal Biyani
          </Typography>
        </Box>

        {/* Center: Cookie Settings & Links */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, sm: 3 },
          order: { xs: 3, sm: 2 },
        }}>
          <CopilotChatBubble />
          <PrivacyPreferencesButton />
          
          <Link
            href="https://vishal.biyani.xyz/docs/policies"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
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
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                color: theme.palette.common.white,
              },
            }}
          >
            Credits
          </Link>
        </Box>

        {/* Right: Social Icons */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          order: { xs: 1, sm: 3 },
        }}>
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/vishalbiyani2/"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: theme.palette.common.white,
              p: { xs: 0.5, sm: 0.75 },
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                transform: 'translateY(-2px)',
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
              p: { xs: 0.5, sm: 0.75 },
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                transform: 'translateY(-2px)',
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
              p: { xs: 0.5, sm: 0.75 },
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                transform: 'translateY(-2px)',
              },
            }}
          >
            <SvgIcon fontSize="small">
              <path d="M0.86,2C0.41,2 0.02,2.34 0,2.78C0,2.81 0,2.84 0,2.88L3.66,21.26C3.73,21.69 4.1,22 4.54,22H19.94C20.28,22 20.57,21.78 20.65,21.45L24,2.88V2.8C23.99,2.36 23.62,2.01 23.18,2C23.16,2 23.14,2 23.12,2H0.86ZM14.93,14.6H9.06L7.85,9.4H16.12L14.93,14.6Z" />
            </SvgIcon>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;