import React, { useState, useEffect, useMemo } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import removeMarkdown from 'remove-markdown';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Chip,
  useTheme,
  Paper,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  Stack,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from "@mui/icons-material/Close";
import glossaryData from "../../data/glossaryData";

// Glossary component
const Glossary = () => {
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [flippedCards, setFlippedCards] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  // Generate alphabet filters
  const alphabetFilters = useMemo(() => {
    const letters = Array.from({ length: 26 }, (_, i) =>
      String.fromCharCode(65 + i)
    );
    const numbers = ["0-9"];
    return [...letters, ...numbers];
  }, []);

  // Filter glossary items based on selected filter
  const filteredItems = useMemo(() => {
    if (selectedFilter === "all") {
      return glossaryData;
    } else if (selectedFilter === "0-9") {
      return glossaryData.filter((item) => /^[0-9]/.test(item.acronym[0]));
    } else {
      return glossaryData.filter(
        (item) => item.acronym[0].toUpperCase() === selectedFilter
      );
    }
  }, [selectedFilter]);

  // Log glossary data for debugging
  // useEffect(() => {
  //   console.log('Glossary Data:', glossaryData);
  //   console.log('Filtered Items:', filteredItems);
  // }, [filteredItems]);

  // Group items by first letter for better organization
  const groupedItems = useMemo(() => {
    const groups = {};

    if (!filteredItems || filteredItems.length === 0) {
      console.warn("No filtered items available for grouping");
      return {};
    }

    filteredItems.forEach((item) => {
      if (!item.acronym) {
        console.warn("Item missing acronym:", item);
        return;
      }

      const firstLetter = item.acronym[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(item);
    });

    // Sort the groups alphabetically
    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {});
  }, [filteredItems]);

  // Handle card flip with animation - only one card flipped at a time
  const handleCardFlip = (id) => {
    setFlippedCards((prev) => {
      // If clicking on already flipped card, just flip it back
      if (prev[id]) {
        return { ...prev, [id]: false };
      }

      // Otherwise, flip all cards back and flip the clicked one
      const newState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = false;
      });
      newState[id] = true;

      return newState;
    });
  };

  // Handle text expansion dialog
  const handleTextExpand = (e, item) => {
    e.stopPropagation(); // Prevent card flip when clicking on text
    setDialogContent(item);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogContent({});
  };

  // Configurable truncation length
  const TRUNCATION_LENGTH = 120;

  // Truncate text function
  const truncateText = (text, maxLength = TRUNCATION_LENGTH) => {
    const plainText = removeMarkdown(text || '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  // Count items for each filter
  const filterCounts = useMemo(() => {
    const counts = { all: glossaryData.length };

    alphabetFilters.forEach((letter) => {
      if (letter === "0-9") {
        counts[letter] = glossaryData.filter((item) =>
          /^[0-9]/.test(item.acronym[0])
        ).length;
      } else {
        counts[letter] = glossaryData.filter(
          (item) => item.acronym[0].toUpperCase() === letter
        ).length;
      }
    });

    return counts;
  }, [alphabetFilters]);

  return (
    <Box
      component="section"
      sx={{
        py: 6,
        minHeight: "calc(100vh - 64px)",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 4,
            color: "primary.main",
            textAlign: "center",
          }}
        >
          Glossary
        </Typography>

        {/* Alphabet filter */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Chip
            label="All"
            color={selectedFilter === "all" ? "primary" : "default"}
            onClick={() => setSelectedFilter("all")}
            sx={{ m: 0.5 }}
          />

          {alphabetFilters.map((letter) => (
            <Badge
              key={letter}
              badgeContent={filterCounts[letter] || 0}
              color="secondary"
              showZero
              sx={{ m: 0.5 }}
            >
              <Chip
                label={letter}
                color={selectedFilter === letter ? "primary" : "default"}
                onClick={() => setSelectedFilter(letter)}
                disabled={!filterCounts[letter]}
              />
            </Badge>
          ))}
        </Paper>

        {/* Glossary content */}
        {Object.keys(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([letter, items]) => (
            <Box key={letter} sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 2,
                  fontWeight: 500,
                  color: "text.primary",
                  borderBottom: `2px solid ${theme.palette.primary.main}`,
                  pb: 1,
                }}
              >
                {letter}
              </Typography>

              <Grid container spacing={2} justifyContent="center">
                {items.map((item) => {
                  const isFlipped = flippedCards[item.id];
                  const truncatedDetails = truncateText(item.details);
                  const needsTruncation = item.details.length > 120;

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      key={item.id}
                      sx={{
                        maxWidth: { xs: "100%", sm: "300px", md: "250px" },
                        mx: "auto",
                      }}
                    >
                      <Box
                          sx={{
                            position: 'relative',
                            top: 15,
                            right: -8,
                            bgcolor: 'primary.main',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: '4px 0 0 4px',
                            zIndex: 10,
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            '&::after': {
                              content: '""',
                              position: 'relative',
                              right: -8,
                              top: 0,
                              width: 0,
                              height: 0,
                              borderTop: '14px solid transparent',
                              borderBottom: '14px solid transparent',
                              borderLeft: `8px solid ${theme.palette.primary.main}`,
                            }
                          }}
                        >
                          {item.acronym}
                        </Box>
                        {/* New Addition */}
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            cursor: 'pointer',
                            perspective: '1000px',
                            '&:hover': {
                              transform: isFlipped
                                ? 'rotateY(180deg) scale(1.02) translateZ(10px)'
                                : 'rotateY(0deg) scale(1.02) translateZ(10px)',
                            }
                          }}
                          onClick={() => handleCardFlip(item.id)}
                        >
                        {/* End Addition */}
                      <Card
                        elevation={3}
                        sx={{
                          height: { xs: 220, sm: 240 },
                          maxWidth: "100%",
                          position: "relative",
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 6,
                          },
                          cursor: "pointer",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                        // onClick={() => handleCardFlip(item.id)}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            borderRadius: 1,
                          }}
                        >
                          {/* Front */}
                          <CardContent
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              p: { xs: 1.5, sm: 2 },
                              backfaceVisibility: "hidden",
                              transform: "rotateY(0deg)",
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "background.paper"
                                  : "background.paper",
                              borderLeft: `4px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                flex: 1,
                              }}
                            >
                              <Typography
                                variant="h6"
                                color="primary"
                                gutterBottom
                                sx={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                {item.acronym}
                              </Typography>
                              <Divider sx={{ width: '60%', mb: 2, bgcolor: 'primary.main', height: 2 }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                                sx={{
                                  fontWeight: 500,
                                  px: 1,
                                }}
                              >
                                {item.fullForm}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: "auto",
                                pt: 1,
                                borderTop: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ opacity: 0.7 }}
                              >
                                {/* (Click to see details) */}
                                ↻ Click to flip for details
                              </Typography>
                            </Box>
                          </CardContent>

                          {/* Back side */}
                          <CardContent
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transform: 'rotateY(180deg)',
                              p: { xs: 1.5, sm: 2 },
                              backfaceVisibility: "hidden",
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? "primary.dark"
                                  : "primary.light",
                              color:
                                theme.palette.mode === "dark"
                                  ? "white"
                                  : "text.primary",
                              overflow: "hidden",
                            }}
                          >
                            <Box sx={{ mb: 1 }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                color={
                                  theme.palette.mode === "dark"
                                    ? "primary.light"
                                    : "primary.dark"
                                }
                              >
                                {item.acronym}: {item.fullForm}
                              </Typography>
                            </Box>
                            <Divider sx={{ mb: 1.5 }} />
                            <Box
                              sx={{
                                flex: 1,
                                overflowY: "auto",
                                overflowX: "hidden",
                                pr: 1,
                                mr: -1,
                                "&::-webkit-scrollbar": {
                                  width: "6px",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: "rgba(0,0,0,0.2)",
                                  borderRadius: "10px",
                                },
                              }}
                            >
                              <Typography
                                variant="body2"
                                align="left"
                                sx={{
                                  lineHeight: 1.6,
                                  fontSize: "0.875rem",
                                  textAlign: "justify",
                                  wordBreak: "break-word",
                                  hyphens: "auto",
                                  maxWidth: "100%",
                                  overflowWrap: "break-word",
                                }}
                                onClick={needsTruncation ? (e) => handleTextExpand(e, item) : undefined}
                              >
                                {/* {item.details} */}
                                {truncatedDetails}
                                {needsTruncation && (
                                    <Box component="span" sx={{
                                      color: 'rgba(255,255,255,0.8)',
                                      fontStyle: 'italic',
                                      textDecoration: 'underline',
                                      ml: 1
                                    }}>
                                      Read more
                                    </Box>
                                  )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mt: "auto",
                                pt: 1,
                                borderTop: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{ opacity: 0.7 }}
                                display="flex" alignItems="center" gap={0.5}
                              >
                                <ReplayIcon fontSize="inherit" />
                                Click to flip back
                              </Typography>
                            </Box>
                          </CardContent>
                        </Box>
                      </Card>
                      {/* New Addition */}
                      </Box>
                      {/* End Addition */}
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Loading glossary items...
            </Typography>
          </Box>
        )}

        {filteredItems.length === 0 && (
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              my: 8,
              color: "text.secondary",
            }}
          >
            No glossary items found for this filter.
          </Typography>
        )}
      </Container>
        {/* Full text dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <Box>
            <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
              {dialogContent.acronym}
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {dialogContent.fullForm}
            </Typography>
          </Box>
          <IconButton
            onClick={handleDialogClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{
            lineHeight: 1.7,
            textAlign: 'justify'
          }}>
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
            {dialogContent.details}
            </ReactMarkdown>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDialogClose}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Glossary;
