import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
// import { FixedSizeList as List } from "react-window";
import {
  Drawer,
  List as MuiList,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Divider,
  Box,
  Icon,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Chip,
  SwipeableDrawer,
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import ArticleIcon from "@mui/icons-material/Article";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import BookIcon from "@mui/icons-material/Book";

// Import ToolpadAccountComponent
import ToolpadAccountComponent from "./auth/toolpad/ToolpadAccountComponent";


// 1. Pull-to-Refresh Implementation
const PullToRefresh = ({ onRefresh, children }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [pullStart, setPullStart] = useState(null);
  const threshold = 80;

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setPullStart({ y: touch.clientY, scrollTop: e.target.scrollTop });
  };

  const handleTouchMove = (e) => {
    if (!pullStart || e.target.scrollTop > 0) return;

    const touch = e.touches[0];
    const distance = touch.clientY - pullStart.y;

    if (distance > 0) {
      setPullDistance(Math.min(distance, threshold * 1.5));
      setIsPulling(distance > threshold);
    }
  };

  const handleTouchEnd = () => {
    if (isPulling) {
      onRefresh?.();
    }
    setPullDistance(0);
    setIsPulling(false);
    setPullStart(null);
  };

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      sx={{ position: "relative", height: "100%" }}
    >
      {pullDistance > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: pullDistance,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.paper",
            zIndex: 1000,
          }}
        >
          <RefreshIcon
            sx={{
              transform: `rotate(${pullDistance * 2}deg)`,
              color: isPulling ? "primary.main" : "text.secondary",
            }}
          />
        </Box>
      )}
      <Box sx={{ paddingTop: `${pullDistance}px` }}>{children}</Box>
    </Box>
  );
};

PullToRefresh.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  children: PropTypes.node,
};
// 2. Virtualized List for Large Categories
const VirtualizedCategoryList = ({ categories, onCategoryClick }) => {
  const Row = ({ index, style }) => {
    const category = categories[index];
    return (
      <div style={style}>
        <ListItem>
          <ListItemButton
            onClick={() => onCategoryClick(category)}
            sx={{ pl: 4 }}
          >
            <ListItemIcon>
              <Icon>{category.icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={category.name} />
          </ListItemButton>
        </ListItem>
      </div>
    );
  };

  // Only use virtualization if there are many categories
  if (categories.length <= 10) {
    return (
      <>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <ListItemButton
              onClick={() => onCategoryClick(category)}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <Icon>{category.icon}</Icon>
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </>
    );
  }

  return (
    <Box sx={{ height: 300 }}>
      <MuiList
        height={300}
        itemCount={categories.length}
        itemSize={56}
        itemData={categories}
      >
        {Row}
      </MuiList>
    </Box>
  );
};

VirtualizedCategoryList.propTypes = {
  index: PropTypes.number.isRequired,
  style: PropTypes.object.isRequired,
  data: PropTypes.shape({
    categories: PropTypes.array.isRequired,
    onCategoryClick: PropTypes.func.isRequired,
  }).isRequired,

  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      // Add more fields if your category objects have them
    })
  ).isRequired,
  onCategoryClick: PropTypes.func.isRequired,
};
// 3. Search Functionality
const SearchableNavigation = ({ items, onItemClick }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    const searchLower = searchTerm.toLowerCase();
    return items.filter((item) => {
      if (!item || !item.label) return false;
      return (
        item.label.toLowerCase().includes(searchLower) ||
        (item.keywords &&
          item.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchLower)
          ))
      );
    });
  }, [items, searchTerm]);

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {searchTerm && (
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}{" "}
            found
          </Typography>
        </Box>
      )}

      <MuiList>
        {filteredItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemButton onClick={() => onItemClick(item)}>
              <ListItemIcon>{item.icon || <ArticleIcon />}</ListItemIcon>
              <ListItemText primary={item.label} secondary={item.description} />
            </ListItemButton>
          </ListItem>
        ))}
      </MuiList>
    </Box>
  );
};

SearchableNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      // Add other fields you use for filtering or display (e.g. `icon`, `description`)
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
};

// 4. Recent Items Hook
const useRecentItems = (maxItems = 5) => {
  const [recentItems, setRecentItems] = useState(() => {
    try {
      const saved = localStorage.getItem("recentItems");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading recent items:", error);
      return [];
    }
  });

  const addRecentItem = (item) => {
    try {
      // Only store essential data to avoid circular references
      const simplifiedItem = {
        id: item.id,
        label: item.label,
        path: item.path,
        iconType: item.iconType || "default", // Store icon type instead of the icon component
      };

      setRecentItems((prev) => {
        const filtered = prev.filter((i) => i.id !== item.id);
        const updated = [simplifiedItem, ...filtered].slice(0, maxItems);
        localStorage.setItem("recentItems", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Error adding recent item:", error);
    }
  };

  const clearRecentItems = () => {
    setRecentItems([]);
    localStorage.removeItem("recentItems");
  };

  return { recentItems, addRecentItem, clearRecentItems };
};

// Helper function to get icon component
const getIconComponent = (iconType) => {
  switch (iconType) {
    case "home":
      return <HomeIcon />;
    case "person":
      return <PersonIcon />;
    case "work":
      return <WorkIcon />;
    case "article":
      return <ArticleIcon />;
    case "contact":
      return <ContactMailIcon />;
    case "star":
      return <StarIcon />;
    case "book":
      return <BookIcon />;
    default:
      return <ArticleIcon />;
  }
};


// Main Enhanced Mobile Drawer Component
const EnhancedMobileDrawer = ({
  mobileOpen,
  handleDrawerToggle,
  resumeItems,
  domainKnowledgeData,
  isAuthenticated,
  authJsAuthenticated,
  // ... other props
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recentItems, addRecentItem, clearRecentItems } = useRecentItems();
  const [refreshing, setRefreshing] = useState(false);
  const [resumeAnchorEl, setResumeAnchorEl] = useState(null);

  const handleResumeMenuClose = () => {
    setResumeAnchorEl(null);
  };



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


  // Transform domain knowledge data into navigation items
  const domainKnowledgeItems = useMemo(() => {
    if (!domainKnowledgeData?.categories) return [];

    return domainKnowledgeData.categories.flatMap((category) => [
      // Add the category itself
      {
        id: `domain-${category.id}`,
        label: category.name,
        iconType: "article",
        path: `/knowledge/domain/${category.id}`,
        keywords: ["knowledge", "domain", category.name.toLowerCase()],
      },
      // Add its topics
      ...category.topics.map((topic) => ({
        id: `domain-${category.id}-${topic.id}`,
        label: topic.title,
        iconType: "article",
        path: `/knowledge/domain/${category.id}/${topic.id}`,
        keywords: [
          "knowledge",
          "domain",
          category.name.toLowerCase(),
          topic.title.toLowerCase(),
        ],
      })),
    ]);
  }, [domainKnowledgeData]);

  // Combine all navigation items for search
  const allNavItems = useMemo(
    () => [
      {
        id: "nav-home",
        label: "Home",
        iconType: "home",
        path: "/",
        keywords: ["main", "index"],
      },
      {
        id: "nav-heroref",
        label: "Hero",
        iconType: "star",
        path: "/heroref",
        keywords: ["hero", "main"],
      },
      {
        id: "nav-about",
        label: "About Me",
        iconType: "person",
        path: "/about",
        keywords: ["profile", "bio"],
      },
      {
        id: "nav-portfolio",
        label: "Portfolio",
        iconType: "work",
        path: "/works",
        keywords: ["projects", "work"],
      },
      {
        id: "nav-blog",
        label: "Blog",
        iconType: "article",
        path: "/blogs",
        keywords: ["articles", "posts"],
      },
      {
        id: "nav-contact",
        label: "Contact",
        iconType: "contact",
        path: "/contact",
        keywords: ["email", "reach"],
      },
      {
        id: "nav-docs",
        label: "Documentation",
        iconType: "book",
        path: "/docs",
        keywords: ["docs", "documentation"],
      },
      ...resumeItems.map((item) => ({
        ...item,
        id: `resume-${item.id}`,
        iconType: "work",
        path: `/resume#${item.id}`,
        keywords: ["resume", "cv"],
      })),
      ...domainKnowledgeItems,
    ],
    [resumeItems, domainKnowledgeItems]
  );

  const handleItemClick = (item) => {
    if (!item.path) return;

    addRecentItem(item);
    handleDrawerToggle();

    // Handle hash-based navigation for resume sections
    if (item.path.includes("#") && item.path.startsWith("/resume")) {
      const [path, hash] = item.path.split("#");
      console.log("path=", path);
      console.log("hash=", hash);
      handleResumeItemClick(hash);

      // navigate(path, { replace: true });
      // // Use setTimeout to ensure the navigation happens after the path change
      // setTimeout(() => {
      //   const element = document.getElementById(hash);
      //   if (element) {
      //     element.scrollIntoView({ behavior: "smooth" });
      //   }
      // }, 100);
    } else {
      // Regular path navigation
      navigate(item.path);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh - replace with actual refresh logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <SwipeableDrawer
      variant="temporary"
      anchor="right"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      onOpen={() => {}} // Required for SwipeableDrawer
      id="mobile-navigation"
      disableBackdropTransition
      disableDiscovery
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: "100%",
          maxWidth: 320,
          maxHeight: "95%"
        },
      }}
    >
      <PullToRefresh onRefresh={handleRefresh}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header with Close Button and Title */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "background.paper"
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Navigation
            </Typography>
            <IconButton
              onClick={handleDrawerToggle}
              aria-label="Close navigation menu"
              sx={{
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "rotate(90deg)"
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Authentication Section */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              {(isAuthenticated || authJsAuthenticated) ? "Account" : "Sign In"}
            </Typography>
            {!(isAuthenticated || authJsAuthenticated) && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Access your account and personalized features
              </Typography>
            )}
            <ToolpadAccountComponent
              variant="default"
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              availablePalettes={availablePalettes}
              currentPaletteIndex={currentPaletteIndex}
              changePalette={changePalette}
            />
          </Box>

          {/* Search Section */}
          <SearchableNavigation
            items={allNavItems}
            onItemClick={handleItemClick}
          />

          <Divider sx={{ my: 1 }} />

          {/* Recent Items Section */}
          {recentItems.length > 0 && (
            <>
              <MuiList>
                <ListSubheader
                  component="div"
                  disableSticky
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HistoryIcon fontSize="small" />
                    Recent
                  </Box>
                  <Chip
                    label="Clear"
                    size="small"
                    variant="outlined"
                    onClick={clearRecentItems}
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                </ListSubheader>

                {recentItems.slice(0, 3).map((item) => (
                  <ListItem key={`recent-${item.id}`}>
                    <ListItemButton onClick={() => handleItemClick(item)}>
                      <ListItemIcon>
                        {getIconComponent(item.iconType)}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        secondary={item.description}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </MuiList>

              <Divider sx={{ my: 1 }} />
            </>
          )}


          {/* Domain Knowledge Categories */}
          {domainKnowledgeData?.categories?.length > 0 && (
            <MuiList>
              <ListSubheader component="div" disableSticky>
                Knowledge Base
              </ListSubheader>
              {domainKnowledgeData.categories.map((category) => (
                <React.Fragment key={`domain-${category.id}`}>
                  <ListItem>
                    <ListItemButton
                      onClick={() => handleItemClick({
                        id: `domain-${category.id}`,
                        label: category.name,
                        iconType: 'article',
                        path: `/knowledge/domain/${category.id}`
                      })}
                    >
                      <ListItemIcon>
                        {getIconComponent('article')}
                      </ListItemIcon>
                      <ListItemText
                        primary={category.name}
                        // secondary={category.description}
                      />
                    </ListItemButton>
                  </ListItem>
                  {category.topics.map((topic) => (
                    <ListItem key={`domain-${category.id}-${topic.id}`} sx={{ pl: 4 }}>
                      <ListItemButton
                        onClick={() => handleItemClick({
                          id: `domain-${category.id}-${topic.id}`,
                          label: topic.title,
                          iconType: 'article',
                          path: `/knowledge/domain/${category.id}/${topic.id}`
                        })}
                      >
                        <ListItemIcon>
                          {getIconComponent('article')}
                        </ListItemIcon>
                        <ListItemText
                          primary={topic.title}
                          // secondary={topic.content}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </React.Fragment>
              ))}
            </MuiList>
          )}
        </Box>
      </PullToRefresh>
    </SwipeableDrawer>
  );
};

EnhancedMobileDrawer.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  resumeItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  domainKnowledgeData: PropTypes.shape({
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        topics: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
  isAuthenticated: PropTypes.bool,
  authJsAuthenticated: PropTypes.bool,
};

export default EnhancedMobileDrawer;
