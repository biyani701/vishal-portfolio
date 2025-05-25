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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { trackClick } from "../utils/analytics";

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

  // Categorize projects
  const categories = {
    "Personal Projects": projects.filter(p => p.type === "Personal Project"),
    "Open Source": projects.filter(p => p.type === "Open Source Project"),
    "Professional Projects": projects.filter(p => p.type === "Project"),
  };

  // Technology categories
  const techCategories = {
    "Frontend": ["React", "Material UI", "JavaScript", "Dash"],
    "Backend": ["Python", "FastAPI", "Flask", "GraphQL"],
    "Database": ["PostgreSQL", "Redis", "SQLAlchemy"],
    "DevOps": ["Docker", "GitHub Pages", "Bitbucket Pipelines"],
    "Security": ["Auth.js", "KeePass", "Microsoft identity"],
  };

  const handleOpenDialog = (project) => {
    console.log("Opening dialog for project:", project);
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    console.log("Closing dialog");
    setOpenDialog(false);
    setSelectedProject(null);
  };

  // Filter projects based on search query and active tab
  useEffect(() => {
    let result = [...projects];

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter((project) =>
        project.type.toLowerCase().includes(activeTab.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();      
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.shortDescription.toLowerCase().includes(query) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(query)
          )
      );
    }

    // Filter by selected technology
    if (selectedTech) {
      result = result.filter((project) =>
        project.technologies.some((tech) => tech === selectedTech)
      );
    }

    setFilteredProjects(result);
    // Removed 'projects' from dependency array since it's a static array defined in the component
  }, [searchQuery, activeTab, selectedTech]);

  // Get all unique project types for tabs
  const projectTypes = [
    "all",
    ...new Set(
      projects.map((project) => project.type.toLowerCase().replace(/\s+/g, "-"))
    ),
  ];

  // Get all unique technologies for filtering
  const allTechnologies = [
    ...new Set(projects.flatMap((project) => project.technologies)),
  ].sort();

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    if (newValue === "all") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.type.toLowerCase().replace(/\s+/g, "-") === newValue
      );
      setFilteredProjects(filtered);
    }
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
    const techs = project.technologies.map((t) => t.toLowerCase());

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
      return (
        <IntegrationInstructionsIcon
          sx={{ fontSize: 64, color: theme.palette.primary.main }}
        />
      );
    }
  };

  // Function to track project link clicks
  const trackProjectLinkClick = (projectId, linkType, url) => {
    console.log(`[Works] Tracking click for project ${projectId}, link type: ${linkType}`);
    trackClick(
      `project-${projectId}-${linkType}`, // elementId
      'project-link',                     // elementType
      window.location.pathname,           // pageUrl
      null                                // userId
    );
  };

  const renderSidebarContent = () => (
    <Box sx={{ width: 250, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2}}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Categories</Typography>
        <IconButton onClick={toggleSidebarPin} size="small">
          {sidebarPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
        </IconButton>
      </Box>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DescriptionIcon color="primary" />
          <Typography>Project Types</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {Object.entries(categories).map(([category, projects]) => (
              <ListItem 
                button 
                key={category}
                onClick={() => {
                  setActiveTab(category.toLowerCase().replace(/\s+/g, '-'));
                  setFilteredProjects(projects);
                }}
              >
                <ListItemIcon>
                  {category === "Personal Projects" ? <CodeIcon color="primary" /> :
                   category === "Open Source" ? <GitHubIcon color="primary" /> :
                   <BuildIcon color="primary" />}
                </ListItemIcon>
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BuildIcon color="primary" />
            <Typography>Technologies</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {Object.entries(techCategories).map(([category, techs]) => (
              <Accordion key={category}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {category === "Frontend" ? <CodeIcon color="primary" /> :
                     category === "Backend" ? <StorageIcon color="primary" /> :
                     category === "Database" ? <DataObjectIcon color="primary" /> :
                     category === "DevOps" ? <CloudIcon color="primary" /> :
                     <SecurityIcon color="primary" />}
                  <Typography>{category}</Typography>
                </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {techs.map((tech) => (
                      <ListItem 
                        button 
                        key={tech}
                        onClick={() => {
                          setSelectedTech(tech);
                          setFilteredProjects(
                            projects.filter(p => 
                              p.technologies.some(t => 
                                t.toLowerCase().includes(tech.toLowerCase())
                              )
                            )
                          );
                        }}
                      >
                        <ListItemIcon>
                          {tech.includes("React") ? <CodeIcon color="primary" /> :
                           tech.includes("Python") ? <TerminalIcon color="primary" /> :
                           tech.includes("FastAPI") ? <ApiIcon color="primary" /> :
                           tech.includes("GraphQL") ? <DataObjectIcon color="primary" /> :
                           tech.includes("PostgreSQL") ? <StorageIcon color="primary" /> :
                           tech.includes("Docker") ? <CloudIcon color="primary" /> :
                           tech.includes("Security") ? <SecurityIcon color="primary" /> :
                           <BuildIcon color="primary" />}
                        </ListItemIcon>
                        <ListItemText primary={tech} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
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
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        {/* Mobile Drawer */}
        <SwipeableDrawer
          anchor="left"
          open={isMobile && sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              width: 280,
              height: "100%",
            },
          }}
        >
          {renderSidebarContent()}
        </SwipeableDrawer>

        {/* Desktop Drawer */}
        <Box
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
          sx={{
            display: { xs: "none", md: "block" },
            width: sidebarOpen ? 280 : 30,
            flexShrink: 0,
            transition: "width 0.3s ease",
            position: "relative",
            borderRight: `3px solid ${alpha(theme.palette.divider, 0.1)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(8px)",
            height: "100vh",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          {/* Collapsed sidebar icon */}
          {!sidebarOpen && (
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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

          {renderSidebarContent()}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            width: {
              xs: "100%",
              md: sidebarOpen ? "calc(100% - 280px)" : "calc(100% - 60px)",
            },
            transition: "width 0.3s ease",            
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
              A showcase of my personal and professional projects, demonstrating
              my skills and experience in software development.
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
                  },
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
                    label={
                      type === "all"
                        ? "All Projects"
                        : type
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")
                    }
                  />
                ))}
              </Tabs>
            </Box>

            {/* Projects Grid */}
            <Grid container spacing={2.5} sx={{ mt: 1 }}>
              {(filteredProjects.length > 0 ? filteredProjects : projects).map(
                (project, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    key={project.id}
                    // data-aos="fade-up"
                    // data-aos-delay={150 + index * 50}
                    sx={{ flexBasis: "550px"}}                    
                  >
                    <Card
                      elevation={2}
                      sx={{
                        height: 360,
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        borderRadius: 3,
                        overflow: "hidden",
                        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                        backgroundColor: theme.palette.background.paper,
                        position: "relative",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`
                              : `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                          "& .project-icon": {
                            transform: "scale(1.1)",
                          },
                          "& .project-overlay": {
                            opacity: 1,
                          },
                        },
                      }}
                      onClick={() => {
                        console.log("Card clicked for project:", project);
                        handleOpenDialog(project);
                      }}
                    >
                      {/* Project Type Badge */}
                      <Chip
                        label={project.type}
                        size="small"
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          zIndex: 3,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderRadius: 2,
                          backdropFilter: "blur(10px)",
                          backgroundColor: alpha(theme.palette.primary.main, 0.9),
                        }}
                      />

                      {/* Compact Project Icon Section */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          pt: 3,
                          pb: 1.5,
                          position: "relative",
                          zIndex: 1,
                          height: 80, // Reduced from 120px
                          background: `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.05
                          )} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
                        }}
                      >
                        <Box
                          className="project-icon"
                          sx={{
                            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          {getProjectIcon(project)}
                        </Box>
                      </Box>

                      <CardContent
                        sx={{
                          flexGrow: 1,
                          textAlign: "center",
                          px: 2.5,
                          pb: 2.5,
                          pt: 1,
                          position: "relative",
                          zIndex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: 250, // Adjusted for new total height
                        }}
                      >
                        {/* Title */}
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            mb: 1,
                            color:
                              theme.palette.mode === "dark"
                                ? "#fff"
                                : theme.palette.primary.dark || "#000",
                            textShadow:
                              theme.palette.primary.main === "#2E6F40"
                                ? "0px 1px 1px rgba(255,255,255,0.5)"
                                : "none",
                            lineHeight: 1.3,
                            // Ensure title doesn't exceed 2 lines
                            height: "2.6em",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {project.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 2,
                            height: "3.6em", // Reduced from 4.5em
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            color:
                              theme.palette.primary.main === "#2E6F40"
                                ? "#000"
                                : theme.palette.text.secondary,
                            fontWeight:
                              theme.palette.primary.main === "#2E6F40" ? 500 : 400,
                            fontSize: "0.875rem",
                            lineHeight: 1.4,
                          }}
                        >
                          {project.shortDescription}
                        </Typography>

                        {/* Technology Tags - More Compact */}
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: 0.5,
                            mb: 2,
                            minHeight: "32px", // Ensure consistent spacing
                          }}
                        >
                          {project.technologies.slice(0, 2).map((tech, i) => (
                            <Chip
                              key={i}
                              label={tech}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderRadius: 2,
                                fontSize: "0.65rem",
                                height: "22px",
                                backgroundColor:
                                  theme.palette.primary.main === "#2E6F40"
                                    ? alpha("#fff", 0.9)
                                    : alpha(theme.palette.primary.main, 0.08),
                                color:
                                  theme.palette.primary.main === "#2E6F40"
                                    ? "#000"
                                    : theme.palette.primary.main,
                                fontWeight: 500,
                                border:
                                  theme.palette.primary.main === "#2E6F40"
                                    ? "1px solid #000"
                                    : `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                              }}
                            />
                          ))}
                          {project.technologies.length > 2 && (
                            <Chip
                              label={`+${project.technologies.length - 2}`}
                              size="small"
                              variant="filled"
                              color="primary"
                              sx={{
                                borderRadius: 2,
                                fontSize: "0.65rem",
                                height: "22px",
                                fontWeight: 600,
                                minWidth: "32px",
                              }}
                            />
                          )}
                        </Box>

                        {/* View Details Button - More Prominent */}
                        <Button
                          variant="contained"
                          color="primary"
                          size="medium"
                          endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem" }} />}
                          sx={{                            
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                            backgroundColor:
                              theme.palette.primary.main === "#2E6F40"
                                ? "#253D2C"
                                : theme.palette.primary.main,
                            color: "#fff",
                            py: 1,
                            "&:hover": {
                              backgroundColor:
                                theme.palette.primary.main === "#2E6F40"
                                  ? "#1A2A1F"
                                  : theme.palette.primary.dark,
                              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>

                      {/* Enhanced Overlay on hover */}
                      <Box
                        className="project-overlay"
                        sx={{
                          position: "relative",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${alpha(
                            theme.palette.primary.main,
                            0.1
                          )} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
                          backdropFilter: "blur(1px)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          zIndex: 0,
                        }}
                      />
                    </Card>
                  </Grid>
                )
              )}
            </Grid>

            {/* Project Details Dialog */}
            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              maxWidth="xl"
              fullWidth
              fullScreen={isMobile}
              slots={{ transition: Fade }}
              slotProps={{
                transition: { timeout: 400 },
                paper: {
                  sx: {
                    borderRadius: isMobile ? 0 : 3,
                    backgroundColor: theme.palette.background.paper,
                    overflow: "hidden",
                    maxHeight: "92vh",
                    // Modern glass effect
                    backdropFilter: "blur(20px)",
                    boxShadow: theme.palette.mode === "dark"
                      ? "0 32px 64px rgba(0,0,0,0.5)"
                      : "0 32px 64px rgba(0,0,0,0.15)",
                  },
                },
                backdrop: {
                  sx: {
                    backdropFilter: "blur(8px)",
                    backgroundColor: alpha(theme.palette.background.default, 0.7),
                  },
                },
              }}
            >
              {selectedProject && (
                <>
                  {/* Compact Header */}
                  <Box
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Background Pattern */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `radial-gradient(circle at 20% 80%, ${alpha("#fff", 0.1)} 0%, transparent 50%),
                                         radial-gradient(circle at 80% 20%, ${alpha("#fff", 0.1)} 0%, transparent 50%)`,
                      }}
                    />

                    <DialogTitle sx={{ position: "relative", zIndex: 1, p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: "rgba(255,255,255,0.2)",
                              color: "white",
                              width: 48,
                              height: 48,
                              backdropFilter: "blur(10px)",
                              border: "2px solid rgba(255,255,255,0.3)",
                            }}
                          >
                            {getProjectIcon(selectedProject)}
                          </Avatar>
                          <Box>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
                              {selectedProject.title}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                              <Chip
                                label={selectedProject.type}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(255,255,255,0.2)",
                                  color: "white",
                                  fontWeight: 600,
                                  backdropFilter: "blur(10px)",
                                }}
                              />
                              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                {selectedProject.year}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <IconButton
                          onClick={handleCloseDialog}
                          sx={{
                            color: "white",
                            bgcolor: "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(10px)",
                            "&:hover": {
                              bgcolor: "rgba(255,255,255,0.2)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </DialogTitle>
                  </Box>

                  <DialogContent sx={{ p: 0 }}>
                    {/* Main Content - Single Column Layout */}
                    <Box sx={{ p: 4 }}>
                      {/* Project Image - Full Width */}
                      <Box sx={{ position: "relative", mb: 4 }}>
                        <CardMedia
                          component="img"
                          image={selectedProject.image}
                          alt={selectedProject.title}
                          sx={{
                            borderRadius: 3,
                            boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                            height: { xs: 280, sm: 400 },
                            width: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.01)",
                            },
                          }}
                        />

                        {/* Quick Action Buttons */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            display: "flex",
                            gap: 1,
                          }}
                        >
                          {selectedProject.links.demo && (
                            <Button
                              variant="contained"
                              startIcon={<LaunchIcon />}
                              href={selectedProject.links.demo}
                              target="_blank"
                              onClick={() => trackProjectLinkClick(selectedProject.id, 'demo', selectedProject.links.demo)}
                              sx={{
                                bgcolor: "rgba(0,0,0,0.7)",
                                color: "white",
                                backdropFilter: "blur(10px)",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: "rgba(0,0,0,0.9)",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              Live Demo
                            </Button>
                          )}
                          {selectedProject.links.github && (
                            <Button
                              variant="contained"
                              startIcon={<GitHubIcon />}
                              href={selectedProject.links.github}
                              target="_blank"
                              onClick={() => trackProjectLinkClick(selectedProject.id, 'github', selectedProject.links.github)}
                              sx={{
                                bgcolor: "rgba(0,0,0,0.7)",
                                color: "white",
                                backdropFilter: "blur(10px)",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: "rgba(0,0,0,0.9)",
                                  transform: "translateY(-2px)",
                                },
                              }}
                            >
                              View Code
                            </Button>
                          )}
                        </Box>
                      </Box>

                      {/* Content Grid - Better Proportions */}
                      <Grid container spacing={4}>
                        {/* Left Column - Main Content */}
                        <Grid item xs={12} md={8}>
                          {/* Description */}
                          <Box sx={{ mb: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                              About This Project
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
                              {selectedProject.fullDescription}
                            </Typography>
                          </Box>

                          {/* Features */}
                          <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: theme.palette.primary.main }}>
                              Key Features
                            </Typography>
                            <Grid container spacing={2}>
                              {selectedProject.features.map((feature, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: 1.5,
                                      p: 2.5,
                                      borderRadius: 2,
                                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                      transition: "all 0.2s ease",
                                      "&:hover": {
                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                        transform: "translateY(-2px)",
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                                      },
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        color: theme.palette.primary.main,
                                        mt: 0.25,
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {getFeatureIcon(feature)}
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                                      {feature}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>

                          {/* Additional Links */}
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                              Additional Resources
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                              {selectedProject.links.docs && (
                                <Button
                                  variant="outlined"
                                  startIcon={<BookIcon />}
                                  href={selectedProject.links.docs}
                                  target="_blank"
                                  onClick={() => trackProjectLinkClick(selectedProject.id, 'docs', selectedProject.links.docs)}
                                  sx={{
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    textTransform: "none",
                                    borderWidth: 2,
                                    "&:hover": {
                                      borderWidth: 2,
                                      transform: "translateY(-2px)",
                                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    },
                                    transition: "all 0.2s ease",
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
                                  onClick={() => trackProjectLinkClick(selectedProject.id, 'pypi', selectedProject.links.pypi)}
                                  sx={{
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1.5,
                                    textTransform: "none",
                                    borderWidth: 2,
                                    "&:hover": {
                                      borderWidth: 2,
                                      transform: "translateY(-2px)",
                                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`,
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  PyPI Package
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Grid>

                        {/* Right Sidebar - Technologies & Stats */}
                        <Grid item xs={12} md={4}>
                          {/* Quick Stats */}
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.primary.light, 0.04)} 100%)`,
                              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                              mb: 3,
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                              Quick Overview
                            </Typography>

                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: "center", p: 1 }}>
                                  <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                                    {selectedProject.technologies.length}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Technologies
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Box sx={{ textAlign: "center", p: 1 }}>
                                  <Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                                    {selectedProject.features.length}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Features
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Paper>

                          {/* Technologies */}
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
                              Tech Stack
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              {selectedProject.technologies.map((tech, index) => (
                                <Chip
                                  key={index}
                                  label={tech}
                                  variant="filled"
                                  sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    fontSize: "0.9rem",
                                    py: 1.5,
                                    justifyContent: "flex-start",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                                      transform: "translateX(4px)",
                                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </DialogContent>
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
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
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
