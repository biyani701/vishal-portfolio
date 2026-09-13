import React, { useState } from 'react';
import { Box, Typography, useTheme, Link, Tabs, Tab, Button } from '@mui/material';
import PrivacyPreferencesButton from './PrivacyPreferencesButton';
import PropTypes from "prop-types";

export default function PrivacyPolicy({ initialTab = 0 }) {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleShowPrivacySettings = () => {
    if (window.klaro && typeof window.klaro.show === 'function') {
      window.klaro.show();
    }
  };

  return (
    <Box
      sx={{
        px: theme.spacing(3),
        py: theme.spacing(4),
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
        mt: (theme) => theme.spacing(5),
        textAlign: 'left',
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            fontWeight: 'bold',
          },
        }}
      >
        <Tab label="Privacy Policy" />
        <Tab label="Terms of Use" />
      </Tabs>

      {/* Privacy Policy Tab */}
      {activeTab === 0 && (
        <>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              textAlign: 'center',
            }}
          >
            Privacy Policy
          </Typography>

          <Button
            variant="outlined"
            onClick={handleShowPrivacySettings}
            sx={{
              display: 'block',
              mx: 'auto',
              mb: 3,
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
            }}
          >
            Manage Cookie Preferences
          </Button>

          <Typography paragraph sx={{ mb: theme.spacing(2) }}>
            Your privacy is important to us. This website is hosted on GitHub Pages and uses third-party services to improve your experience.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            1. Data Collection
          </Typography>
          <Typography component="p">
            We collect personal information only when you submit the contact form provided via Tally.so. This includes your first name, last name, email address, and message content.
          </Typography>
          <Typography component="p">
            Form submissions are securely stored and managed using Notion for analysis and tracking.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            2. Analytics
          </Typography>
          <Typography component="p">
            We use Google Analytics to understand how visitors interact with our site. Google Analytics uses cookies to collect anonymous traffic data such as pages visited, browser type, and device information.
          </Typography>
          <Typography component="p">
            You can opt out of Google Analytics by installing the Google Analytics opt-out browser add-on:{' '}
            <Link
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: theme.palette.primary.main }}
            >
              https://tools.google.com/dlpage/gaoptout
            </Link>
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            3. Cookies
          </Typography>
          <Typography component="p">
            This site stores cookies in your browser to remember preferences like theme mode or palette selection. These are used solely to enhance your browsing experience and are not used for tracking or advertising purposes.
          </Typography>
          <Typography component="p" sx={{ mt: 1 }}>
            Essential cookies are necessary for the website to function properly. You can manage your cookie preferences at any time by clicking the &quotManage Cookie Preferences&quot button above or the cookie icon at the bottom of the page.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            4. Data Sharing
          </Typography>
          <Typography component="p">
            We do not sell or share your personal data with third parties. Data collected through the contact form is used solely by the site owner for communication purposes.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            5. Your Rights
          </Typography>
          <Typography component="p">
            If you wish to access, correct, or delete any personal information submitted through this website, please contact us directly using the form provided.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            6. Contact
          </Typography>
          <Typography component="p">
            If you have any questions regarding this privacy policy, feel free to reach out via the contact form.
          </Typography>

          <Typography
            variant="caption"
            display="block"
            sx={{ mt: theme.spacing(6), color: theme.palette.text.secondary }}
          >
            Last updated: May 15, 2023
          </Typography>
        </>
      )}

      {/* Terms of Use Tab */}
      {activeTab === 1 && (
        <>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              textAlign: 'center',
            }}
          >
            Terms of Use
          </Typography>

          <Typography paragraph sx={{ mb: theme.spacing(2) }}>
            By accessing and using this website, you agree to be bound by these Terms of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            1. Use License
          </Typography>
          <Typography component="p">
            Permission is granted to temporarily view the materials on this website for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Typography>
          <Typography component="ul" sx={{ pl: 4, mt: 1 }}>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or &quotmirror&quot the materials on any other server</li>
          </Typography>
          <Typography component="p" sx={{ mt: 1 }}>
            This license shall automatically terminate if you violate any of these restrictions and may be terminated at any time. Upon terminating your viewing of these materials, you must destroy any downloaded materials in your possession.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            2. Disclaimer
          </Typography>
          <Typography component="p">
            The materials on this website are provided on an &quotas is&quot basis. The website owner makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </Typography>
          <Typography component="p" sx={{ mt: 1 }}>
            Further, the website owner does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on the website or otherwise relating to such materials or on any sites linked to this site.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            3. Limitations
          </Typography>
          <Typography component="p">
            In no event shall the website owner or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website, even if the website owner or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            4. Accuracy of Materials
          </Typography>
          <Typography component="p">
            The materials appearing on this website could include technical, typographical, or photographic errors. The website owner does not warrant that any of the materials on its website are accurate, complete, or current. The website owner may make changes to the materials contained on its website at any time without notice.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            5. Links
          </Typography>
          <Typography component="p">
            The website owner has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by the website owner of the site. Use of any such linked website is at the user&quots own risk.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            6. Modifications
          </Typography>
          <Typography component="p">
            The website owner may revise these terms of use for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: theme.spacing(4) }}>
            7. Governing Law
          </Typography>
          <Typography component="p">
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </Typography>

          <Typography
            variant="caption"
            display="block"
            sx={{ mt: theme.spacing(6), color: theme.palette.text.secondary }}
          >
            Last updated: May 15, 2023
          </Typography>
        </>
      )}

      {/* Cookie settings button */}
      <PrivacyPreferencesButton />
    </Box>
  );
}
PrivacyPolicy.propTypes = {
  initialTab: PropTypes.number,
};