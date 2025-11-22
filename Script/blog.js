// // Smooth scroll for navbar links
// document.querySelectorAll('nav a').forEach(link => {
//   link.addEventListener('click', e => {
//     const target = link.getAttribute('href');
//     if (target.startsWith('#')) {
//       e.preventDefault();
//       document.querySelector(target).scrollIntoView({
//         behavior: 'smooth'
//       });
//     }
//   });
// });

// // Load external blog page
// document.addEventListener("DOMContentLoaded", function () {
//   const readMoreBtn = document.getElementById("readMoreBtn");
//   const blogFullContent = document.getElementById("blogFullContent");

//   readMoreBtn.addEventListener("click", function (e) {
//     e.preventDefault(); // Stop page reload

//     // Load blogDetails.html
//     fetch("Pages/blogDetails.html")
//       .then(response => response.text())
//       .then(data => {
//         blogFullContent.innerHTML = data;
//         blogFullContent.scrollIntoView({ behavior: "smooth" });
//       })
//       .catch(error => console.error("Error loading blog:", error));
//   });
// });



//--------------------------------------------------------------------------------------------//
// --------------------------------------
// SAFE NAVBAR SCROLL
// --------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");

  if (navLinks.length > 0) {
    navLinks.forEach(link => {
      link.addEventListener("click", e => {
        const target = link.getAttribute("href");
        if (target && target.startsWith("#")) {
          e.preventDefault();
          const section = document.querySelector(target);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }
//});

// --------------------------------------
// SAFE BLOG "READ MORE" LOADER
// --------------------------------------
 // BLOG LOAD LOGIC
  const readMoreBtn = document.getElementById("readMoreBtn");
  const blogFullContent = document.getElementById("blogFullContent");

  if (!readMoreBtn || !blogFullContent) {
    // Blog not present — silent exit
    return;
  }

  
  // If blog exists → activate read more
  readMoreBtn.addEventListener("click", (e) => {
    e.preventDefault();

    fetch("Pages/blogDetails.html")
      .then(res => res.text())
      .then(data => {
        blogFullContent.innerHTML = data;
        blogFullContent.scrollIntoView({ behavior: "smooth" });
      })
      .catch(err => console.error("⚠ Error loading blog:", err));
  });
});
