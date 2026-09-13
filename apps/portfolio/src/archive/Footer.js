import React from 'react';
import { Typography, Box, useTheme, useMediaQuery, IconButton, Container, Link } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import SvgIcon from '@mui/material/SvgIcon';
import PrivacyPreferencesButton from '../components/PrivacyPreferencesButton';
import { alpha } from '@mui/material/styles';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isVerySmallMobile = useMediaQuery('(max-width:400px)');
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: theme.palette.background.footer,
        color: theme.palette.common.white,
        borderTop: `1px solid ${theme.palette.divider}`,
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 0.5, sm: 0.75, md: 1 },
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(8px)',
        transition: theme.transitions.create(['background-color', 'border-color'], {
          duration: theme.transitions.duration.standard,
        }),
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0.5, sm: 1, md: 2 } }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          width: '100%',
          py: { xs: 0.25, sm: 0 }
        }}>
          {/* Left section - Cookie settings and Policies */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: '33%' },
            justifyContent: { xs: 'flex-start', sm: 'flex-start' },
            mb: { xs: 0.5, sm: 0 },
            order: { xs: 1, sm: 1 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' }
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mr: { xs: 1, sm: 0 }
            }}>
              <PrivacyPreferencesButton />
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 1.5 }
            }}>
              <Link
                href="https://vishal.biyani.xyz/docs/policies"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: alpha(theme.palette.common.white, 0.9),
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: theme.palette.common.white,
                  },
                  whiteSpace: 'nowrap'
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
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: theme.palette.common.white,
                  },
                  whiteSpace: 'nowrap'
                }}
              >
                Credits
              </Link>
            </Box>
          </Box>

          {/* Middle section - Social links */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: '100%', sm: '33%' },
            order: { xs: 2, sm: 2 }
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75
            }}>
              <IconButton
                component="a"
                href="https://www.linkedin.com/in/vishalbiyani2/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                size="small"
                sx={{
                  color: theme.palette.common.white,
                  padding: { xs: 0.4, sm: 0.5 },
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
                className="social-link"
                size="small"
                sx={{
                  color: theme.palette.common.white,
                  padding: { xs: 0.4, sm: 0.5 },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                className="social-link"
                href="https://bitbucket.org/visby8em/workspace/overview/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: theme.palette.common.white,
                  padding: { xs: 0.4, sm: 0.5 },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <SvgIcon fontSize="small">
                  {/* Bitbucket SVG path */}
                  <path d="M0.86,2C0.41,2 0.02,2.34 0,2.78C0,2.81 0,2.84 0,2.88L3.66,21.26C3.73,21.69 4.1,22 4.54,22H19.94C20.28,22 20.57,21.78 20.65,21.45L24,2.88V2.8C23.99,2.36 23.62,2.01 23.18,2C23.16,2 23.14,2 23.12,2H0.86ZM14.93,14.6H9.06L7.85,9.4H16.12L14.93,14.6Z" />
                </SvgIcon>
              </IconButton>
            </Box>
          </Box>

          {/* Right section - Copyright */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: { xs: '100%', sm: '33%' },
            order: { xs: 3, sm: 3 }
          }}>
            <Typography
              variant="body2"
              sx={{
                color: alpha(theme.palette.common.white, 0.9),
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                textAlign: 'right'
              }}
            >
              © {currentYear} Vishal Biyani
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;