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

  // Add staggered animation for product cards on category pages
  const productCards = document.querySelectorAll(
    ".row .Product:not(.carousel .Product)"
  );

  // Apply staggered delay to each product
  productCards.forEach((card, index) => {
    // Calculate delay based on index (0.1s between each card)
    const delay = 0.1 + index * 0.1;
    // Set the delay as a CSS variable
    card.style.setProperty("--animation-delay", `${delay}s`);
  });

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
