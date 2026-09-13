// src/components/auth/GitHubAuth.js
import React, { useState } from "react";

import {
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  Typography,
} from "@mui/material";
import { useColorScheme, styled } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import config from "../../config";

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  marginBottom: theme.spacing(4),
  fontSize: "1.5rem",
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.2rem",
  },
}));

const GitHubAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const { mode } = useColorScheme();

  // Handle the GitHub OAuth login
  const handleLogin = () => {
    setLoading(true);
    try {
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${config.github.redirectUri}&scope=user,repo`;
      window.location.href = githubAuthUrl;
    } catch (error) {
      setError("Failed to initiate GitHub login");
      setLoading(false);
    }
  };

  return (
    <>
      <Title
        variant="h2"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="200"
      >
        Login
      </Title>

      <Button
        variant="contained"
        onClick={handleLogin}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <GitHubIcon />}
        sx={{
          backgroundColor:
            mode === "dark"
              ? theme.palette.primary.dark
              : theme.palette.primary.main,
          color:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.common.white,
          "&:hover": {
            backgroundColor:
              mode === "dark"
                ? theme.palette.primary.light
                : theme.palette.primary.dark,
          },
        }}
      >
        {loading ? "Redirecting..." : "Login with GitHub"}
      </Button>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
    </>
  );
};

export default GitHubAuth;
