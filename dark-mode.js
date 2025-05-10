// Dark mode functionality
document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const icon = darkModeToggle.querySelector("i");
  const htmlElement = document.documentElement;

  // Check if user has previously set a preference
  const currentTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", currentTheme);
  updateIcon(currentTheme === "dark");

  // Toggle dark mode when button is clicked
  darkModeToggle.addEventListener("click", function () {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateIcon(newTheme === "dark");
  });

  // Update the icon based on dark mode state
  function updateIcon(isDark) {
    if (isDark) {
      icon.className = "fa-solid fa-sun"; // Sun icon for dark mode
    } else {
      icon.className = "fa-solid fa-moon"; // Moon icon for light mode
    }
  }
});

// Apply theme on page load before DOM is ready to prevent flashing
(function () {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
})();
