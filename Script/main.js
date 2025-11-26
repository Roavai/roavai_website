// Script/main.js
function loadPage(sectionId, filePath) {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(sectionId).innerHTML = data;
    })
    .catch((err) => console.error("Error loading page:", err));
}

// Load all page
loadPage("home", "View/Home.html");
loadPage("product", "View/Product.html");
loadPage("blog", "View/Blog.html");
loadPage("about", "View/AboutUs.html");
