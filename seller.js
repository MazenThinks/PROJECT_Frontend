document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("productForm");
  const submitBtn = document.querySelector(".submit-btn");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData();
      const productName = document.getElementById("productName")?.value?.trim();
      const productPrice = document.getElementById("productPrice")?.value;
      const productDescription = document
        .getElementById("productDescription")
        ?.value?.trim();
      const productCategory = document.getElementById("productCategory")?.value;
      const productStock = document.getElementById("productStock")?.value;
      const productImages = document.getElementById("productImages")?.files;

      // Validate required fields
      if (
        !productName ||
        !productPrice ||
        !productDescription ||
        !productCategory ||
        !productStock
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Validate price
      if (parseFloat(productPrice) <= 0) {
        alert("Price must be greater than 0");
        return;
      }

      // Validate stock
      if (parseInt(productStock) < 0) {
        alert("Stock quantity cannot be negative");
        return;
      }

      // Prepare form data for submission
      formData.append("name", productName);
      formData.append("price", productPrice);
      formData.append("description", productDescription);
      formData.append("category", productCategory);
      formData.append("stock", productStock);

      // Add images if any
      if (productImages && productImages.length > 0) {
        for (let i = 0; i < productImages.length; i++) {
          formData.append("images", productImages[i]);
        }
      }

      // Add loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Adding Product...";
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please sign in to add products");
          window.location.href = "signinPage.html";
          return;
        }

        const response = await fetch("http://localhost:3000/api/v1/products", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          alert("Product added successfully!");
          form.reset();
          // Optionally redirect to products page or dashboard
          // window.location.href = 'dashboard.html';
        } else {
          alert(data.message || "Failed to add product");
        }
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product. Please try again.");
      } finally {
        // Remove loading state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Add Product";
        }
      }
    });
  }

  // Real-time validation
  const inputs = form?.querySelectorAll("input, textarea, select");
  inputs?.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      this.classList.remove("error");
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;

    switch (fieldName) {
      case "productName":
        if (!value) {
          showFieldError(field, "Product name is required");
          return false;
        }
        break;
      case "productPrice":
        if (!value || parseFloat(value) <= 0) {
          showFieldError(field, "Valid price is required");
          return false;
        }
        break;
      case "productDescription":
        if (!value) {
          showFieldError(field, "Product description is required");
          return false;
        }
        break;
      case "productCategory":
        if (!value) {
          showFieldError(field, "Please select a category");
          return false;
        }
        break;
      case "productStock":
        if (!value || parseInt(value) < 0) {
          showFieldError(field, "Valid stock quantity is required");
          return false;
        }
        break;
    }
    clearFieldError(field);
    return true;
  }

  function showFieldError(field, message) {
    field.classList.add("error");
    let errorDiv = field.parentNode.querySelector(".error-message");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }

  function clearFieldError(field) {
    field.classList.remove("error");
    const errorDiv = field.parentNode.querySelector(".error-message");
    if (errorDiv) {
      errorDiv.remove();
    }
  }
});
