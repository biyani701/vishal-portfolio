import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Button,
  Fade,
  Slide,
  Collapse,
  TextField,
  InputAdornment,
  Chip,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Article as ArticleIcon,
  ContactMail as ContactMailIcon,
  Star as StarIcon,
  Book as BookIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  History as HistoryIcon,
  Clear as ClearIcon,
  Logout as LogoutIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import ToolpadAccountComponent from "./auth/toolpad/ToolpadAccountComponent";
import AuthJsClient from "./auth/AuthJsClient";

const ModernMobileMenu = ({
  open,
  onClose,
  isAuthenticated,
  authJsAuthenticated,
  user,
  isDarkMode,
  toggleDarkMode,
  availablePalettes,
  currentPaletteIndex,
  changePalette,
  resumeItems = [],
  domainKnowledgeData = {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [animationDelay, setAnimationDelay] = useState(0);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [recentItems, setRecentItems] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    account: false,
    settings: false,
    signIn: false,
    recent: false,
  });

  useEffect(() => {
    if (open) {
      setAnimationDelay(100);
      // Load recent items from localStorage
      try {
        const saved = localStorage.getItem("recentItems");
        if (saved) {
          setRecentItems(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading recent items:", error);
      }
    } else {
      setAnimationDelay(0);
    }
  }, [open]);

  // Enhanced menu items with submenus
  const menuItems = useMemo(
    () => [
      { id: "home", label: "Home", icon: <HomeIcon />, path: "/" },
      { id: "hero", label: "Hero", icon: <StarIcon />, path: "/heroref" },
      { id: "about", label: "About Me", icon: <PersonIcon />, path: "/about" },
      {
        id: "resume",
        label: "Resume",
        icon: <WorkIcon />,
        hasSubmenu: true,
        submenu: resumeItems.map((item) => ({
          id: item.id,
          label: item.label,
          icon: item.icon || <WorkIcon />,
          path: `/resume#${item.id}`,
        })),
      },
      {
        id: "portfolio",
        label: "Portfolio",
        icon: <WorkIcon />,
        path: "/works",
      },
      {
        id: "knowledge",
        label: "Knowledge Base",
        icon: <BookIcon />,
        hasSubmenu: true,
        submenu: [
          { id: "overview", label: "Overview", icon: <BookIcon />, path: "/knowledge" },
          { id: "glossary", label: "Glossary", icon: <ArticleIcon />, path: "/knowledge/glossary" },
          {
            id: "domain",
            label: "Domain Knowledge",
            icon: <ArticleIcon />,
            hasSubmenu: true,
            submenu: [
              { id: "credit-cards", label: "Credit Cards & Payments", icon: <ArticleIcon />, path: "/knowledge/domain/credit-cards" },
              { id: "market-reference", label: "Market Reference Data", icon: <ArticleIcon />, path: "/knowledge/domain/market-reference" },
              { id: "capital-markets", label: "Capital Markets", icon: <ArticleIcon />, path: "/knowledge/domain/capital-markets" },
            ]
          }
        ],
      },
      { id: "blog", label: "Blog", icon: <ArticleIcon />, path: "/blogs" },
      {
        id: "contact",
        label: "Contact",
        icon: <ContactMailIcon />,
        path: "/contact",
      },
      { id: "docs", label: "Documentation", icon: <BookIcon />, path: "/docs" },
    ],
    [resumeItems]
  );

  // All searchable items including submenus
  const allSearchableItems = useMemo(() => {
    const items = [];
    menuItems.forEach((item) => {
      if (item.hasSubmenu) {
        items.push(...item.submenu);
      } else {
        items.push(item);
      }
    });

    // Add domain knowledge items
    if (domainKnowledgeData?.categories) {
      domainKnowledgeData.categories.forEach((category) => {
        items.push({
          id: `domain-${category.id}`,
          label: category.name,
          icon: <ArticleIcon />,
          path: `/knowledge/domain/${category.id}`,
          keywords: ["knowledge", "domain"],
        });

        category.topics?.forEach((topic) => {
          items.push({
            id: `domain-${category.id}-${topic.id}`,
            label: topic.title,
            icon: <ArticleIcon />,
            path: `/knowledge/domain/${category.id}/${topic.id}`,
            keywords: ["knowledge", "domain", category.name.toLowerCase()],
          });
        });
      });
    }

    return items;
  }, [menuItems, domainKnowledgeData]);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchTerm) return [];

    const searchLower = searchTerm.toLowerCase();
    return allSearchableItems.filter(
      (item) =>
        item.label.toLowerCase().includes(searchLower) ||
        (item.keywords &&
          item.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchLower)
          ))
    );
  }, [searchTerm, allSearchableItems]);

  const handleResumeItemClick = (sectionId) => {
    handleResumeMenuClose(); // Close the dropdown

    // Track the menu click
    // trackMenuClick(sectionId, "resume-menu");

    if (location.pathname === "/") {
      // Already on home, just scroll
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home and scroll after landing
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  // Previous implementation - Retain this in case of
  // const [resumeAnchorEl, setResumeAnchorEl] = useState(null);

  // const handleResumeMenuClose = () => {
  //   setResumeAnchorEl(null);
  // };

  const handleResumeMenuClose = () => {
    setExpandedMenus((prev) => ({
      ...prev,
      resume: false,
    }));
  };

  const handleItemClick = (item) => {
    // Add to recent items
    const newRecentItem = {
      id: item.id,
      label: item.label,
      path: item.path,
      timestamp: Date.now(),
    };

    const updatedRecent = [
      newRecentItem,
      ...recentItems.filter((r) => r.id !== item.id),
    ].slice(0, 5);
    setRecentItems(updatedRecent);
    localStorage.setItem("recentItems", JSON.stringify(updatedRecent));

    onClose();

    // Handle hash navigation for resume items
    if (item.path.includes("#")) {
      const [path, hash] = item.path.split("#");
      if (path.startsWith("/resume")) {
        handleResumeItemClick(hash);
        return;
      }
      navigate(path);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate(item.path);
    }
  };

  const handleMenuToggle = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleSignOut = async () => {
    try {
      await AuthJsClient.signOut();
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const clearRecentItems = () => {
    setRecentItems([]);
    localStorage.removeItem("recentItems");
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isUserAuthenticated = isAuthenticated || authJsAuthenticated;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100vw",
          height: "100vh",
          maxHeight: "95%",
          background: (theme) => theme.palette.mode === 'dark'
            ? "linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(156, 39, 176, 0.15) 100%)"
            : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          border: "none",
          color: (theme) => theme.palette.text.primary,
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Fade in={open} timeout={300}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(45deg, #1976d2, #9c27b0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Menu
            </Typography>
          </Fade>
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.primary",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User Section - Collapsible */}
        {isUserAuthenticated && (
          <Slide direction="left" in={open} timeout={400}>
            <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <ListItemButton
                onClick={() => toggleSection("account")}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  src={user?.image || user?.avatar_url}
                  sx={{
                    width: 40,
                    height: 40,
                    border: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  {user?.name?.[0] || user?.login?.[0] || "U"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {user?.name || user?.login || "User"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email || "Welcome back!"}
                  </Typography>
                </Box>
                <IconButton size="small">
                  {expandedSections.account ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </ListItemButton>

              {/* Account Actions - Collapsible */}
              <Collapse
                in={expandedSections.account}
                timeout="auto"
                unmountOnExit
              >
                <Box sx={{ p: 2, pt: 0 }}>
                  <List dense>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          onClose();
                          navigate("/profile");
                        }}
                        sx={{ borderRadius: 1, py: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={handleSignOut}
                        sx={{ borderRadius: 1, py: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Collapse>
            </Box>
          </Slide>
        )}

        {/* Authentication Section for Non-authenticated Users - Compact */}
        {!isUserAuthenticated && (
          <Slide direction="left" in={open} timeout={400}>
            <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <ListItemButton
                onClick={() => toggleSection("signIn")}
                sx={{ p: 2 }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Sign In"
                  secondary="Access your account"
                />
                <IconButton size="small">
                  {expandedSections.signIn ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </ListItemButton>

              {/* Sign-in Providers - Collapsible */}
              <Collapse
                in={expandedSections.signIn}
                timeout="auto"
                unmountOnExit
              >
                <Box sx={{ p: 2, pt: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Choose your preferred sign-in method:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {[
                      { id: "github", name: "GitHub", color: "#333" },
                      { id: "google", name: "Google", color: "#4285f4" },
                      { id: "facebook", name: "Facebook", color: "#1877f2" },
                      { id: "linkedin", name: "LinkedIn", color: "#0077b5" },
                      { id: "auth0", name: "Auth0", color: "#eb5424" },
                    ].map((provider) => (
                      <Box
                        key={provider.id}
                        onClick={async () => {
                          console.log(
                            `[Mobile Menu] Signing in with ${provider.id}`
                          );
                          try {
                            await AuthJsClient.signIn(provider.id);
                            onClose();
                          } catch (error) {
                            console.error(
                              `[Mobile Menu] Error signing in with ${provider.id}:`,
                              error
                            );
                          }
                        }}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: provider.color,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "medium" }}
                        >
                          Continue with {provider.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </Box>
          </Slide>
        )}

        {/* Search Section */}
        <Slide direction="left" in={open} timeout={500}>
          <Box
            sx={{ p: 2, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  },
                },
              }}
            />

            {/* Search Results */}
            {searchTerm && searchResults.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {searchResults.length} result
                  {searchResults.length !== 1 ? "s" : ""} found
                </Typography>
                <List dense>
                  {searchResults.slice(0, 5).map((item) => (
                    <ListItem key={item.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleItemClick(item)}
                        sx={{
                          borderRadius: 1,
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{ fontSize: "0.9rem" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Slide>

        {/* Recent Items - Collapsible */}
        {recentItems.length > 0 && (
          <Slide direction="left" in={open} timeout={600}>
            <Box sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <ListItemButton
                onClick={() => toggleSection('recent')}
                sx={{ p: 2 }}
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Recent"
                  secondary={`${recentItems.length} recent item${recentItems.length !== 1 ? 's' : ''}`}
                />
                <IconButton size="small">
                  {expandedSections.recent ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </ListItemButton>

              {/* Recent Items Content - Collapsible */}
              <Collapse in={expandedSections.recent} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Chip
                      label="Clear All"
                      size="small"
                      variant="outlined"
                      onClick={clearRecentItems}
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  </Box>
                  <List dense>
                    {recentItems.slice(0, 5).map((item) => (
                      <ListItem key={`recent-${item.id}`} disablePadding>
                        <ListItemButton
                          onClick={() => handleItemClick(item)}
                          sx={{
                            borderRadius: 1,
                            py: 1,
                            "&:hover": {
                              backgroundColor: "rgba(25, 118, 210, 0.1)",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <HistoryIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{ fontSize: "0.9rem" }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Collapse>
            </Box>
          </Slide>
        )}

        {/* Navigation Items */}
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          <List>
            {menuItems.map((item, index) => (
              <Slide
                key={item.id}
                direction="left"
                in={open}
                timeout={500 + index * 100}
              >
                <Box>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() =>
                        item.hasSubmenu
                          ? handleMenuToggle(item.id)
                          : handleItemClick(item)
                      }
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        px: 2,
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.1)",
                          transform: "translateX(8px)",
                        },
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: "primary.main",
                          minWidth: 40,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: "medium",
                          fontSize: "1.1rem",
                        }}
                      />
                      {item.hasSubmenu && (
                        <IconButton size="small">
                          {expandedMenus[item.id] ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      )}
                    </ListItemButton>
                  </ListItem>

                  {/* Submenu */}
                  {item.hasSubmenu && (
                    <Collapse
                      in={expandedMenus[item.id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {item.submenu.map((subItem) => (
                          <Box key={subItem.id}>
                            <ListItem disablePadding sx={{ pl: 4 }}>
                              <ListItemButton
                                onClick={() =>
                                  subItem.hasSubmenu
                                    ? handleMenuToggle(subItem.id)
                                    : handleItemClick(subItem)
                                }
                                sx={{
                                  borderRadius: 1,
                                  py: 1,
                                  px: 2,
                                  "&:hover": {
                                    backgroundColor: "rgba(25, 118, 210, 0.05)",
                                    transform: "translateX(4px)",
                                  },
                                  transition: "all 0.2s ease-in-out",
                                }}
                              >
                                <ListItemIcon
                                  sx={{ minWidth: 32, color: "text.secondary" }}
                                >
                                  {subItem.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={subItem.label}
                                  primaryTypographyProps={{
                                    fontSize: "0.95rem",
                                    color: "text.secondary",
                                  }}
                                />
                                {subItem.hasSubmenu && (
                                  <IconButton size="small">
                                    {expandedMenus[subItem.id] ? (
                                      <ExpandLessIcon fontSize="small" />
                                    ) : (
                                      <ExpandMoreIcon fontSize="small" />
                                    )}
                                  </IconButton>
                                )}
                              </ListItemButton>
                            </ListItem>

                            {/* Nested Submenu */}
                            {subItem.hasSubmenu && (
                              <Collapse
                                in={expandedMenus[subItem.id]}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding>
                                  {subItem.submenu.map((nestedItem) => (
                                    <ListItem
                                      key={nestedItem.id}
                                      disablePadding
                                      sx={{ pl: 8 }}
                                    >
                                      <ListItemButton
                                        onClick={() => handleItemClick(nestedItem)}
                                        sx={{
                                          borderRadius: 1,
                                          py: 0.5,
                                          px: 2,
                                          "&:hover": {
                                            backgroundColor: "rgba(25, 118, 210, 0.03)",
                                            transform: "translateX(2px)",
                                          },
                                          transition: "all 0.2s ease-in-out",
                                        }}
                                      >
                                        <ListItemIcon
                                          sx={{ minWidth: 28, color: "text.disabled" }}
                                        >
                                          {nestedItem.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={nestedItem.label}
                                          primaryTypographyProps={{
                                            fontSize: "0.85rem",
                                            color: "text.disabled",
                                          }}
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  ))}
                                </List>
                              </Collapse>
                            )}
                          </Box>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              </Slide>
            ))}
          </List>
        </Box>

        {/* Settings Section - Collapsible */}
        <Slide direction="up" in={open} timeout={600}>
          <Box sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <ListItemButton
              onClick={() => toggleSection("settings")}
              sx={{ p: 2 }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Settings"
                secondary="Theme & preferences"
              />
              <IconButton size="small">
                {expandedSections.settings ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </ListItemButton>

            {/* Settings Content - Collapsible */}
            <Collapse
              in={expandedSections.settings}
              timeout="auto"
              unmountOnExit
            >
              <Box sx={{ p: 2, pt: 0 }}>
                {/* Dark Mode Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDarkMode}
                      onChange={(e) => toggleDarkMode(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {/* {isDarkMode ? (
                        <Brightness7Icon fontSize="small" />
                      ) : (
                        <Brightness4Icon fontSize="small" />
                      )} */}
                      <Typography variant="body2">
                        Dark Mode
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 2, ml: 0 }}
                />

                {/* Color Palette */}
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Color Theme
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {availablePalettes?.map((palette, index) => (
                      <Tooltip key={palette.name} title={palette.name} arrow>
                        <Box
                          onClick={() => changePalette(index)}
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: palette.primary,
                            border: "2px solid",
                            borderColor:
                              index === currentPaletteIndex
                                ? "primary.main"
                                : "transparent",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "scale(1.2)",
                            },
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </Box>
        </Slide>
      </Box>
    </Drawer>
  );
};

ModernMobileMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  authJsAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  isDarkMode: PropTypes.bool,
  toggleDarkMode: PropTypes.func,
  availablePalettes: PropTypes.array,
  currentPaletteIndex: PropTypes.number,
  changePalette: PropTypes.func,
  resumeItems: PropTypes.array,
  domainKnowledgeData: PropTypes.object,
};

export default ModernMobileMenu;
