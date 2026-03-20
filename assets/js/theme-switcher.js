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

  function isLightPage(pathname) {
    return /-white\.html$/i.test(pathname);
  }

  function getPairedPath(pathname, targetTheme) {
    if (!/\.html$/i.test(pathname)) {
      return null;
    }

    var nextPath = pathname;

    if (targetTheme === "light" && !isLightPage(pathname)) {
      nextPath = pathname.replace(/\.html$/i, "-white.html");
    } else if (targetTheme === "dark" && isLightPage(pathname)) {
      nextPath = pathname.replace(/-white\.html$/i, ".html");
    }

    return nextPath === pathname ? null : nextPath;
  }

  function withCurrentLocation(pathname) {
    return pathname + window.location.search + window.location.hash;
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
    var currentTheme = isLightPage(window.location.pathname) ? "light" : "dark";
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
      var currentTheme = isLightPage(window.location.pathname) ? "light" : "dark";
      var nextTheme = currentTheme === "dark" ? "light" : "dark";
      var targetPath = getPairedPath(window.location.pathname, nextTheme);

      if (!targetPath) {
        return;
      }

      try {
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
        window.sessionStorage.setItem(TRANSITION_KEY, "1");
      } catch (error) {
        // Ignore storage access issues.
      }

      document.documentElement.classList.add("theme-is-transitioning");
      createOverlay();

      window.setTimeout(function () {
        window.location.href = withCurrentLocation(targetPath);
      }, FADE_DURATION);
    });
  }

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
