import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";

import {
  Container,
  Typography,
  Box,
  Avatar,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';

import {
  GitHub,
  Mail,
  Link as LinkIcon,
  Star
} from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuthContext } from '../context/AuthProvider';

const ProfilePage = () => {
  const { user, session } = useAuthContext();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepos = async () => {
      if (!user || !session) return;

      try {
        setLoading(true);

        // Fetch user repos directly
        const response = await fetch('https://api.github.com/user/repos', {
          headers: {
            Authorization: `token ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const repoData = await response.json();

        // Sort repos by stars
        const sortedRepos = repoData.sort((a, b) =>
          b.stargazers_count - a.stargazers_count
        );
        setRepos(sortedRepos.slice(0, 5)); // Just take top 5
      } catch (error) {
        console.error('Error loading repos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRepos();
  }, [user, session]);

  if (loading || !user) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={user.avatar_url}
              alt={user.login}
              sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {user.name || user.login}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              @{user.login}
            </Typography>

            {user.bio && (
              <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
                {user.bio}
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Chip
                icon={<PersonIcon size={16} />}
                label={`${user.followers} followers`}
                variant="outlined"
              />
              <Chip
                icon={<PersonIcon size={16} />}
                label={`${user.following} following`}
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <GitHub size={20} style={{ marginRight: 8 }} />
              GitHub Profile Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <List dense>
              {user.company && (
                <ListItem>
                  <ListItemText
                    primary="Organization"
                    secondary={user.company}
                  />
                </ListItem>
              )}

              {user.location && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon size={16} style={{ marginRight: 8 }} />
                        Location
                      </Box>
                    }
                    secondary={user.location}
                  />
                </ListItem>
              )}

              {user.email && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Mail size={16} style={{ marginRight: 8 }} />
                        Email
                      </Box>
                    }
                    secondary={user.email}
                  />
                </ListItem>
              )}

              {user.blog && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinkIcon size={16} style={{ marginRight: 8 }} />
                        Website
                      </Box>
                    }
                    secondary={
                      <a href={user.blog} target="_blank" rel="noopener noreferrer">
                        {user.blog}
                      </a>
                    }
                  />
                </ListItem>
              )}

              <ListItem>
                <ListItemText
                  primary="Public repositories"
                  secondary={user.public_repos}
                />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <Star size={20} style={{ marginRight: 8 }} />
              Top Repositories
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : repos.length > 0 ? (
              <List>
                {repos.map(repo => (
                  <ListItem key={repo.id} sx={{ border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: 1 }}>
                    <ListItemText
                      primary={
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}
                        >
                          {repo.name}
                        </a>
                      }
                      secondary={
                        <>
                          {repo.description}
                          <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                            {repo.language && (
                              <Chip label={repo.language} size="small" />
                            )}
                            <Chip
                              icon={<Star size={14} />}
                              label={repo.stargazers_count}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No repositories found.
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};


export default ProfilePage;