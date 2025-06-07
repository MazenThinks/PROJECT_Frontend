// Handles cart operations: fetch, add, remove items using backend API

const API_URL = "http://localhost:3000/api/v1/cart";

function getToken() {
  return localStorage.getItem("token");
}

// Fetch current user's cart
document.getCart = async function () {
  const token = getToken();
  if (!token) return null;
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      console.error("Failed to fetch cart:", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
};

// Add product to cart
// Usage: addToCart(productId, color, quantity)
document.addToCart = async function (productId, color, quantity) {
  const token = getToken();
  if (!token) return { error: "Not authenticated" };
  const body = { productId };
  if (color) body.color = color;
  if (quantity) body.quantity = quantity;
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { error: "Server error" };
  }
  if (!res.ok && data && data.message) {
    return { error: data.message };
  }
  return data;
};

// Remove item from cart
// Usage: removeFromCart(itemId)
document.removeFromCart = async function (itemId) {
  const token = getToken();
  if (!token) return { error: "Not authenticated" };
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

// Clear cart
document.clearCart = async function () {
  const token = getToken();
  if (!token) return { error: "Not authenticated" };
  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.ok;
};

// Update cart item quantity
// Usage: updateCartItemQuantity(itemId, newQuantity)
document.updateCartItemQuantity = async function (itemId, quantity) {
  const token = getToken();
  if (!token) return { error: "Not authenticated" };
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });
  return res.json();
};

document.addEventListener("DOMContentLoaded", async function () {
  // Only execute cart page specific code if we're on the cart page
  const cartContainer = document.querySelector(".cart-container");
  if (!cartContainer) return;

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "signinPage.html";
    return;
  }

  // Function to render cart items
  async function loadCart() {
    const cartData = await document.getCart();
    if (!cartData || !cartData.data) {
      cartContainer.innerHTML =
        '<div class="alert alert-info">Your cart is empty</div>';
      return;
    }

    // Render cart items here
    // ...
  }

  // Initial load
  await loadCart();
});
