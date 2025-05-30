// components/CopilotChatBubble.jsx
import React, { useState, useEffect, useRef } from "react";
import { CopilotKit, useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import {
  Box,
  IconButton,
  Tooltip,
  useMediaQuery,
  Fab,
  Paper,
  TextField,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  Zoom,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Stop as StopIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

function CustomChatInterface() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Get footer heights from theme
  const footerHeight = isMobile 
    ? theme.customLayout?.mobileFooterHeight || theme.customLayout?.footerHeight?.xs || 120
    : theme.customLayout?.fixedFooterHeight || theme.customLayout?.footerHeight?.md || 56;

  const {
    visibleMessages,
    appendMessage,
    stopGeneration,
    isLoading,
  } = useCopilotChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      appendMessage(new TextMessage({ content: inputValue.trim(), role: Role.User }));
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Toggle Button - Fixed Position Above Footer */}
      <Box
        sx={{
          position: 'fixed',
          bottom: footerHeight + 16,
          right: isMobile ? 16 : 24,
          zIndex: theme.zIndex.speedDial,
        }}
      >
        <Zoom in={!isOpen}>
          <Tooltip title="Chat with AI Assistant" placement="left">
            <Fab
              color="primary"
              onClick={handleToggle}
              sx={{
                boxShadow: theme.shadows[6],
                '&:hover': {
                  boxShadow: theme.shadows[12],
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <ChatIcon />
            </Fab>
          </Tooltip>
        </Zoom>
      </Box>

      {/* Chat Interface */}
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: footerHeight + 16,
            right: isMobile ? 16 : 24,
            zIndex: Math.max(theme.zIndex.footer + 100, theme.zIndex.modal),
            width: isMobile ? 'calc(100vw - 32px)' : 400,
            height: isMobile ? `calc(100vh - ${footerHeight + 100}px)` : 500,
            maxHeight: '80vh',
          }}
        >
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BotIcon />
                <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                  Vishal&apos;s Copilot
                </Typography>
              </Box>
              <IconButton
                onClick={handleToggle}
                sx={{ 
                  color: 'inherit',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                p: 1,
                backgroundColor: theme.palette.background.default,
              }}
            >
              {visibleMessages.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <BotIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Hi there! 👋 How can I help you explore this site?
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {visibleMessages.map((message, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        flexDirection: 'column',
                        alignItems: message.role === Role.User ? 'flex-end' : 'flex-start',
                        py: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          maxWidth: '85%',
                          flexDirection: message.role === Role.User ? 'row-reverse' : 'row',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: message.role === Role.User 
                              ? theme.palette.primary.main 
                              : theme.palette.secondary.main,
                          }}
                        >
                          {message.role === Role.User ? <PersonIcon /> : <BotIcon />}
                        </Avatar>
                        <Paper
                          sx={{
                            p: 1.5,
                            backgroundColor: message.role === Role.User 
                              ? theme.palette.primary.main 
                              : theme.palette.grey[100],
                            color: message.role === Role.User 
                              ? theme.palette.primary.contrastText 
                              : theme.palette.text.primary,
                            borderRadius: 2,
                            maxWidth: '100%',
                          }}
                          elevation={1}
                        >
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {message.content}
                          </Typography>
                        </Paper>
                      </Box>
                    </ListItem>
                  ))}
                  <div ref={messagesEndRef} />
                </List>
              )}
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isLoading ? (
                        <IconButton
                          onClick={stopGeneration}
                          color="error"
                          size="small"
                        >
                          <StopIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={handleSendMessage}
                          disabled={!inputValue.trim()}
                          color="primary"
                          size="small"
                        >
                          <SendIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              {isLoading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary">
                    AI is typing...
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
}

export default function CopilotChatBubble() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't render in multi-viewport tools like Responsively App
  if (!document.hasFocus() && window.parent !== window.self) {
    return null;
  }

  // Check if API key exists
  const apiKey = process.env.REACT_APP_COPILOTKIT_PUBLIC_API_KEY;
  if (!apiKey) {
    console.error('CopilotKit API key not found. Make sure REACT_APP_COPILOTKIT_PUBLIC_API_KEY is set in your .env.local file');
    return null;
  }

  return (
    <CopilotKit publicApiKey={apiKey}>
      <CustomChatInterface />
    </CopilotKit>
  );
}