const signupForm = document.getElementById("signupForm");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const sourceInput = document.getElementById("source");
const submitButton = document.getElementById("submitButton");
const formStatus = document.getElementById("formStatus");
const successModal = document.getElementById("successModal");
const watchTogetherButton = document.getElementById("watchTogetherButton");
const landingPanel = document.getElementById("landingPanel");
const offerPanel = document.getElementById("offerPanel");
const loadingOverlay = document.getElementById("loadingOverlay");
const instagramInput = document.getElementById("instagramUsername");
const enterRoomButton = document.getElementById("enterRoomButton");
const rippleTargets = document.querySelectorAll(".ripple-target");
const fieldErrors = {
  name: document.getElementById("nameError"),
  phone: document.getElementById("phoneError"),
  email: document.getElementById("emailError"),
  source: document.getElementById("sourceError")
};
const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setFieldError = (field, message) => {
  fieldErrors[field].textContent = message;
};

const clearFieldError = (field) => {
  fieldErrors[field].textContent = "";
};

const toggleInvalidState = (input, isInvalid) => {
  input.classList.toggle("input-invalid", isInvalid);
};

const clearGlobalStatus = () => {
  formStatus.textContent = "";
  formStatus.classList.remove("success");
};

const validateSignupForm = () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();
  const source = sourceInput.value.trim();
  let isValid = true;

  clearGlobalStatus();

  if (!name) {
    setFieldError("name", "Please enter your name.");
    toggleInvalidState(nameInput, true);
    isValid = false;
  } else {
    clearFieldError("name");
    toggleInvalidState(nameInput, false);
  }

  if (!phoneRegex.test(phone)) {
    setFieldError("phone", "Phone must be 10 digits and start with 6-9.");
    toggleInvalidState(phoneInput, true);
    isValid = false;
  } else {
    clearFieldError("phone");
    toggleInvalidState(phoneInput, false);
  }

  if (!emailRegex.test(email)) {
    setFieldError("email", "Please enter a valid email address.");
    toggleInvalidState(emailInput, true);
    isValid = false;
  } else {
    clearFieldError("email");
    toggleInvalidState(emailInput, false);
  }

  if (!source) {
    setFieldError("source", "Please select how you heard about us.");
    toggleInvalidState(sourceInput, true);
    isValid = false;
  } else {
    clearFieldError("source");
    toggleInvalidState(sourceInput, false);
  }

  return {
    isValid,
    payload: {
      user_name: name,
      user_phone: phone,
      user_email: email,
      user_source: source
    }
  };
};

// Keep phone input numeric-only and max 10 digits.
phoneInput.addEventListener("keydown", (event) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
  if (allowedKeys.includes(event.key)) {
    return;
  }
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
});

// Submit signup form, validate data, and send with EmailJS.
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { isValid, payload } = validateSignupForm();
  if (!isValid) {
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  try {
    await emailjs.send(
      "service_49ci7e6",
      "template_cxh5a6m",
      payload,
      "daYLIRdAzY1qg6Mpj"
    );
    signupForm.reset();
    clearGlobalStatus();
    formStatus.textContent = "Registration successful. Access granted!";
    formStatus.classList.add("success");
    successModal.classList.remove("hidden");
    successModal.setAttribute("aria-hidden", "false");
  } catch (error) {
    console.log("EMAILJS ERROR:", error);
    alert(JSON.stringify(error));
    formStatus.textContent = "Something went wrong. Please try again.";
    formStatus.classList.remove("success");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Enter Experience";
  }
});

// Move user to offer section after a short loading animation.
watchTogetherButton.addEventListener("click", () => {
  successModal.classList.add("hidden");
  successModal.setAttribute("aria-hidden", "true");

  loadingOverlay.classList.remove("hidden");
  loadingOverlay.setAttribute("aria-hidden", "false");

  setTimeout(() => {
    loadingOverlay.classList.add("hidden");
    loadingOverlay.setAttribute("aria-hidden", "true");

    landingPanel.classList.remove("panel-active");
    offerPanel.classList.add("panel-active");
    offerPanel.setAttribute("aria-hidden", "false");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, 1400);
});

// Enable the final CTA only when username has text.
instagramInput.addEventListener("input", () => {
  const hasValue = instagramInput.value.trim().length > 0;
  enterRoomButton.classList.toggle("disabled", !hasValue);
  enterRoomButton.setAttribute("aria-disabled", String(!hasValue));
});

// Clear input-specific error feedback during typing.
nameInput.addEventListener("input", () => {
  clearFieldError("name");
  toggleInvalidState(nameInput, false);
  clearGlobalStatus();
});

phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
  clearFieldError("phone");
  toggleInvalidState(phoneInput, false);
  clearGlobalStatus();
});

emailInput.addEventListener("input", () => {
  clearFieldError("email");
  toggleInvalidState(emailInput, false);
  clearGlobalStatus();
});

sourceInput.addEventListener("change", () => {
  clearFieldError("source");
  toggleInvalidState(sourceInput, false);
  clearGlobalStatus();
});

// Ripple micro-interaction for primary action buttons.
rippleTargets.forEach((button) => {
  button.addEventListener("click", (event) => {
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    const rect = button.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 550);
  });
});
