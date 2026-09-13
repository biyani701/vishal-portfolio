---
sidebar_position: 2
---

# Material-UI (MUI)

Material-UI is the primary UI component library used in the portfolio project.

## Overview

[Material-UI](https://mui.com/) is a popular React UI framework that implements Google's Material Design. It provides a comprehensive set of pre-built components that are customizable and responsive.

## Key Components Used

### Layout Components

- **Box**: A wrapper component for most layout needs
- **Container**: Centers content horizontally with max-width
- **Grid**: Responsive layout grid using flexbox
- **Stack**: Manages layout of immediate children along the vertical or horizontal axis
- **Paper**: A surface to display content

### Navigation Components

- **AppBar**: A top navigation bar
- **Drawer**: A side panel that slides in from the edge of the screen
- **Menu**: A temporary popup that displays a list of choices
- **Tabs**: Organize content across different screens or functional aspects

### Inputs and Controls

- **Button**: Allows users to take actions and make choices
- **TextField**: Input component for text entry
- **Select**: Input component for selecting a value from options
- **Checkbox**: Selection control for binary choices
- **IconButton**: Button represented as an icon

### Display Components

- **Typography**: Text component with different variants
- **Card**: A container for content and actions
- **Chip**: Compact element representing an input, attribute, or action
- **Divider**: A thin line that groups content in lists and layouts
- **Avatar**: A circular graphic representing a user

### Feedback Components

- **Dialog**: A modal window that appears in front of app content
- **Snackbar**: Brief messages about app processes at the bottom of the screen
- **Alert**: Displays a short, important message
- **CircularProgress**: Indicates a loading state

## Theme Customization

The portfolio uses MUI's theming system to customize the appearance of components. The theme is defined in `src/theme/index.js` and includes:

```jsx
// Example theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    // Other typography variants
  },
  // Other theme options
});
```

## Responsive Design

MUI's responsive utilities are used throughout the portfolio:

- **Breakpoints**: `xs`, `sm`, `md`, `lg`, `xl` for different screen sizes
- **useMediaQuery**: Hook for responsive logic
- **Hidden**: Component for hiding elements based on screen size
- **Responsive props**: Many components accept responsive values

Example:
```jsx
<Grid container spacing={{ xs: 2, md: 3 }}>
  <Grid item xs={12} sm={6} md={4}>
    {/* Content */}
  </Grid>
</Grid>
```

## Styling Approach

The portfolio uses several MUI styling approaches:

1. **sx prop**: Inline styling with theme-aware properties
2. **styled API**: Creating styled components
3. **useTheme hook**: Accessing theme values in components

Example using the `sx` prop:
```jsx
<Box
  sx={{
    p: 2,
    borderRadius: 2,
    bgcolor: 'background.paper',
    boxShadow: 1,
    '&:hover': {
      boxShadow: 3,
    },
  }}
>
  Content
</Box>
```

## Best Practices

- Use MUI's built-in components instead of custom HTML elements
- Leverage the theme for consistent styling
- Use responsive props for adaptive layouts
- Minimize custom CSS by using MUI's styling system
- Follow MUI's accessibility guidelines
