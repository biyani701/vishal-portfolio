const React = require('react');
          const {useEffect, useState} = require('react');
          const {useColorMode} = require('@docusaurus/theme-common');

          // Import styles
          const styles = {
            themeToggle: 'themeToggle'
          };

          function ThemeToggle() {
            const { colorMode, setColorMode } = useColorMode();
            const [mounted, setMounted] = useState(false);

            // The Docusaurus theme system is client-side only, so we need to make sure
            // we don't render this component on the server
            useEffect(() => {
              setMounted(true);
            }, []);

            // Save theme preference to cookies when it changes
            useEffect(() => {
              if (mounted) {
                // Set cookie with 365 days expiry
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 365);

                // Use secure cookies with proper attributes
                const cookieOptions = "expires=" + expiryDate.toUTCString() + "; path=/; SameSite=Strict" +
                  (window.location.protocol === 'https:' ? '; Secure' : '');

                document.cookie = "themeMode=" + colorMode + "; " + cookieOptions;
                console.log("Theme preference saved to cookie: mode=" + colorMode);
              }
            }, [colorMode, mounted]);

            const toggleTheme = () => {
              setColorMode(colorMode === 'dark' ? 'light' : 'dark');
            };

            if (!mounted) {
              // Don't render anything until client-side hydration is complete
              return null;
            }

            return (
              React.createElement('button', {
                onClick: toggleTheme,
                className: styles.themeToggle,
                title: "Switch to " + (colorMode === 'dark' ? 'light' : 'dark') + " mode",
                'aria-label': "Switch to " + (colorMode === 'dark' ? 'light' : 'dark') + " mode"
              }, colorMode === 'dark' ? (
                React.createElement('svg', {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                }, React.createElement('path', {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z",
                  fill: "currentColor"
                }), React.createElement('path', {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M12 5C12.5523 5 13 4.55228 13 4V2C13 1.44772 12.5523 1 12 1C11.4477 1 11 1.44772 11 2V4C11 4.55228 11.4477 5 12 5Z",
                  fill: "currentColor"
                }), React.createElement('path', {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M12 23C12.5523 23 13 22.5523 13 22V20C13 19.4477 12.5523 19 12 19C11.4477 19 11 19.4477 11 20V22C11 22.5523 11.4477 23 12 23Z",
                  fill: "currentColor"
                }), React.createElement('path', {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M5 12C5 11.4477 4.55228 11 4 11H2C1.44772 11 1 11.4477 1 12C1 12.5523 1.44772 13 2 13H4C4.55228 13 5 12.5523 5 12Z",
                  fill: "currentColor"
                }), React.createElement('path', {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M23 12C23 11.4477 22.5523 11 22 11H20C19.4477 11 19 11.4477 19 12C19 12.5523 19.4477 13 20 13H22C22.5523 13 23 12.5523 23 12Z",
                  fill: "currentColor"
                }))
              ) : (
                React.createElement('svg', {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                }, React.createElement('path', {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M12.2256 2.00253C9.59172 1.94346 6.93894 2.9189 4.92893 4.92891C1.02369 8.83415 1.02369 15.1658 4.92893 19.071C8.83418 22.9763 15.1658 22.9763 19.0711 19.071C21.0811 17.061 22.0565 14.4082 21.9975 11.7743C21.9796 10.9772 21.8669 10.1818 21.6595 9.40643C21.0933 9.9488 20.3275 10.2636 19.5 10.2636C17.8431 10.2636 16.5 8.92051 16.5 7.26364C16.5 6.43612 16.8148 5.67034 17.3572 5.10418C16.5818 4.89677 15.7864 4.78414 14.9893 4.76623C14.1924 4.74832 13.3877 4.86649 12.6108 5.11029C11.8338 5.35409 11.0998 5.72209 10.4407 6.20046C9.78165 6.67882 9.21038 7.26184 8.75321 7.92197C7.83853 9.29209 7.42511 10.9206 7.57253 12.5603C7.72005 14.1999 8.41898 15.7433 9.55557 16.8799C10.6922 18.0165 12.2355 18.7154 13.8752 18.8629C15.5148 19.0103 17.1433 18.5969 18.5135 17.6822C19.1736 17.225 19.7566 16.6538 20.235 15.9947C20.7133 15.3356 21.0813 14.6016 21.3251 13.8246C21.5689 13.0476 21.6871 12.243 21.6692 11.4461C21.6532 10.6835 21.5458 9.92309 21.3482 9.18407C21.1506 8.44505 20.8663 7.73171 20.4999 7.06241C20.1336 6.39311 19.6886 5.77206 19.1777 5.22109C18.6667 4.67012 18.0956 4.19486 17.4644 3.80854C16.8332 3.42222 16.1481 3.12612 15.4372 2.92856C14.7262 2.73101 13.9953 2.63331 13.2616 2.63773C12.9136 2.64058 12.5672 2.65973 12.2256 2.00253Z",
                  fill: "currentColor"
                }))
              ))
            );
          }

          module.exports = ThemeToggle;