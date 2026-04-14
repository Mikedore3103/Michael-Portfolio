(function () {
  "use strict";

  var STORAGE_KEY = "preferred-theme";
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
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage access issues.
    }
  }

  function getCurrentTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    return attr === "light" ? "light" : "dark";
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

      setTheme(nextTheme);
      updateToggleState(button);
    });
  }

  // Initialize theme on page load
  function initTheme() {
    var preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
  }

  // Set up toggle buttons
  function init() {
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    toggles.forEach(function(button) {
      bindToggle(button);
    });
  }

  // Initialize theme first
  initTheme();

  // Set up toggles when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
