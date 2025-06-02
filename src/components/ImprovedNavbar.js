import PropTypes from "prop-types";
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Document } from "flexsearch";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Avatar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  ListSubheader,
  Box,
  Menu,
  Grow,
  MenuItem,
  Button,
  Divider,
  useMediaQuery,
  Tooltip,
  Icon,
  Grid,
  Container,
} from "@mui/material";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import ArticleIcon from "@mui/icons-material/Article";
import PaletteIcon from "@mui/icons-material/Palette";
import CloseIcon from "@mui/icons-material/Close";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faGraduationCap,
  faAward,
  faEnvelope,
  faFileLines,
  faRoad,
} from "@fortawesome/free-solid-svg-icons";
import { trackClick } from "../utils/analytics";

import { motion } from "framer-motion";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { resumeData } from "./resumeData";
import { skillSections } from "./Skills"; // Import skillSections from Skills component

import { useAuthContext } from "../context/AuthProvider";
import { useAuth as useLegacyAuth } from "../context/AuthContext";
import GitHubIcon from "@mui/icons-material/GitHub";
import SettingsIcon from "@mui/icons-material/Settings";
import config from "../config";
import domainKnowledgeData from "../data/domainKnowledgeData";
import ToolpadAccountComponent from "./auth/toolpad/ToolpadAccountComponent";
import AuthJsClient from "./auth/AuthJsClient";

// Import custom CSS and JS fix for menu issues
import "./KnowledgeBaseMenuFix.css";
import { initKnowledgeBaseMenuFix } from "./KnowledgeBaseMenuFix";
import EnhancedMobileDrawer from "./EnhancedMobileDrawer";
import ModernMobileMenu from "./ModernMobileMenu";
import { useResponsiveHeight } from "../hooks/useResponsiveHeight";
import { useLayoutDimensions } from "../hooks/useLayoutDimensions";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -5 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  }),
};

// Initialize FlexSearch for search functionality
const searchIndex = new Document({
  document: {
    id: "id",
    index: ["section", "content"],
    store: ["section", "content"],
  },
  tokenize: "forward",
  resolution: 9,
});

// Add skills data to search index
const addSkillsToSearchIndex = (skillSections) => {
  if (!skillSections) return;

  // Create skill search entries
  const skillEntries = [];
  let entryId = resumeData.length;

  Object.entries(skillSections).forEach(([category, skills]) => {
    // Add category as a section
    const skillNames = skills.map((skill) => skill.name).join(", ");
    skillEntries.push({
      id: `skill_category_${entryId++}`,
      section: category,
      content: `Skills in ${category}: ${skillNames}`,
    });

    // Add individual skills with more details
    skills.forEach((skill) => {
      skillEntries.push({
        id: `skill_${entryId++}`,
        section: "Skills",
        content: `${skill.name} (${skill.years}+ years experience) - ${category}`,
      });
    });
  });

  // Add to FlexSearch index
  skillEntries.forEach((entry) => {
    if (
      !resumeData.some(
        (item) =>
          item.section === entry.section && item.content === entry.content
      )
    ) {
      resumeData.push(entry);
    }
  });
};

// Initialize the search index with data
const initializeSearchIndex = () => {
  // Add all resume data to the index
  resumeData.forEach((item, index) => {
    searchIndex.add({
      id: item.id || `resume_${index}`,
      section: item.section,
      content: item.content,
    });
  });

  // Add domain knowledge data to the index
  if (domainKnowledgeData && domainKnowledgeData.categories) {
    domainKnowledgeData.categories.forEach((category, catIndex) => {
      searchIndex.add({
        id: `domain_category_${catIndex}`,
        section: "Domain Knowledge",
        content: `${category.title}: ${category.description}`,
      });

      // Add topics within each category
      if (category.topics) {
        category.topics.forEach((topic, topicIndex) => {
          searchIndex.add({
            id: `domain_topic_${catIndex}_${topicIndex}`,
            section: category.title,
            content: `${topic.title}: ${topic.description}`,
          });
        });
      }
    });
  }
};

// Styled components - using theme properly
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(
    theme.palette.common[theme.palette.mode === "dark" ? "white" : "black"],
    theme.palette.mode === "dark" ? 0.15 : 0.08
  ),
  "&:hover": {
    backgroundColor: alpha(
      theme.palette.common[theme.palette.mode === "dark" ? "white" : "black"],
      theme.palette.mode === "dark" ? 0.25 : 0.12
    ),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchResultsDropdown = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  maxHeight: "300px",
  overflowY: "auto",
  zIndex: 1000,
  border: `1px solid ${theme.palette.divider}`,
  "& .MuiListItem-root": {
    padding: theme.spacing(1, 2),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const SearchResultItem = styled(ListItem)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: theme.spacing(0.5),
}));

const SearchResultSection = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: "0.875rem",
}));

const SearchResultContent = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.75rem",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

// Use the theme directly for AppBar styling - no hardcoded colors
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "100%",
  maxWidth: "100vw",
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.footer,
  color: theme.palette.common.white,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 4px 20px rgba(0,0,0,0.5)"
      : "0 2px 10px rgba(0,0,0,0.1)",
  backdropFilter: "blur(8px)",
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  "& .MuiIconButton-root": {
    color: theme.palette.common.white,
  },
  "& .MuiButton-root": {
    color: theme.palette.common.white,
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const ColorPaletteMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 12,
    boxShadow: theme.shadows[4],
    minWidth: 200,
    "& .MuiMenuItem-root": {
      padding: theme.spacing(1.5, 2),
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
      "&.Mui-selected": {
        backgroundColor: theme.palette.action.selected,
      },
    },
  },
}));

// Custom styled menu for Knowledge Base to fix positioning issues
const KnowledgeBaseMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
    minWidth: 220,
    padding: theme.spacing(1),
    maxHeight: "80vh",
    overflowY: "auto",
    marginTop: theme.spacing(1),
    zIndex: 1200,
  },
  "& .MuiBackdrop-root": {
    // Make sure backdrop is clickable to close the menu
    backgroundColor: "transparent",
    zIndex: 1199,
  },
}));

const ColorPaletteButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
}));

const ColorPaletteItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "&::before": {
    content: '""',
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    opacity: 0.7,
  },
}));

// Main component
const NavigationBar = ({
  isDarkMode,
  toggleDarkMode,
  currentPaletteIndex,
  changePalette,
  availablePalettes,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Add media queries for responsive behavior
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLandscape = useMediaQuery("(orientation: landscape)");
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [resumeAnchorEl, setResumeAnchorEl] = useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [query, setQuery] = useState("");
  const [paletteAnchorEl, setPaletteAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [settingsHover, setSettingsHover] = useState(false);
  const [knowledgeAnchorEl, setKnowledgeAnchorEl] = useState(null);
  const [blogAnchorEl, setBlogAnchorEl] = useState(null);
  const [overflowMenuAnchorEl, setOverflowMenuAnchorEl] = useState(null);
  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  // State for keyboard navigation in search results
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);

  const headerHeight = useResponsiveHeight("header");
  const { isDesktop } = useLayoutDimensions();

  // Initialize search index and add data
  React.useEffect(() => {
    // Add skills data to search index
    addSkillsToSearchIndex(skillSections);

    // Initialize the search index with all data
    initializeSearchIndex();

    console.log("Search index initialized with FlexSearch");
  }, []);

  // Perform search when query changes
  React.useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      // Search in both section and content fields
      const results = searchIndex.search(query, {
        enrich: true,
        limit: 10,
      });

      // Process and flatten results
      const flatResults = [];
      results.forEach((resultSet) => {
        if (resultSet.result) {
          resultSet.result.forEach((item) => {
            flatResults.push({
              section: item.doc.section,
              content: item.doc.content,
            });
          });
        }
      });

      // Remove duplicates
      const uniqueResults = [
        ...new Map(
          flatResults.map((item) => [`${item.section}-${item.content}`, item])
        ).values(),
      ];

      setSearchResults(uniqueResults);
    } catch (error) {
      console.error("Error searching with FlexSearch:", error);
      setSearchResults([]);
    }
  }, [query]);

  const matches = searchResults;

  // Get auth functions from both auth systems
  const { user, isAuthenticated, checkSession } = useAuthContext();
  const legacyAuth = useLegacyAuth();

  console.log("[Navbar] Auth context state:", { user, isAuthenticated });

  // Force re-render when authentication state changes
  const [authStateKey, setAuthStateKey] = useState(0);
  // State to track Auth.js authentication status and user role
  const [authJsAuthenticated, setAuthJsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setAuthStateKey((prev) => prev + 1);
  }, [isAuthenticated, authJsAuthenticated, user]);

  // Function to track menu clicks
  const trackMenuClick = (menuId, menuType) => {
    // Get the current user ID if authenticated
    let userId = null;
    if (isAuthenticated || authJsAuthenticated) {
      // Try to get user ID from session
      const session = sessionStorage.getItem("auth_session");
      if (session) {
        try {
          const parsedSession = JSON.parse(session);
          userId =
            parsedSession?.user?.id || parsedSession?.user?.email || null;
        } catch (error) {
          console.error("[Navbar] Error parsing session:", error);
        }
      }
    }

    // Track the click
    trackClick(menuId, menuType, window.location.pathname, userId);
  };

  // Function to force close all menus and navigate
  const forceCloseMenuAndNavigate = (url, trackingId, menuType) => {
    // First close the menu by setting state
    setKnowledgeAnchorEl(null);

    // Add a class to body to indicate we're navigating (for CSS)
    document.body.classList.add("navigating");

    // Force close any open menus by adding a class to them
    const menus = document.querySelectorAll(".MuiMenu-root, .MuiPopover-root");
    menus.forEach((menu) => {
      menu.classList.add("force-hide-menu");

      // Also try to set display:none directly on the element
      menu.style.display = "none";
      menu.style.visibility = "hidden";
      menu.style.opacity = "0";
      menu.style.pointerEvents = "none";
    });

    // Force remove any backdrop elements
    const backdrops = document.querySelectorAll(".MuiBackdrop-root");
    backdrops.forEach((backdrop) => {
      backdrop.classList.add("force-hide-menu");

      // Also try to set display:none directly on the element
      backdrop.style.display = "none";
      backdrop.style.visibility = "hidden";
      backdrop.style.opacity = "0";
      backdrop.style.pointerEvents = "none";
    });

    // Try to remove any menu papers
    const papers = document.querySelectorAll(".MuiPaper-root");
    papers.forEach((paper) => {
      if (paper.closest(".MuiMenu-root, .MuiPopover-root")) {
        paper.classList.add("force-hide-menu");
        paper.style.display = "none";
        paper.style.visibility = "hidden";
        paper.style.opacity = "0";
        paper.style.pointerEvents = "none";
      }
    });

    // Navigate immediately to prevent any race conditions
    navigate(url);
    trackMenuClick(trackingId, menuType);

    // Remove the navigating class after navigation
    setTimeout(() => {
      document.body.classList.remove("navigating");

      // Remove the force-hide class after navigation is complete
      menus.forEach((menu) => {
        menu.classList.remove("force-hide-menu");
        menu.style.removeProperty("display");
        menu.style.removeProperty("visibility");
        menu.style.removeProperty("opacity");
        menu.style.removeProperty("pointer-events");
      });

      backdrops.forEach((backdrop) => {
        backdrop.classList.remove("force-hide-menu");
        backdrop.style.removeProperty("display");
        backdrop.style.removeProperty("visibility");
        backdrop.style.removeProperty("opacity");
        backdrop.style.removeProperty("pointer-events");
      });

      papers.forEach((paper) => {
        if (paper.closest(".MuiMenu-root, .MuiPopover-root")) {
          paper.classList.remove("force-hide-menu");
          paper.style.removeProperty("display");
          paper.style.removeProperty("visibility");
          paper.style.removeProperty("opacity");
          paper.style.removeProperty("pointer-events");
        }
      });
    }, 300);
  };

  // Force a session check when the navbar mounts
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("[Navbar] Checking authentication status");
      try {
        // Check session with the context
        const session = await checkSession();

        // Also check with AuthJsClient
        const isAuthJsAuthenticated = await AuthJsClient.isAuthenticated();
        setAuthJsAuthenticated(isAuthJsAuthenticated);

        // Get user role if authenticated
        if (isAuthJsAuthenticated && session?.user) {
          try {
            // Get user role from Auth.js session
            const role = session?.user?.role || "user";
            setUserRole(role);
            console.log("[Navbar] User role:", role);
          } catch (error) {
            console.error("[Navbar] Error getting user role:", error);
            setUserRole("user"); // Default to user role
          }
        }

        console.log("[Navbar] Authentication status:", {
          isAuthenticated,
          authJsAuthenticated: isAuthJsAuthenticated,
          session,
          userRole,
          user,
          shouldShowAccount: isAuthenticated || isAuthJsAuthenticated,
        });
      } catch (error) {
        console.error("[Navbar] Error checking authentication status:", error);
      }
    };

    checkAuthStatus();

    // Set up an interval to periodically check authentication status
    const intervalId = setInterval(async () => {
      const isAuthJsAuthenticated = await AuthJsClient.isAuthenticated();
      setAuthJsAuthenticated(isAuthJsAuthenticated);
    }, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [checkSession]);

  // Initialize the Knowledge Base menu fix
  React.useEffect(() => {
    console.log("[Navbar] Initializing Knowledge Base menu fix");
    // Initialize the fix and get the cleanup function
    const cleanup = initKnowledgeBaseMenuFix();

    // Return the cleanup function to be called when the component unmounts
    return cleanup;
  }, []);

  // Create a simplified logout function that uses Auth.js signOut
  const combinedLogout = async () => {
    console.log("[Auth Debug] Signing out with Auth.js");

    try {
      // Call the signOut function from AuthJsClient
      AuthJsClient.signOut();
      console.log("[Auth Debug] Sign out successful");
    } catch (error) {
      console.error("[Auth Debug] Error signing out:", error);
    }
  };
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    combinedLogout();
    handleMenuClose();
  };

  const handleResumeItemClick = (sectionId) => {
    handleResumeMenuClose(); // Close the dropdown

    // Track the menu click
    trackMenuClick(sectionId, "resume-menu");

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleResumeMenuOpen = (event) => {
    setResumeAnchorEl(event.currentTarget);
  };

  const handleResumeMenuClose = () => {
    setResumeAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
    if (event.target.value) {
      setSearchAnchorEl(event.currentTarget);
      // Reset selected index when search query changes
      setSelectedResultIndex(-1);
    } else {
      setSearchAnchorEl(null);
    }
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
    setQuery("");
    setSelectedResultIndex(-1);
  };

  // Handle keyboard navigation in search results
  const handleSearchKeyDown = (event) => {
    // Only handle keyboard navigation when search results are visible
    if (!searchAnchorEl || matches.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setSelectedResultIndex((prevIndex) =>
          prevIndex < matches.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setSelectedResultIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : 0
        );
        break;
      case "Enter":
        event.preventDefault();
        if (selectedResultIndex >= 0 && selectedResultIndex < matches.length) {
          handleSearchResultClick(matches[selectedResultIndex].section);
        }
        break;
      case "Escape":
        event.preventDefault();
        handleSearchClose();
        break;
      default:
        break;
    }
  };

  const handleSearchResultClick = (section) => {
    handleSearchClose();

    // Handle skill-specific searches
    if (section === "Skills" || Object.keys(skillSections).includes(section)) {
      // If we're not on the home page, navigate there first
      if (location.pathname !== "/") {
        navigate("/", { state: { scrollTo: "skills" } });
      } else {
        // Scroll to skills section
        scrollToSection("skills");
      }
    } else {
      // For other sections, use the standard behavior
      scrollToSection(section.toLowerCase());
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleThemeToggle = () => {
    toggleDarkMode(!isDarkMode);
  };

  const handlePaletteMenuOpen = (event) => {
    setPaletteAnchorEl(event.currentTarget);
  };

  const handlePaletteMenuClose = () => {
    setPaletteAnchorEl(null);
  };

  // Blog menu handlers
  const handleBlogMenuOpen = (event) => {
    setBlogAnchorEl(event.currentTarget);
  };

  const handleBlogMenuClose = () => {
    setBlogAnchorEl(null);
  };

  // Settings menu handlers
  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    if (!settingsHover) {
      setSettingsAnchorEl(null);
    }
  };

  const handleSettingsMouseEnter = (event) => {
    setSettingsHover(true);
    if (!settingsAnchorEl) {
      setSettingsAnchorEl(event.currentTarget);
    }
  };

  const handleSettingsMouseLeave = () => {
    setSettingsHover(false);
    setTimeout(() => {
      if (!settingsHover) {
        setSettingsAnchorEl(null);
      }
    }, 300);
  };

  const handlePaletteSelect = (index) => {
    changePalette(index);
    handlePaletteMenuClose();
  };

  // Overflow menu handlers
  const handleOverflowMenuOpen = (event) => {
    setOverflowMenuAnchorEl(event.currentTarget);
  };

  const handleOverflowMenuClose = () => {
    setOverflowMenuAnchorEl(null);
  };

  // Get icon for each nav item
  const getIconForNavItem = (id) => {
    switch (id) {
      case "home":
        return <HomeIcon />;
      case "experience":
        return <FontAwesomeIcon icon={faBriefcase} />;
      case "timeline":
        return <FontAwesomeIcon icon={faRoad} />;
      case "skills":
        return <WorkIcon />;
      case "education":
        return <FontAwesomeIcon icon={faGraduationCap} />;
      case "certifications":
        return <SchoolIcon />;
      case "recognition":
        return <FontAwesomeIcon icon={faAward} />;
      // case "contact":
      //   return <FontAwesomeIcon icon={faEnvelope} />;
      case "summary":
        return <FontAwesomeIcon icon={faFileLines} />;
      default:
        return null;
    }
  };

  // Memoized nav items to prevent unnecessary re-renders
  const navigationItems = useMemo(
    () => [
      {
        id: "home",
        label: "Home",
        path: "/",
        icon: <HomeIcon />,
        keywords: ["home", "main", "landing"],
      },
      {
        id: "about",
        label: "About",
        path: "/about",
        icon: <PersonIcon />,
        keywords: ["about", "profile", "bio"],
      },
      {
        id: "experience",
        label: "Experience",
        path: "/experience",
        icon: <WorkIcon />,
        keywords: ["experience", "work", "employment"],
      },
      {
        id: "education",
        label: "Education",
        path: "/education",
        icon: <SchoolIcon />,
        keywords: ["education", "school", "university"],
      },
      {
        id: "skills",
        label: "Skills",
        path: "/skills",
        icon: <MenuBookIcon />,
        keywords: ["skills", "expertise", "capabilities"],
      },
      {
        id: "projects",
        label: "Projects",
        path: "/projects",
        icon: <LibraryBooksIcon />,
        keywords: ["projects", "portfolio", "work"],
      },
      {
        id: "achievements",
        label: "Achievements",
        path: "/achievements",
        icon: <EmojiEventsIcon />,
        keywords: ["achievements", "awards", "recognition"],
      },
      // {
      //   id: 'contact-me',
      //   label: 'Contact',
      //   path: '/contact',
      //   icon: <ContactMailIcon />,
      //   keywords: ['contact', 'email', 'reach']
      // }
    ],
    []
  );

  // Navigation items for grid layout
  const gridNavigationItems = useMemo(
    () => [
      {
        id: "home",
        label: "Home",
        path: "/",
        component: (
          <Button
            component={RouterLink}
            to="/"
            onClick={() => {
              trackMenuClick("home", "main-menu");
              if (location.pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            Home
          </Button>
        ),
      },
      {
        id: "hero",
        label: "Hero",
        path: "/heroref",
        component: (
          <Button
            component={RouterLink}
            to="/heroref"
            onClick={() => trackMenuClick("about", "main-menu")}
          >
            Hero
          </Button>
        ),
      },
      {
        id: "about",
        label: "About Me",
        path: "/about",
        component: (
          <Button
            component={RouterLink}
            to="/about"
            onClick={() => trackMenuClick("about", "main-menu")}
          >
            About Me
          </Button>
        ),
      },
      {
        id: "resume",
        label: "Resume",
        hasSubmenu: true,
        component: (
          <Button
            id="resume-button"
            onClick={(e) => {
              handleResumeMenuOpen(e);
              trackMenuClick("resume-menu", "main-menu");
            }}
            endIcon={<KeyboardArrowDownIcon />}
            aria-controls="resume-menu"
            aria-haspopup="true"
            aria-expanded={Boolean(resumeAnchorEl) ? "true" : undefined}
          >
            Resume
          </Button>
        ),
      },
      {
        id: "portfolio",
        label: "Portfolio",
        path: "/works",
        component: (
          <Button
            component={RouterLink}
            to="/works"
            onClick={() => trackMenuClick("portfolio", "main-menu")}
          >
            Portfolio
          </Button>
        ),
      },
      {
        id: "knowledge",
        label: "Knowledge Base",
        hasSubmenu: true,
        component: (
          <Button
            id="knowledge-button"
            onClick={(e) => {
              // Remove any existing force-hide-menu classes
              document
                .querySelectorAll(".force-hide-menu")
                .forEach((el) => {
                  el.classList.remove("force-hide-menu");
                });

              // Remove navigating class from body
              document.body.classList.remove("navigating");

              // If menu is already open, close it
              if (knowledgeAnchorEl) {
                setKnowledgeAnchorEl(null);
              } else {
                // Otherwise open it
                setKnowledgeAnchorEl(e.currentTarget);
                trackMenuClick("knowledge-base", "main-menu");
              }
            }}
            endIcon={<KeyboardArrowDownIcon />}
            aria-controls="knowledge-menu"
            aria-haspopup="true"
            aria-expanded={Boolean(knowledgeAnchorEl) ? "true" : undefined}
          >
            Knowledge Base
          </Button>
        ),
      },
      {
        id: "blog",
        label: "Blog",
        hasSubmenu: true,
        component: (
          <Button
            id="blog-button"
            onClick={(e) => {
              handleBlogMenuOpen(e);
              trackMenuClick("blog-menu", "main-menu");
            }}
            endIcon={<KeyboardArrowDownIcon />}
            aria-controls="blog-menu"
            aria-haspopup="true"
            aria-expanded={Boolean(blogAnchorEl) ? "true" : undefined}
          >
            Blog
          </Button>
        ),
      },
      {
        id: "contact",
        label: "Contact Me",
        path: "/contact",
        component: (
          <Button
            onClick={() => {
              navigate("/contact");
              trackMenuClick("contact", "main-menu");
            }}
            startIcon={<ContactMailIcon />}
          >
            Contact Me
          </Button>
        ),
      },
    ],
    [
      location.pathname,
      resumeAnchorEl,
      knowledgeAnchorEl,
      blogAnchorEl,
      navigate,
      trackMenuClick,
      handleResumeMenuOpen,
      handleBlogMenuOpen,
    ]
  );

  // New Addition
  const groupedResumeItems = [
    {
      label: "Professional",
      items: [
        { id: "summary", label: "Summary" },
        { id: "timeline", label: "Career Timeline" },
        { id: "skills", label: "Skills" },
        { id: "experience", label: "Experience" },
      ],
    },
    {
      label: "Education & Certs",
      items: [
        { id: "certifications", label: "Certifications" },
        { id: "education", label: "Education" },
      ],
    },
    {
      label: "Other",
      items: [
        { id: "recognition", label: "Awards" },
        // { id: "contact", label: "Contact" },
      ],
    },
  ];

  const resumeItems = useMemo(() => {
    const grouped = groupedResumeItems.flatMap((group) => group.items);

    return grouped.map((item) => {
      const navItem = navigationItems.find((n) => n.id === item.id);
      return {
        ...item,
        icon: navItem?.icon,
        path: navItem?.path || `/resume/${item.id}`,
      };
    });
  }, [groupedResumeItems, navigationItems]);

  // New Addition
  // Determine when to show desktop navigation vs mobile navigation
  const showDesktopNav = !isMobile || (isLandscape && !isMobile) || isTablet;
  const shouldShowMobileMenu = isMobile || (isLandscape && !showDesktopNav);

  // const headerHeight = isMobile
  //   ? theme.customLayout.mobileHeaderHeight
  //   : theme.customLayout.fixedHeaderHeight;

  const hostName = window.location.hostname;
  const protocol = window.location.protocol;
  const isLocalhost = hostName === "localhost" || hostName === "127.0.0.1";

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <StyledAppBar>
        <Toolbar
          sx={{
            minHeight: headerHeight,
            width: "100%",
            boxSizing: "border-box",
            padding: 0,
          }}
        >
          {/* Mobile Layout - Keep existing mobile menu */}
          {!showDesktopNav && (
            <>
              <Box
                component="img"
                src="/images/my-logo.jpg"
                alt="Logo"
                sx={{
                  maxHeight: "40px",
                  maxWidth: "40px",
                  borderRadius: 2,
                  boxShadow: 3,
                  mr: 1,
                }}
              />
              <Button
                component={RouterLink}
                to="/"
                onClick={() => {
                  trackMenuClick("home", "main-menu");
                  if (location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                sx={{ flexGrow: 1, justifyContent: "flex-start" }}
              >
                {hostName}
              </Button>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}

          {/* Desktop Grid Layout */}
          {showDesktopNav && (
            <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
              <Grid container spacing={1} alignItems="center">
                {/* Column 1: Logo/Icon */}
                <Grid item xs={1}>
                  <Box
                    component="img"
                    src="/images/my-logo.jpg"
                    alt="Logo"
                    sx={{
                      maxHeight: "50px",
                      maxWidth: "50px",
                      borderRadius: 2,
                      boxShadow: 3,                      
                    }}
                  />
                </Grid>

                {/* Column 2: Hostname Button */}
                <Grid item xs={1}>
                  <Button
                    component={RouterLink}
                    to="/"
                    onClick={() => {
                      trackMenuClick("home", "main-menu");
                      if (location.pathname === "/") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    size="small"
                  >
                    {hostName}
                  </Button>
                </Grid>

                {/* Columns 3-9: Navigation Menu Items */}
                <Grid item xs={7}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                      overflow: "hidden",
                    }}
                  >
                    {gridNavigationItems.slice(0, 7).map((item) => (
                      <Box key={item.id} sx={{ flexShrink: 0 }}>
                        {item.component}
                      </Box>
                    ))}
                    {gridNavigationItems.length > 7 && (
                      <IconButton
                        onClick={handleOverflowMenuOpen}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>

                {/* Columns 10-11: Search Box */}
                <Grid item xs={2}>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ "aria-label": "search" }}
                      value={query}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={(e) => {
                        if (e.target.value) {
                          setSearchAnchorEl(e.currentTarget);
                          trackMenuClick("search", "main-menu");
                        }
                      }}
                    />
                    {Boolean(searchAnchorEl) && (
                      <SearchResultsDropdown>
                        {matches.length > 0 ? (
                          matches.map((item, index) => (
                            <SearchResultItem
                              key={index}
                              button
                              onClick={() => handleSearchResultClick(item.section)}
                              selected={index === selectedResultIndex}
                              sx={{
                                backgroundColor:
                                  index === selectedResultIndex
                                    ? theme.palette.action.selected
                                    : "transparent",
                                "&:hover": {
                                  backgroundColor:
                                    index === selectedResultIndex
                                      ? theme.palette.action.selected
                                      : theme.palette.action.hover,
                                },
                              }}
                            >
                              <SearchResultSection>
                                {item.section}
                              </SearchResultSection>
                              <SearchResultContent>
                                {item.content}
                              </SearchResultContent>
                            </SearchResultItem>
                          ))
                        ) : (
                          <ListItem>
                            <Typography color="text.secondary">
                              No results found
                            </Typography>
                          </ListItem>
                        )}
                      </SearchResultsDropdown>
                    )}
                  </Search>
                </Grid>

                {/* Column 12: Gear Icon */}
                <Grid item xs={1}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* Account Button */}
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                      {(() => {
                        const shouldShowAccount = Boolean(
                          isAuthenticated || authJsAuthenticated
                        );

                        return shouldShowAccount ? (
                          <Box key={`account-${authStateKey}-${shouldShowAccount}`}>
                            <ToolpadAccountComponent variant="preview" />
                          </Box>
                        ) : null;
                      })()}
                    </Box>

                    {/* Settings Icon */}
                    <IconButton
                      onClick={(e) => {
                        handleSettingsClick(e);
                        trackMenuClick("settings", "main-menu");
                      }}
                      onMouseEnter={handleSettingsMouseEnter}
                      color="inherit"
                      aria-label="settings"
                      size="small"
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          )}

          {/* Overflow Menu for items that don't fit */}
          <Menu
            anchorEl={overflowMenuAnchorEl}
            open={Boolean(overflowMenuAnchorEl)}
            onClose={handleOverflowMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: {
                  borderRadius: 2,
                  minWidth: 180,
                  bgcolor: theme.palette.background.paper,
                  boxShadow: theme.shadows[4],
                  p: 1,
                },
              },
            }}
          >
            {gridNavigationItems.slice(7).map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => {
                  handleOverflowMenuClose();
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                sx={{ py: 1.2, px: 2, gap: 1 }}
              >
                <ListItemText primary={item.label} />
              </MenuItem>
            ))}
          </Menu>

          {/* Resume Menu */}
          <Menu
            id="resume-menu"
            anchorEl={resumeAnchorEl}
            open={Boolean(resumeAnchorEl)}
            onClose={handleResumeMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: {
                  borderRadius: 2,
                  minWidth: 220,
                  bgcolor: theme.palette.background.paper,
                  boxShadow: theme.shadows[4],
                },
              },
            }}
          >
            {groupedResumeItems.map((group, groupIndex) => (
              <Box key={group.label}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    px: 2,
                    py: 1,
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                    textTransform: "uppercase",
                  }}
                >
                  {group.label}
                </Typography>
                {group.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    custom={groupIndex * 10 + itemIndex}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                  >
                    <MenuItem
                      key={item.id}
                      onClick={() => handleResumeItemClick(item.id)}
                      sx={{
                        py: 1.2,
                        px: 2,
                        gap: 1,
                        "&:hover": {
                          bgcolor: theme.palette.action.hover,
                        },
                        "&:focus": {
                          bgcolor: theme.palette.action.selected,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: theme.palette.text.secondary,
                          minWidth: 32,
                        }}
                      >
                        {getIconForNavItem(item.id)}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            variant: "body1",
                            sx: { color: theme.palette.text.primary },
                          },
                        }}
                      />
                    </MenuItem>
                  </motion.div>
                ))}
                {groupIndex < groupedResumeItems.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </Box>
            ))}
          </Menu>

          {/* Knowledge Base Menu */}
          {Boolean(knowledgeAnchorEl) && (
            <KnowledgeBaseMenu
              id="knowledge-menu"
              anchorEl={knowledgeAnchorEl}
              open={Boolean(knowledgeAnchorEl)}
              onClose={() => setKnowledgeAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              disableScrollLock={true}
              keepMounted={false}
              onClick={() => setKnowledgeAnchorEl(null)}
            >
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  forceCloseMenuAndNavigate(
                    "/knowledge",
                    "knowledge-overview",
                    "knowledge-menu"
                  );
                }}
                sx={{
                  py: 1.2,
                  px: 2,
                  gap: 1,
                  cursor: "pointer",
                }}
              >
                <ListItemIcon
                  sx={{ color: theme.palette.text.secondary, minWidth: 32 }}
                >
                  <MenuBookIcon />
                </ListItemIcon>
                <ListItemText primary="Overview" />
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  forceCloseMenuAndNavigate(
                    "/knowledge/glossary",
                    "knowledge-glossary",
                    "knowledge-menu"
                  );
                }}
                sx={{
                  py: 1.2,
                  px: 2,
                  gap: 1,
                  cursor: "pointer",
                }}
              >
                <ListItemIcon
                  sx={{ color: theme.palette.text.secondary, minWidth: 32 }}
                >
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText primary="Glossary" />
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="subtitle2"
                sx={{
                  px: 2,
                  py: 0.5,
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                }}
              >
                Domain Knowledge
              </Typography>
              <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                {domainKnowledgeData.categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      forceCloseMenuAndNavigate(
                        `/knowledge/domain/${category.id}`,
                        `domain-${category.id}`,
                        "knowledge-menu"
                      );
                    }}
                    sx={{
                      py: 1.2,
                      px: 2,
                      gap: 1,
                      cursor: "pointer",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: theme.palette.text.secondary,
                        minWidth: 32,
                      }}
                    >
                      <Icon>{category.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={category.name} />
                  </MenuItem>
                ))}
              </Box>
            </KnowledgeBaseMenu>
          )}

          {/* Blog Menu */}
          <Menu
            id="blog-menu"
            anchorEl={blogAnchorEl}
            open={Boolean(blogAnchorEl)}
            onClose={handleBlogMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: {
                  borderRadius: 2,
                  minWidth: 180,
                  bgcolor: theme.palette.background.paper,
                  boxShadow: theme.shadows[4],
                  p: 1,
                },
              },
            }}
            MenuListProps={{
              onClick: handleBlogMenuClose,
            }}
          >
            <MenuItem
              component={RouterLink}
              to="/blogs"
              onClick={() => {
                handleBlogMenuClose();
                trackMenuClick("view-all-blogs", "blog-menu");
              }}
              sx={{ py: 1.2, px: 2, gap: 1 }}
            >
              <ListItemIcon
                sx={{ color: theme.palette.text.secondary, minWidth: 32 }}
              >
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="View All" />
            </MenuItem>

            {/* Admin menu items */}
            {(isAuthenticated || authJsAuthenticated) &&
              userRole === "admin" && (
                <MenuItem
                  key="create-new"
                  component={RouterLink}
                  to="/blog/new"
                  onClick={() => {
                    handleBlogMenuClose();
                    trackMenuClick("create-new-blog", "blog-menu");
                  }}
                  sx={{ py: 1.2, px: 2, gap: 1 }}
                >
                  <ListItemIcon
                    sx={{
                      color: theme.palette.text.secondary,
                      minWidth: 32,
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Create New" />
                </MenuItem>
              )}

            {/* Edit - For admin or moderator roles */}
            {(isAuthenticated || authJsAuthenticated) &&
              (userRole === "admin" || userRole === "moderator") && (
                <MenuItem
                  key="edit"
                  component={RouterLink}
                  to="/blogs"
                  onClick={() => {
                    handleBlogMenuClose();
                    trackMenuClick("edit-blog", "blog-menu");
                  }}
                  sx={{ py: 1.2, px: 2, gap: 1 }}
                >
                  <ListItemIcon
                    sx={{
                      color: theme.palette.text.secondary,
                      minWidth: 32,
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Edit" />
                </MenuItem>
              )}

            {/* Delete - Only for admin role */}
            {(isAuthenticated || authJsAuthenticated) &&
              userRole === "admin" && (
                <MenuItem
                  key="delete"
                  component={RouterLink}
                  to="/blogs"
                  onClick={() => {
                    handleBlogMenuClose();
                    trackMenuClick("delete-blog", "blog-menu");
                  }}
                  sx={{ py: 1.2, px: 2, gap: 1 }}
                >
                  <ListItemIcon
                    sx={{
                      color: theme.palette.text.secondary,
                      minWidth: 32,
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Delete" />
                </MenuItem>
              )}
          </Menu>

          {/* Settings Menu */}
          <Menu
            anchorEl={settingsAnchorEl}
            open={Boolean(settingsAnchorEl)}
            onClose={handleSettingsClose}
            MenuListProps={{
              onMouseEnter: () => setSettingsHover(true),
              onMouseLeave: handleSettingsMouseLeave,
              sx: { minWidth: 220 },
            }}
            slotProps={{
              paper: {
                elevation: 3,
                sx: {
                  mt: 1.5,
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* User Profile Section */}
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Account
              </Typography>
              {isAuthenticated || authJsAuthenticated ? (
                <ToolpadAccountComponent variant="default" />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Please sign in to access your account
                </Typography>
              )}
            </Box>
            {/* Mui Sign in */}
            {!(isAuthenticated || authJsAuthenticated) && (
              <MenuItem>
                <Box sx={{ width: "100%" }}>
                  <AppProvider theme={theme}>
                    <SignInPage
                      providers={[
                        { id: "github", name: "GitHub" },
                        { id: "google", name: "Google" },
                        { id: "facebook", name: "Facebook" },
                        { id: "linkedin", name: "LinkedIn" },
                        { id: "auth0", name: "Auth0" },
                      ]}
                      signIn={async (provider) => {
                        // Call the signIn function from AuthJsClient
                        if (provider && provider.id) {
                          console.log(
                            `[Navbar] Signing in with ${provider.id}`
                          );
                          try {
                            await AuthJsClient.signIn(provider.id);
                          } catch (error) {
                            console.error(
                              `[Navbar] Error signing in with ${provider.id}:`,
                              error
                            );
                          }
                        }
                      }}
                    />
                  </AppProvider>
                </Box>
              </MenuItem>
            )}

            {/* Theme Toggle */}
            <MenuItem onClick={() => toggleDarkMode(!isDarkMode)}>
              <ListItemIcon>
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </ListItemIcon>
              <ListItemText
                primary={isDarkMode ? "Light Mode" : "Dark Mode"}
              />
            </MenuItem>

            {/* Color Palette Section */}
            <Box
              sx={{
                px: 2,
                py: 1,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Color Theme
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {availablePalettes.map((palette, index) => (
                  <Tooltip key={palette.name} title={palette.name} arrow>
                    <Box
                      onClick={() => handlePaletteSelect(index)}
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

            {/* User Actions */}
            {(isAuthenticated || authJsAuthenticated) && (
              <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
                <MenuItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleSettingsClose}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleSettingsClose();
                    combinedLogout();
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Box>
            )}
          </Menu>
        </Toolbar>
      </StyledAppBar>

      {/* Modern Mobile Menu */}
      <ModernMobileMenu
        open={mobileOpen}
        onClose={handleDrawerToggle}
        isAuthenticated={isAuthenticated}
        authJsAuthenticated={authJsAuthenticated}
        user={user}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        availablePalettes={availablePalettes}
        currentPaletteIndex={currentPaletteIndex}
        changePalette={changePalette}
        resumeItems={resumeItems}
        domainKnowledgeData={domainKnowledgeData}
      />
    </Box>
  );
};

NavigationBar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  currentPaletteIndex: PropTypes.number.isRequired,
  changePalette: PropTypes.func.isRequired,
  availablePalettes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      primary: PropTypes.string.isRequired,
      secondary: PropTypes.string.isRequired,
    })
  ).isRequired,
};
export default NavigationBar;
