# Analytics Integration Guide

This guide explains how the analytics tracking and role-based access control are implemented in the portfolio website.

## Overview

The portfolio website now includes:

1. **Click Tracking**: Tracks clicks on menu items and other interactive elements
2. **Role-Based Access Control**: Controls access to blog creation and editing based on user roles

## Analytics API

The analytics API is a separate Next.js project hosted on Bitbucket and deployed to Vercel. It provides:

- Endpoints for tracking clicks
- User role management
- Analytics data retrieval

The API code is available at: https://bitbucket.org/your-username/portfolio-analytics-api
Documentation is available at: https://your-github-username.github.io/portfolio-analytics-api/

### API Endpoints

- `POST /api/track`: Track a click event
- `GET /api/stats`: Get click statistics
- `GET /api/user/role`: Get user role information
- `POST /api/user/role`: Set user role

## Integration with Portfolio Website

### Click Tracking

The portfolio website tracks clicks using the `trackClick` function in `src/utils/analytics.js`:

```javascript
trackClick(elementId, elementType, pageUrl, userId);
```

This function is called in various click handlers throughout the application, particularly in the navigation components.

### Role-Based Access Control

The blog menu items are conditionally rendered based on the user's role:

- **Admin Role**: Can create, edit, and delete blog posts
- **Moderator Role**: Can edit blog posts
- **User Role**: Can only view blog posts

The user's role is retrieved from the Auth.js session and stored in the component state.

## Database Schema

The analytics API uses a PostgreSQL database with the following tables:

### clicks

| Column      | Type      | Description                       |
|-------------|-----------|-----------------------------------|
| id          | SERIAL    | Primary key                       |
| element_id  | VARCHAR   | ID of the clicked element         |
| element_type| VARCHAR   | Type of the element (e.g., menu)  |
| page_url    | VARCHAR   | URL of the page                   |
| user_id     | VARCHAR   | ID of the user (if authenticated) |
| timestamp   | TIMESTAMP | Time of the click                 |

### user_roles

| Column     | Type      | Description                  |
|------------|-----------|------------------------------|
| id         | SERIAL    | Primary key                  |
| user_id    | VARCHAR   | ID of the user               |
| role       | VARCHAR   | Role (user, moderator, admin)|
| created_at | TIMESTAMP | Creation timestamp           |
| updated_at | TIMESTAMP | Last update timestamp        |

## Configuration

The analytics API URL is configured in the `runtime-config.json` file:

```json
{
  "ANALYTICS_API_URL": "https://your-analytics-api-url.vercel.app/api"
}
```

## Deployment

See the `api-project/DEPLOYMENT.md` file for detailed deployment instructions.

## Future Enhancements

Potential future enhancements include:

1. Dashboard for visualizing analytics data
2. More detailed tracking of user interactions
3. A/B testing capabilities
4. Integration with Google Analytics or other analytics platforms
