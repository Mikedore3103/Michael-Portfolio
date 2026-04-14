(function () {
  "use strict";

  var STORAGE_KEY = "preferred-theme";
  var TRANSITION_KEY = "theme-transition";
  var FADE_DURATION = 220;

  function getPreferredTheme() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        return stored;
      }
    } catch (error) {
      // Ignore storage access issues and fall back to device preference.
    }

    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage access issues.
    }
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "dark";
  }

  function createOverlay() {
    var overlay = document.createElement("div");
    overlay.className = "theme-transition-overlay";
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add("is-visible");
    });

    return overlay;
  }

  function updateToggleState(button) {
    var currentTheme = getCurrentTheme();
    button.setAttribute("aria-pressed", currentTheme === "dark" ? "true" : "false");
    button.setAttribute(
      "aria-label",
      currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );

    var label = button.querySelector("[data-theme-label]");
    if (label) {
      label.textContent = currentTheme === "dark" ? "Dark" : "Light";
    }
  }

  function bindToggle(button) {
    updateToggleState(button);

    button.addEventListener("click", function () {
      var currentTheme = getCurrentTheme();
      var nextTheme = currentTheme === "dark" ? "light" : "dark";

      document.documentElement.classList.add("theme-is-transitioning");
      createOverlay();

      window.setTimeout(function () {
        setTheme(nextTheme);
        updateToggleState(button);
        document.documentElement.classList.remove("theme-is-transitioning");
        
        // Remove overlay
        var overlay = document.querySelector(".theme-transition-overlay");
        if (overlay) {
          overlay.remove();
        }
      }, FADE_DURATION);
    });
  }

  // Initialize theme on page load
  function initTheme() {
    var preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
  }

  // Set up the toggle button when DOM is ready
  function setupToggle() {
    var button = document.querySelector("[data-theme-toggle]");
    if (button) {
      bindToggle(button);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupToggle);
  } else {
    setupToggle();
  }

  initTheme();
})();

  function initEntranceTransition() {
    try {
      if (!window.sessionStorage.getItem(TRANSITION_KEY)) {
        return;
      }

      window.sessionStorage.removeItem(TRANSITION_KEY);
    } catch (error) {
      return;
    }

    document.documentElement.classList.add("theme-is-entering");

    window.setTimeout(function () {
      document.documentElement.classList.remove("theme-is-entering");
    }, FADE_DURATION + 120);
  }

  function init() {
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    if (!toggles.length) {
      return;
    }

    initEntranceTransition();
    toggles.forEach(bindToggle);
  }

  window.ThemeSwitcher = {
    getPreferredTheme: getPreferredTheme,
    getPairedPath: getPairedPath,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
