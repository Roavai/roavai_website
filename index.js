// drawer control
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");
const sideDrawer = document.getElementById("sideDrawer");
const overlay = document.getElementById("overlay");

function openDrawer() {
  sideDrawer.classList.add("open");
  overlay.classList.add("show");
  overlay.hidden = false;
  sideDrawer.setAttribute("aria-hidden", "false");
}
function closeDrawer() {
  sideDrawer.classList.remove("open");
  overlay.classList.remove("show");
  overlay.hidden = true;
  sideDrawer.setAttribute("aria-hidden", "true");
}

openMenu.addEventListener("click", openDrawer);
closeMenu.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sideDrawer.classList.contains("open"))
    closeDrawer();
});

// Smooth scroll
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".navHome");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      if (sideDrawer.classList.contains("open")) {
        closeDrawer();
      }
    });
  });


  /**
   * Dynamically loads a section's HTML, CSS, and JS.
   * @param {string} name - The name of the section (e.g., 'product', 'blog').
   * @param {string} containerId - The ID of the element to inject HTML into.
   * @param {boolean} hasCss - Whether to load a corresponding CSS file.
   * @param {boolean} hasJs - Whether to load a corresponding JS file.
   * @param {boolean} isModule - Whether the JS file is a module.
   */
  const loadSection = (name, containerId, hasCss = false, hasJs = false, isModule = false) => {
    fetch(`View/${name}.html`)
      .then((res) =>
        res.ok ? res.text() : Promise.reject(`Failed to load ${name}.html`)
      )
      .then((data) => {
        document.getElementById(containerId).innerHTML = data;

        if (hasCss) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = `Style/${name}.css`;
          document.head.appendChild(link);
        }

        if (hasJs) {
          const script = document.createElement("script");
          script.src = `Script/${name}.js`;
          if (isModule) script.type = "module";
          document.body.appendChild(script);
        }
      })
      .catch((err) => console.error(`Error loading ${name}:`, err));
  };

  // Preload all dynamic sections
  loadSection("product", "product", true, true, true);
  loadSection("blog", "blog", true, true);
  loadSection("aboutUs", "aboutUs", true, true);
});

// Scroll to blog section if URL hash is #blog on initial load
window.addEventListener("load", () => {
  if (window.location.hash === "#blog") {
    const target = document.getElementById("blog");
    if (target) {
      // Use a small timeout to ensure content is loaded and layout is stable
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }
});

// ---------------------------------------------------------------------------

// Scroll Reveal Animation
const revealSections = document.querySelectorAll('.reveal-section');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.25 });

revealSections.forEach(section => revealObserver.observe(section));

