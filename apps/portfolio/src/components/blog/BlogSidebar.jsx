import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Category as CategoryIcon,
  Label as LabelIcon,
  ChevronRight,
  Close,
  PushPin,
  PushPinOutlined
} from '@mui/icons-material';
import sampleBlogData from '../../data/sampleBlogData';

/**
 * BlogSidebar component that displays a collapsible tree view of blogs grouped by categories
 * @param {Object} props - Component props
 * @param {Array} props.blogs - Array of blog objects
 * @param {boolean} props.open - Whether the sidebar is open (for mobile)
 * @param {function} props.onClose - Function to close the sidebar (for mobile)
 * @param {boolean} props.isPinned - Whether the sidebar is pinned in expanded state
 * @param {function} props.onPinToggle - Function to toggle pinned state
 * @returns {React.ReactNode} - The blog sidebar component
 */
const BlogSidebar = ({
  blogs = [],
  open = true,
  onClose,
  isPinned = false,
  onPinToggle
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedTags, setExpandedTags] = useState({});

  // Group blogs by category and tags
  const [groupedBlogs, setGroupedBlogs] = useState({
    categories: {},
    tags: {}
  });

  // State for hover (only used in desktop non-pinned mode)
  const [isHovered, setIsHovered] = useState(false);

  // Process blogs to group them by category and tags
  useEffect(() => {
    // If no blogs provided, use sample data
    const blogsToProcess = blogs.length > 0 ? blogs : sampleBlogData;

    const categories = {};
    const tags = {};

    blogsToProcess.forEach(blog => {
      // Group by category
      if (!categories[blog.category]) {
        categories[blog.category] = [];
      }
      categories[blog.category].push(blog);

      // Group by tags
      blog.tags.forEach(tag => {
        if (!tags[tag]) {
          tags[tag] = [];
        }
        if (!tags[tag].some(b => b.id === blog.id)) {
          tags[tag].push(blog);
        }
      });
    });

    setGroupedBlogs({ categories, tags });

    // Initialize expanded state for categories
    const initialExpandedCategories = {};
    Object.keys(categories).forEach(category => {
      initialExpandedCategories[category] = false;
    });
    setExpandedCategories(initialExpandedCategories);

    // Initialize expanded state for tags
    const initialExpandedTags = {};
    Object.keys(tags).forEach(tag => {
      initialExpandedTags[tag] = false;
    });
    setExpandedTags(initialExpandedTags);
  }, [blogs]);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle tag expansion
  const toggleTag = (tag) => {
    setExpandedTags(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }));
  };

  // Navigate to a blog
  const navigateToBlog = (blogId) => {
    navigate(`/blogs/${blogId}`);
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Handle mouse enter/leave for hover effect
  const handleMouseEnter = () => {
    if (!isMobile && !isPinned) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isPinned) {
      setIsHovered(false);
    }
  };

  // We'll use isPinned and isHovered directly in the component

  return (
    <Paper
      elevation={3}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        borderRadius: 0, // Remove border radius for full-height sidebar
        display: open ? 'block' : 'none',
        transition: 'all 0.3s ease',
        bgcolor: 'background.paper',
        ...((!isMobile && !isPinned) && {
          '&:hover': {
            boxShadow: 6,
          },
          width: '100%', // Width is controlled by parent container
          '& .sidebar-content': {
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease, visibility 0.3s ease',
          },
          '& .sidebar-icon-only': {
            display: isHovered ? 'none' : 'flex',
            transition: 'display 0.3s ease',
          }
        })
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Icon-only view for collapsed state */}
        {!isMobile && !isPinned && (
          <Box className="sidebar-icon-only" sx={{
            width: '100%',
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <CategoryIcon color="primary" />
          </Box>
        )}

        {/* Full content for expanded state */}
        <Box className="sidebar-content" sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Blog Categories
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!isMobile && (
              <Tooltip title={isPinned ? "Unpin sidebar" : "Pin sidebar"}>
                <IconButton onClick={onPinToggle} size="small" color={isPinned ? "primary" : "default"}>
                  {isPinned ? <PushPin /> : <PushPinOutlined />}
                </IconButton>
              </Tooltip>
            )}
            {isMobile && (
              <IconButton onClick={onClose} size="small">
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Categories section */}
      <List component="nav" dense className="sidebar-content">
        {Object.keys(groupedBlogs.categories).map(category => (
          <React.Fragment key={`category-${category}`}>
            <ListItem button onClick={() => toggleCategory(category)}>
              <ListItemIcon>
                <CategoryIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={category.charAt(0).toUpperCase() + category.slice(1)}
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
              {expandedCategories[category] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={expandedCategories[category]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {groupedBlogs.categories[category].map(blog => (
                  <ListItem
                    key={`blog-${blog.id}`}
                    button
                    onClick={() => navigateToBlog(blog.id)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <ChevronRight fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={blog.title}
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: {
                          maxWidth: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>

      <Divider />

      {/* Tags section */}
      <Box sx={{ p: 2 }} className="sidebar-content">
        <Typography variant="h6" fontWeight="bold" color="primary">
          Tags
        </Typography>
      </Box>

      {/* Icon-only view for collapsed state */}
      {!isMobile && !isPinned && (
        <Box className="sidebar-icon-only" sx={{
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2
        }}>
          <LabelIcon color="secondary" />
        </Box>
      )}

      <List component="nav" dense className="sidebar-content">
        {Object.keys(groupedBlogs.tags).map(tag => (
          <React.Fragment key={`tag-${tag}`}>
            <ListItem button onClick={() => toggleTag(tag)}>
              <ListItemIcon>
                <LabelIcon color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary={tag}
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
              {expandedTags[tag] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={expandedTags[tag]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {groupedBlogs.tags[tag].map(blog => (
                  <ListItem
                    key={`tag-blog-${blog.id}`}
                    button
                    onClick={() => navigateToBlog(blog.id)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <ChevronRight fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={blog.title}
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: {
                          maxWidth: '180px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

BlogSidebar.propTypes = {
  blogs: PropTypes.array,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  isPinned: PropTypes.bool,
  onPinToggle: PropTypes.func
};

export default BlogSidebar;
