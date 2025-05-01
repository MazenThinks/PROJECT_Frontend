// Handles cart operations: fetch, add, remove items using backend API

const API_URL = "http://localhost:3000/api/v1/cart";

function getToken() {
  return localStorage.getItem("token");
}

// Fetch current user's cart
document.getCart = async function () {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
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
