import React, { useState } from "react";
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
  Link,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import CodeIcon from "@mui/icons-material/Code";
import LanguageIcon from "@mui/icons-material/Language";
import BookIcon from "@mui/icons-material/Book";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import CloudIcon from "@mui/icons-material/Cloud";
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

const Works = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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

  return (
    <Box
      component="section"
      id="works"
      sx={{
        py: { xs: 5, md: 8 },
        backgroundColor:
          theme.palette.mode === "dark" ? "background.default" : "#f8f9fa",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 600,
            color: theme.palette.primary.main,
            textShadow:
              theme.palette.mode === "dark"
                ? "0 2px 4px rgba(0,0,0,0.5)"
                : "none",
          }}
          data-aos="fade-up"
        >
          My Projects
        </Typography>

        <Typography
          variant="h6"
          component="p"
          align="center"
          sx={{ mb: 6, maxWidth: "800px", mx: "auto" }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          A showcase of my personal and professional projects, demonstrating my
          skills and experience in software development.
        </Typography>

        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={project.id}
              data-aos="fade-up"
              data-aos-delay="150"
            >
              <Card
                elevation={1}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  backgroundColor: theme.palette.background.paper,
                  "&:hover": {
                    boxShadow: theme.palette.mode === "dark"
                      ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`
                      : `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pt: 4,
                    pb: 2,
                  }}
                >
                  {getProjectIcon(project)}
                </Box>

                <CardContent sx={{ flexGrow: 1, textAlign: "center", px: 3 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      fontSize: "1.25rem",
                      mb: 1.5,
                    }}
                  >
                    {project.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      height: "4.5em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {project.shortDescription}
                  </Typography>

                  <Link
                    component="button"
                    onClick={() => handleOpenDialog(project)}
                    color="primary"
                    underline="hover"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      "&:hover": {
                        color: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Learn More <ArrowForwardIcon sx={{ ml: 0.5, fontSize: "0.9rem" }} />
                  </Link>
                </CardContent>
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
          slotProps={{
            paper: {
              sx: {
                borderRadius: isMobile ? 0 : 2,
                backgroundColor:
                  theme.palette.mode === "dark" ? "background.paper" : "white",
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
                }}
              >
                <Typography
                  variant="h5"
                  component="span"
                  sx={{ fontWeight: 600 }}
                >
                  {selectedProject.title}
                </Typography>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleCloseDialog}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CardMedia
                      component="img"
                      image={selectedProject.image}
                      alt={selectedProject.title}
                      sx={{
                        borderRadius: 1,
                        mb: 2,
                        boxShadow: 1,
                      }}
                    />

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mt: 2, fontWeight: 600 }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedProject.fullDescription}
                    </Typography>

                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3 }}
                    >
                      {selectedProject.technologies.map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          color="primary"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Key Features
                    </Typography>
                    <List>
                      {selectedProject.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {getFeatureIcon(feature)}
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>

                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mt: 3, fontWeight: 600 }}
                    >
                      Links
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {selectedProject.links.github && (
                        <Button
                          variant="outlined"
                          startIcon={<GitHubIcon />}
                          href={selectedProject.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ justifyContent: "flex-start" }}
                        >
                          GitHub Repository
                        </Button>
                      )}
                      {selectedProject.links.docs && (
                        <Button
                          variant="outlined"
                          startIcon={<BookIcon />}
                          href={selectedProject.links.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ justifyContent: "flex-start" }}
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
                          sx={{ justifyContent: "flex-start" }}
                        >
                          PyPI Package
                        </Button>
                      )}
                    </Box>

                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.03)",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Type: {selectedProject.type} • Year:{" "}
                        {selectedProject.year}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleCloseDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Works;
