import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import SvgIcon from "@mui/material/SvgIcon";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Close as CloseIcon } from "@mui/icons-material";
import { useLayoutDimensions } from "../hooks/useLayoutDimensions";

// Styled IconButton for cookie preferences
const CookieIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main),
  position: 'relative',
  flexShrink: 0,
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
  // Ensure proper touch targets and visibility on all screen sizes
  [theme.breakpoints.down('sm')]: {
    minWidth: 44,
    minHeight: 44,
    // Ensure button stays within viewport in landscape
    '@media (orientation: landscape)': {
      minWidth: 36,
      minHeight: 36,
    },
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
  const { 
    isMobile, 
    isSmallScreen,
    isPortrait,
    spacing 
  } = useLayoutDimensions();
  
  const [klaroReady, setKlaroReady] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get footer height for positioning calculations
  const footerHeight = theme.customLayout?.footerHeight?.mobile || 56;
  
  // Simplified size calculation
  const buttonSize = (() => {
    if (isSmallScreen) return 32;
    if (isMobile && !isPortrait) return 36;
    if (isMobile) return 40;
    return 36;
  })();

  const iconSize = buttonSize <= 32 ? "small" : "medium";

  // Simplified modal positioning - let CSS handle most of the work
  const addModalClasses = () => {
    const klaroModal = document.querySelector('.klaro');
    const klaroModalContent = document.querySelector('.klaro .cm-modal');
    
    if (!klaroModal || !klaroModalContent) return;

    // Add custom classes for CSS targeting
    klaroModal.classList.add('klaro-custom');
    klaroModalContent.classList.add('klaro-modal-custom');

    // Add orientation and device classes
    if (isMobile) {
      klaroModal.classList.add('klaro-mobile');
      klaroModalContent.classList.add('klaro-mobile');
      
      if (isPortrait) {
        klaroModal.classList.add('klaro-portrait');
        klaroModalContent.classList.add('klaro-portrait');
      } else {
        klaroModal.classList.add('klaro-landscape');
        klaroModalContent.classList.add('klaro-landscape');
      }
    } else {
      klaroModal.classList.add('klaro-desktop');
      klaroModalContent.classList.add('klaro-desktop');
    }

    // Set CSS custom properties for dynamic values
    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);

    // Add backdrop click to close
    const handleBackdropClick = (e) => {
      if (e.target === klaroModal) {
        window.klaro?.hide();
      }
    };
    
    klaroModal.removeEventListener('click', handleBackdropClick);
    klaroModal.addEventListener('click', handleBackdropClick);
  };

  useEffect(() => {
    // Check if Klaro is available
    const checkKlaro = () => {
      if (window.klaro && typeof window.klaro.show === "function") {
        setKlaroReady(true);
        clearInterval(interval);
      }
    };
    
    const interval = setInterval(checkKlaro, 1000);
    checkKlaro();

    // Add pulse animation after delay
    const pulseTimer = setTimeout(() => {
      setPulsing(true);
    }, 3000);

    // Event listeners for modal show/hide
    const handleKlaroShow = () => {
      setIsModalOpen(true);
      
      // Apply classes multiple times to ensure they stick
      setTimeout(addModalClasses, 10);
      setTimeout(addModalClasses, 50);
      setTimeout(addModalClasses, 100);
      setTimeout(addModalClasses, 200);
      
      // Handle orientation changes
      const handleOrientationChange = () => {
        setTimeout(() => {
          document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
          document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
          addModalClasses();
        }, 100);
      };
      
      window.addEventListener('resize', handleOrientationChange);
      window.addEventListener('orientationchange', handleOrientationChange);
    };
    
    const handleKlaroHide = () => {
      setIsModalOpen(false);
      // Clean up event listeners
      window.removeEventListener('resize', addModalClasses);
      window.removeEventListener('orientationchange', addModalClasses);
    };

    window.addEventListener('klaro-show', handleKlaroShow);
    window.addEventListener('klaro-hide', handleKlaroHide);

    return () => {
      clearInterval(interval);
      clearTimeout(pulseTimer);
      window.removeEventListener('klaro-show', handleKlaroShow);
      window.removeEventListener('klaro-hide', handleKlaroHide);
    };
  }, [isMobile, isPortrait, footerHeight]);

  const handleClick = () => {
    if (window.klaro && typeof window.klaro.show === "function") {
      try {
        if (isModalOpen) {
          window.klaro.hide();
        } else {
          window.klaro.show();
        }
        setPulsing(false);
      } catch (error) {
        console.error("Error toggling Klaro modal:", error);
      }
    } else {
      console.warn("Klaro is not properly initialized");
    }
  };

  if (!klaroReady) {
    return null;
  }

  return (
    <Tooltip title={isModalOpen ? "Close Cookie Settings" : "Cookie Settings"} arrow>
      <CookieIconButton
        onClick={handleClick}
        aria-label={isModalOpen ? "Close Cookie Settings" : "Cookie Settings"}
        className={pulsing && !isModalOpen ? "pulse" : ""}
        size={iconSize}
        sx={{
          width: buttonSize,
          height: buttonSize,
          minWidth: buttonSize,
          padding: spacing.xs / 2,
          transform: isModalOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease, background-color 0.3s ease',
          zIndex: 'auto',
          
          '@media (pointer: coarse)': {
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: isModalOpen ? 'rotate(180deg) scale(1.05)' : 'scale(1.05)',
            },
          },
        }}
      >
        {isModalOpen ? 
          <CloseIcon fontSize={iconSize} /> : 
          <CookieIcon fontSize={iconSize} />
        }
      </CookieIconButton>
    </Tooltip>
  );
};

export default PrivacyPreferencesButton;