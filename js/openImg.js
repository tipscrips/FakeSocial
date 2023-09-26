import { createContentElement } from "./renderUserProfile.js";

document.addEventListener("click", openImg);
document.addEventListener("click", closeImg);

let lastImg = null;

function openImg(e) {
  if (lastImg) return;

  const fullSizeImg = e.target.closest(".img-fullsize-item");

  if (!fullSizeImg) return;

  e.preventDefault();
  const imgLink = fullSizeImg.href;

  document.getElementsByTagName("html")[0].style.overflowY = "hidden";

  const openedImgBackgroundBox = createContentElement(
    "div",
    document.body,
    "opened-img-background-box",
    "opened-img-background-box"
  );

  const openedImgBox = createContentElement(
    "div",
    openedImgBackgroundBox,
    "opened-img-box",
    "opened-img-box"
  );

  createContentElement(
    "button",
    openedImgBox,
    "close-opened-img-box-btn",
    "close-opened-img-box-btn",
    null,
    null,
    '<ion-icon name="close-outline"></ion-icon>'
  );

  createContentElement(
    "img",
    openedImgBox,
    "full-size-img",
    "full-size-img",
    imgLink
  );

  const userPostRatingsBox = createContentElement(
    "div",
    openedImgBox,
    "user-post-ratings-box",
    "user-post-ratings-box"
  );

  const userPostRatingButten = createContentElement(
    "butten",
    userPostRatingsBox,
    "user-post-ratings-button",
    "user-post-ratings-button",
    null,
    null,
    "<ion-icon class='post-like-icon not-liked' name='heart-outline'></ion-icon>"
  );

  lastImg = openedImgBackgroundBox;
}

function closeImg(e) {
  const closer = e.target.closest(".close-opened-img-box-btn");
  const emptySpace = e.target.classList.contains("opened-img-background-box");
  if (!closer && !emptySpace) return;

  lastImg.remove();
  document.getElementsByTagName("html")[0].style.overflowY = "";
  lastImg = null;
}
