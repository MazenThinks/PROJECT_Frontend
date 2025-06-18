// Dark mode functionality
document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const icon = darkModeToggle.querySelector("i");
  const htmlElement = document.documentElement;

  // Check if user has previously set a preference
  const currentTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", currentTheme);
  updateIcon(currentTheme === "dark");
  updateBodyTertiaryElements(currentTheme === "dark");

  // Toggle dark mode when button is clicked
  darkModeToggle.addEventListener("click", function () {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateIcon(newTheme === "dark");
    updateBodyTertiaryElements(newTheme === "dark");

    // Instant page refresh
    window.location.reload();
  });

  // Update the icon based on dark mode state
  function updateIcon(isDark) {
    if (isDark) {
      icon.className = "fa-solid fa-sun"; // Sun icon for dark mode
    } else {
      icon.className = "fa-solid fa-moon"; // Moon icon for light mode
    }
  }

  // Update all bg-body-tertiary elements to use bg-dark.bg-gradient in dark mode
  function updateBodyTertiaryElements(isDark) {
    const tertiaryElements = document.querySelectorAll(".bg-body-tertiary");

    tertiaryElements.forEach((element) => {
      if (isDark) {
        // In dark mode: add bg-dark.bg-gradient class and remove bg-body-tertiary
        element.classList.add("bg-dark.bg-gradient");
        element.classList.remove("bg-body-tertiary");
      } else {
        // In light mode: restore bg-body-tertiary and remove bg-dark.bg-gradient
        element.classList.add("bg-body-tertiary");
        element.classList.remove("bg-dark.bg-gradient");
      }
    });
  }
});

// Apply theme on page load before DOM is ready to prevent flashing
(function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
})();
