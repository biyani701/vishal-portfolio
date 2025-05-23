import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  CardMedia,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Divider,
  Fade,
  Paper,
  Avatar,
  SwipeableDrawer,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import CodeIcon from "@mui/icons-material/Code";
import LanguageIcon from "@mui/icons-material/Language";
import BookIcon from "@mui/icons-material/Book";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import CloudIcon from "@mui/icons-material/Cloud";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LabelIcon from "@mui/icons-material/Label";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import StorageIcon from "@mui/icons-material/Storage";
import SecurityIcon from "@mui/icons-material/Security";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SpeedIcon from "@mui/icons-material/Speed";
import BuildIcon from "@mui/icons-material/Build";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ApiIcon from "@mui/icons-material/Api";
import DataObjectIcon from "@mui/icons-material/DataObject";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import TerminalIcon from "@mui/icons-material/Terminal";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import LaunchIcon from "@mui/icons-material/Launch";

const Works = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Project data
  const projects = [
    {
      id: "portfolio-site",
      title: "Portfolio Website",
      shortDescription:
        "A modern React-based portfolio website with Material UI, featuring responsive design, dark mode, and interactive components.",
      fullDescription:
        "This portfolio website showcases my projects and skills using modern web technologies. Built with React and Material UI, it features responsive design for all screen sizes, light and dark mode with customizable color palettes, interactive components like a periodic table of skills, and a blog system. The site is deployed on GitHub Pages and includes authentication with Auth.js.",
      technologies: [
        "React",
        "Material UI",
        "JavaScript",
        "Auth.js",
        "GitHub Pages",
        "Responsive Design",
      ],
      features: [
        "Responsive design for all screen sizes",
        "Light and dark mode with customizable color palettes",
        "Interactive periodic table of skills",
        "Blog system with Slate.js editor",
        "Authentication with Auth.js",
        "Docusaurus documentation site",
      ],
      image: "https://via.placeholder.com/400x200?text=Portfolio+Website",
      links: {
        github: "https://github.com/biyani701/portfolio",
        demo: "https://vishal.biyani.xyz",
      },
      type: "Personal Project",
      year: "2023",
    },
    {
      id: "get-confluence-space-pages-details",
      title: "Confluence Space Pages Details",
      shortDescription:
        "A Python tool to extract and format Confluence space pages details with secure credential management and enrichment capabilities.",
      fullDescription:
        "This Python tool automates the extraction and formatting of Confluence space pages. It uses KeePass for secure credential management, formats data into structured JSON, filters unwanted pages, and leverages asynchronous API requests for better performance. The tool also includes an enrichment feature that can enhance glossary descriptions with external data from sources like Wikipedia and Investopedia.",
      technologies: [
        "Python",
        "Async/Await",
        "KeePass",
        "Confluence API",
        "JSON",
      ],
      features: [
        "Extract page details from Confluence spaces",
        "Secure credential management using KeePass",
        "Format data into a structured JSON format",
        "Filter out unwanted pages",
        "Asynchronous API requests for better performance",
        "Enrich glossary descriptions with external data",
      ],
      image: "https://via.placeholder.com/400x200?text=Confluence+Tool",
      links: {
        github:
          "https://github.com/vishalbiyani/get-confluence-space-pages-details",
        docs: "https://get-confluence-space-pages-details.readthedocs.io/",
        pypi: "https://pypi.org/project/get-confluence-space-pages-details/",
      },
      type: "Personal Project",
      year: "2023",
    },
    {
      id: "fast-jiraql",
      title: "Fast-JiraQL",
      shortDescription:
        "A FastAPI application that provides GraphQL and REST API interfaces to query and interact with Jira data stored in a PostgreSQL database.",
      fullDescription:
        "Fast-JiraQL is a modern API solution for accessing and manipulating Jira data through both REST and GraphQL interfaces. It features Redis caching for improved performance, authentication with Microsoft identity, and customizable OpenAPI documentation. The application is built with a clean architecture using dependency injection and includes comprehensive documentation generated with MkDocs. It's designed to provide flexible, high-performance access to Jira data stored in PostgreSQL.",
      technologies: [
        "Python",
        "FastAPI",
        "GraphQL",
        "PostgreSQL",
        "Redis",
        "SQLAlchemy",
        "Strawberry GraphQL",
        "Dependency Injection",
        "MkDocs",
      ],
      features: [
        "REST API endpoints for Jira data",
        "GraphQL API for flexible queries",
        "Redis caching for improved performance",
        "Authentication with Microsoft identity",
        "Customizable OpenAPI documentation with code examples",
        "Dependency injection for clean architecture",
        "Comprehensive documentation with MkDocs",
        "Automated testing with pytest",
        "Database integration with SQLAlchemy ORM",
      ],
      image: "https://via.placeholder.com/400x200?text=Fast-JiraQL",
      links: {
        github: "https://github.com/biyani701/fast-jiraql",
        docs: "https://fast-jiraql.readthedocs.io/",
        demo: "https://fast-jiraql-demo.example.com",
      },
      type: "Open Source Project",
      year: "2023",
    },
    {
      id: "jiradashboard",
      title: "JIRA Dashboard",
      shortDescription:
        "A Python-based dashboard for JIRA project management with secure credential handling and comprehensive analytics capabilities.",
      fullDescription:
        "This dashboard application provides a comprehensive view of JIRA project data with secure credential management through KeePass. It features REST API integration with JIRA, PostgreSQL database connectivity, and various analytics capabilities including release tracking, worklog analysis, and sprint performance metrics. The application uses Dash for the frontend and includes features like OpenAI integration and service availability monitoring.",
      technologies: [
        "Python",
        "Dash",
        "PostgreSQL",
        "JIRA REST API",
        "KeePass",
        "Redis",
        "Docker",
        "Bitbucket Pipelines",
      ],
      features: [
        "Secure credential management using KeePass",
        "JIRA REST API integration for project data retrieval",
        "PostgreSQL database connectivity for data storage and analysis",
        "Release notes and version tracking",
        "Worklog analysis and time tracking",
        "Sprint performance metrics",
        "Service availability monitoring",
        "OpenAI ChatGPT integration",
        "Docker containerization for deployment",
      ],
      image: "https://via.placeholder.com/400x200?text=JIRA+Dashboard",
      links: {
        bitbucket: "https://bitbucket.org/visby8em/jiradashboard",
        jira: "https://biyani.atlassian.net/browse/DASH",
      },
      type: "Project",
      year: "2022",
    },
    {
      id: "admin-dashboard",
      title: "Admin Dashboard",
      shortDescription:
        "A Flask-Admin based dashboard for managing teams, users, and NLP training data with secure database connectivity.",
      fullDescription:
        "This admin dashboard application provides a comprehensive interface for managing teams, users, and NLP training data. It features secure credential management through KeePass, PostgreSQL database connectivity, and a clean interface built with Flask-Admin. The application includes custom model views for different data types, validation logic, and bulk creation capabilities. It's designed to be deployed with uWSGI for production use.",
      technologies: [
        "Python",
        "Flask",
        "Flask-Admin",
        "SQLAlchemy",
        "PostgreSQL",
        "KeePass",
        "uWSGI",
        "WTForms",
      ],
      features: [
        "Secure credential management using KeePass",
        "Custom model views for teams, users, and NLP training data",
        "Email validation against user database",
        "Automatic account ID retrieval",
        "Bulk data creation through Excel uploads",
        "Case-insensitive text search",
        "Configurable uWSGI deployment",
        "Role-based access control framework",
      ],
      image: "https://via.placeholder.com/400x200?text=Admin+Dashboard",
      links: {},
      type: "Project",
      year: "2023",
    },
  ];

  const handleOpenDialog = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Filter projects based on search query and active tab
  useEffect(() => {
    let result = [...projects];

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter(project =>
        project.type.toLowerCase().includes(activeTab.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.technologies.some(tech => tech.toLowerCase().includes(query))
      );
    }

    // Filter by selected technology
    if (selectedTech) {
      result = result.filter(project =>
        project.technologies.some(tech => tech === selectedTech)
      );
    }

    setFilteredProjects(result);
    // Removed 'projects' from dependency array since it's a static array defined in the component
  }, [searchQuery, activeTab, selectedTech]);

  // Get all unique project types for tabs
  const projectTypes = ["all", ...new Set(projects.map(project =>
    project.type.toLowerCase().replace(/\s+/g, '-')
  ))];

  // Get all unique technologies for filtering
  const allTechnologies = [...new Set(
    projects.flatMap(project => project.technologies)
  )].sort();

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  // Handle technology selection
  const handleTechSelect = (tech) => {
    setSelectedTech(tech === selectedTech ? null : tech);
  };

  // Toggle sidebar pin state
  const toggleSidebarPin = () => {
    setSidebarPinned(!sidebarPinned);
    setSidebarOpen(!sidebarPinned);
  };

  // Handle sidebar hover
  const handleSidebarMouseEnter = () => {
    if (!sidebarPinned && !isMobile) {
      setSidebarHovered(true);
      setSidebarOpen(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    if (!sidebarPinned && !isMobile) {
      setSidebarHovered(false);
      setSidebarOpen(false);
    }
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarPinned(!sidebarPinned);
      setSidebarOpen(!sidebarPinned);
    }
  };

  // Update sidebar state when screen size changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(sidebarPinned);
    }
  }, [isMobile, sidebarPinned]);

  // Function to render feature icons based on feature text
  const getFeatureIcon = (feature) => {
    if (feature.includes("KeePass") || feature.includes("credential"))
      return <SecurityIcon color="primary" />;
    if (feature.includes("API") || feature.includes("requests"))
      return <CloudIcon color="primary" />;
    if (feature.includes("JSON") || feature.includes("data"))
      return <StorageIcon color="primary" />;
    if (feature.includes("Async") || feature.includes("performance"))
      return <SpeedIcon color="primary" />;
    if (feature.includes("Enrich") || feature.includes("external"))
      return <AutoAwesomeIcon color="primary" />;
    if (feature.includes("Filter")) return <BuildIcon color="primary" />;
    return <CheckCircleOutlineIcon color="primary" />;
  };

  // Function to get project icon based on technologies
  const getProjectIcon = (project) => {
    const techs = project.technologies.map(t => t.toLowerCase());

    if (techs.includes("react")) {
      return <CodeIcon sx={{ fontSize: 64, color: "#61DAFB" }} />;
    } else if (techs.includes("python")) {
      return <TerminalIcon sx={{ fontSize: 64, color: "#3776AB" }} />;
    } else if (techs.includes("fastapi") || techs.includes("api")) {
      return <ApiIcon sx={{ fontSize: 64, color: "#009688" }} />;
    } else if (techs.includes("graphql")) {
      return <DataObjectIcon sx={{ fontSize: 64, color: "#E535AB" }} />;
    } else if (techs.includes("confluence")) {
      return <DescriptionIcon sx={{ fontSize: 64, color: "#0052CC" }} />;
    } else {
      return <IntegrationInstructionsIcon sx={{ fontSize: 64, color: theme.palette.primary.main }} />;
    }
  };

  // Sidebar content
  const sidebarContent = (
    <Box
      sx={{
        width: sidebarOpen ? { xs: 250, sm: 280 } : 0,
        p: sidebarOpen ? 2 : 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {sidebarOpen && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: theme.palette.mode === "dark" ? "white" : "text.primary",
              }}
            >
              <LabelIcon fontSize="small" color="primary" />
              Technologies
            </Typography>

            <IconButton
              onClick={toggleSidebarPin}
              size="small"
              color={sidebarPinned ? "primary" : "default"}
              sx={{
                opacity: sidebarHovered || sidebarPinned ? 1 : 0.5,
                '&:hover': { opacity: 1 },
              }}
            >
              {sidebarPinned ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              gap: 1,
              overflowY: "auto",
              flex: 1,
            }}
          >
            {allTechnologies.map((tech) => (
              <Chip
                key={tech}
                label={tech}
                clickable
                color={selectedTech === tech ? "primary" : "default"}
                variant={selectedTech === tech ? "filled" : "outlined"}
                onClick={() => handleTechSelect(tech)}
                sx={{
                  borderRadius: 1,
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  mb: 0.5,
                  backgroundColor: selectedTech === tech ? undefined : alpha(theme.palette.background.paper, 0.9),
                  color: selectedTech === tech ? undefined : theme.palette.text.primary,
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );

  return (
    <Box
      component="section"
      id="works"
      sx={{
        py: { xs: 5, md: 8 },
        backgroundColor:
          theme.palette.mode === "dark" ? "background.default" : "#f8f9fa",
        position: "relative",
      }}
    >
      <Box sx={{ display: 'flex' }}>
        {/* Mobile Drawer */}
        <SwipeableDrawer
          anchor="left"
          open={isMobile && sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              width: 280,
            },
          }}
        >
          {sidebarContent}
        </SwipeableDrawer>

        {/* Desktop Drawer */}
        <Box
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
          sx={{
            display: { xs: 'none', md: 'block' },
            width: sidebarOpen ? 280 : 60,
            flexShrink: 0,
            transition: 'width 0.3s ease',
            position: 'relative',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(8px)',
            height: '100%',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Collapsed sidebar icon */}
          {!sidebarOpen && (
            <Box
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <IconButton
                onClick={toggleSidebar}
                color="primary"
                size="small"
                sx={{
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 1,
                }}
              >
                <ChevronRightIcon />
              </IconButton>
              <LabelIcon color="primary" />
            </Box>
          )}

          {sidebarContent}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            width: {
              xs: '100%',
              md: sidebarOpen ? 'calc(100% - 280px)' : 'calc(100% - 60px)'
            },
            transition: 'width 0.3s ease',
          }}
        >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              mb: 2,
              fontWeight: 700,
              color: theme.palette.primary.main,
              textShadow:
                theme.palette.mode === "dark"
                  ? "0 2px 4px rgba(0,0,0,0.5)"
                  : "none",
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                width: "60px",
                height: "4px",
                bottom: "-10px",
                left: "calc(50% - 30px)",
                backgroundColor: theme.palette.primary.main,
                borderRadius: "2px",
              },
            }}
            data-aos="fade-up"
          >
            My Projects
          </Typography>

          <Typography
            variant="h6"
            component="p"
            align="center"
            sx={{
              mb: 5,
              maxWidth: "800px",
              mx: "auto",
              color: theme.palette.text.secondary,
              fontWeight: 400,
            }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            A showcase of my personal and professional projects, demonstrating my
            skills and experience in software development.
          </Typography>

          {/* Search and Filter Section */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <TextField
              placeholder="Search projects..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                maxWidth: { xs: "100%", md: "300px" },
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }
              }}
            />

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                minHeight: "40px",
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTab-root": {
                  minHeight: "40px",
                  textTransform: "capitalize",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  px: 2,
                },
              }}
            >
              {projectTypes.map((type) => (
                <Tab
                  key={type}
                  value={type}
                  label={type === "all" ? "All Projects" : type.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                />
              ))}
            </Tabs>
          </Box>

          {/* Projects Grid */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {(filteredProjects.length > 0 ? filteredProjects : projects).map((project, index) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              key={project.id}
              data-aos="fade-up"
              data-aos-delay={150 + index * 50}
            >
              <Card
                elevation={3}
                sx={{
                  height: 450, // Fixed height for consistency
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  backgroundColor: theme.palette.background.paper,
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.palette.mode === "dark"
                      ? `0 12px 28px ${alpha(theme.palette.primary.main, 0.25)}`
                      : `0 12px 28px ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                  "&:hover .project-overlay": {
                    opacity: 1,
                  },
                }}
              >
                {/* Project Type Badge */}
                <Chip
                  label={project.type}
                  size="small"
                  color="primary"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    borderRadius: 1,
                  }}
                />

                {/* Project Icon */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pt: 4,
                    pb: 2,
                    position: "relative",
                    zIndex: 1,
                    height: 120, // Increased height for icon section
                  }}
                >
                  {getProjectIcon(project)}
                </Box>

                <CardContent
                  sx={{
                    flexGrow: 1,
                    textAlign: "center",
                    px: 3,
                    pb: 3,
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: 300, // Increased height for content section
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      mb: 1.5,
                      color: theme.palette.mode === "dark"
                        ? "#fff"
                        : theme.palette.primary.dark || "#000",
                      textShadow: theme.palette.primary.main === "#2E6F40"
                        ? "0px 1px 1px rgba(255,255,255,0.5)"
                        : "none",
                    }}
                  >
                    {project.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      height: "4.5em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      minHeight: 60, // Ensure consistent height
                      color: theme.palette.primary.main === "#2E6F40"
                        ? "#000"
                        : theme.palette.text.secondary,
                      fontWeight: theme.palette.primary.main === "#2E6F40" ? 500 : 400,
                    }}
                  >
                    {project.shortDescription}
                  </Typography>

                  {/* Technology Tags */}
                  <Box sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 0.75,
                    mb: 2,
                  }}>
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <Chip
                        key={i}
                        label={tech}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          fontSize: "0.7rem",
                          height: "24px",
                          backgroundColor: theme.palette.primary.main === "#2E6F40"
                            ? alpha("#fff", 0.9)
                            : undefined,
                          color: theme.palette.primary.main === "#2E6F40"
                            ? "#000"
                            : undefined,
                          fontWeight: theme.palette.primary.main === "#2E6F40" ? 600 : 400,
                          border: theme.palette.primary.main === "#2E6F40"
                            ? "1px solid #000"
                            : undefined,
                        }}
                      />
                    ))}
                    {project.technologies.length > 3 && (
                      <Chip
                        label={`+${project.technologies.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 1,
                          fontSize: "0.7rem",
                          height: "24px",
                          backgroundColor: theme.palette.primary.main === "#2E6F40"
                            ? alpha("#fff", 0.9)
                            : undefined,
                          color: theme.palette.primary.main === "#2E6F40"
                            ? "#000"
                            : undefined,
                          fontWeight: theme.palette.primary.main === "#2E6F40" ? 600 : 400,
                          border: theme.palette.primary.main === "#2E6F40"
                            ? "1px solid #000"
                            : undefined,
                        }}
                      />
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenDialog(project)}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      borderRadius: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      boxShadow: 1,
                      backgroundColor: theme.palette.primary.main === "#2E6F40"
                        ? "#253D2C"
                        : undefined,
                      color: theme.palette.primary.main === "#2E6F40"
                        ? "#fff"
                        : undefined,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.main === "#2E6F40"
                          ? "#1A2A1F"
                          : undefined,
                      }
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>

                {/* Overlay on hover */}
                <Box
                  className="project-overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    backdropFilter: "blur(2px)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 0,
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Project Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
          slots={{ transition: Fade }}
          slotProps={{
            transition: { timeout: 300 },
            paper: {
              sx: {
                borderRadius: isMobile ? 0 : 2,
                backgroundColor:
                  theme.palette.mode === "dark" ? "background.paper" : "white",
                overflow: "hidden",
                backgroundImage: theme.palette.mode === "dark"
                  ? "linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px)"
                  : "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "-1px -1px",
              },
            },
          }}
        >
          {selectedProject && (
            <>
              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  pb: 2,
                  pt: 2,
                  px: { xs: 2, sm: 3 },
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getProjectIcon(selectedProject)}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="span"
                    sx={{ fontWeight: 700 }}
                  >
                    {selectedProject.title}
                  </Typography>
                </Box>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleCloseDialog}
                  aria-label="close"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: { xs: 2, sm: 3 }, pb: 0 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ position: "relative", mb: 3 }}>
                      <CardMedia
                        component="img"
                        image={selectedProject.image}
                        alt={selectedProject.title}
                        sx={{
                          borderRadius: 2,
                          boxShadow: 3,
                          height: { xs: 200, sm: 250 },
                          objectFit: "cover",
                        }}
                      />
                      <Chip
                        label={`${selectedProject.type} • ${selectedProject.year}`}
                        color="primary"
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          fontWeight: 500,
                          borderRadius: 1,
                          backdropFilter: "blur(4px)",
                          backgroundColor: alpha(theme.palette.primary.main, 0.8),
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: theme.palette.primary.main,
                        '&::before': {
                          content: '""',
                          display: 'block',
                          width: '4px',
                          height: '20px',
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: '2px',
                        }
                      }}
                    >
                      About This Project
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                      {selectedProject.fullDescription}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: theme.palette.primary.main,
                        '&::before': {
                          content: '""',
                          display: 'block',
                          width: '4px',
                          height: '20px',
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: '2px',
                        }
                      }}
                    >
                      Technologies Used
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 3,
                      }}
                    >
                      {selectedProject.technologies.map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          color="primary"
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            fontWeight: 500,
                            transition: "all 0.2s ease",
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              transform: "translateY(-2px)",
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.primary.main, 0.03),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: theme.palette.primary.main,
                          '&::before': {
                            content: '""',
                            display: 'block',
                            width: '4px',
                            height: '20px',
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: '2px',
                          }
                        }}
                      >
                        Key Features
                      </Typography>
                      <List disablePadding>
                        {selectedProject.features.map((feature, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              px: 0,
                              py: 0.75,
                              borderBottom: index < selectedProject.features.length - 1
                                ? `1px dashed ${alpha(theme.palette.divider, 0.5)}`
                                : 'none',
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {getFeatureIcon(feature)}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2" fontWeight={500}>
                                  {feature}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: theme.palette.primary.main,
                        '&::before': {
                          content: '""',
                          display: 'block',
                          width: '4px',
                          height: '20px',
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: '2px',
                        }
                      }}
                    >
                      Project Links
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 1.5,
                        mb: 3,
                      }}
                    >
                      {selectedProject.links.github && (
                        <Button
                          variant="contained"
                          startIcon={<GitHubIcon />}
                          href={selectedProject.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 1,
                            backgroundColor: "#24292e",
                            '&:hover': {
                              backgroundColor: "#1a1e22",
                            }
                          }}
                        >
                          GitHub Repository
                        </Button>
                      )}
                      {selectedProject.links.demo && (
                        <Button
                          variant="contained"
                          startIcon={<LaunchIcon />}
                          href={selectedProject.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 1,
                          }}
                        >
                          Live Demo
                        </Button>
                      )}
                      {selectedProject.links.docs && (
                        <Button
                          variant="outlined"
                          startIcon={<BookIcon />}
                          href={selectedProject.links.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 1,
                          }}
                        >
                          Documentation
                        </Button>
                      )}
                      {selectedProject.links.pypi && (
                        <Button
                          variant="outlined"
                          startIcon={<LanguageIcon />}
                          href={selectedProject.links.pypi}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            fontWeight: 500,
                            borderRadius: 1,
                          }}
                        >
                          PyPI Package
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                sx={{
                  p: 2.5,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  backgroundColor: alpha(theme.palette.primary.main, 0.03),
                }}
              >
                <Button
                  onClick={handleCloseDialog}
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* No Projects Found Message */}
        {filteredProjects.length === 0 && searchQuery && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
            }}
            data-aos="fade-up"
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              No projects found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
                setSelectedTech(null);
              }}
              sx={{
                borderRadius: 1,
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Works;
