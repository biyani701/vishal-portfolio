const React = require("react");
const Navbar = require("@theme-original/Navbar").default;
const ThemeToggle = require("../../components/ThemeToggle");

// Import styles
const styles = {
  navbarWrapper: "navbarWrapper",
  themeToggleWrapper: "themeToggleWrapper",
};

function NavbarWrapper(props) {
  return React.createElement(
    "div",
    { className: styles.navbarWrapper },
    React.createElement(Navbar, props),
    React.createElement(
      "div",
      { className: styles.themeToggleWrapper },
      React.createElement(ThemeToggle, null)
    )
  );
}

module.exports = NavbarWrapper;
