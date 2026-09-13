import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, Container, useTheme } from '@mui/material';

const Contact = () => {
  const formRef = useRef(null);
  const theme = useTheme();
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      try {
        const manager = window.klaro?.getManager?.();
        const consents = manager?.consents;
    
        console.log('Klaro consents:', consents);
    
        const tallyConsent = consents?.tally === true;
        const nortonConsent = consents?.norton === true;
    
        setConsentGiven(tallyConsent && nortonConsent);
      } catch (error) {
        console.warn('Consent check failed:', error);
        setConsentGiven(false);
      }
    };

    // Initial check
    checkConsent();

    // Listen for all relevant Klaro events
    const events = [
      'klaro-consent-changed',
      'klaro-preferences-saved',
      'klaro-consents-updated'
    ];

    events.forEach(event => {
      document.addEventListener(event, checkConsent);
    });

    // Also check periodically in case events are missed
    const interval = setInterval(checkConsent, 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, checkConsent);
      });
      clearInterval(interval);
    };
  }, []);

  // useEffect(() => {
  //   // Load the Tally script
  //   const script = document.createElement('script');
  //   script.src = 'https://tally.so/widgets/embed.js';
  //   script.async = true;
  //   script.onload = () => {
  //     // Once the script is loaded, initialize Tally
  //     if (window.Tally) {
  //       window.Tally.loadEmbeds();
  //     }
  //   };
  //   document.body.appendChild(script);

  //   // Clean up
  //   return () => {
  //     if (script.parentNode) {
  //       document.body.removeChild(script);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (!consentGiven) return;

    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    script.onload = () => {
      if (window.Tally) {
        window.Tally.loadEmbeds();
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [consentGiven]);

  return (
    <Box 
      id="contact" 
      sx={{ 
        py: 8, 
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
        mb: '80px', // Add bottom margin to account for the fixed footer
      }}
    >
      <Container maxWidth="md">
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            mb: 4,
            color: theme.palette.mode === 'dark' ? 'white' : 'primary.main'
          }}
        >
          Get in Touch
        </Typography>
        {consentGiven ? (
          <Box 
            ref={formRef}
            sx={{
              width: '100%',
              minHeight: '300px',
              mb: 4,
              boxShadow: 3,
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white',
            }}
          >
            <iframe 
              data-tally-src="https://tally.so/embed/mB6PPe?hideTitle=1&transparentBackground=1&dynamicHeight=1" 
              width="100%" 
              height="276"             
              title="Contact Me"
              style={{ border: 'none' }}
            />
          </Box>
        ) : (
          <Typography align="center" color="textSecondary">
            Please accept the required cookies to view and use the contact form.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default Contact;