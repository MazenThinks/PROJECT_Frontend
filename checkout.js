// Checkout page functionality
document.addEventListener("DOMContentLoaded", async function () {
  await loadCartData();
});

// Global function to update cart display
document.updateCartDisplay = updateCartDisplay;

async function loadCartData() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/v1/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success" && data.data) {
        updateCartDisplay(data.data);
      }
    }
  } catch (error) {
    console.error("Error loading cart:", error);
  }
}

function updateCartDisplay(cartData) {
  const cartList = document.querySelector(".list-group");
  const badge = document.querySelector(".badge");

  if (!cartData || !cartData.items) {
    return;
  }

  // Update item count
  if (badge) {
    badge.textContent = cartData.items.length;
  }

  // Clear existing items (except promo and total)
  const existingItems = cartList.querySelectorAll(
    ".list-group-item:not(:nth-last-child(1)):not(:nth-last-child(2))"
  );
  existingItems.forEach((item) => item.remove());

  // Add cart items
  cartData.items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between lh-sm";
    listItem.innerHTML = `
            <div>
                <h6 class="my-0">${item.product.name}</h6>
                <small class="text-body-secondary">Qty: ${item.quantity}</small>
            </div>
            <span class="text-body-secondary">EGP ${(
              item.product.price * item.quantity
            ).toFixed(2)}</span>
        `;

    // Insert before the promo code item (second to last item)
    const promoItem = cartList.children[cartList.children.length - 2];
    cartList.insertBefore(listItem, promoItem);
  });

  // Update totals
  const subtotal = cartData.totalCartPrice || 0;
  const discount = cartData.totalPriceAfterDiscount
    ? subtotal - cartData.totalPriceAfterDiscount
    : 0;
  const total = cartData.totalPriceAfterDiscount || subtotal;

  // Update or create promo code display
  const promoItem = cartList.children[cartList.children.length - 2];
  if (discount > 0) {
    promoItem.style.display = "flex";
    promoItem.querySelector(
      ".text-success span"
    ).textContent = `− EGP ${discount.toFixed(2)}`;
  } else {
    promoItem.style.display = "none";
  }

  // Update total
  const totalItem = cartList.children[cartList.children.length - 1];
  totalItem.querySelector("strong").textContent = `EGP ${total.toFixed(2)}`;
}

// Make updateCartDisplay available globally
window.updateCartDisplay = updateCartDisplay;

// Fetch and display cart items, handle promo code, validate form, and show confirmation

// Redirect to sign in if not logged in
if (!localStorage.getItem("token")) {
  window.location.href = "signinPage.html";
}

document.addEventListener("DOMContentLoaded", async function () {
  const cartList = document.querySelector(".list-group.mb-3");
  const badge = document.querySelector(".badge.bg-primary");
  let cartItems = [];
  let promoDiscount = 0;
  let promoCode = "";

  // Fetch cart items from backend (reuse cart.js logic)
  async function fetchCart() {
    if (!document.getCart) return null;
    const cartData = await document.getCart();
    if (
      cartData &&
      cartData.data &&
      cartData.data._id &&
      cartData.data.cartItems
    ) {
      return cartData.data;
    }
    return null;
  }

  // Render cart items in summary
  function renderCartSummary(items) {
    cartList.innerHTML = "";
    let total = 0;
    items.forEach((item) => {
      // Always display product name like in cart page
      let name = "";
      if (item.product && item.product.name) {
        name = item.product.name;
      } else if (item.name) {
        name = item.name;
      } else if (item.product && item.product.title) {
        name = item.product.title;
      } else {
        name = "Product";
      }
      if (name.length > 90) name = name.slice(0, 90) + "...";
      const price =
        item.product && item.product.price
          ? item.product.price
          : item.price || 0;
      const quantity = item.quantity || 1;
      const lineTotal = price * quantity;
      total += lineTotal;
      cartList.innerHTML += `
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0">${name}</h6>
            <small class="text-body-secondary">Qty: ${quantity}</small>
          </div>
          <span class="text-body-secondary">EGP ${lineTotal}</span>
        </li>
      `;
    });
    // Promo code row
    if (promoDiscount > 0 && promoCode) {
      cartList.innerHTML += `
        <li class="list-group-item d-flex justify-content-between bg-body-tertiary">
          <div class="text-success">
            <h6 class="my-0">Promo code</h6>
            <small>${promoCode}</small>
          </div>
          <span class="text-success">− EGP ${promoDiscount}</span>
        </li>
      `;
      total -= promoDiscount;
      if (total < 0) total = 0;
    }
    // Total row
    cartList.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <span>Total (EGP)</span>
        <strong>EGP ${total}</strong>
      </li>
    `;
    badge.textContent = items.length;
  }

  // Apply coupon function
  async function applyCoupon(couponName) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to apply coupons");
      return null;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/cart/applyCoupon",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ coupon: couponName }),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        return data.data; // Returns the updated cart with discount applied
      } else {
        throw new Error(data.message || "Failed to apply coupon");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      return null;
    }
  }

  // Promo code logic
  document
    .querySelector("#promoForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const input = document.getElementById("promoInput");
      const code = input.value.trim();

      if (!code) {
        alert("Please enter a promo code");
        return;
      }

      // Show loading state
      const submitBtn = document.getElementById("redeemBtn");
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Applying...";
      submitBtn.disabled = true;

      try {
        const updatedCart = await applyCoupon(code);

        if (updatedCart) {
          // Calculate discount amount
          const originalPrice = updatedCart.totalCartPrice;
          const discountedPrice = updatedCart.totalPriceAfterDiscount;

          if (discountedPrice && discountedPrice < originalPrice) {
            promoDiscount = originalPrice - discountedPrice;
            promoCode = code.toUpperCase();

            // Update cart items with the new cart data
            cartItems = updatedCart.cartItems;

            alert(
              `Coupon "${code}" applied successfully! You saved EGP ${promoDiscount.toFixed(
                2
              )}`
            );
            renderCartSummary(cartItems);

            // Clear the input
            input.value = "";
          } else {
            promoDiscount = 0;
            promoCode = "";
            alert("Coupon applied but no discount was calculated");
          }
        } else {
          promoDiscount = 0;
          promoCode = "";
          alert("Invalid or expired coupon code");
        }
      } catch (error) {
        promoDiscount = 0;
        promoCode = "";
        alert("Error applying coupon: " + error.message);
      } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

  // Form validation and order submission
  const checkoutForm = document.querySelector("form.needs-validation");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      try {
        // 1. Get cart for logged-in user
        const cartData = await document.getCart();
        if (!cartData || !cartData.data || !cartData.data._id) {
          alert("No cart found for this user.");
          return;
        }
        const cartId = cartData.data._id;

        // 2. Collect shipping and payment info from form
        const shippingAddress = {
          details: document.getElementById("address").value,
          phone: document.getElementById("zip").value,
          city: document.getElementById("state").value,
          postalCode: "", // Add if you have a postal code field
        };

        // Check if cash on delivery is selected
        const cashOnDelivery = document.getElementById("cash").checked;

        if (cashOnDelivery) {
          // Original cash on delivery flow
          const token = localStorage.getItem("token");
          const res = await fetch(
            `http://localhost:3000/api/v1/orders/${cartId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                shippingAddress,
                paymentMethodType: "cash",
              }),
            }
          );
          const data = await res.json();
          if (res.ok && data.status === "success") {
            // Store order ID in localStorage
            if (data.data && data.data._id) {
              localStorage.setItem("lastOrderId", data.data._id);
            }
            window.location.href = "OrderConfirmed.html";
          } else {
            alert("Order failed: " + (data.message || JSON.stringify(data)));
            console.error("Order API error:", data);
          }
        } else {
          // For card payments, use Stripe checkout
          const token = localStorage.getItem("token");
          if (!token) {
            alert("You must be logged in to place an order.");
            return;
          }

          // Call the checkout session endpoint
          const res = await fetch(
            `http://localhost:3000/api/v1/orders/checkout-session/${cartId}`,
            {
              method: "POST", // Changed to POST since we're sending data in the body
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              // Send shipping address in the request body
              body: JSON.stringify({ shippingAddress }),
            }
          );

          const data = await res.json();
          if (
            res.ok &&
            data.status === "success" &&
            data.session &&
            data.session.url
          ) {
            // Redirect to Stripe Checkout
            window.location.href = data.session.url;
          } else {
            alert(
              "Failed to initialize payment: " +
                (data.message || "Unknown error")
            );
            console.error("Stripe session error:", data);
          }
        }
      } catch (err) {
        alert("Unexpected error: " + err.message);
        console.error("Order submit error:", err);
      }
    });
  } else {
    console.error("Checkout form not found!");
  }

  // Initial load
  const cartData = await fetchCart();
  cartItems = cartData && cartData.cartItems ? cartData.cartItems : [];
  renderCartSummary(cartItems);
});
