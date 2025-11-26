function initContactUs() {
  document
    .getElementById("contactForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // AUTO DETECT: local dev or production
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const apiUrl = isLocal ? "http://localhost:5010/save" : "/api/save";

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message || "Success!");
          document.getElementById("contactForm").reset();
        } else {
          alert("Error: " + (result.error || result.details || "Unknown"));
        }
      } catch (error) {
        console.error(error);
        alert("Network error — are you running the local server?");
      }
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactUs);
} else {
  initContactUs();
}
