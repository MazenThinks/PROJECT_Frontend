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

  // Promo code logic
  document
    .querySelector("form.card.p-2")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const input = this.querySelector("input");
      const code = input.value.trim();
      // Example: only one promo code
      if (code.toUpperCase() === "SAVE50") {
        promoDiscount = 50;
        promoCode = code.toUpperCase();
      } else {
        promoDiscount = 0;
        promoCode = "";
        alert("Invalid promo code");
      }
      renderCartSummary(cartItems);
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
        const paymentMethodType =
          document.getElementById("paypal") &&
          document.getElementById("paypal").checked
            ? "card"
            : "cash";

        // 3. Call backend order API
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in to place an order.");
          return;
        }
        const res = await fetch(
          `http://localhost:3000/api/v1/orders/${cartId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ shippingAddress, paymentMethodType }),
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
