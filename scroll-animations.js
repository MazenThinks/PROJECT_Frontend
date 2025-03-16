document.addEventListener("DOMContentLoaded", function () {
  console.log("Scroll animations script loaded");

  // Configure the Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  // Create the observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("Element in view:", entry.target);
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Check if element is part of the footer
  function isFooterElement(element) {
    // Check if element is the footer itself
    if (element.tagName.toLowerCase() === "footer") {
      return true;
    }

    // Check if element has footer class
    if (element.classList.contains("footer")) {
      return true;
    }

    // Check if element is inside a footer
    let parent = element.parentElement;
    while (parent) {
      if (
        parent.tagName.toLowerCase() === "footer" ||
        parent.classList.contains("footer")
      ) {
        return true;
      }
      parent = parent.parentElement;
    }

    return false;
  }

  // Determine if element is primarily text-based
  function isTextElement(element) {
    const tagName = element.tagName.toLowerCase();
    const textTags = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "a",
      "label",
      "li",
    ];

    // Check if it's directly a text element
    if (textTags.includes(tagName)) {
      return true;
    }

    // Check if it's a container with primarily text content
    if (
      element.children.length === 0 &&
      element.textContent.trim().length > 0
    ) {
      return true;
    }

    // Check if it contains headings as direct children
    const headings = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (headings.length > 0 && headings.length === element.children.length) {
      return true;
    }

    return false;
  }

  // Check if an element is a background container that should be skipped
  function isBackgroundContainer(element) {
    // Skip container elements with bg- classes
    if (
      element.classList.contains("bg-body-tertiary") ||
      element.classList.contains("bg-light") ||
      element.classList.contains("bg-dark") ||
      element.classList.contains("bg-white")
    ) {
      return true;
    }

    // Skip large containers that aren't product cards
    if (
      element.classList.contains("container") ||
      element.classList.contains("container-fluid") ||
      element.classList.contains("row")
    ) {
      return true;
    }

    return false;
  }

  // Check if element is a product card
  function isProductCard(element) {
    return element.classList.contains("Product");
  }

  function applyAnimationClasses(element, index) {
    // Skip if the element already has animation classes
    if (
      element.classList.contains("fade-section") ||
      element.classList.contains("text-fade")
    ) {
      return;
    }

    // Skip footer elements
    if (isFooterElement(element)) {
      console.log("Skipping footer element:", element);
      return;
    }

    // Skip background container elements unless they're product cards
    if (isBackgroundContainer(element) && !isProductCard(element)) {
      return;
    }

    // Only animate text elements and product cards
    if (isTextElement(element) || isProductCard(element)) {
      console.log("Applying animation to:", element);

      // Apply different animation class based on element type
      if (isTextElement(element)) {
        console.log("Applying text fade to:", element);
        element.classList.add("text-fade");
      } else if (isProductCard(element)) {
        console.log("Applying standard fade to:", element);
        element.classList.add("fade-section");
      }

      // Add delay for staggered effect
      element.classList.add(`delay-${(index % 3) * 100}`);

      // Start observing this element
      observer.observe(element);
    }

    // Also apply animations to direct text children if they're not in background containers
    const textChildren = Array.from(element.children).filter(
      (child) => isTextElement(child) && !isFooterElement(child)
    );
    textChildren.forEach((child, childIndex) => {
      if (!child.classList.contains("text-fade")) {
        child.classList.add("text-fade");
        child.classList.add(`delay-${(((index + childIndex) % 3) + 1) * 100}`);
        observer.observe(child);
      }
    });
  }

  // Add animation classes to specific elements
  function initializeAnimations() {
    // Target only text elements and product cards
    const textElements = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, .lead, .display-5, .display-4, .headline, .title"
    );

    const productCards = document.querySelectorAll(".Product");

    console.log("Found text elements to animate:", textElements.length);
    console.log("Found product cards to animate:", productCards.length);

    // Apply animations to text elements
    textElements.forEach((element, index) => {
      if (!isFooterElement(element)) {
        applyAnimationClasses(element, index);
      }
    });

    // Apply animations to product cards - enhanced for better staggering
    console.log("Found product cards to animate:", productCards.length);

    productCards.forEach((element, index) => {
      // Remove any existing animations
      element.style.animation = "none";

      // Add our scroll animation classes
      element.classList.add("fade-section");

      // Add staggered delay based on column position
      const staggerDelay = (index % 4) * 150; // Increased delay between items
      element.classList.add(`delay-${staggerDelay}`);

      // Start observing this element
      observer.observe(element);

      console.log(
        "Applied product card animation to:",
        element,
        "with delay:",
        staggerDelay
      );
    });
  }

  initializeAnimations();

  // Re-check for elements after a short delay (helps with dynamic content)
  setTimeout(initializeAnimations, 500);
});
