import React, { useState, useMemo, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Box,
  useTheme,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Card,
  CardContent,
  Tooltip,
  Rating,
} from "@mui/material";
import FlexSearch from "flexsearch";

// Icons
import CodeIcon from "@mui/icons-material/Code";

import BuildIcon from "@mui/icons-material/Build";
import AssessmentIcon from "@mui/icons-material/Assessment";
import WebIcon from "@mui/icons-material/Web";

import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import BugReportIcon from "@mui/icons-material/BugReport";
import CloudIcon from "@mui/icons-material/Cloud";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { FaDatabase } from "react-icons/fa";

// Import the getSkillIcon function

const getSkillIcon = (skillName) => {
  const iconMap = {
    // Programming
    Python:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    SQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    C: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    "C++":
      "https://cdn.jsdelivr.net/npm/@programming-languages-logos/cpp@0.0.2/cpp.svg",
    JavaScript:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    HTML5:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    CSS3: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    Java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",

    // Libraries & Frameworks
    "React.js":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    dash: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg",
    Bootstrap:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    "Tailwind CSS": "/images/tailwindcss-original.svg",
    Sass: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
    Flask:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
    "Node.js":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",

    // Databases
    Oracle:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
    PostgreSQL:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    "MS SQL":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg",
    MySQL:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    MongoDB:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",

    // IDEs & Editors
    PyCharm:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg",
    "VS Code":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    IntelliJ:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg",
    Eclipse:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg",

    // Version Control & CI/CD
    Git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    SVN: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/subversion/subversion-original.svg",
    GitHub:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    GitLab:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg",
    Bitbucket:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
    Jenkins:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg",
    "Bitbucket Pipelines":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg",
    "GitHub Actions":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",

    // Project Management
    Jira: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg",
    "MS Project":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg",
    Trello:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg",

    // Documentation & Collaboration
    Confluence:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg",
    SharePoint: "/images/sharepoint.svg",
    Notion:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg",
    "Google Docs":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",

    // Testing & QA
    Selenium:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg",
    Pytest:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    Postman:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
    SonarQube:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sonarqube/sonarqube-original.svg",

    // Data Visualization & Analytics
    "Plotly Dash":
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    Excel: "/images/excel.svg",
    Pandas:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    "Power BI": "/images/PowerBi.svg",
    Tableau: "/images/tableau.svg",

    // Cloud & DevOps
    AWS: "/images/aws.svg",
    Azure:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
    Docker:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    Terraform:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",

    // Package Managers
    pip: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    npm: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
  };

  return iconMap[skillName] || null;
};

// Colors for periodic table view
const getSkillColor = (category) => {
  const colors = {
    // "Tools": "success",
    // "Programming": "primary",
    // "Databases": "secondary",
    // "Libraries": "info",
    // "Repositories": "warning",
    // "Data Visualization": "error",
    // "Domain Knowledge": "default"
    Programming: "alpha",
    Frontend: "beta",
    Database: "secondary",
    SCM: "theta",
    "Cloud & DevOps": "epsilon",
    "Project Management": "alpha",
    "Collaboration Tools": "beta",
    Testing: "gamma",
    Visualization: "theta",
    "Dev Tools": "epsilon",
  };
  const key = colors[category] || "knowledge";

  // Debug: make sure this is a string
  console.log("[getSkillColor]", { category, key });

  // return colors[category] || "default";
  return key;
};

// Function to calculate experience based on start and end dates
const calculateExperience = (startDate, endDate = null) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  // Calculate difference in milliseconds
  const diffTime = Math.abs(end - start);
  // Convert to years
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

  if (diffYears < 1) {
    // If less than a year, return in months
    const diffMonths = Math.floor(diffYears * 12);
    return { value: diffMonths, unit: "months", display: `${diffMonths}+ mo.` };
  } else {
    // Round down to whole years
    const years = Math.floor(diffYears);
    // Check if there's a partial year to add the "+" sign
    const hasPartialYear = diffYears - years > 0.1; // More than ~1 month
    return {
      value: diffYears,
      unit: "years",
      display: `${years}${hasPartialYear ? "+" : ""}`
    };
  }
};

// Enhanced skill data with experience, usage, project type and rating
export const skillSections = {
  Programming: [
    { name: "Python", startDate: "2019-01-01", experience: calculateExperience("2019-01-01"), usage: "current", projectUse: "Professional", rating: 8 },
    { name: "C", startDate: "2010-01-01", endDate: "2020-01-01", experience: calculateExperience("2010-01-01", "2020-01-01"), usage: "past", projectUse: "Professional", rating: 7 },
    { name: "C++", startDate: "2010-01-01", endDate: "2020-01-01", experience: calculateExperience("2010-01-01", "2020-01-01"), usage: "past", projectUse: "Professional", rating: 7 },
    { name: "JavaScript", startDate: "2020-01-01", experience: calculateExperience("2020-01-01"), usage: "current", projectUse: "Personal", rating: 6 },
    { name: "HTML5", startDate: "2020-01-01", experience: calculateExperience("2020-01-01"), usage: "current", projectUse: "Professional", rating: 8 },
    { name: "SQL", startDate: "2012-01-01", endDate: "2021-01-01", experience: calculateExperience("2012-01-01", "2021-01-01"), usage: "past", projectUse: "Professional", rating: 9 },
    { name: "Java", startDate: "2020-01-01", endDate: "2021-01-01", experience: calculateExperience("2020-01-01", "2021-01-01"), usage: "past", projectUse: "Learning", rating: 5 },
  ],
  Frontend: [
    { name: "React.js", startDate: "2023-01-01", experience: calculateExperience("2023-01-01"), usage: "current", projectUse: "Professional", rating: 7 },
    { name: "CSS3", startDate: "2020-01-01", experience: calculateExperience("2020-01-01"), usage: "current", projectUse: "Professional", rating: 7 },
    { name: "Tailwind CSS", startDate: "2023-06-01", experience: calculateExperience("2023-06-01"), usage: "current", projectUse: "Personal", rating: 6 },
    { name: "Sass", startDate: "2023-06-01", experience: calculateExperience("2023-06-01"), usage: "current", projectUse: "Learning", rating: 5 },
    { name: "Bootstrap", startDate: "2020-01-01", experience: calculateExperience("2020-01-01"), usage: "current", projectUse: "Professional", rating: 8 },
    { name: "Flask", startDate: "2021-01-01", experience: calculateExperience("2021-01-01"), usage: "current", projectUse: "Professional", rating: 8 },
  ],

  Database: [
    { name: "Oracle", startDate: "2010-01-01", endDate: "2019-01-01", experience: calculateExperience("2010-01-01", "2019-01-01"), usage: "past", projectUse: "Professional", rating: 8 },
    { name: "Sybase", startDate: "2015-01-01", endDate: "2020-01-01", experience: calculateExperience("2015-01-01", "2020-01-01"), usage: "past", projectUse: "Professional", rating: 7 },
    { name: "DB2", startDate: "2018-01-01", endDate: "2020-01-01", experience: calculateExperience("2018-01-01", "2020-01-01"), usage: "past", projectUse: "Professional", rating: 6 },
    { name: "PostgreSQL", startDate: "2021-01-01", experience: calculateExperience("2021-01-01"), usage: "current", projectUse: "Professional", rating: 8 },
    { name: "MS SQL", startDate: "2016-01-01", endDate: "2020-01-01", experience: calculateExperience("2016-01-01", "2020-01-01"), usage: "past", projectUse: "Professional", rating: 7 },
    { name: "MongoDB", startDate: "2022-06-01", endDate: "2023-01-01", experience: calculateExperience("2022-06-01", "2023-01-01"), usage: "past", projectUse: "Learning", rating: 5 },
  ],
  SCM: [
    { name: "Git", startDate: "2019-01-01", experience: calculateExperience("2019-01-01"), usage: "current", projectUse: "Professional", rating: 9 },
    { name: "SVN", startDate: "2015-01-01", endDate: "2020-01-01", experience: calculateExperience("2015-01-01", "2020-01-01"), usage: "past", projectUse: "Professional", rating: 7 },
    { name: "GitHub", startDate: "2019-01-01", experience: calculateExperience("2019-01-01"), usage: "current", projectUse: "Professional", rating: 9 },
    { name: "Bitbucket", startDate: "2019-01-01", experience: calculateExperience("2019-01-01"), usage: "current", projectUse: "Professional", rating: 8 },
  ],
  "Cloud & DevOps": [
    {
      name: "Bitbucket Pipelines",
      startDate: "2021-01-01",
      experience: calculateExperience("2021-01-01"),
      usage: "current",
      projectUse: "Professional",
      rating: 8
    },
    { name: "Jenkins", startDate: "2023-01-01", experience: calculateExperience("2023-01-01"), usage: "current", projectUse: "Personal", rating: 6 },
    { name: "GitHub Actions", startDate: "2023-01-01", experience: calculateExperience("2023-01-01"), usage: "current", projectUse: "Personal", rating: 7 },
    { name: "AWS", startDate: "2022-01-01", endDate: "2023-01-01", experience: calculateExperience("2022-01-01", "2023-01-01"), usage: "past", projectUse: "Professional", rating: 6 },
    { name: "Azure", startDate: "2022-01-01", endDate: "2023-01-01", experience: calculateExperience("2022-01-01", "2023-01-01"), usage: "past", projectUse: "Learning", rating: 5 },
    { name: "Docker", startDate: "2022-01-01", endDate: "2023-01-01", experience: calculateExperience("2022-01-01", "2023-01-01"), usage: "past", projectUse: "Learning", rating: 6 },
    { name: "Terraform", startDate: "2022-01-01", endDate: "2023-01-01", experience: calculateExperience("2022-01-01", "2023-01-01"), usage: "past", projectUse: "Learning", rating: 5 },
  ],
  "Project Management": [
    { name: "Jira", startDate: "2014-01-01", experience: calculateExperience("2014-01-01"), usage: "current", projectUse: "Professional", rating: 9 },
    { name: "MS Project", startDate: "2010-01-01", endDate: "2023-01-01", experience: calculateExperience("2010-01-01", "2023-01-01"), usage: "past", projectUse: "Professional", rating: 8 },
    { name: "Trello", startDate: "2023-01-01", experience: calculateExperience("2023-01-01"), usage: "current", projectUse: "Personal", rating: 7 },
  ],
  "Collaboration Tools": [
    { name: "Confluence", startDate: "2019-01-01", experience: calculateExperience("2019-01-01"), usage: "current", projectUse: "Professional", rating: 9 },
    { name: "SharePoint", startDate: "2019-01-01", experience: calculateExperience("2019-01-01"), usage: "current", projectUse: "Professional", rating: 7 },
    { name: "Notion", startDate: "2023-01-01", experience: calculateExperience("2023-01-01"), usage: "current", projectUse: "Personal", rating: 8 },
  ],
  Testing: [
    { name: "Selenium", startDate: "2023-01-01", experience: calculateExperience("2023-01-01"), usage: "current", projectUse: "Personal", rating: 6 },
    { name: "Pytest", startDate: "2021-01-01", experience: calculateExperience("2021-01-01"), usage: "current", projectUse: "Professional", rating: 8 },
    { name: "Postman", startDate: "2023-01-01", experience: calculateExperience("2023-01-01"), usage: "current", projectUse: "Personal", rating: 7 },
    { name: "SonarQube", startDate: "2023-01-01", experience: calculateExperience("2023-01-01"), usage: "current", projectUse: "Personal", rating: 6 },
  ],
  Visualization: [
    { name: "Plotly Dash", startDate: "2021-01-01", experience: calculateExperience("2021-01-01"), usage: "current", projectUse: "Professional", rating: 9 },
    { name: "Pandas", startDate: "2020-01-01", experience: calculateExperience("2020-01-01"), usage: "current", projectUse: "Professional", rating: 9 },
    { name: "Power BI", startDate: "2022-01-01", endDate: "2023-01-01", experience: calculateExperience("2022-01-01", "2023-01-01"), usage: "past", projectUse: "Learning", rating: 6 },
    { name: "Tableau", startDate: "2022-01-01", endDate: "2023-01-01", experience: calculateExperience("2022-01-01", "2023-01-01"), usage: "past", projectUse: "Professional", rating: 7 },
  ],
  "Dev Tools": [
    { name: "PyCharm", startDate: "2019-01-01", experience: calculateExperience("2019-01-01"), usage: "current", projectUse: "Professional", rating: 9 },
    { name: "VS Code", startDate: "2020-01-01", experience: calculateExperience("2020-01-01"), usage: "current", projectUse: "Professional", rating: 9 },
    { name: "pip", startDate: "2019-01-01", experience: calculateExperience("2019-01-01"), usage: "current", projectUse: "Personal", rating: 8 },
    { name: "npm", startDate: "2023-01-01", experience: calculateExperience("2023-01-01"), usage: "current", projectUse: "Personal", rating: 7 },
  ],
};

const categoryIcons = {
  Programming: <CodeIcon />,
  Frontend: <WebIcon />,
  Database: <FaDatabase size={20} />,
  SCM: <CloudIcon />,
  "Cloud & DevOps": <CloudQueueIcon />,
  "Project Management": <AssignmentIcon />,
  "Collaboration Tools": <GroupWorkIcon />,
  Testing: <BugReportIcon />,
  Visualization: <AssessmentIcon />,
  "Dev Tools": <BuildIcon />,
};

// Periodic Table Layout
const periodicTableLayout = {
  row1: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  row2: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  row3: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  row4: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  row5: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  row6: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  row7: [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
};

// Helper function to organize skills into periodic table layout
const organizeSkillsIntoPeriodicTable = (
  skills,
  layout = periodicTableLayout
) => {
  console.log(
    `organizeSkillsIntoPeriodicTable called with ${skills.length} skills`
  );

  const table = JSON.parse(JSON.stringify(layout));
  const rows = Object.keys(table);

  const sortedSkills = [...skills].sort((a, b) => {
    if (a.usage !== b.usage) return a.usage === "current" ? -1 : 1;
    if (b.years !== a.years) return b.years - a.years;
    if (a.projectUse !== b.projectUse) return a.projectUse ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const validPositions = [];

  // Define custom placement rules per row
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const rowKey = rows[rowIndex];

    if (rowIndex === 0) {
      // Row 1: Only positions 0 and 17
      validPositions.push({ row: rowKey, col: 0 });
      validPositions.push({ row: rowKey, col: 17 });
    } else if (rowIndex === 1 || rowIndex === 2) {
      // Row 2 and 3: columns 0-1 and 12-17
      [0, 1, 12, 13, 14, 15, 16, 17].forEach((col) => {
        validPositions.push({ row: rowKey, col });
      });
    } else {
      // Rows 4-7: all columns (0–17)
      for (let col = 0; col < 18; col++) {
        validPositions.push({ row: rowKey, col });
      }
    }
  }

  const skillsToPlace = sortedSkills.slice(0, validPositions.length);

  // Fill the table using only valid positions
  skillsToPlace.forEach((skill, index) => {
    const { row, col } = validPositions[index];
    table[row][col] = skill;
  });

  // Log how many skills were actually placed
  console.log(
    `Placed ${skillsToPlace.length} skills out of ${skills.length} in the periodic table`
  );

  // Count non-null cells in the table for verification
  let filledCells = 0;
  Object.values(table).forEach((row) => {
    row.forEach((cell) => {
      if (cell !== null) filledCells++;
    });
  });
  console.log(`Table has ${filledCells} filled cells`);

  return table;
};

// Helper functions
const getUsageBadge = (usage) => {
  return usage === "current" ? "Active" : "Past";
};

// Get project use color
const getProjectUseColor = (projectUse) => {
  switch (projectUse) {
    case "Professional": return "success";
    case "Personal": return "info";
    case "Learning": return "secondary";
    default: return "default";
  }
};

const Skills = () => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchResults, setSearchResults] = useState([]);
  const [searchIndex, setSearchIndex] = useState(null);

  // Process and sort skills data
  const processedSkills = useMemo(() => {
    const result = {};

    Object.entries(skillSections).forEach(([category, skills]) => {
      // Sort by usage (current first), then by experience (descending), then by project use
      result[category] = [...skills].sort((a, b) => {
        if (a.usage !== b.usage) return a.usage === "current" ? -1 : 1;

        // Compare experience values
        const aExp = a.experience.value;
        const bExp = b.experience.value;
        if (bExp !== aExp) return bExp - aExp;

        // Compare project use (Professional > Personal > Learning)
        if (a.projectUse !== b.projectUse) {
          if (a.projectUse === "Professional") return -1;
          if (b.projectUse === "Professional") return 1;
          if (a.projectUse === "Personal") return -1;
          if (b.projectUse === "Personal") return 1;
        }

        // Compare ratings
        if (b.rating !== a.rating) return b.rating - a.rating;

        return a.name.localeCompare(b.name);
      });
    });

    return result;
  }, []);

  // Get all skills as a flat array for periodic table view
  const allSkills = useMemo(() => {
    const skills = [];

    Object.entries(skillSections).forEach(([category, categorySkills]) => {
      categorySkills.forEach((skill) => {
        skills.push({
          ...skill,
          category,
        });
      });
    });

    // Sort by experience (descending), then by name
    return skills.sort(
      (a, b) => b.experience.value - a.experience.value || a.name.localeCompare(b.name)
    );
  }, []);

  // Initialize search results with all skills
  useEffect(() => {
    setSearchResults(allSkills);
  }, [allSkills]);

  // Initialize FlexSearch index
  useEffect(() => {
    try {
      // Create a new FlexSearch index
      const index = new FlexSearch.Document({
        document: {
          id: "id",
          index: ["name", "category", "projectUse"],
          store: true
        }
      });

      // Add all skills to the index
      allSkills.forEach((skill, idx) => {
        index.add({
          id: idx,
          name: skill.name,
          category: skill.category,
          projectUse: skill.projectUse,
          // Store the original skill object
          skill: skill
        });
      });

      setSearchIndex(index);
      console.log("FlexSearch index initialized with", allSkills.length, "skills");
    } catch (error) {
      console.error("Error initializing FlexSearch:", error);
      // Fallback to default search if FlexSearch fails
      setSearchResults(allSkills);
    }
  }, [allSkills]);

  // Perform search using FlexSearch or fallback to basic filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      // If no search term, use all skills
      setSearchResults(allSkills);
      return;
    }

    try {
      if (searchIndex) {
        // Search across multiple fields with FlexSearch
        const results = searchIndex.search(searchTerm, {
          enrich: true,
          limit: 100
        });

        // Extract the skill objects from the results
        const foundSkills = [];
        results.forEach(resultSet => {
          resultSet.result.forEach(result => {
            foundSkills.push(result.skill);
          });
        });

        // Remove duplicates (a skill might match on multiple fields)
        const uniqueSkills = [...new Map(foundSkills.map(skill =>
          [skill.name + skill.category, skill])).values()];

        setSearchResults(uniqueSkills);
        console.log(`FlexSearch for "${searchTerm}" found ${uniqueSkills.length} results`);
      } else {
        // Fallback to basic filtering if FlexSearch index is not ready
        performBasicSearch();
      }
    } catch (error) {
      console.error("Error during search:", error);
      // Fallback to basic filtering if FlexSearch fails
      performBasicSearch();
    }

    function performBasicSearch() {
      const filteredSkills = allSkills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.projectUse.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredSkills);
      console.log(`Basic search for "${searchTerm}" found ${filteredSkills.length} results`);
    }
  }, [searchIndex, searchTerm, allSkills]);

  // Organize skills into periodic table layout
  const periodicTableData = useMemo(() => {
    console.log(
      `Search results: ${searchResults.length} skills`
    );

    // Use all search results for the periodic table layout
    // The category filtering will be handled by the opacity in the rendering
    return organizeSkillsIntoPeriodicTable(searchResults);
  }, [searchResults]);

  // Handle view mode change
  const handleViewModeChange = (_, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Handle search term change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    console.log(`Category changed to: ${category}`);
    setSelectedCategory(category);

    // Force re-render of the periodic table when changing categories
    if (viewMode === "periodic") {
      // This is a workaround to ensure the periodic table updates correctly
      setTimeout(() => {
        const event = new Event("resize");
        window.dispatchEvent(event);
      }, 50);
    }
  };

  // Get all categories for filter
  const categories = ["All", ...Object.keys(skillSections)];

  return (
    <section id="skills" className="py-5">
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          sx={{ mb: 3, fontWeight: theme.typography.fontWeightBold }}
        >
          Technical Skills
        </Typography>

        {/* View Toggle and Search */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{ alignSelf: { xs: "center", sm: "flex-start" } }}
          >
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />{" "}
              <Box sx={{ ml: 1, display: { xs: "none", sm: "block" } }}>
                List
              </Box>
            </ToggleButton>
            <ToggleButton value="periodic" aria-label="periodic table view">
              <ViewModuleIcon />{" "}
              <Box sx={{ ml: 1, display: { xs: "none", sm: "block" } }}>
                Periodic Table
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>

          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search skills..."
            size="small"
            sx={{ width: { xs: "100%", sm: "auto", md: "25%" } }}
            // Using slotProps instead of deprecated InputProps
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={clearSearch} edge="end">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Category Filters */}
        {viewMode === "periodic" && (
          <Box
            sx={{
              mb: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: '100%',
                overflowX: 'auto',
                pb: 1,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'center',
                  maxWidth: '100%'
                }}
              >
                {categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => handleCategoryChange(category)}
                    color={category === selectedCategory ? "primary" : "default"}
                    variant={category === selectedCategory ? "filled" : "outlined"}
                    icon={category !== "All" ? categoryIcons[category] : undefined}
                    sx={{
                      m: 0.5,
                      '& .MuiChip-label': {
                        whiteSpace: 'nowrap',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <Grid container spacing={3}>
            {Object.entries(processedSkills).map(([category, skills]) => (
              <Grid
                item xs={12} sm={6} md={4} key={category}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: "100%",
                    width: "100%",
                    minWidth: 350,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.background.paper
                        : theme.palette.grey[50],
                    borderRadius: theme.shape.borderRadius,
                    transition: theme.transitions.create(["box-shadow"]),
                    "&:hover": {
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      pb: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.primary.main,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 1,
                        borderRadius: "50%",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? theme.palette.background.default
                            : theme.palette.primary.light + "20",
                      }}
                    >
                      {categoryIcons[category]}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        ml: 1,
                        fontWeight: theme.typography.fontWeightMedium,
                      }}
                    >
                      {category}
                    </Typography>
                  </Box>

                  {/* Skills Tags */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: 1,
                      mb: 3,
                      minHeight: 120, // Ensure minimum height for consistency
                    }}
                  >
                    {skills.map((skill) => (
                      <Chip
                        key={skill.name}
                        label={skill.name}
                        color={
                          skill.usage === "current" ? "primary" : "default"
                        }
                        variant={skill.projectUse ? "filled" : "outlined"}
                        size="small"
                        sx={{
                          m: 0.5,
                          height: 32, // Fixed height
                          maxWidth: "100%",
                          "& .MuiChip-label": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      />
                    ))}
                  </Box>

                  {/* Skill Progress Bars */}
                  {skills.map((skill) => (
                    <Box key={skill.name} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={theme.typography.fontWeightMedium}
                        >
                          {skill.name}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Chip
                            label={getUsageBadge(skill.usage)}
                            size="small"
                            color={
                              skill.usage === "current" ? "primary" : "default"
                            }
                            sx={{
                              height: 20,
                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: theme.typography.pxToRem(10),
                              },
                            }}
                          />
                          <Chip
                            label={skill.projectUse}
                            size="small"
                            color={getProjectUseColor(skill.projectUse)}
                            sx={{
                              height: 20,
                              "& .MuiChip-label": {
                                px: 1,
                                fontSize: theme.typography.pxToRem(10),
                              },
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={theme.typography.fontWeightMedium}
                          >
                            {skill.experience.display}{skill.experience.unit === "years" ? " yrs" : ""}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Rating Progress Bar */}
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.25 }}>
                          <Typography variant="caption" color="text.secondary">
                            Skill Rating
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {skill.rating}/10
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(skill.rating / 10) * 100}
                          color="success"
                          sx={{
                            height: 6,
                            borderRadius: theme.shape.borderRadius,
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? theme.palette.grey[700]
                                : theme.palette.grey[200],
                            "& .MuiLinearProgress-bar": {
                              borderRadius: theme.shape.borderRadius,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Periodic Table View */}
        {viewMode === "periodic" && (
          <Box sx={{ mt: 2 }}>
            {Object.keys(periodicTableData).length === 0 ||
              Object.values(periodicTableData).every((row) =>
                row.every((cell) => cell === null)
              ) ? (
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                No skills found matching your criteria.
              </Typography>
            ) : (
              <Grid container spacing={1}>
                {Object.entries(periodicTableData).map(([rowKey, rowData]) => (
                  <Grid item xs={12} key={rowKey}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: { xs: 0.5, sm: 1 },
                      }}
                    >
                      {rowData.map((skill, cellIndex) => {
                        // Check if skill exists first
                        if (!skill) {
                          return (
                            <Box
                              key={`${rowKey}-${cellIndex}`}
                              sx={{
                                width: {
                                  xs: 75,
                                  sm: 95,
                                  md: 115,
                                  lg: 130,
                                },
                                m: 0.3,
                                borderRadius: 0.5,
                                height: {
                                  xs: 130,
                                  sm: 140,
                                  md: 150,
                                  lg: 160,
                                },
                              }}
                            />
                          );
                        }

                        // Check if skill matches both the search term and category filter
                        const matchesSearch =
                          !searchTerm ||
                          skill.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          skill.category
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase());

                        const matchesCategory =
                          selectedCategory === "All" ||
                          skill.category === selectedCategory;

                        const matchesFilter = matchesSearch && matchesCategory;

                        return (
                          <Box
                            key={`${rowKey}-${cellIndex}`}
                            sx={{
                              width: {
                                xs: 75,
                                sm: 95,
                                md: 115,
                                lg: 130,
                              },
                              m: 0.3,
                              borderRadius: 0.5,
                              height: {
                                xs: 130,
                                sm: 140,
                                md: 150,
                                lg: 160,
                              },
                            }}
                          >
                            {skill && (
                              <Tooltip
                                title={
                                  <React.Fragment>
                                    <Typography variant="subtitle2" component="span">
                                      {skill.name}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Category: {skill.category}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Experience: {skill.experience.display}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Status: {skill.usage === "current" ? "Active" : "Past"}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Type: {skill.projectUse}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      Rating: {skill.rating}/10
                                    </Typography>
                                  </React.Fragment>
                                }
                                arrow
                              >
                                <Card
                                  elevation={2}
                                  sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    opacity: matchesFilter ? 1 : 0.25,
                                    visibility: "visible",
                                    filter: matchesFilter
                                      ? "none"
                                      : "grayscale(70%)",
                                    transition: (theme) =>
                                      theme.transitions.create([
                                        "transform",
                                        "box-shadow",
                                        "opacity",
                                      ]),
                                    "&:hover": {
                                      transform: "scale(1.5)",
                                      zIndex: 10,
                                      opacity: 1,
                                      boxShadow: (theme) => theme.shadows[10],
                                    },
                                    "&:focus": {
                                      transform: "scale(2.5)",
                                      zIndex: 20,
                                      opacity: 1,
                                      boxShadow: (theme) => theme.shadows[12],
                                    },
                                    border: (theme) =>
                                      `5px solid ${theme.palette[getSkillColor(skill.category)].main}20`,
                                  }}
                                  tabIndex={0}
                                >
                                  <CardContent
                                    sx={{
                                      p: 1,
                                      flexGrow: 1,
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      height: "100%",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {/* Skill Icon */}
                                    {getSkillIcon(skill.name) && (
                                      <Box
                                        component="img"
                                        src={getSkillIcon(skill.name)}
                                        alt={`${skill.name} icon`}
                                        sx={{
                                          width: 24,
                                          height: 24,
                                          mb: 0.5,
                                          opacity: 0.9,
                                        }}
                                      />
                                    )}

                                    {/* Skill name */}
                                    <Typography
                                      variant="subtitle2"
                                      component="h3"
                                      align="center"
                                      sx={{
                                        fontWeight: (theme) =>
                                          theme.typography.fontWeightMedium,
                                        fontSize: {
                                          xs: "0.65rem",
                                          sm: "0.7rem",
                                        },
                                        lineHeight: 1.2,
                                        mb: 0.5,
                                      }}
                                    >
                                      {skill.name}
                                    </Typography>

                                    {/* Experience Badge */}
                                    <Typography
                                      variant="caption"
                                      sx={(theme) => {
                                        const key = getSkillColor(skill.category);
                                        const color = theme.palette[key]?.main;
                                        return {
                                          fontWeight: "bold",
                                          bgcolor: `${color}20`,
                                          color,
                                          px: 1,
                                          py: 0.25,
                                          borderRadius: theme.shape.borderRadius,
                                          fontSize: "0.6rem",
                                          mb: 0.5,
                                        };
                                      }}
                                    >
                                      {skill.experience.display}
                                    </Typography>

                                    {/* Status and Project Use */}
                                    <Box sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "center",
                                      width: "100%",
                                      gap: 0.5,
                                      mb: 0.5,
                                      flexWrap: "wrap"
                                    }}>
                                      <Chip
                                        label={skill.usage === "current" ? "Active" : "Past"}
                                        size="small"
                                        color={skill.usage === "current" ? "primary" : "default"}
                                        sx={{
                                          height: 16,
                                          minWidth: "40%",
                                          "& .MuiChip-label": {
                                            px: 0.5,
                                            fontSize: "0.6rem",
                                            whiteSpace: "nowrap",
                                          },
                                        }}
                                      />

                                      <Chip
                                        label={skill.projectUse}
                                        size="small"
                                        color={getProjectUseColor(skill.projectUse)}
                                        sx={{
                                          height: 16,
                                          minWidth: "40%",                                          
                                          "& .MuiChip-label": {
                                            px: 0.5,
                                            fontSize: "0.6rem",
                                            whiteSpace: "nowrap",
                                          },
                                        }}
                                      />
                                      </Box>
                                    

                                    {/* Rating Progress Bar */}
                                    <Box sx={{ width: "100%", mt: "auto" }}>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontSize: "0.6rem",
                                          display: "block",
                                          textAlign: "center",
                                          mb: 0.25
                                        }}
                                      >
                                        Rating: {skill.rating}/10
                                      </Typography>
                                      <LinearProgress
                                        variant="determinate"
                                        value={(skill.rating / 10) * 100}
                                        sx={{
                                          height: 4,
                                          borderRadius: 1,
                                          bgcolor: theme.palette.grey[300],
                                          '& .MuiLinearProgress-bar': {
                                            borderRadius: 1,
                                            bgcolor: theme.palette.mode === 'dark'
                                              ? theme.palette.primary.light
                                              : theme.palette.primary.main,
                                          }
                                        }}
                                      />
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Tooltip>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Box>
    </section>
  );
};

export default Skills;
