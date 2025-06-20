// Countdown Timer for Today Sale
document.addEventListener("DOMContentLoaded", function () {
  // Set the date we're counting down to (24 hours from now)
  const countDownDate = new Date();
  countDownDate.setDate(countDownDate.getDate() + 1);

  // Update the countdown every 1 second
  const x = setInterval(function () {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the countdown date
    const distance = countDownDate - now;

    // Time calculations for hours, minutes and seconds
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("demo").innerHTML =
      hours + "h " + minutes + "m " + seconds + "s ";

    // If the countdown is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("demo").innerHTML = "EXPIRED";
    }
  }, 1000);

  // Fix missing star images in product sections
  const sections = ["Fashion", "toysandgames", "beauty"];

  sections.forEach((section) => {
    const stars = document.querySelectorAll(`#${section} .stars`);
    const imgContainers = document.querySelectorAll(
      `#${section} p:nth-child(3)`
    );

    imgContainers.forEach((container) => {
      const imgs = container.querySelectorAll("img");

      imgs.forEach((img, index) => {
        if (!img.hasAttribute("src")) {
          if (index < 5) {
            img.setAttribute("src", "Assets/star.png");
            img.setAttribute("alt", "star");
            img.setAttribute("height", "20px");
            img.setAttribute("width", "20px");
          } else {
            img.setAttribute("src", "Assets/empty star.png");
            img.setAttribute("alt", "star");
            img.setAttribute("height", "15px");
            img.setAttribute("width", "15px");
          }
        }
      });
    });
  });

  // Fix missing oldprice class in some sections
  const oldPrices = document.querySelectorAll("s:not(.oldprice)");
  oldPrices.forEach((price) => {
    price.classList.add("oldprice");
  });

  // Add staggered animation for product cards on category pages ONLY
  const currentPage = window.location.pathname;
  // Check if current page is NOT index.html
  const isCategoryPage =
    !currentPage.endsWith("index.html") &&
    !currentPage.endsWith("/") &&
    currentPage !== "";

  if (isCategoryPage) {
    const productCards = document.querySelectorAll(".Product");

    // Apply staggered animation classes to each product
    productCards.forEach((card, index) => {
      // Calculate delay based on index (0.2s between each card)
      const delay = 0.2 + index * 0.2;
      card.classList.add("category-product-animation");
      card.style.animationDelay = `${delay}s`;
    });
  }

  // Cart button enhancement - remove jQuery hover
  const cartButton = document.querySelector(".cart");
  if (cartButton) {
    // Add cart badge element
    const cartLink = cartButton.querySelector("a");
    if (cartLink) {
      const badge = document.createElement("span");
      badge.className = "cart-badge";
      badge.textContent = "0";
      cartLink.style.position = "relative";
      cartLink.appendChild(badge);

      // Show badge if there are items in cart (for demo)
      setTimeout(() => {
        badge.classList.add("visible");
        badge.textContent = "2"; // Example count - this would come from actual cart data
      }, 1000);
    }
  }

  // Navigation animation - only apply on index.html page
  if (
    currentPage.endsWith("index.html") ||
    currentPage.endsWith("/") ||
    currentPage === ""
  ) {
    const navItems = document.querySelectorAll("nav .nav-link");
    navItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.3}s`;
      item.classList.add("fadeInNav");
    });
  }

  // Enhanced Product Image Gallery
  // Product Image Gallery with smooth transitions
  const productThumbnails = document.querySelectorAll(".otherProds");
  const mainProductImage = document.querySelector(".ProductCard");

  if (productThumbnails.length > 0 && mainProductImage) {
    // Set first thumbnail as active by default
    productThumbnails[0].classList.add("active");

    productThumbnails.forEach((thumb) => {
      thumb.addEventListener("click", function () {
        // Get image source from thumbnail
        const imgSrc = this.querySelector("img").src;

        // Prepare transition
        mainProductImage.style.opacity = "0.5";
        mainProductImage.style.transform = "scale(0.98)";

        // Update main image with short delay for transition effect
        setTimeout(() => {
          mainProductImage.src = imgSrc;

          // Restore appearance
          setTimeout(() => {
            mainProductImage.style.opacity = "1";
            mainProductImage.style.transform = "scale(1)";
          }, 100);
        }, 200);

        // Update active state
        productThumbnails.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // Fix similar products image dimensions
  document
    .querySelectorAll(".similar-products-container .Product img")
    .forEach((img) => {
      img.style.width = "400px";
      img.style.height = "300px";
      img.style.objectFit = "contain";
    });

  // Quantity dropdown functionality
  const quantityDropdown = document.querySelector(".dropdown-menu");
  const quantityButton = document.querySelector(".dropdown-toggle");

  if (quantityDropdown && quantityButton) {
    const quantityItems = quantityDropdown.querySelectorAll(".dropdown-item");
    quantityItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        quantityButton.textContent = this.textContent;
      });
    });
  }

  // Add to Cart animation
  const addToCartBtn = document.querySelector(".sideboxbuttons");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      this.innerHTML = '<i class="fas fa-check"></i> Added!';
      this.classList.add("added");

      setTimeout(() => {
        this.innerHTML = "Add to Cart";
        this.classList.remove("added");

        // Update cart badge
        const cartBadge = document.querySelector(".cart-badge");
        if (cartBadge) {
          cartBadge.classList.add("visible");
          cartBadge.textContent = parseInt(cartBadge.textContent || 0) + 1;
        }
      }, 1500);
    });
  }

  // Image zoom functionality
  const zoomWrapper = document.querySelector(".image-zoom-wrapper");
  const zoomImage = document.querySelector(".zoom-image");

  if (zoomWrapper && zoomImage) {
    const zoomLevel = 2.5; // Zoom magnification level

    zoomWrapper.addEventListener("mousemove", function (e) {
      const { left, top, width, height } = zoomWrapper.getBoundingClientRect();

      // Calculate cursor position as percentage of the container
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      // Set the transform origin to the cursor position
      zoomImage.style.transformOrigin = `${x}% ${y}%`;

      // Apply zoom
      zoomImage.style.transform = `scale(${zoomLevel})`;
    });

    zoomWrapper.addEventListener("mouseleave", function () {
      // Reset zoom when mouse leaves the image
      zoomImage.style.transform = "scale(1)";
    });

    // Add touch support for mobile devices
    zoomWrapper.addEventListener("touchmove", function (e) {
      e.preventDefault(); // Prevent scrolling while zooming

      const touch = e.touches[0];
      const { left, top, width, height } = zoomWrapper.getBoundingClientRect();

      const x = ((touch.clientX - left) / width) * 100;
      const y = ((touch.clientY - top) / height) * 100;

      zoomImage.style.transformOrigin = `${x}% ${y}%`;
      zoomImage.style.transform = `scale(${zoomLevel})`;
    });

    zoomWrapper.addEventListener("touchend", function () {
      zoomImage.style.transform = "scale(1)";
    });
  }

  // Dark mode functionality for all pages
  (function () {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  })();

  const darkModeToggle = document.getElementById("darkModeToggle");
  if (!darkModeToggle) return;
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

    // Only refresh when switching from dark to light
    if (currentTheme === "dark" && newTheme === "light") {
      window.location.reload();
    }
  });

  function updateIcon(isDark) {
    if (!icon) return;
    if (isDark) {
      icon.className = "fa-solid fa-sun";
    } else {
      icon.className = "fa-solid fa-moon";
    }
  }

  function updateBodyTertiaryElements(isDark) {
    const tertiaryElements = document.querySelectorAll(".bg-body-tertiary");
    tertiaryElements.forEach((element) => {
      if (isDark) {
        element.classList.add("bg-dark", "bg-gradient");
        element.classList.remove("bg-body-tertiary");
      } else {
        element.classList.add("bg-body-tertiary");
        element.classList.remove("bg-dark", "bg-gradient");
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const navEnd = document.querySelector(".text-end");
  if (!navEnd) return;
  const token = localStorage.getItem("token");

  // Detect if we are in ProductPages subfolder
  const isProductPages = window.location.pathname.includes("/ProductPages/");
  const prefix = isProductPages ? "../../" : "";
  const avatarUrlDefault = prefix + "Assets/BlankPFP.png";
  const profileUrl = prefix + "profile.html";
  const ordersUrl = prefix + "orders.html";

  if (token) {
    let username = "User";
    let avatarUrl = avatarUrlDefault;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.name) username = payload.name;
      if (payload.photo) avatarUrl = payload.photo;
    } catch (e) {
      try {
        const res = await fetch(
          prefix + "http://localhost:3000/api/v1/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          username = data.data.name || username;
          avatarUrl = data.data.photo ? data.data.photo : avatarUrl;
        }
      } catch {}
    }
    navEnd.innerHTML = `
      <div class="dropdown d-flex align-items-center">
        <img src="${avatarUrlDefault}" alt="avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;margin-right:8px;">
        <button class="btn btn-link dropdown-toggle p-0" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="font-weight:500;text-decoration:none;color:inherit;">
          ${username}
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li><a class="dropdown-item" href="${profileUrl}">Profile</a></li>
          <li><a class="dropdown-item" href="${ordersUrl}">Orders</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
        </ul>
      </div>
    `;
    document.getElementById("logoutBtn").onclick = function () {
      localStorage.removeItem("token");
      location.reload();
    };
  } else {
    navEnd.innerHTML = `
      <a href="${prefix}signinPage.html"><button type="button" class="btn btn-light text-dark me-2 ms-4">Login</button></a>
      <a href="${prefix}signupPage.html"><button type="button" class="btn btn-primary">Sign Up</button></a>
    `;
  }
});

var paragraphs = document.querySelectorAll(".slicingText");
paragraphs.forEach((paragraph) => {
  if (paragraph.textContent.length > 110) {
    paragraph.textContent = paragraph.textContent.slice(0, 110) + " ...";
  }
});

// Remove the jQuery hover for cart as we now have CSS hover effects
$(".titleanimation").hover(mousenter, mouseleave);
$(".navsearch").hover(mousenter, mouseleave);
$(".cardlinking").hover(mousenterprod, mouseleaveprod);
function mousenter() {
  $(this).stop(true, true).animate(
    {
      opacity: 0.7,
    },
    300
  );
}

function mouseleave() {
  $(this).stop(true, true).animate(
    {
      opacity: 1,
    },
    300
  );
}

function mousenterprod() {
  $(this).stop(true, true).animate(
    {
      opacity: 0.8,
    },
    300
  );
}

function mouseleaveprod() {
  $(this).stop(true, true).animate(
    {
      opacity: 1,
    },
    300
  );
}

document.addEventListener("DOMContentLoaded", function () {
  // Dark mode toggle
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  if (themeToggle && themeIcon) {
    // Set initial theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    themeIcon.className = savedTheme === "dark" ? "fa fa-sun" : "fa fa-moon";

    themeToggle.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      themeIcon.className = newTheme === "dark" ? "fa fa-sun" : "fa fa-moon";
    });
  }
});
