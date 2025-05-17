document.addEventListener("DOMContentLoaded", function () {
  // Get email from query string
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  const verifyForm = document.getElementById("verifyCodeForm");
  const resetForm = document.getElementById("resetPasswordForm");
  const codeInput = document.getElementById("resetCodeInput");
  const verifyBtn = document.getElementById("verifyCodeBtn");
  const verifyMsg = document.getElementById("verifyMsg");
  const newPasswordInput = document.getElementById("newPasswordInput");
  const confirmNewPasswordInput = document.getElementById(
    "confirmNewPasswordInput"
  );
  const resetBtn = document.getElementById("resetPasswordBtn");
  const resetMsg = document.getElementById("resetMsg");

  let verifiedCode = null;

  verifyForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    verifyMsg.textContent = "";
    codeInput.classList.remove("is-invalid");
    if (!codeInput.value.trim() || codeInput.value.length !== 6) {
      codeInput.classList.add("is-invalid");
      verifyMsg.textContent = "Please enter the 6-digit code.";
      verifyMsg.style.color = "#dc3545";
      return;
    }
    verifyBtn.classList.add("loading");
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/verifyResetCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetCode: codeInput.value }),
        }
      );
      const data = await response.json();
      verifyBtn.classList.remove("loading");
      if (response.ok) {
        verifiedCode = codeInput.value;
        verifyMsg.textContent = "Code verified! Please set your new password.";
        verifyMsg.style.color = "#198754";
        verifyForm.classList.add("d-none");
        resetForm.classList.remove("d-none");
      } else {
        verifyMsg.textContent = data.message || "Invalid or expired code.";
        verifyMsg.style.color = "#dc3545";
      }
    } catch {
      verifyBtn.classList.remove("loading");
      verifyMsg.textContent = "Failed to verify code.";
      verifyMsg.style.color = "#dc3545";
    }
  });

  resetForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    resetMsg.textContent = "";
    newPasswordInput.classList.remove("is-invalid");
    confirmNewPasswordInput.classList.remove("is-invalid");
    if (!newPasswordInput.value.trim() || newPasswordInput.value.length < 6) {
      newPasswordInput.classList.add("is-invalid");
      resetMsg.textContent = "Password must be at least 6 characters.";
      resetMsg.style.color = "#dc3545";
      return;
    }
    if (newPasswordInput.value !== confirmNewPasswordInput.value) {
      confirmNewPasswordInput.classList.add("is-invalid");
      resetMsg.textContent = "Passwords do not match.";
      resetMsg.style.color = "#dc3545";
      return;
    }
    resetBtn.classList.add("loading");
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/resetPassword",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            newPassword: newPasswordInput.value,
          }),
        }
      );
      const data = await response.json();
      resetBtn.classList.remove("loading");
      if (response.ok) {
        resetMsg.textContent =
          "Password reset successfully! Redirecting to login...";
        resetMsg.style.color = "#198754";
        setTimeout(() => {
          window.location.href = "signinPage.html";
        }, 1500);
      } else {
        resetMsg.textContent = data.message || "Failed to reset password.";
        resetMsg.style.color = "#dc3545";
      }
    } catch {
      resetBtn.classList.remove("loading");
      resetMsg.textContent = "Failed to reset password.";
      resetMsg.style.color = "#dc3545";
    }
  });
});
