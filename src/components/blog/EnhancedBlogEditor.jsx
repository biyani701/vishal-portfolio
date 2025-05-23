import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuthContext } from "../../context/AuthProvider";
import {
  createEditor,
  Editor,
  Transforms,
  Element as SlateElement,
} from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import { withHistory } from "slate-history";
import {
  Box,
  Chip,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Container,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Grid,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Edit,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  LooksOne,
  LooksTwo,
  LooksThree,
  Looks4,
  Looks5,
  Looks6,
  Image,
  Save,
  ArrowBack,
  Delete,
  Preview,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  ArrowDropDown
} from "@mui/icons-material";

// Initial value for the editor
const initialValue = [
  {
    type: "heading-one",
    children: [{ text: "Blog Title" }],
  },
  {
    type: "paragraph",
    children: [{ text: "Start writing your blog content here..." }],
  },
];

// Custom toolbar button component
const ToolbarButton = ({
  format,
  icon,
  isBlock = false,
  isActive,
  onMouseDown,
}) => {
  const theme = useTheme();

  return (
    <Tooltip title={format.charAt(0).toUpperCase() + format.slice(1)}>
      <IconButton
        onMouseDown={(event) => onMouseDown(event, format, isBlock)}
        sx={{
          color: isActive ? "primary.main" : "text.secondary",
          backgroundColor: isActive
            ? (theme.palette.mode === 'dark'
                ? 'rgba(25, 118, 210, 0.15)'
                : 'rgba(25, 118, 210, 0.08)')
            : 'transparent',
          "&:hover": {
            backgroundColor: isActive
              ? (theme.palette.mode === 'dark'
                  ? 'rgba(25, 118, 210, 0.25)'
                  : 'rgba(25, 118, 210, 0.15)')
              : (theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)'),
          },
          transition: 'all 0.2s ease',
          borderRadius: 1
        }}
        size="small"
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

ToolbarButton.propTypes = {
  format: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  isBlock: PropTypes.bool,
  isActive: PropTypes.bool,
  onMouseDown: PropTypes.func.isRequired,
};

// Block button component that checks if the current selection has the specified block type
const BlockButton = ({ format, icon }) => {
  const editor = useSlate();

  const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    return !!match;
  };

  // Helper function to check if we're in a list
  const isInList = () => {
    const [match] = Editor.nodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n.type === "bulleted-list" || n.type === "numbered-list"),
    });
    return !!match;
  };

  const toggleBlock = (event, format) => {
    event.preventDefault();
    const isActive = isBlockActive(editor, format);

    // Special handling for lists
    if (format === "bulleted-list" || format === "numbered-list") {
      // If the list is already active, convert list items back to paragraphs
      if (isActive) {
        Transforms.unwrapNodes(editor, {
          match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            (n.type === "bulleted-list" || n.type === "numbered-list"),
          split: true
        });

        Transforms.setNodes(
          editor,
          { type: "paragraph" },
          { match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "list-item" }
        );
      } else {
        // If a different type of list is active, unwrap it first
        const otherListFormat = format === "bulleted-list" ? "numbered-list" : "bulleted-list";
        const isOtherListActive = isBlockActive(editor, otherListFormat);

        if (isOtherListActive) {
          Transforms.unwrapNodes(editor, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === otherListFormat,
            split: true
          });
        }

        // Convert the current blocks to list items
        Transforms.setNodes(
          editor,
          { type: "list-item" },
          { match: n => Editor.isBlock(editor, n) && n.type !== "list-item" }
        );

        // Wrap in the appropriate list type
        Transforms.wrapNodes(editor, {
          type: format,
          children: []
        });
      }
    } else {
      // If we're in a list and trying to apply a non-list block format,
      // we need to unwrap from the list first
      if (isInList()) {
        Transforms.unwrapNodes(editor, {
          match: n =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            (n.type === "bulleted-list" || n.type === "numbered-list"),
          split: true
        });
      }

      // Handle other block types normally
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : format },
        { match: n => Editor.isBlock(editor, n) }
      );
    }
  };

  return (
    <ToolbarButton
      format={format}
      icon={icon}
      isBlock={true}
      isActive={isBlockActive(editor, format)}
      onMouseDown={toggleBlock}
    />
  );
};

BlockButton.propTypes = {
  format: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

// Mark button component that checks if the current selection has the specified mark
const MarkButton = ({ format, icon }) => {
  const editor = useSlate();

  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };

  const toggleMark = (event, format) => {
    event.preventDefault();
    const isActive = isMarkActive(editor, format);

    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  return (
    <ToolbarButton
      format={format}
      icon={icon}
      isActive={isMarkActive(editor, format)}
      onMouseDown={toggleMark}
    />
  );
};

MarkButton.propTypes = {
  format: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

// Element renderer
const Element = ({ attributes, children, element }) => {
  // Get alignment style if it exists
  const textAlign = element.align || 'left';
  const alignStyle = { textAlign };

  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={{
            borderLeft: "2px solid #ddd",
            paddingLeft: "10px",
            color: "#666",
            ...alignStyle
          }}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return <ul style={alignStyle} {...attributes}>{children}</ul>;
    case "heading-one":
      return (
        <h1 style={{ fontSize: "2em", fontWeight: "bold", ...alignStyle }} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={{ fontSize: "1.5em", fontWeight: "bold", ...alignStyle }} {...attributes}>
          {children}
        </h2>
      );
    case "heading-three":
      return (
        <h3 style={{ fontSize: "1.3em", fontWeight: "bold", ...alignStyle }} {...attributes}>
          {children}
        </h3>
      );
    case "heading-four":
      return (
        <h4 style={{ fontSize: "1.2em", fontWeight: "bold", ...alignStyle }} {...attributes}>
          {children}
        </h4>
      );
    case "heading-five":
      return (
        <h5 style={{ fontSize: "1.1em", fontWeight: "bold", ...alignStyle }} {...attributes}>
          {children}
        </h5>
      );
    case "heading-six":
      return (
        <h6 style={{ fontSize: "1em", fontWeight: "bold", ...alignStyle }} {...attributes}>
          {children}
        </h6>
      );
    case "list-item":
      return <li style={alignStyle} {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol style={alignStyle} {...attributes}>{children}</ol>;
    case "image":
      return (
        <div {...attributes}>
          <div contentEditable={false} style={{ textAlign: "center" }}>
            <img
              src={element.url}
              alt={element.alt || "Blog image"}
              style={{
                maxWidth: "100%",
                maxHeight: "20em",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              }}
            />
          </div>
          {children}
        </div>
      );
    case "code-block":
      return (
        <pre
          style={{
            backgroundColor: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            overflowX: "auto",
            ...alignStyle
          }}
          {...attributes}
        >
          <code>{children}</code>
        </pre>
      );
    default:
      return <p style={alignStyle} {...attributes}>{children}</p>;
  }
};

Element.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.shape({
    type: PropTypes.string.isRequired,
    url: PropTypes.string,
    alt: PropTypes.string,
    align: PropTypes.string,
  }).isRequired,
};

// Leaf renderer for text formatting
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
    children = (
      <code
        style={{
          backgroundColor: "#f0f0f0",
          padding: "2px 4px",
          borderRadius: "3px",
        }}
      >
        {children}
      </code>
    );
  }
  return <span {...attributes}>{children}</span>;
};

Leaf.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  leaf: PropTypes.object.isRequired,
};

// Main blog editor component
const EnhancedBlogEditor = ({ editMode = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { blogId } = useParams();

  // For demo purposes, set isAuthenticated to true
  // const { isAuthenticated } = useAuthContext();
  const isAuthenticated = true;

  // State for blog metadata
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("technology");
  const [tags, setTags] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Create a Slate editor with history and React plugins
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [content, setContent] = useState(initialValue);

  // Load existing blog data if in edit mode
  useEffect(() => {
    if (editMode && blogId) {
      // In a real app, you would fetch the blog data from an API or storage
      // For now, we'll simulate loading from localStorage
      try {
        const savedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
        const blog = savedBlogs.find((b) => b.id === blogId);

        if (blog) {
          setTitle(blog.title);
          setCategory(blog.category);
          setTags(blog.tags.join(", "));
          setContent(JSON.parse(blog.content));
        }
      } catch (error) {
        console.error("Error loading blog data:", error);
      }
    }
  }, [editMode, blogId]);

  // Render element and leaf components
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  // Handle saving the blog
  const handleSaveBlog = () => {
    if (!title.trim()) {
      alert("Please enter a blog title");
      return;
    }

    const blogData = {
      id: editMode && blogId ? blogId : Date.now().toString(),
      title,
      category,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      content: JSON.stringify(content),
      createdAt: editMode && blogId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // In a real app, you would send this data to an API
      // For now, we'll save to localStorage
      const savedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");

      if (editMode && blogId) {
        // Update existing blog
        const index = savedBlogs.findIndex((b) => b.id === blogId);
        if (index !== -1) {
          savedBlogs[index] = { ...savedBlogs[index], ...blogData };
        }
      } else {
        // Add new blog
        savedBlogs.push(blogData);
      }

      localStorage.setItem("blogs", JSON.stringify(savedBlogs));
      alert(
        editMode ? "Blog updated successfully!" : "Blog published successfully!"
      );
      navigate("/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog. Please try again.");
    }
  };

  // Handle deleting the blog
  const handleDeleteBlog = () => {
    if (!editMode || !blogId) return;

    try {
      const savedBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
      const updatedBlogs = savedBlogs.filter((blog) => blog.id !== blogId);
      localStorage.setItem("blogs", JSON.stringify(updatedBlogs));
      alert("Blog deleted successfully!");
      navigate("/blogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  // Handle inserting an image
  const handleInsertImage = () => {
    const url = prompt("Enter image URL:");
    if (!url) return;

    const alt = prompt("Enter image description (alt text):");

    // Use Transforms.insertNodes instead of Editor.insertNodes
    Transforms.insertNodes(editor, {
      type: "image",
      url,
      alt,
      children: [{ text: "" }],
    });
  };

  // Function to toggle block type
  const toggleBlock = (event, format) => {
    event.preventDefault();

    // Check if the current block has the format
    const [match] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    });
    const isActive = !!match;

    // Handle lists specially
    if (format === 'bulleted-list' || format === 'numbered-list') {
      // Implementation for lists is in the BlockButton component
    } else {
      // For other block types, set the node type
      Transforms.setNodes(
        editor,
        { type: isActive ? 'paragraph' : format },
        { match: n => Editor.isBlock(editor, n) }
      );
    }
  };

  const inputColor = theme.palette.text.primary;
const labelColor = theme.palette.text.secondary;

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 10 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              {editMode ? "Edit Blog Post" : "Create New Blog Post"}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {editMode
                ? "Update your existing blog post"
                : "Share your thoughts with the world"}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => {
              // Check if there are unsaved changes
              if (title || tags || content !== initialValue) {
                setConfirmDialogOpen(true);
              } else {
                navigate("/blogs");
              }
            }}
          >
            Back to Blogs
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {!previewMode ? (
          <>
            <Grid container spacing={2} sx={{ mb: 4 }}>
  {/* Blog Title */}
  <Grid item xs={12} md={6}>
    <TextField
      label="Blog Title"
      variant="outlined"
      fullWidth
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      slotProps={{
        input: {
          sx: {
            color: inputColor,
            backgroundColor: theme.palette.background.paper
          }
        },
        label: {
          sx: { color: labelColor }
        },
        helperText: {
          sx: { color: labelColor }
        }
      }}
      helperText="Make it short and catchy"
    />
  </Grid>

  {/* Category */}
  <Grid item xs={12} sm={6} md={3}>
    <FormControl fullWidth>
      <InputLabel id="category-label" sx={{ color: labelColor }}>
        Category
      </InputLabel>
      <Select
        labelId="category-label"
        id="category"
        value={category}
        label="Category"
        onChange={(e) => setCategory(e.target.value)}
        sx={{
          color: inputColor,
          backgroundColor: theme.palette.background.paper
        }}
      >
        <MenuItem value="technology">Technology</MenuItem>
        <MenuItem value="finance">Finance</MenuItem>
        <MenuItem value="career">Career</MenuItem>
        <MenuItem value="personal">Personal</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  {/* Tags */}
  <Grid item xs={12} sm={6} md={3}>
    <TextField
      label="Tags"
      variant="outlined"
      fullWidth
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      placeholder="e.g., react, dev, fintech"
      slotProps={{
        input: {
          sx: {
            color: inputColor,
            backgroundColor: theme.palette.background.paper
          }
        },
        label: {
          sx: { color: labelColor }
        },
        helperText: {
          sx: { color: labelColor }
        }
      }}
      helperText="Comma separated tags"
    />
  </Grid>
</Grid>


            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 3,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              <Slate
                editor={editor}
                value={content}
                initialValue={initialValue}
                onChange={(value) => setContent(value)}
              >
                {/* Toolbar - Properly positioned at the top */}
                <Box
                  sx={{
                    p: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                    borderTopLeftRadius: 1,
                    borderTopRightRadius: 1,
                  }}
                >
                  <MarkButton format="bold" icon={<FormatBold />} />
                  <MarkButton format="italic" icon={<FormatItalic />} />
                  <MarkButton
                    format="underline"
                    icon={<FormatUnderlined />}
                  />
                  <MarkButton format="code" icon={<Code />} />

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                  {/* Heading Dropdown */}
                  <Box sx={{ position: 'relative' }}>
                    <Select
                      value=""
                      displayEmpty
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 100,
                        '& .MuiSelect-select': {
                          py: 0.5,
                          px: 1,
                          display: 'flex',
                          alignItems: 'center'
                        }
                      }}
                      IconComponent={ArrowDropDown}
                      renderValue={() => (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>Heading</Typography>
                        </Box>
                      )}
                    >
                      <MenuItem value="paragraph" onClick={(e) => {
                        e.preventDefault();
                        const event = new MouseEvent('mousedown', { bubbles: true });
                        Transforms.setNodes(
                          editor,
                          { type: 'paragraph' },
                          { match: n => Editor.isBlock(editor, n) }
                        );
                      }}>
                        <Typography variant="body2">Normal Text</Typography>
                      </MenuItem>
                      <MenuItem value="heading-one" onClick={(e) => {
                        e.preventDefault();
                        const event = new MouseEvent('mousedown', { bubbles: true });
                        toggleBlock(event, 'heading-one');
                      }}>
                        <Typography variant="h6">Heading 1</Typography>
                      </MenuItem>
                      <MenuItem value="heading-two" onClick={(e) => {
                        e.preventDefault();
                        const event = new MouseEvent('mousedown', { bubbles: true });
                        toggleBlock(event, 'heading-two');
                      }}>
                        <Typography variant="subtitle1">Heading 2</Typography>
                      </MenuItem>
                      <MenuItem value="heading-three" onClick={(e) => {
                        e.preventDefault();
                        const event = new MouseEvent('mousedown', { bubbles: true });
                        toggleBlock(event, 'heading-three');
                      }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Heading 3</Typography>
                      </MenuItem>
                      <MenuItem value="heading-four" onClick={(e) => {
                        e.preventDefault();
                        const event = new MouseEvent('mousedown', { bubbles: true });
                        toggleBlock(event, 'heading-four');
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Heading 4</Typography>
                      </MenuItem>
                      <MenuItem value="heading-five" onClick={(e) => {
                        e.preventDefault();
                        const event = new MouseEvent('mousedown', { bubbles: true });
                        toggleBlock(event, 'heading-five');
                      }}>
                        <Typography variant="body2">Heading 5</Typography>
                      </MenuItem>
                      <MenuItem value="heading-six" onClick={(e) => {
                        e.preventDefault();
                        const event = new MouseEvent('mousedown', { bubbles: true });
                        toggleBlock(event, 'heading-six');
                      }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Heading 6</Typography>
                      </MenuItem>
                    </Select>
                  </Box>

                  <ToolbarButton
                    format="block-quote"
                    icon={<FormatQuote />}
                    isBlock={true}
                    isActive={
                      Editor.nodes(editor, {
                        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'block-quote',
                      }).length > 0
                    }
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const [match] = Editor.nodes(editor, {
                        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'block-quote',
                      });
                      const isActive = !!match;

                      Transforms.setNodes(
                        editor,
                        { type: isActive ? 'paragraph' : 'block-quote' },
                        { match: n => Editor.isBlock(editor, n) }
                      );
                    }}
                  />
                  <BlockButton
                    format="bulleted-list"
                    icon={<FormatListBulleted />}
                  />
                  <BlockButton
                    format="numbered-list"
                    icon={<FormatListNumbered />}
                  />
                  <ToolbarButton
                    format="code-block"
                    icon={<Code />}
                    isBlock={true}
                    isActive={
                      Editor.nodes(editor, {
                        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'code-block',
                      }).length > 0
                    }
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const [match] = Editor.nodes(editor, {
                        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'code-block',
                      });
                      const isActive = !!match;

                      Transforms.setNodes(
                        editor,
                        { type: isActive ? 'paragraph' : 'code-block' },
                        { match: n => Editor.isBlock(editor, n) }
                      );
                    }}
                  />

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                  {/* Text Alignment Buttons */}
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <ToolbarButton
                      format="align-left"
                      icon={<FormatAlignLeft />}
                      isActive={
                        Editor.marks(editor) && Editor.marks(editor)['align'] === 'left'
                      }
                      onMouseDown={(e) => {
                        e.preventDefault();
                        Editor.removeMark(editor, 'align-center');
                        Editor.removeMark(editor, 'align-right');
                        Editor.removeMark(editor, 'align-justify');
                        Transforms.setNodes(
                          editor,
                          { align: 'left' },
                          { match: n => Editor.isBlock(editor, n) }
                        );
                      }}
                    />
                    <ToolbarButton
                      format="align-center"
                      icon={<FormatAlignCenter />}
                      isActive={
                        Editor.marks(editor) && Editor.marks(editor)['align'] === 'center'
                      }
                      onMouseDown={(e) => {
                        e.preventDefault();
                        Editor.removeMark(editor, 'align-left');
                        Editor.removeMark(editor, 'align-right');
                        Editor.removeMark(editor, 'align-justify');
                        Transforms.setNodes(
                          editor,
                          { align: 'center' },
                          { match: n => Editor.isBlock(editor, n) }
                        );
                      }}
                    />
                    <ToolbarButton
                      format="align-right"
                      icon={<FormatAlignRight />}
                      isActive={
                        Editor.marks(editor) && Editor.marks(editor)['align'] === 'right'
                      }
                      onMouseDown={(e) => {
                        e.preventDefault();
                        Editor.removeMark(editor, 'align-left');
                        Editor.removeMark(editor, 'align-center');
                        Editor.removeMark(editor, 'align-justify');
                        Transforms.setNodes(
                          editor,
                          { align: 'right' },
                          { match: n => Editor.isBlock(editor, n) }
                        );
                      }}
                    />
                    <ToolbarButton
                      format="align-justify"
                      icon={<FormatAlignJustify />}
                      isActive={
                        Editor.marks(editor) && Editor.marks(editor)['align'] === 'justify'
                      }
                      onMouseDown={(e) => {
                        e.preventDefault();
                        Editor.removeMark(editor, 'align-left');
                        Editor.removeMark(editor, 'align-center');
                        Editor.removeMark(editor, 'align-right');
                        Transforms.setNodes(
                          editor,
                          { align: 'justify' },
                          { match: n => Editor.isBlock(editor, n) }
                        );
                      }}
                    />
                  </Box>

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                  <Tooltip title="Insert Image">
                    <IconButton onClick={handleInsertImage} size="small">
                      <Image />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Editor Content */}
                <Box sx={{ p: 2, minHeight: "400px", flex: 1 }}>
                  <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Start writing your blog content here..."
                    spellCheck
                    style={{ minHeight: "400px" }}
                    onKeyDown={(event) => {
                      // Handle special key combinations
                      if (event.key === 'Enter' && event.shiftKey) {
                        // Shift+Enter for soft breaks within a block
                        event.preventDefault();
                        editor.insertText('\n');
                        return;
                      }

                      // Handle tab key for indentation
                      if (event.key === 'Tab') {
                        event.preventDefault();
                        editor.insertText('    ');
                        return;
                      }

                      // Keyboard shortcuts for formatting
                      if (event.ctrlKey || event.metaKey) {
                        switch (event.key) {
                          case 'b': {
                            event.preventDefault();
                            Editor.addMark(editor, 'bold', true);
                            return;
                          }
                          case 'i': {
                            event.preventDefault();
                            Editor.addMark(editor, 'italic', true);
                            return;
                          }
                          case 'u': {
                            event.preventDefault();
                            Editor.addMark(editor, 'underline', true);
                            return;
                          }
                          case '1': {
                            event.preventDefault();
                            toggleBlock(event, 'heading-one');
                            return;
                          }
                          case '2': {
                            event.preventDefault();
                            toggleBlock(event, 'heading-two');
                            return;
                          }
                          case '`': {
                            event.preventDefault();
                            Editor.addMark(editor, 'code', true);
                            return;
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Slate>
            </Box>
          </>
        ) : (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {title || "Blog Title"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
              <Chip label={category} color="primary" size="small" />
              {tags
                .split(",")
                .map(
                  (tag, index) =>
                    tag.trim() && (
                      <Chip
                        key={index}
                        label={tag.trim()}
                        size="small"
                        variant="outlined"
                      />
                    )
                )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                color: "text.secondary",
                typography: "body2",
              }}
            >
              <Typography variant="body2">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body2">5 min read</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                borderRadius: 2,
                minHeight: "400px",
              }}
            >
              <Box sx={{ typography: "body1" }}>
                {/* In a real app, you would render the Slate content here */}
                {content.map((node, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    {node.type === "heading-one" && (
                      <Typography variant="h4">
                        {node.children[0].text}
                      </Typography>
                    )}
                    {node.type === "heading-two" && (
                      <Typography variant="h5">
                        {node.children[0].text}
                      </Typography>
                    )}
                    {node.type === "paragraph" && (
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {node.children[0].text}
                      </Typography>
                    )}
                    {node.type === "block-quote" && (
                      <Typography
                        variant="body1"
                        sx={{
                          borderLeft: "3px solid",
                          borderColor: "primary.main",
                          pl: 2,
                          py: 1,
                          fontStyle: "italic",
                          color: "text.secondary",
                        }}
                      >
                        {node.children[0].text}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        )}

        <Paper
          elevation={2}
          sx={{
            p: 2,
            mt: 4,
            borderRadius: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.02)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <Button
              variant="outlined"
              startIcon={previewMode ? <Edit /> : <Preview />}
              onClick={() => setPreviewMode(!previewMode)}
              fullWidth={false}
              sx={{ minWidth: "120px" }}
            >
              {previewMode ? "Edit" : "Preview"}
            </Button>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {editMode && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDeleteBlog}
                  fullWidth={false}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSaveBlog}
                size="large"
                sx={{
                  px: 3,
                  py: 1,
                }}
              >
                {editMode ? "Update" : "Publish"} Blog
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Paper>

      {/* Confirmation dialog for navigating away */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to leave this page?
            Your changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => navigate("/blogs")} color="error">
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

EnhancedBlogEditor.propTypes = {
  editMode: PropTypes.bool,
};

export default EnhancedBlogEditor;
