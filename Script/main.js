// Script/main.js
function loadPage(sectionId, filePath) {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(sectionId).innerHTML = data;
    })
    .catch((err) => console.error("Error loading page:", err));
}

// Load all pages
loadPage("home", "Pages/Home.html");
loadPage("product", "Pages/Product.html");
loadPage("blog", "Pages/Blog.html");
loadPage("about", "Pages/AboutUs.html");
