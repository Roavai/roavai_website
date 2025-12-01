// contact.js  ← this is the script you load in HTML
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

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
      alert("Thank you! Your message was sent.");
      e.target.reset();
    } else {
      alert("Error: " + (data.error || "Try again"));
    }
  } catch (err) {
    alert("Network error. Please try again.");
  }
});
