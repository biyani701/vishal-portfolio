// This script helps with handling client-side routing within Docusaurus
(function () {
  console.log("📚 Docusaurus router script loaded");

  // Check if we're in the docs section
  if (window.location.pathname.startsWith("/docs/")) {
    console.log("✅ Initialized docusaurus router");

    // Add a listener for handle Docusaurus navigation
    window.addEventListener("load", function () {
      console.log("🔄 Docusaurus page loaded completely");
    });
  }
})();
