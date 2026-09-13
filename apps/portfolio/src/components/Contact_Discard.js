import { Typography, Box, useTheme, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import SvgIcon from '@mui/material/SvgIcon';
import './Contact.css';

const Contact = () => {
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      className="footer"
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#1a237e',
        color: 'white',
        py: 1,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Box className="container">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          minHeight: '40px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" component="span" sx={{ color: 'white' }}>
              <a href="mailto:support@biyani.xyz" className="footer-link">                
              Support Team
              </a>
            </Typography>
            {/* <Typography variant="body2" component="span" sx={{ color: 'white' }}>
              <a href="tel:+917720028522" className="footer-link">
                📞 +91 77 20 02 85 22
              </a>
            </Typography> */}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              component="a" 
              href="https://www.linkedin.com/in/vishalbiyani2/" 
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              size="small"
              sx={{ color: 'white' }}
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
              sx={{ color: 'white' }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton
          className="social-link"
          href="https://bitbucket.org/visby8em/workspace/overview/"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          <SvgIcon fontSize="small">
            {/* Bitbucket SVG path */}
            <path d="M0.86,2C0.41,2 0.02,2.34 0,2.78C0,2.81 0,2.84 0,2.88L3.66,21.26C3.73,21.69 4.1,22 4.54,22H19.94C20.28,22 20.57,21.78 20.65,21.45L24,2.88V2.8C23.99,2.36 23.62,2.01 23.18,2C23.16,2 23.14,2 23.12,2H0.86ZM14.93,14.6H9.06L7.85,9.4H16.12L14.93,14.6Z" />
          </SvgIcon>
        </IconButton>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
            © {new Date().getFullYear()} Vishal Biyani
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
