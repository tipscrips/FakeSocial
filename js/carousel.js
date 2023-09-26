let width = 128; // ширина картинки
let count = 4; // видимое количество изображений
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
  // сдвиг влево
  position += width * count;
  // последнее передвижение влево может быть не на 3, а на 2 или 1 элемент
  position = Math.min(position, 0);
  ul.style.marginLeft = position + "px";
}

function next(ul, listItems) {
  // сдвиг вправо
  position -= width * count;
  // последнее передвижение вправо может быть не на 3, а на 2 или 1 элемент

  position = Math.max(position, -width * (listItems.length - count));
  ul.style.marginLeft = position + "px";
}
