import { loadUserData } from "./search.js";
import { createPostZone } from "./renderUserProfile.js";
import { createContentElement } from "./renderUserProfile.js";
import { openUserProfile } from "./renderUserProfile.js";
import { randomizer } from "./renderUserProfile.js";

const contentFlow = document.querySelector(".content-flow");
const avocadoLogo = document.querySelector(".header-primary");
const homeBtn = document.querySelector(".home-icon");
let pageHeight = 0;
let abort = false;

async function getUser(url) {
  let respons = await fetch(url + (randomizer(9) + 1));

  let user = await respons.json();

  return user;
}

async function openUser(e) {
  if (e.currentTarget === e.target) return;

  const user = e.currentTarget.user;
  const userAvatar = e.currentTarget.avatar;
  const userPhotosArray = e.currentTarget.photos;
  const userPostsArray = e.currentTarget.posts;

  let currentUserProfile = await openUserProfile(
    null,
    user,
    userAvatar,
    userPhotosArray,
    userPostsArray
  );

  currentUserProfile.name = user.name;
  currentUserProfile.username = user.username;
  currentUserProfile.userId = user.id;
}

function doSamplePosts(container) {
  const sampleArray = [];
  for (let i = 0; i < 10; i++) {
    const containerDiv = createContentElement(
      "div",
      container,
      null,
      "home-div-posts-container"
    );
    const homePostContainer = createContentElement(
      "div",
      containerDiv,
      null,
      "home-post-container"
    );

    const sampleUserPostInfoBox = createContentElement(
      "div",
      homePostContainer,
      null,
      "home-sample-post-info-box"
    );

    createContentElement(
      "div",
      sampleUserPostInfoBox,
      null,
      "home-sample-post-info-avatar"
    );

    const userPostNameBox = createContentElement(
      "div",
      sampleUserPostInfoBox,
      null,
      "home-sample-post-info-name-box"
    );

    createContentElement(
      "strong",
      userPostNameBox,
      null,
      "home-sample-post-info-name"
    );
    createContentElement(
      "span",
      userPostNameBox,
      null,
      "home-sample-post-info-login"
    );

    const userPostTextBox = createContentElement(
      "div",
      homePostContainer,
      null,
      "home-sample-post-text-box"
    );

    createContentElement(
      "div",
      userPostTextBox,
      null,
      "home-sample-post-header"
    );
    createContentElement(
      "div",
      userPostTextBox,
      null,
      "home-sample-post-text-content"
    );
    createContentElement(
      "div",
      userPostTextBox,
      null,
      "home-sample-post-text-content"
    );
    createContentElement(
      "div",
      userPostTextBox,
      null,
      "home-sample-post-text-content"
    );

    sampleArray.push(containerDiv);
  }

  return sampleArray;
}

async function createHomePost(container) {
  const postOwner = await getUser(
    "https://jsonplaceholder.typicode.com/users/"
  );

  const userPhotos = await loadUserData(
    `https://jsonplaceholder.typicode.com/albums/${postOwner.id}/photos`
  );

  let counter = randomizer(userPhotos.length);
  let doUserPhotos;
  if (randomizer(100) < 80) {
    doUserPhotos = false;
  } else {
    doUserPhotos = userPhotos[counter];
    counter = randomizer(userPhotos.length) - 1;
  }

  const postOwnerAvatar = userPhotos[0];

  const randomUserPost = await loadUserData(
    `https://jsonplaceholder.typicode.com/users/${postOwner.id}/posts`
  );

  container.innerHTML = "";
  const readyPost = createPostZone(
    postOwner,
    postOwnerAvatar,
    doUserPhotos,
    randomUserPost[randomizer(randomUserPost.length - 1)],
    container
  );

  const infoContainer = readyPost.querySelector(".user-post-info-container");
  infoContainer.user = postOwner;
  infoContainer.avatar = postOwnerAvatar;
  infoContainer.photos = userPhotos;
  infoContainer.posts = randomUserPost;
  infoContainer.addEventListener("click", openUser);
}

function getFullHeightOfPage() {
  const body = document.body;
  const html = document.documentElement;

  const pageHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  return pageHeight;
}

async function postsCycle() {
  if (contentFlow.classList.contains("user-page")) {
    clearInterval(timer);
    timer = null;
    return;
  }

  if (
    window.pageYOffset + document.documentElement.clientHeight <
    pageHeight - document.documentElement.clientHeight
  )
    return;

  abort = true;
  const homeSamplePosts = await doSamplePosts(contentFlow);

  for (let post of homeSamplePosts) {
    await createHomePost(post);
  }

  abort = false;
}

function startHomePage(e) {
  e.preventDefault();

  if (!contentFlow.classList.contains("user-page")) return;

  contentFlow.classList.remove("user-page");
  contentFlow.innerHTML = "";

  timer = setInterval(() => {
    if (abort) return;
    pageHeight = getFullHeightOfPage();
    postsCycle();
  }, 2000);
}

avocadoLogo.addEventListener("click", startHomePage);
homeBtn.addEventListener("click", startHomePage);

let timer = setInterval(() => {
  if (abort) return;
  pageHeight = getFullHeightOfPage();
  postsCycle();
}, 2000);
