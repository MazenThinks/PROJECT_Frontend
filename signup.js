document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const loginForm = document.querySelector(".login-form");
  const signupBtn = document.getElementById("signupBtn");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const confirmPasswordInput = document.getElementById("confirmPasswordInput");
  const firstNameInput = document.getElementById("firstNameInput");
  const lastNameInput = document.getElementById("lastNameInput");
  const agreeCheck = document.getElementById("agreeCheck");
  const togglePasswordBtn = document.querySelector(".btn-toggle-password");
  const toggleConfirmPasswordBtn = document.querySelector(
    ".btn-toggle-confirm-password"
  );
  const socialBtns = document.querySelectorAll(".social-btn");

  // Toggle password visibility
  function togglePasswordVisibility(inputField, button) {
    const type =
      inputField.getAttribute("type") === "password" ? "text" : "password";
    inputField.setAttribute("type", type);

    // Change the icon
    const eyeIcon = button.querySelector("svg");
    if (type === "password") {
      eyeIcon.innerHTML =
        '<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>';
    } else {
      eyeIcon.innerHTML =
        '<path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/>';
    }
  }

  // Password visibility toggle handlers
  togglePasswordBtn.addEventListener("click", function () {
    togglePasswordVisibility(passwordInput, this);
  });

  toggleConfirmPasswordBtn.addEventListener("click", function () {
    togglePasswordVisibility(confirmPasswordInput, this);
  });

  // Form submission with validation
  signupBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Reset validation
    const inputs = [
      emailInput,
      passwordInput,
      confirmPasswordInput,
      firstNameInput,
      lastNameInput,
    ];
    inputs.forEach((input) => input.classList.remove("is-invalid"));

    // Validate inputs
    let isValid = true;

    // Check required fields
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add("is-invalid");
        isValid = false;
      }
    });

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    }

    // Check password length
    if (passwordInput.value.trim() && passwordInput.value.trim().length < 8) {
      passwordInput.classList.add("is-invalid");
      isValid = false;
    }

    // Check if passwords match
    if (
      passwordInput.value.trim() &&
      confirmPasswordInput.value.trim() &&
      passwordInput.value !== confirmPasswordInput.value
    ) {
      confirmPasswordInput.classList.add("is-invalid");
      isValid = false;
    }

    // Check terms agreement
    if (!agreeCheck.checked) {
      agreeCheck.classList.add("is-invalid");
      isValid = false;
    }

    if (!isValid) {
      loginForm.classList.add("shake");
      setTimeout(() => loginForm.classList.remove("shake"), 500);
      return;
    }

    // Submit form
    signupBtn.classList.add("loading");

    // Simulate API call
    setTimeout(() => {
      signupBtn.classList.remove("loading");

      // Show success message or redirect
      window.location.href = "index.html"; // Redirect to homepage after successful signup
    }, 2000);
  });

  // Input validation on blur
  [
    emailInput,
    passwordInput,
    confirmPasswordInput,
    firstNameInput,
    lastNameInput,
  ].forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.classList.add("is-invalid");
      } else {
        this.classList.remove("is-invalid");
      }
    });

    // Remove validation errors on input
    input.addEventListener("input", function () {
      this.classList.remove("is-invalid");
    });
  });

  // Special validation for confirm password
  confirmPasswordInput.addEventListener("blur", function () {
    if (
      passwordInput.value.trim() &&
      this.value.trim() &&
      this.value !== passwordInput.value
    ) {
      this.classList.add("is-invalid");
    }
  });

  // Special validation for email format
  emailInput.addEventListener("blur", function () {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value.trim() && !emailRegex.test(this.value.trim())) {
      this.classList.add("is-invalid");
    }
  });

  // Terms checkbox validation
  agreeCheck.addEventListener("change", function () {
    if (this.checked) {
      this.classList.remove("is-invalid");
    }
  });

  // Social signup button effects
  socialBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 200);

      // Simulate redirect after clicking social login
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    });
  });
});
