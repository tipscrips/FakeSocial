let width;
let count = 4;
let position = 0;

const mainContainer = document.getElementById("main-container");

mainContainer.addEventListener("click", checkElem);

function checkElem(e) {
  let element = e.target.closest(".arrow-btn");

  if (!element) return;

  if (!element.classList.contains("arrow-btn")) return;

  const carousel = element.closest(".carousel");
  const ul = carousel.querySelector(".img-carousel-ul");
  const listItem = ul.querySelectorAll(".photo-list-item");
  const img = document.querySelector(".user-photo-thumbnail-size");
  width = img.offsetWidth + 8;

  if (element.classList.contains("prev")) {
    prev(ul, listItem);
    return;
  }

  if (element.classList.contains("next")) {
    next(ul, listItem);
    return;
  }
}

function prev(ul, listItems) {
  position += width * count;
  position = Math.min(position, 0);
  ul.style.marginLeft = position + "px";
}

function next(ul, listItems) {
  position -= width * count;
  position = Math.max(position, -width * (listItems.length - count));
  ul.style.marginLeft = position + "px";
}
