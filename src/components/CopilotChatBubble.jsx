// components/CopilotChatBubble.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import { Box, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

export default function CopilotChatBubble() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Chat Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1600,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Tooltip title={isOpen ? "Close Chat" : "Ask Me Anything"} arrow>
          <IconButton
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              width: 56,
              height: 56,
              borderRadius: "50%",
              boxShadow: theme.shadows[6],
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: theme.shadows[10],
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            onClick={handleToggle}
          >
            {isOpen ? <CloseIcon fontSize="medium" /> : <ChatIcon fontSize="medium" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Chat Popup Portal */}
      {isOpen && createPortal(
        <Box
          sx={{
            position: "fixed",
            bottom: "80px",
            right: isMobile ? "8px" : "16px",
            left: isMobile ? "8px" : "auto",
            zIndex: 10000,
            width: isMobile ? "auto" : "400px",
            height: isMobile ? "calc(100vh - 120px)" : "600px",
            maxWidth: "calc(100vw - 16px)",
            maxHeight: "calc(100vh - 100px)",
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            boxShadow: theme.shadows[20],
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            className="copilot-popup-container"
            sx={{
              width: "100%",
              height: "100%",
              '& .copilotkit-popup': {
                width: '100% !important',
                height: '100% !important',
                position: 'static !important',
                border: 'none !important',
                borderRadius: '0 !important',
                boxShadow: 'none !important',
                margin: '0 !important',
                padding: '0 !important',
              }
            }}
          >
            <CopilotKit
              runtimeUrl="http://192.168.1.137:6600/api/copilotkit"
              // publicApiKey="ck_pub_04e844a3046664d5aee8d25970d0e38f"
            >
              <CopilotPopup
                instructions="You're a helpful AI assistant guiding users through the site."
                defaultOpen={true}
                labels={{
                  title: "Chat with Vishal's Copilot",
                  initial: "Hi there! How can I help you explore this site?",
                }}
                onSetOpen={setIsOpen}
              />
            </CopilotKit>
          </Box>
        </Box>,
        document.body
      )}
    </>
  );
}