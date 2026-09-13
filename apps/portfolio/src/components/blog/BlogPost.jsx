import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from "prop-types";
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  useTheme,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  CalendarToday,
  Category,
  NavigateNext
} from '@mui/icons-material';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { useAuthContext } from '../../context/AuthProvider';
import sampleBlogData from '../../data/sampleBlogData';

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Custom renderer for Slate elements
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote style={{ borderLeft: '2px solid #ddd', paddingLeft: '10px', color: '#666', margin: '16px 0' }} {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 style={{ fontSize: '2em', fontWeight: 'bold', margin: '24px 0 16px' }} {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '20px 0 12px' }} {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'image':
      return (
        <div {...attributes} style={{ margin: '16px 0' }}>
          <div contentEditable={false} style={{ textAlign: 'center' }}>
            <img
              src={element.url}
              alt={element.alt || 'Blog image'}
              style={{ maxWidth: '100%', maxHeight: '500px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
            />
            {element.alt && (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                {element.alt}
              </Typography>
            )}
          </div>
          {children}
        </div>
      );
    case 'code-block':
      return (
        <pre style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '5px', overflowX: 'auto', margin: '16px 0' }} {...attributes}>
          <code>{children}</code>
        </pre>
      );
    default:
      return <p style={{ margin: '12px 0' }} {...attributes}>{children}</p>;
  }
};

Element.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.shape({
    type: PropTypes.string.isRequired,
    url: PropTypes.string,
    alt: PropTypes.string,
  }).isRequired,
};

// Custom renderer for Slate text formatting
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.code) {
    children = <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '3px' }}>{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
};

Leaf.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  leaf: PropTypes.object.isRequired,
};

// Related blog card component
const RelatedBlogCard = ({ blog, onClick }) => {
  return (
    <Card
      elevation={2}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {blog.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
          <CalendarToday fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem' }} />
          <Typography variant="caption">
            {formatDate(blog.createdAt)}
          </Typography>
        </Box>
        <Chip
          label={blog.category}
          size="small"
          color="primary"
          sx={{ height: 20, fontSize: '0.75rem' }}
        />
      </CardContent>
    </Card>
  );
};

RelatedBlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

// Main blog post component
const BlogPost = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { blogId } = useParams();
  // For demo purposes, set isAuthenticated to true
  // const { isAuthenticated } = useAuthContext();
  const isAuthenticated = true;

  // State for blog data
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Create a read-only Slate editor
  const editor = useMemo(() => withReact(createEditor()), []);

  // Load blog data
  useEffect(() => {
    try {
      setLoading(true);
      let savedBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');

      // If no blogs in localStorage, use sample data and save it
      if (savedBlogs.length === 0) {
        savedBlogs = sampleBlogData;
        localStorage.setItem('blogs', JSON.stringify(savedBlogs));
      }

      const foundBlog = savedBlogs.find(b => b.id === blogId);

      if (foundBlog) {
        setBlog(foundBlog);

        // Find related blogs (same category or shared tags)
        const related = savedBlogs
          .filter(b => b.id !== blogId)
          .filter(b =>
            b.category === foundBlog.category ||
            b.tags.some(tag => foundBlog.tags.includes(tag))
          )
          .slice(0, 3);

        setRelatedBlogs(related);
      } else {
        setError('Blog post not found');
      }
    } catch (error) {
      console.error('Error loading blog:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Loading blog post...
        </Typography>
      </Container>
    );
  }

  if (error || !blog) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Blog post not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/blogs')}
        >
          Back to Blogs
        </Button>
      </Container>
    );
  }

  // Parse the blog content for the Slate editor
  let content = [];
  try {
    // Check if blog.content is already an object (pre-parsed)
    if (typeof blog.content === 'object') {
      content = blog.content;
    } else {
      content = JSON.parse(blog.content);
    }

    // Validate content is a proper array for Slate
    if (!Array.isArray(content) || content.length === 0) {
      // If content is not a valid array, use a default value
      content = [
        {
          type: 'paragraph',
          children: [{ text: 'Blog content could not be loaded properly.' }],
        }
      ];
    }

    // Ensure each block has a children array with at least one text node
    content = content.map(block => {
      if (!block.children || !Array.isArray(block.children) || block.children.length === 0) {
        return {
          ...block,
          children: [{ text: '' }]
        };
      }
      return block;
    });
  } catch (error) {
    console.error('Error parsing blog content:', error);
    content = [
      {
        type: 'paragraph',
        children: [{ text: 'Error loading blog content.' }],
      }
    ];
  }

  return (
    <Box
      component="section"
      sx={{
        py: 6,
        minHeight: 'calc(100vh - 64px)',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumbs navigation */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/blogs" color="inherit">
            Blogs
          </Link>
          <Typography color="text.primary">
            {blog.title}
          </Typography>
        </Breadcrumbs>

        <Paper
          elevation={3}
          sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, mb: 4 }}
        >
          {/* Blog header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Chip
                label={blog.category}
                color="primary"
                sx={{ mb: 2 }}
              />
              {isAuthenticated && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  size="small"
                  component={RouterLink}
                  to={`/blog/edit/${blog.id}`}
                >
                  Edit
                </Button>
              )}
            </Box>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary'
              }}
            >
              {blog.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: 'text.secondary' }}>
              <CalendarToday sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ mr: 3 }}>
                Published: {formatDate(blog.createdAt)}
              </Typography>
              {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                <Typography variant="body2">
                  Updated: {formatDate(blog.updatedAt)}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {blog.tags.map((tag, i) => (
                <Chip
                  key={i}
                  label={tag}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Blog content */}
          <Box sx={{ typography: 'body1' }}>
            <Slate editor={editor} initialValue={content} value={content} onChange={() => {}}>
              <Editable
                readOnly
                renderElement={props => <Element {...props} />}
                renderLeaf={props => <Leaf {...props} />}
              />
            </Slate>
          </Box>
        </Paper>

        {/* Related blogs section */}
        {relatedBlogs.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: 'primary.main'
              }}
            >
              Related Articles
            </Typography>

            <Grid container spacing={3}>
              {relatedBlogs.map(relatedBlog => (
                <Grid item xs={12} sm={6} md={4} key={relatedBlog.id}>
                  <RelatedBlogCard
                    blog={relatedBlog}
                    onClick={() => navigate(`/blogs/${relatedBlog.id}`)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Navigation buttons */}
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/blogs')}
          >
            Back to Blogs
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default BlogPost;
