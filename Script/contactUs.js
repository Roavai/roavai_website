document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  const spinner = submitBtn.querySelector(".spinner");
  const btnText = submitBtn.querySelector(".btn-text");
  const messageContainer = document.getElementById("formMessage");

  // Clear any previous message
  messageContainer.classList.remove("show", "success", "error");
  messageContainer.textContent = "";

  // Show loading state
  submitBtn.disabled = true;
  spinner.style.display = "inline-block";
  btnText.textContent = "Sending...";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();

    if (res.ok) {
      // Success message
      messageContainer.textContent =
        "Thank you! Your message was sent successfully.";
      messageContainer.classList.add("success", "show");
      e.target.reset(); // Clear the form
    } else {
      // Error from server
      messageContainer.textContent =
        "Error: " + (data.error || "Something went wrong. Please try again.");
      messageContainer.classList.add("error", "show");
    }
  } catch (err) {
    // Network or other error
    messageContainer.textContent =
      "Network error. Please check your connection and try again.";
    messageContainer.classList.add("error", "show");
  } finally {
    // Always restore button
    submitBtn.disabled = false;
    spinner.style.display = "none";
    btnText.textContent = "Send message";

    // Optional: Auto-hide message after 5 seconds
    if (messageContainer.classList.contains("show")) {
      setTimeout(() => {
        messageContainer.classList.remove("show");
      }, 5000);
    }
  }
});
