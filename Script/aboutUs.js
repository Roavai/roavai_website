const textBox = document.querySelector(".about-scroll-box");
const text = document.querySelector(".about-reveal-text");
const words = text.dataset.words.split(",");
let i = 0;

text.textContent = words[i];

let last = textBox.scrollTop;
let progress = 0;

textBox.addEventListener("scroll", () => {
  let diff = textBox.scrollTop - last;
  last = textBox.scrollTop;
  progress += diff;

  const STEP = 120; // scrolling distance required to change text

  if (progress > STEP && i < words.length - 1) {
    text.classList.add("fade");
    setTimeout(() => {
      i++;
      text.textContent = words[i];
      text.classList.remove("fade");
    }, 350);
    progress = 0;
  }

  if (progress < -STEP && i > 0) {
    text.classList.add("fade");
    setTimeout(() => {
      i--;
      text.textContent = words[i];
      text.classList.remove("fade");
    }, 350);
    progress = 0;
  }
});
