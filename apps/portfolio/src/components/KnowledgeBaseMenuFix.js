/**
 * This is a direct fix for the Knowledge Base menu issue
 * It uses a MutationObserver to detect when the menu is opened
 * and adds a click event listener to the domain knowledge items
 * to force close the menu when clicked
 */

// Function to initialize the fix
export function initKnowledgeBaseMenuFix() {
  console.log("[KnowledgeBaseMenuFix] Initializing fix");

  // Create a MutationObserver to watch for menu opening
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if the knowledge menu was added to the DOM
        const knowledgeMenu = document.getElementById('knowledge-menu');
        if (knowledgeMenu) {
          console.log("[KnowledgeBaseMenuFix] Knowledge menu detected, applying fix");
          fixKnowledgeMenu(knowledgeMenu);
        }

        // Also check for any menu items that might be domain knowledge items
        const menuItems = document.querySelectorAll('.MuiMenuItem-root');
        menuItems.forEach(item => {
          // Check if this is a domain knowledge item by looking at its text content
          const text = item.textContent?.trim().toLowerCase();
          if (text && (
            text === 'credit cards & payments' ||
            text === 'banking & finance' ||
            text === 'insurance'
          )) {
            console.log(`[KnowledgeBaseMenuFix] Domain knowledge item detected: ${text}`);
            fixDomainKnowledgeItem(item);
          }
        });
      }
    });
  });

  // Start observing the body for changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Also try to fix any existing menus
  const existingMenu = document.getElementById('knowledge-menu');
  if (existingMenu) {
    console.log("[KnowledgeBaseMenuFix] Existing knowledge menu detected, applying fix");
    fixKnowledgeMenu(existingMenu);
  }

  // Add a global click event listener to handle clicks on domain knowledge items
  document.addEventListener('click', (e) => {
    // Check if the click was on a domain knowledge item
    const target = e.target;
    if (target instanceof HTMLElement) {
      const menuItem = target.closest('.MuiMenuItem-root');
      if (menuItem) {
        const text = menuItem.textContent?.trim().toLowerCase();
        if (text && (
          text === 'credit cards & payments' ||
          text === 'banking & finance' ||
          text === 'insurance'
        )) {
          console.log(`[KnowledgeBaseMenuFix] Domain knowledge item clicked: ${text}`);
          // Force close the menu
          forceCloseMenu();
        }
      }
    }
  }, true); // Use capture phase to handle the click before React

  return () => {
    // Cleanup function
    observer.disconnect();
    document.removeEventListener('click', forceCloseMenu, true);
  };
}

// Function to fix the knowledge menu
function fixKnowledgeMenu(menuElement) {
  // Find all domain knowledge items
  const domainItems = menuElement.querySelectorAll('.MuiMenuItem-root');

  domainItems.forEach((item) => {
    // Check if this is a domain knowledge item by looking at its text content
    const text = item.textContent?.trim().toLowerCase();
    if (text && (
      text === 'credit cards & payments' ||
      text === 'banking & finance' ||
      text === 'insurance'
    )) {
      console.log(`[KnowledgeBaseMenuFix] Domain knowledge item detected in menu: ${text}`);
      fixDomainKnowledgeItem(item);
    }
  });
}

// Function to fix a domain knowledge item
function fixDomainKnowledgeItem(item) {
  // Remove any existing click listeners
  const newItem = item.cloneNode(true);
  item.parentNode?.replaceChild(newItem, item);

  // Add a new click event listener
  newItem.addEventListener('click', (e) => {
    console.log("[KnowledgeBaseMenuFix] Domain item clicked, forcing menu close");
    e.preventDefault();
    e.stopPropagation();

    // Force close the menu
    forceCloseMenu();

    // Extract the URL from the item
    const url = extractUrlFromMenuItem(newItem);
    if (url) {
      // Navigate to the URL after a short delay
      setTimeout(() => {
        window.location.href = url;
      }, 50);
    }
  }, true); // Use capture phase to handle the click before React
}

// Function to extract the URL from a menu item
function extractUrlFromMenuItem(item) {
  // Try to get the URL from the href attribute
  const link = item.querySelector('a');
  if (link && link.href) {
    return link.href;
  }

  // Try to get the URL from the data-to attribute
  const to = item.getAttribute('data-to');
  if (to) {
    return to;
  }

  // Try to infer the URL from the text content
  const text = item.textContent?.trim().toLowerCase();
  if (text) {
    if (text === 'credit cards & payments') {
      return '/knowledge/domain/credit-cards-payments';
    } else if (text === 'banking & finance') {
      return '/knowledge/domain/banking-finance';
    } else if (text === 'insurance') {
      return '/knowledge/domain/insurance';
    }
  }

  return null;
}

// Function to force close the menu
function forceCloseMenu() {
  console.log("[KnowledgeBaseMenuFix] Force closing all menus");

  // Find all menus and backdrops
  const menus = document.querySelectorAll('.MuiMenu-root, .MuiPopover-root');
  const backdrops = document.querySelectorAll('.MuiBackdrop-root');

  // Add a class to body to indicate we're navigating
  document.body.classList.add('navigating');

  // Force close menus
  menus.forEach(menu => {
    // Try to call the onClose handler if it exists
    const closeButton = menu.querySelector('[aria-label="Close"]');
    if (closeButton) {
      closeButton.click();
    }

    // Hide the menu using CSS
    menu.style.display = 'none !important';
    menu.style.visibility = 'hidden !important';
    menu.style.opacity = '0 !important';
    menu.style.pointerEvents = 'none !important';
    menu.style.position = 'absolute !important';
    menu.style.top = '-9999px !important';
    menu.style.left = '-9999px !important';
    menu.style.zIndex = '-1 !important';

    // Add a class to hide the menu
    menu.classList.add('force-hide-menu');

    // Try to remove the menu from the DOM
    try {
      menu.remove();
    } catch (e) {
      console.error("[KnowledgeBaseMenuFix] Error removing menu:", e);
    }
  });

  // Force remove backdrops
  backdrops.forEach(backdrop => {
    backdrop.style.display = 'none !important';
    backdrop.style.visibility = 'hidden !important';
    backdrop.style.opacity = '0 !important';
    backdrop.style.pointerEvents = 'none !important';
    backdrop.style.zIndex = '-1 !important';

    // Add a class to hide the backdrop
    backdrop.classList.add('force-hide-menu');

    // Try to remove the backdrop from the DOM
    try {
      backdrop.remove();
    } catch (e) {
      console.error("[KnowledgeBaseMenuFix] Error removing backdrop:", e);
    }
  });

  // Try to remove any menu papers
  const papers = document.querySelectorAll('.MuiPaper-root');
  papers.forEach(paper => {
    if (paper.closest('.MuiMenu-root, .MuiPopover-root')) {
      paper.style.display = 'none !important';
      paper.style.visibility = 'hidden !important';
      paper.style.opacity = '0 !important';
      paper.style.pointerEvents = 'none !important';
      paper.style.zIndex = '-1 !important';

      // Add a class to hide the paper
      paper.classList.add('force-hide-menu');
    }
  });

  // Try to find and click any close buttons
  const closeButtons = document.querySelectorAll('[aria-label="Close"]');
  closeButtons.forEach(button => {
    try {
      button.click();
    } catch (e) {
      console.error("[KnowledgeBaseMenuFix] Error clicking close button:", e);
    }
  });

  // Try to find and trigger any onClose handlers
  const menuElements = document.querySelectorAll('[role="menu"]');
  menuElements.forEach(menu => {
    // Try to get the React instance
    const key = Object.keys(menu).find(key => key.startsWith('__reactFiber$'));
    if (key) {
      const reactInstance = menu[key];
      if (reactInstance && reactInstance.memoizedProps && reactInstance.memoizedProps.onClose) {
        try {
          reactInstance.memoizedProps.onClose();
        } catch (e) {
          console.error("[KnowledgeBaseMenuFix] Error calling onClose:", e);
        }
      }
    }
  });

  // Clean up after a delay
  setTimeout(() => {
    document.body.classList.remove('navigating');

    // Remove the force-hide-menu class from all elements
    document.querySelectorAll('.force-hide-menu').forEach(el => {
      el.classList.remove('force-hide-menu');
    });
  }, 300);
}
