import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import SvgIcon from "@mui/material/SvgIcon";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Close as CloseIcon } from "@mui/icons-material";

// Styled IconButton for cookie preferences
const CookieIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main),
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.05)",
  },
  transition: "all 0.3s ease",
  "@keyframes pulse": {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.05)" },
    "100%": { transform: "scale(1)" },
  },
  "&.pulse": {
    animation: "pulse 2s infinite",
  },
}));

// Cookie Icon SVG Component
const CookieIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,10.84 21.79,9.69 21.39,8.61L19.79,10.21C19.93,10.8 20,11.4 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.6,4 13.2,4.07 13.79,4.21L15.4,2.6C14.31,2.21 13.16,2 12,2M19,2A2,2 0 0,0 17,4A2,2 0 0,0 19,6A2,2 0 0,0 21,4A2,2 0 0,0 19,2M10,4A1,1 0 0,0 9,5A1,1 0 0,0 10,6A1,1 0 0,0 11,5A1,1 0 0,0 10,4M7,6A1,1 0 0,0 6,7A1,1 0 0,0 7,8A1,1 0 0,0 8,7A1,1 0 0,0 7,6M16,7A1,1 0 0,0 15,8A1,1 0 0,0 16,9A1,1 0 0,0 17,8A1,1 0 0,0 16,7M9,10A1,1 0 0,0 8,11A1,1 0 0,0 9,12A1,1 0 0,0 10,11A1,1 0 0,0 9,10M16,11A1,1 0 0,0 15,12A1,1 0 0,0 16,13A1,1 0 0,0 17,12A1,1 0 0,0 16,11M14,15A1,1 0 0,0 13,16A1,1 0 0,0 14,17A1,1 0 0,0 15,16A1,1 0 0,0 14,15Z"
    />
  </SvgIcon>
);

const PrivacyPreferencesButton = () => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('smallMobile'));
  const [klaroReady, setKlaroReady] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if Klaro is available and has the show method
    const checkKlaro = () => {
      if (window.klaro && typeof window.klaro.show === "function") {
        setKlaroReady(true);
        clearInterval(interval);
      }
    };
    // Set up an interval to check periodically
    const interval = setInterval(checkKlaro, 1000);

    // Initial check
    checkKlaro();

    // Add pulse animation after a delay
    const pulseTimer = setTimeout(() => {
      setPulsing(true);
    }, 3000);

    // Listen for Klaro modal events
    const handleKlaroShow = () => setIsModalOpen(true);
    const handleKlaroHide = () => setIsModalOpen(false);

    window.addEventListener('klaro-show', handleKlaroShow);
    window.addEventListener('klaro-hide', handleKlaroHide);

    // Clean up interval on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(pulseTimer);
      window.removeEventListener('klaro-show', handleKlaroShow);
      window.removeEventListener('klaro-hide', handleKlaroHide);
    };
  }, []);

  const handleClick = () => {
    if (window.klaro && typeof window.klaro.show === "function") {
      try {
        if (isModalOpen) {
          // If modal is open, close it
          window.klaro.hide();
        } else {
          // If modal is closed, open it
          window.klaro.show();
        }
        setPulsing(false); // Stop pulsing once clicked
      } catch (error) {
        console.error("Error toggling Klaro modal:", error);
      }
    } else {
      console.warn("Klaro is not properly initialized");
    }
  };

  // Don't render anything if Klaro isn't ready
  if (!klaroReady) {
    return null;
  }

  return (
    <Tooltip title={isModalOpen ? "Close Cookie Settings" : "Cookie Settings"} arrow>
      <CookieIconButton
        onClick={handleClick}
        aria-label={isModalOpen ? "Close Cookie Settings" : "Cookie Settings"}
        className={pulsing && !isModalOpen ? "pulse" : ""}
        size="small"
        sx={{
          padding: isSmallMobile ? 0.3 : 0.5,
          minWidth: isSmallMobile ? 28 : 32,
          width: isSmallMobile ? 28 : 32,
          height: isSmallMobile ? 28 : 32,
          transform: isModalOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}
      >
        {isModalOpen ? <CloseIcon fontSize="small" /> : <CookieIcon fontSize="small" />}
      </CookieIconButton>
    </Tooltip>
  );
};

export default PrivacyPreferencesButton;
