import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import config from "./config";

// import { ThemeProvider } from '@mui/material/styles';
import ThemeProvider from "./ThemeProvider";

import CssBaseline from "@mui/material/CssBaseline";
import AOS from "aos";
import "aos/dist/aos.css";

import useScrollTrigger from "@mui/material/useScrollTrigger";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Fab from "@mui/material/Fab";

import NavigationBar from "./components/ImprovedNavbar";
import Hero from "./components/Hero";

import ProfileSummary from "./components/ProfileSummaryNew";
// import EnhancedSkillsWithTabs from './components/EnhancedSkillsWithTabs';
import Skills from "./components/Skills";
import ExperienceTimeline from "./components/Experience";
import Certifications from "./components/Certifications";
import Education from "./components/Education";
import Recognition from "./components/Recognition";
import CareerTimeline from "./components/CareerTimeline";
import Contact from "./components/Contact";
import Footer from "./components/FooterNew";
import AboutMe from "./components/AboutMe";
import Works from "./components/Works";
import Blogs from "./components/Blogs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import BlogEditor from "./components/BlogEditor";
import GitHubCallback from "./components/auth/GitHubCallback";
import GitHubAuth from "./components/auth/GitHubAuth";
import AuthDebug from "./components/auth/AuthDebug";
import ProfilePage from "./components/ProfilePage";
import CreditsPage from "./components/credits/CreditsPage";
import SimpleSignIn from "./components/auth/SimpleSignIn";
import ModernSignIn from "./components/auth/ModernSignIn";
import AuthTestPage from "./components/auth/AuthTestPage";
import AuthDebugTool from "./components/auth/AuthDebugTool";
import AuthServerDebug from "./components/auth/AuthServerDebug";
import GoogleCallback from "./components/auth/GoogleCallback";
import LogoutPage from "./components/auth/LogoutPage";
import AuthCallback from "./components/auth/AuthCallback";
import AuthCallbackPage from "./pages/auth-callback";
import AuthSuccessPage from "./pages/auth-success";
import AuthErrorPage from "./pages/auth-error";
import AuthProvider from "./context/AuthProvider";
import { useAuthContext } from "./context/AuthProvider";
import AuthSessionCheck from "./components/AuthSessionCheck";
import ClickTest from "./components/ClickTest";
import ConfigTest from "./components/ConfigTest";
import viewportDemo from "./components/ViewportDemo";

// Toolpad SignIn Page
import ToolpadSignInPageWrapper from "./pages/toolpad-signin";

// Knowledge Base components
import KnowledgeBase from "./components/knowledge/KnowledgeBase";
import Glossary from "./components/knowledge/Glossary";
import DomainKnowledge from "./components/knowledge/DomainKnowledge";
import ThreeDSFlowStepper from "./components/knowledge/ThreeDSFlowStepper";

// Enhanced Blog components
import BlogList from "./components/blog/BlogList";
import BlogPost from "./components/blog/BlogPost";
import EnhancedBlogEditor from "./components/blog/EnhancedBlogEditor";

import { palettes } from "./theme";

// Import just the minimal non-themeable styles
import "./App.minimal.css";
import ViewportDemo from "./components/ViewportDemo";



export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Navigate to sign-in page with current location for redirect after login
      navigate('/signin', { state: { from: location } });
    }
  }, [loading, isAuthenticated, location, navigate]);

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return isAuthenticated ? children : null;
};

function ScrollTop(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    // Prevent default behavior
    event.preventDefault();

    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: "fixed",
          bottom: 76, // Adjusted to appear above footer
          right: 16,
          zIndex: 1600, // Higher than footer's z-index (1500)
        }}
      >
        {children}
      </Box>
    </Fade>
  );
}

function App(props) {
  const location = useLocation();

  const [mode, setMode] = useState("light"); // Default to 'light'
  const [paletteIndex, setPaletteIndex] = useState(0); // Default to 0

  // Theme persistence with cookies
  // Helper function to get cookie value by name
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  // Function to save theme preferences to both cookies and localStorage
  const saveThemePreferences = (currentMode, currentPaletteIndex) => {
    try {
      // Always save to localStorage as fallback
      localStorage.setItem("themeMode", currentMode);
      localStorage.setItem("themePaletteIndex", currentPaletteIndex.toString());

      // Check for cookie consent
      const manager = window.klaro?.getManager?.();
      const consents = manager?.consents;
      const cookieConsent = consents?.essentialCookies === true;

      // If we have consent or no Klaro (development), save to cookies
      if (cookieConsent || !window.klaro) {
        // Set cookies with 365 days expiry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365);

        // Use secure cookies with proper attributes
        const cookieOptions = `expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict${window.location.protocol === 'https:' ? '; Secure' : ''}`;
        document.cookie = `themeMode=${currentMode}; ${cookieOptions}`;
        document.cookie = `themePaletteIndex=${currentPaletteIndex}; ${cookieOptions}`;

        console.log(`Theme preferences saved to cookies: mode=${currentMode}, paletteIndex=${currentPaletteIndex}`);
      }
    } catch (error) {
      console.warn('Error saving theme preferences:', error);
    }
  };

  // Load theme preferences on mount
  useEffect(() => {
    const loadThemePreferences = () => {
      try {
        // First try to read from cookies (preferred when consent exists)
        const cookieMode = getCookieValue('themeMode');
        const cookiePaletteIndex = getCookieValue('themePaletteIndex');

        console.log('Theme cookies found:', { cookieMode, cookiePaletteIndex });

        if (cookieMode) {
          setMode(cookieMode);
        }

        if (cookiePaletteIndex && !isNaN(parseInt(cookiePaletteIndex, 10))) {
          setPaletteIndex(parseInt(cookiePaletteIndex, 10));
        }

        // If cookies don't exist, fall back to localStorage
        if (!cookieMode) {
          const localMode = localStorage.getItem('themeMode');
          if (localMode) {
            console.log('Using theme mode from localStorage:', localMode);
            setMode(localMode);
          }
        }

        if (!cookiePaletteIndex) {
          const localPaletteIndex = localStorage.getItem('themePaletteIndex');
          if (localPaletteIndex && !isNaN(parseInt(localPaletteIndex, 10))) {
            console.log('Using palette index from localStorage:', localPaletteIndex);
            setPaletteIndex(parseInt(localPaletteIndex, 10));
          }
        }
      } catch (error) {
        console.warn('Error loading theme preferences:', error);

        // Fallback to localStorage in case of error
        try {
          const localMode = localStorage.getItem('themeMode');
          const localPaletteIndex = localStorage.getItem('themePaletteIndex');

          if (localMode) {
            setMode(localMode);
          }

          if (localPaletteIndex && !isNaN(parseInt(localPaletteIndex, 10))) {
            setPaletteIndex(parseInt(localPaletteIndex, 10));
          }
        } catch (storageError) {
          console.error('Failed to load theme from localStorage:', storageError);
        }
      }
    };

    // Load theme preferences immediately on mount
    loadThemePreferences();

    // Handle consent changes
    const handleConsentChange = () => {
      try {
        const manager = window.klaro?.getManager?.();
        const consents = manager?.consents;

        // If we have consent, save to cookies again to ensure they exist
        if (consents?.essentialCookies === true) {
          console.log('Consent granted for essential cookies, saving theme preferences');
          saveThemePreferences(mode, paletteIndex);
        }
      } catch (error) {
        console.warn('Error handling consent change:', error);
      }
    };

    // Listen for Klaro consent changes
    document.addEventListener('klaro-consent-changed', handleConsentChange);

    return () => {
      document.removeEventListener('klaro-consent-changed', handleConsentChange);
    };
  }, []);

  // Initialize mode state based on user preference or default to 'light'
  // const [mode, setMode] = useState(() => {

  //   if (typeof window !== 'undefined' && localStorage.getItem('themeMode')) {
  //     return localStorage.getItem('themeMode');
  //   }
  //   else {

  //   return 'light';

  //   }

  // });

  // Initialize palette index state or default to 0
  // const [paletteIndex, setPaletteIndex] = useState(() => {
  //   if (typeof window !== 'undefined' && localStorage.getItem('themePaletteIndex')) {
  //     return parseInt(localStorage.getItem('themePaletteIndex'), 10);
  //   }
  //   return 0;
  // });

  // Handle scrolling to sections
  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  // Handle OAuth code from localStorage (set by 404.html)
  const navigate = useNavigate();
  useEffect(() => {
    const oauthCode = localStorage.getItem("oauth.code");
    if (oauthCode && location.pathname === "/") {
      console.log("Found OAuth code in localStorage, redirecting to callback");

      // Clean up localStorage
      localStorage.removeItem("oauth.code");
      localStorage.removeItem("oauth.state");
      localStorage.removeItem("oauth.error");

      // Add a flag to prevent infinite loops
      sessionStorage.setItem("oauth_redirect_processed", "true");

      // Navigate to callback with the code
      navigate(`/callback?code=${oauthCode}`);
    }
  }, [location.pathname, navigate]);

  // Initialize AOS with better settings
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 100,
      easing: "ease-in-out",
      delay: 100,
    });

    // Refresh AOS when the theme changes
    AOS.refresh();
  }, [mode]);

  // Save theme preferences whenever they change
  useEffect(() => {
    // Save theme preferences using our unified function
    saveThemePreferences(mode, paletteIndex);

    // Apply data-theme attribute for any components that might need it
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode, paletteIndex]);

  // Create MUI theme based on mode and palette index
  // const theme = useMemo(() => getTheme(mode, paletteIndex), [mode, paletteIndex]);

  const toggleThemeMode = (isDark) => {
    setMode(isDark ? "dark" : "light");
  };

  const changeThemePalette = (index) => {
    if (index >= 0 && index < palettes[mode].length) {
      setPaletteIndex(index);
    }
  };

  // Protected route component

  return (
    <ThemeProvider mode={mode} paletteIndex={paletteIndex}>
      <CssBaseline />
      <div id="back-to-top-anchor" />
      <AuthProvider>
        <AuthSessionCheck />
        <NavigationBar
          isDarkMode={mode === "dark"}
          toggleDarkMode={toggleThemeMode}
          currentPaletteIndex={paletteIndex}
          changePalette={changeThemePalette}
          availablePalettes={palettes[mode]}
        />
        <Box
          component="div"
          className="App"
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            minHeight: "100vh",
            position: "relative",
            paddingBottom: "60px",
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <ProfileSummary />
                  <Skills />
                  <ExperienceTimeline />
                  <Certifications />
                  <Education />
                  <Recognition />
                  <CareerTimeline />
                </>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AboutMe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="/works" element={<Works />} />

            {/* Knowledge Base Routes */}
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/knowledge/glossary" element={<Glossary />} />
            <Route path="/knowledge/domain/:categoryId" element={<DomainKnowledge />} />            
            <Route path="/knowledge/domain/:categoryId/:topicId" element={<DomainKnowledge />} />
            <Route path="/knowledge/ThreeDSFlowStepper" element={<ThreeDSFlowStepper />} />

            {/* Blog Routes */}
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:blogId" element={<BlogPost />} />
            <Route path="/blog/new" element={<EnhancedBlogEditor />} />
            <Route path="/blog/edit/:blogId" element={<EnhancedBlogEditor editMode={true} />} />

            {/* Auth Routes */}
            <Route path="/login" element={<GitHubAuth />} />
            <Route path="/signin" element={<ModernSignIn />} />
            <Route path="/signin-legacy" element={<SimpleSignIn />} />
            <Route path="/signin-toolpad" element={<ToolpadSignInPageWrapper />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/auth-debug" element={<AuthServerDebug />} />
            <Route path="/auth-test" element={<AuthTestPage />} />
            <Route path="/auth-debug-tool" element={<AuthDebugTool />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/auth-callback.html" element={<AuthCallbackPage />} />
            <Route path="/auth-success" element={<AuthSuccessPage />} />
            <Route path="/auth-error" element={<AuthErrorPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<PrivacyPolicy initialTab={1} />} />
            {/* Auth.js callback routes */}
            <Route path="/api/auth/callback/github" element={<GitHubCallback />} />
            <Route path="/api/auth/callback/google" element={<GoogleCallback />} />

            {/* Generic auth callback route */}
            <Route path="/auth-callback" element={<AuthCallback />} />

            {/* Legacy callback route for backward compatibility */}
            <Route path="/callback" element={<GitHubCallback />} />
            <Route path="/auth-debug" element={<AuthDebug />} />
            <Route path="/credits" element={<CreditsPage />} />
            {/* <Route path="/blog/edit/:blogId" element={<BlogEditor />} /> */}
            <Route path="/click-test" element={<ClickTest />} />
            <Route path="/config-test" element={<ConfigTest />} />
            <Route path="/viewport-demo" element={<ViewportDemo />} />
            {/* <Route path="/heroref" element={<HeroRef />} /> */}

            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
          <Footer />
          <ScrollTop {...props}>
            <Fab color="primary" size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}
ScrollTop.propTypes = {
  children: PropTypes.node,
  window: PropTypes.func,
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
