import { useEffect, useRef } from 'react';
import { Box, Typography, Container } from '@mui/material';

const TallyContactForm = () => {
  const formRef = useRef(null);

  useEffect(() => {
    // Load the Tally script
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    script.onload = () => {
      // Once the script is loaded, initialize Tally
      if (window.Tally) {
        window.Tally.loadEmbeds();
      }
    };
    document.body.appendChild(script);

    // Clean up
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box id="contact" sx={{ py: 8, backgroundColor: 'background.paper' }}>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Contact Me
        </Typography>
        <Box
          ref={formRef}
          sx={{
            width: '100%',
            minHeight: '300px',
            mb: 4
          }}
        >
          <iframe
            data-tally-src="https://tally.so/embed/mB6PPe?hideTitle=1&transparentBackground=1&dynamicHeight=1"
            width="100%"
            height="276"
            style={{
              border: 'none',
              margin: 0
            }}
            title="Contact Me"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default TallyContactForm;