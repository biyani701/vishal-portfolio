---
sidebar_position: 1
---

# Software Bill of Materials (SBOM)

This document provides a comprehensive list of dependencies used in the portfolio project.

## Core Dependencies

| Package | Version | Description | License |
|---------|---------|-------------|---------|
| react | ^18.2.0 | JavaScript library for building user interfaces | MIT |
| react-dom | ^18.2.0 | React package for working with the DOM | MIT |
| react-router-dom | ^6.8.1 | Declarative routing for React | MIT |
| @mui/material | ^5.11.10 | React components that implement Material Design | MIT |
| @mui/icons-material | ^5.11.9 | Material Design icons as React components | MIT |
| @emotion/react | ^11.10.6 | CSS-in-JS library for styling React components | MIT |
| @emotion/styled | ^11.10.6 | Styled API for @emotion/react | MIT |

## UI and Styling

| Package | Version | Description | License |
|---------|---------|-------------|---------|
| @fontsource/roboto | ^4.5.8 | Self-hosted font files for Roboto | MIT |
| @fortawesome/fontawesome-svg-core | ^6.3.0 | Font Awesome SVG icon library | MIT |
| @fortawesome/free-brands-svg-icons | ^6.3.0 | Brand icons for Font Awesome | MIT |
| @fortawesome/free-solid-svg-icons | ^6.3.0 | Solid icons for Font Awesome | MIT |
| @fortawesome/react-fontawesome | ^0.2.0 | Font Awesome React component | MIT |
| framer-motion | ^10.0.1 | Animation library for React | MIT |
| aos | ^2.3.4 | Animate on scroll library | MIT |

## State Management and Data Handling

| Package | Version | Description | License |
|---------|---------|-------------|---------|
| flexsearch | ^0.7.31 | Full-text search library | Apache-2.0 |
| uuid | ^9.0.0 | Generate RFC-compliant UUIDs | MIT |
| date-fns | ^2.29.3 | Modern JavaScript date utility library | MIT |

## Rich Text Editing

| Package | Version | Description | License |
|---------|---------|-------------|---------|
| slate | ^0.94.0 | Framework for building rich text editors | MIT |
| slate-react | ^0.94.0 | React components for Slate | MIT |
| slate-history | ^0.93.0 | History tracking for Slate | MIT |

## Authentication

| Package | Version | Description | License |
|---------|---------|-------------|---------|
| next-auth | ^5.0.0 | Authentication for Next.js (Auth.js) v5 | ISC |

## Development Dependencies

| Package | Version | Description | License |
|---------|---------|-------------|---------|
| @testing-library/jest-dom | ^5.16.5 | Custom jest matchers for DOM testing | MIT |
| @testing-library/react | ^13.4.0 | React testing utilities | MIT |
| @testing-library/user-event | ^13.5.0 | Simulate user events for testing | MIT |
| eslint | ^8.34.0 | JavaScript linter (stable version before 8.57.1 deprecation) | MIT |
| eslint-config-react-app | ^7.0.1 | ESLint configuration for React apps | MIT |
| prettier | ^2.8.4 | Code formatter | MIT |
| web-vitals | ^2.1.4 | Library for measuring web vitals | Apache-2.0 |

## Documentation

| Package | Version | Description | License |
|---------|---------|-------------|---------|
| @docusaurus/core | ^2.4.1 | Documentation site generator | MIT |
| @docusaurus/preset-classic | ^2.4.1 | Classic preset for Docusaurus | MIT |
| prism-react-renderer | ^1.3.5 | Syntax highlighting for code blocks | MIT |

## Dependency Graph

The portfolio project has a relatively flat dependency graph with most dependencies being direct dependencies of the project. Key dependency relationships include:

- React as the core UI library
- Material-UI (MUI) for UI components, which depends on Emotion for styling
- Slate.js for rich text editing
- Auth.js for authentication

## Vulnerability Management

The project uses the following practices for managing vulnerabilities:

1. Regular dependency updates using `npm audit` and `npm update`
2. GitHub Dependabot alerts for security vulnerabilities
3. Manual review of dependencies before adding them to the project
4. Preference for well-maintained libraries with active communities

## Adding New Dependencies

When adding new dependencies to the project, follow these guidelines:

1. Evaluate the necessity of the dependency
2. Check the package's license compatibility
3. Review the package's maintenance status and community support
4. Consider the package size and impact on bundle size
5. Run security audits before and after adding the dependency
