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
    const links = document.querySelectorAll(".drawernavHome");
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


// Sliding Text Pill Logic
document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.querySelector(".mainNav ul");
    // Ensure nav exists before trying to add pill (mobile nav might be hidden/removed)
    if (!navContainer) return;

    const navLinks = document.querySelectorAll(".mainNav a");

    // Create the backdrop pill element
    const pill = document.createElement("div");
    pill.classList.add("nav-backdrop");
    navContainer.appendChild(pill);

    navLinks.forEach((link) => {
        link.addEventListener("mouseenter", (e) => {
            const width = link.offsetWidth;
            const height = link.offsetHeight;
            const left = link.offsetLeft;
            const top = link.offsetTop;

            // Use transform for performance instead of top/left
            // But since I set top/left in CSS to 0, I can sett top/left here or use transform.
            // Using direct style properties for simplicity as transform might conflict if not managed well, 
            // but CSS has transition on 'all'.
            // Note: In CSS I defined top:0; left:0.
            // Let's use top/left properties to match the CSS transition on 'all'.

            pill.style.width = `${width}px`;
            pill.style.height = `${height}px`;
            pill.style.left = `${left}px`;
            pill.style.top = `${top}px`;
            pill.style.opacity = "1";
        });
    });

    navContainer.addEventListener("mouseleave", () => {
        pill.style.opacity = "0";
    });
});

