document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("forgotPasswordForm");
  const emailInput = document.getElementById("forgotEmailInput");
  const btn = document.getElementById("forgotPasswordBtn");
  const msg = document.getElementById("forgotMsg");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    msg.textContent = "";
    emailInput.classList.remove("is-invalid");
    if (!emailInput.value.trim()) {
      emailInput.classList.add("is-invalid");
      msg.textContent = "Please enter your email.";
      msg.style.color = "#dc3545";
      return;
    }
    btn.classList.add("loading");
    try {
      // Use the correct endpoint path (case-sensitive)
      const apiUrl = new URL(
        "/api/v1/auth/forgotPassword",
        "http://localhost:3000"
      ).href;
      console.log("Sending request to:", apiUrl);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.value }),
      });
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        data = { message: "No response from server." };
      }
      btn.classList.remove("loading");
      if (response.ok) {
        msg.textContent = "A reset code has been sent to your email.";
        msg.style.color = "#198754";
        setTimeout(() => {
          window.location.href = `verifyResetCode.html?email=${encodeURIComponent(
            emailInput.value
          )}`;
        }, 1200);
      } else {
        console.error("Backend error:", data);
        if (data && data.message && data.message.includes("sending email")) {
          msg.textContent =
            "Failed to send email. Please check your email address or try again later.";
        } else {
          msg.textContent =
            data && data.message
              ? data.message
              : data && data.error
              ? data.error
              : "Failed to send reset code.";
        }
        msg.style.color = "#dc3545";
      }
    } catch (err) {
      btn.classList.remove("loading");
      msg.textContent = err.message || "Failed to send reset code.";
      msg.style.color = "#dc3545";
    }
  });
});
