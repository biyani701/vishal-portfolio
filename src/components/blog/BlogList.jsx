import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Paper,
  useTheme,
  Pagination,
  Stack,
  Alert,
  Drawer,
  useMediaQuery
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  Sort,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  CalendarToday,
  Category,
  Label,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuthContext } from '../../context/AuthProvider';
import sampleBlogData from '../../data/sampleBlogData';
import BlogSidebar from './BlogSidebar';

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Blog list component
const BlogList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // For demo purposes, set isAuthenticated to true
  // const { isAuthenticated } = useAuthContext();
  const isAuthenticated = true;

  // State for blogs and filtering
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const [blogsPerPage] = useState(6);

  // State for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarPinned, setSidebarPinned] = useState(!isMobile);

  // Handle sidebar pin toggle
  const handlePinToggle = () => {
    setSidebarPinned(prev => !prev);
    // If unpinning, keep sidebar open if it was open
    if (sidebarPinned) {
      setSidebarOpen(true);
    }
  };

  // State for filter and sort menus
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  // Load blogs from localStorage or use sample data if none exists
  useEffect(() => {
    try {
      let savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');

      // If no blogs in localStorage, use sample data and save it
      if (savedBlogs.length === 0) {
        savedBlogs = sampleBlogData;
        localStorage.setItem('blogs', JSON.stringify(savedBlogs));
      }

      setBlogs(savedBlogs);
    } catch (error) {
      console.error('Error loading blogs:', error);
      // Fallback to sample data if there's an error
      setBlogs(sampleBlogData);
    }
  }, []);

  // Update sidebar state based on screen size
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
      setSidebarPinned(false);
    } else {
      setSidebarPinned(true);
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...blogs];

    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(blog => blog.category === categoryFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(term) ||
        blog.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(sortOrder === 'newest' ? a.createdAt : a.updatedAt);
      const dateB = new Date(sortOrder === 'newest' ? b.createdAt : b.updatedAt);
      return sortOrder.includes('newest') ? dateB - dateA : dateA - dateB;
    });

    setFilteredBlogs(result);
    setPage(1); // Reset to first page when filters change
  }, [blogs, categoryFilter, searchTerm, sortOrder]);

  // Get current page of blogs
  const indexOfLastBlog = page * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Menu handlers
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleActionClick = (event, blogId) => {
    setActionAnchorEl(event.currentTarget);
    setSelectedBlogId(blogId);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setSelectedBlogId(null);
  };

  // Handle blog deletion
  const handleDeleteBlog = () => {
    if (!selectedBlogId) return;

    try {
      const updatedBlogs = blogs.filter(blog => blog.id !== selectedBlogId);
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
      setBlogs(updatedBlogs);
      handleActionClose();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Get unique categories for filter
  const categories = ['all', ...new Set(blogs.map(blog => blog.category))];

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 64px)', // Adjust based on your header height
        bgcolor: 'background.default',
        position: 'relative'
      }}
    >
      {/* Fixed sidebar for desktop */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          left: 0,
          top: 64, // Adjust based on your header height
          bottom: 60, // Adjust based on your footer height
          width: sidebarPinned ? '280px' : (sidebarOpen ? '280px' : '60px'),
          transition: 'all 0.3s ease',
          zIndex: 10,
          overflow: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
          boxShadow: 2,
          height: 'calc(100vh - 124px)', // 64px header + 60px footer
        }}
      >
        <BlogSidebar
          blogs={blogs}
          open={sidebarOpen}
          isPinned={sidebarPinned}
          onPinToggle={handlePinToggle}
        />
      </Box>

      {/* Main content area with padding to account for sidebar */}
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: sidebarPinned ? '280px' : (sidebarOpen ? '280px' : '60px') },
          transition: 'all 0.3s ease',
          py: 4,
          px: { xs: 2, sm: 3 },
          minHeight: 'calc(100vh - 124px)', // Match sidebar height
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                color="primary"
                onClick={toggleSidebar}
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main'
                }}
                data-aos="fade-right"
              >
                Blog & Insights
              </Typography>
            </Box>

            {isAuthenticated && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => navigate('/blog/new')}
                data-aos="fade-left"
              >
                New Blog Post
              </Button>
            )}
          </Box>

          {/* Main content grid */}
          <Grid container spacing={3}>
            <Paper
              elevation={3}
              sx={{ p: 2, mb: 4, borderRadius: 2 }}
              data-aos="fade-up"
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search blogs by title or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      },
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={handleFilterClick}
                    size="medium"
                  >
                    Filter: {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
                  </Button>
                  <Menu
                    anchorEl={filterAnchorEl}
                    open={Boolean(filterAnchorEl)}
                    onClose={handleFilterClose}
                  >
                    {categories.map((category) => (
                      <MenuItem
                        key={category}
                        onClick={() => {
                          setCategoryFilter(category);
                          handleFilterClose();
                        }}
                        selected={categoryFilter === category}
                      >
                        <ListItemIcon>
                          <Category fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                          {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                        </ListItemText>
                      </MenuItem>
                    ))}
                  </Menu>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Sort />}
                    onClick={handleSortClick}
                    size="medium"
                  >
                    Sort: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                  </Button>
                  <Menu
                    anchorEl={sortAnchorEl}
                    open={Boolean(sortAnchorEl)}
                    onClose={handleSortClose}
                  >
                    <MenuItem
                      onClick={() => {
                        setSortOrder('newest');
                        handleSortClose();
                      }}
                      selected={sortOrder === 'newest'}
                    >
                      <ListItemIcon>
                        <Sort fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Newest First</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setSortOrder('oldest');
                        handleSortClose();
                      }}
                      selected={sortOrder === 'oldest'}
                    >
                      <ListItemIcon>
                        <Sort fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Oldest First</ListItemText>
                    </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </Paper>

            {blogs.length === 0 ? (
              <Alert
                severity="info"
                sx={{ mt: 4 }}
                data-aos="fade-up"
              >
                No blog posts yet. {isAuthenticated ? 'Click "New Blog Post" to create your first blog!' : 'Check back later for new content.'}
              </Alert>
            ) : (
              <>
                <Grid container spacing={4}>
                  {currentBlogs.map((blog, index) => (
                    <Grid item xs={12} sm={6} lg={4} key={blog.id} data-aos="fade-up" data-aos-delay={index * 100}>
                      <Card
                        elevation={3}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 6
                          },
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Chip
                              label={blog.category}
                              color="primary"
                              size="small"
                            />
                            {isAuthenticated && (
                              <IconButton
                                size="small"
                                onClick={(e) => handleActionClick(e, blog.id)}
                              >
                                <MoreVert fontSize="small" />
                              </IconButton>
                            )}
                          </Box>

                          <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            sx={{
                              fontWeight: 600,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              height: '3.6em'
                            }}
                          >
                            {blog.title}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                            <CalendarToday fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                              {formatDate(blog.createdAt)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {blog.tags.map((tag, i) => (
                              <Chip
                                key={i}
                                label={tag}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </CardContent>

                        <Divider />

                        <CardActions sx={{ p: 2 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            component={RouterLink}
                            to={`/blogs/${blog.id}`}
                            startIcon={<Visibility />}
                          >
                            Read More
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {filteredBlogs.length > blogsPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={Math.ceil(filteredBlogs.length / blogsPerPage)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Container>
      </Box>

      {/* Mobile Drawer for Sidebar */}
      <Drawer
        anchor="left"
        open={isMobile && sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 300,
            boxSizing: 'border-box',
            height: '100%',
          },
        }}
      >
        <BlogSidebar
          blogs={blogs}
          open={true}
          onClose={() => setSidebarOpen(false)}
          isPinned={false}
          onPinToggle={() => {}} // No pin functionality on mobile
        />
      </Drawer>

      {/* Action menu for blog items */}
      <Menu
        anchorEl={actionAnchorEl}
        open={Boolean(actionAnchorEl)}
        onClose={handleActionClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/blog/edit/${selectedBlogId}`);
            handleActionClose();
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleDeleteBlog}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BlogList;
