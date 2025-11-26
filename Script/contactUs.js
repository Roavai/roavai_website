function initContactUs() {
  document
    .getElementById("contactForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // AUTO DETECT: local dev or production
      const hostname = window.location.hostname;

      const isLocalDev =
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "0.0.0.0";

      const isVercel =
        hostname.includes("vercel.app") || hostname.endsWith(".vercel.app");

      const useLocalBackend = isLocalDev && !isVercel;

      const apiUrl = useLocalBackend
        ? "http://localhost:5001/save"
        : "/api/save"; // ← preview + production + any other host

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
