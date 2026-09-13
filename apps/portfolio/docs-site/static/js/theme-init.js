// This script initializes the theme based on cookies before the page loads
// to prevent theme flashing
(function () {
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  // Try to get theme from cookie
  const themeCookie = getCookie("themeMode");

  // If cookie exists, set the theme
  if (themeCookie) {
    document.documentElement.setAttribute("data-theme", themeCookie);
    console.log("Theme initialized from cookie:", themeCookie);
  } else {
    // Default to light theme if no cookie exists
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
