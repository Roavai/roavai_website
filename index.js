
// drawer control
const openMenu = document.getElementById('openMenu');
const closeMenu = document.getElementById('closeMenu');
const sideDrawer = document.getElementById('sideDrawer');
const overlay = document.getElementById('overlay');

function openDrawer() {
  sideDrawer.classList.add('open');
  overlay.classList.add('show');
  overlay.hidden = false;
  sideDrawer.setAttribute('ariahidden', 'false');
}
function closeDrawer() {
  sideDrawer.classList.remove('open');
  overlay.classList.remove('show');
  // hide overlay after transition
  setTimeout(()=> overlay.hidden = true, 300);
  sideDrawer.setAttribute('aria-hidden', 'true');
}

openMenu.addEventListener('click', openDrawer);
closeMenu.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

// close on Esc
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && sideDrawer.classList.contains('open')) closeDrawer();
});

// Scroll to Home

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".navHome");

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href").substring(1); // remove '#'
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
});


// Load Product page dynamically

// Preload product section on page load
window.addEventListener("DOMContentLoaded", () => {
  fetch("Pages/product.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("product").innerHTML = data;

      // Load Product CSS
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "Style/product.css";
      document.head.appendChild(link);

      // Load Product JS
      let script = document.createElement("script");
      script.src = "Script/product.js";
      document.body.appendChild(script);
    })
    .catch(err => console.error("Error preloading product:", err));
});

//-------------------------------------------------------------------------------------------//



//-----------------------------------------------------------------------------------------//



// Load Blog page dynamically
window.addEventListener("load", () => {
  if (window.location.hash === "#blog") {
    const target = document.getElementById("blog");
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth" });
      }, 200); // delay to wait for layout to settle
    }
  }
});

// Preload Blog section on page load
window.addEventListener("DOMContentLoaded", () => {
  fetch("Pages/blog.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("blog").innerHTML = data;

      // Load Blog CSS
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "Style/blog.css";
      document.head.appendChild(link);

      // Load Blog JS
      let script = document.createElement("script");
      script.src = "Script/blog.js";
      document.body.appendChild(script);
    })
    .catch(err => console.error("Error preloading blog:", err));
});



// About us
// Load About Us page
// PRELOAD ABOUT US SECTION ON PAGE LOAD
window.addEventListener("DOMContentLoaded", () => {
  fetch("Pages/aboutUs.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("aboutUs").innerHTML = data;

      // Load About CSS
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "Style/aboutUs.css";
      document.head.appendChild(link);

      // Load About JS for animation
      let script = document.createElement("script");
      script.src = "Script/aboutUs.js";
      document.body.appendChild(script);
    })
    .catch(err => console.error("Error loading About Us:", err));
});


// Load contact.html inside index page
window.addEventListener("DOMContentLoaded", () => {
    fetch("Pages/contactUs.html")
      .then(response => response.text())
      .then(data => {
        document.getElementById("contact-container").innerHTML = data;
      });
  });

