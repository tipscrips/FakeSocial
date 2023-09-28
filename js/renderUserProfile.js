export { openUserProfile };
export { createContentElement };
import { usersPosts } from "./cache.js";
import { reloadImage } from "./reloadImage.js";

function randomizer(num = 1) {
  return Math.round(Math.random() * num);
}

function openUserProfile(cachedUser, user, userAvatar, userPhotos, userPosts) {
  const container = document.getElementById("content-flow");
  container.innerHTML = "";

  if (cachedUser) {
    container.append(cachedUser);
    return cachedUser;
  }

  const userProfileContainer = createInformationZone(
    user,
    userAvatar,
    userPhotos,
    container
  );

  /* FakePost */
  if (userPosts) {
    let counter = randomizer(userPhotos.length);
    for (let userPost of userPosts) {
      let doUserPhotos;
      if (randomizer(100) < 80) {
        doUserPhotos = false;
      } else {
        doUserPhotos = userPhotos[counter];
        counter = randomizer(userPhotos.length) - 1;
      }
      createPostZone(
        user,
        userAvatar,
        doUserPhotos,
        userPost,
        userProfileContainer.querySelector(".user-information-zone-container")
      );
    }
  }

  return userProfileContainer;
}

function createInformationZone(user, avatarImg, photos, container) {
  const userProfileDiv = createContentElement(
    "div",
    container,
    "user-profile-main-container",
    "user-profile-main-container"
  );

  const mediaDiv = createContentElement(
    "div",
    userProfileDiv,
    "user-media-zone-container",
    "user-media-zone-container"
  );

  const informDiv = createContentElement(
    "div",
    userProfileDiv,
    "user-information-zone-container",
    "user-information-zone-container"
  );

  const imgBox = createContentElement("div", mediaDiv, "img-box", "img-box");

  const descriptionBox = createContentElement(
    "div",
    informDiv,
    "description-box",
    "description-box"
  );

  const openedAvatar = createContentElement(
    "a",
    imgBox,
    "user-avatar-full-size",
    "user-avatar-full-size img-fullsize-item",
    avatarImg.url
  );

  openedAvatar.photoId = avatarImg.id;

  const avatarThumbnailUrl = createContentElement(
    "img",
    openedAvatar,
    "user-avatar-thumbnail-size",
    "user-avatar-thumbnail-size",
    avatarImg.thumbnailUrl
  );

  const userName = createContentElement(
    "h4",
    descriptionBox,
    "user-name",
    "user-name",
    null,
    user.name
  );

  const userLogin = createContentElement(
    "span",
    descriptionBox,
    "user-login",
    "user-login",
    null,
    "@" + user.username.toLowerCase()
  );

  const address = createContactElement(user, descriptionBox, user.address);

  const userPhotos = createPhotosCarousel(user, descriptionBox, photos);

  return userProfileDiv;
}

function createContactElement(user, container, address) {
  if (!(address instanceof Object)) return;

  const addresContainer = document.createElement("address");
  addresContainer.id = "user-contact-information";
  addresContainer.className = "user-contact-information";
  const addresList = createContentElement(
    "ul",
    addresContainer,
    "user-contact-list",
    "user-contact-list"
  );

  let userAddressText = makeSpaceBetween("Address:");

  if (address.city) {
    userAddressText += address.city + ", ";

    if (address.street) userAddressText += address.street;
  }

  const userAddress = createContentElement(
    "li",
    addresList,
    "user-info-city",
    "user-info-city address-list-item",
    null,
    userAddressText
  );

  if (user.email) {
    const li = createContentElement(
      "li",
      addresList,
      "user-info-email-list-item",
      "user-info-email-list-item address-list-item"
    );
    const userEmail = createContentElement(
      "a",
      li,
      "user-info-email",
      "user-info-email",
      user.email,
      `${makeSpaceBetween("Email:")}${user.email}`
    );
  }

  if (user.phone) {
    const li = createContentElement(
      "li",
      addresList,
      "user-info-phone-list-item",
      "user-info-phone-list-item address-list-item"
    );
    const userPhone = createContentElement(
      "a",
      li,
      "user-info-phone",
      "user-info-phone",
      user.phone,
      `${makeSpaceBetween("Phone:")}${user.phone.slice(
        0,
        user.phone.indexOf(" ")
      )}`
    );
  }

  if (user.website) {
    const li = createContentElement(
      "li",
      addresList,
      "user-info-website-list-item",
      "user-info-website-list-item address-list-item"
    );
    const userWebsite = createContentElement(
      "a",
      li,
      "user-info-website",
      "user-info-website",
      user.website,
      makeSpaceBetween("Website:") + user.website
    );
  }

  if (user.company.name) {
    const li = createContentElement(
      "li",
      addresList,
      "user-info-company-list-item",
      "user-info-company-list-item address-list-item"
    );
    const userCompany = createContentElement(
      "p",
      li,
      "user-info-company",
      "user-info-company",
      null,
      `Works in "${user.company.name}"`
    );
  }

  container.append(addresContainer);
  return addresContainer;
}

function createPhotosCarousel(user, container, photos) {
  const userCarousel = createContentElement(
    "section",
    container,
    "user-carousel",
    "carousel user-carousel"
  );

  const btnPrev = document.createElement("button");
  btnPrev.classList = "arrow-btn prev";
  const chevronBackCircleOutline = document.createElement("ion-icon");
  chevronBackCircleOutline.setAttribute("name", "chevron-back-circle-outline");
  chevronBackCircleOutline.className = "arr-prev-icon";

  btnPrev.append(chevronBackCircleOutline);
  userCarousel.append(btnPrev);

  const userGallery = createContentElement(
    "div",
    userCarousel,
    "user-gallery",
    "gallery user-gallery"
  );
  const carouselUl = createContentElement(
    "ul",
    userGallery,
    "img-carousel-ul",
    "img-carousel-ul"
  );

  for (let item of photos) {
    const li = createContentElement(
      "li",
      carouselUl,
      "user-photo-list-item",
      "photo-list-item user-photo-list-item"
    );
    const fullPhotoLink = createContentElement(
      "a",
      li,
      "user-photo-full-size",
      "user-photo-full-size img-fullsize-item",
      item.url
    );

    fullPhotoLink.photoId = item.id;

    const photo = createContentElement(
      "img",
      fullPhotoLink,
      "user-photo-thumbnail-size",
      "user-photo-thumbnail-size",
      item.thumbnailUrl
    );

    photo.onerror = () => reloadImage(photo);
  }

  const btnNext = document.createElement("button");
  btnNext.classList = "arrow-btn next";
  const chevronForwardCircleOutline = document.createElement("ion-icon");
  chevronForwardCircleOutline.setAttribute(
    "name",
    "chevron-forward-circle-outline"
  );
  chevronForwardCircleOutline.className = "arrow-next-icon";

  btnNext.append(chevronForwardCircleOutline);
  userCarousel.append(btnNext);

  return;
}

function createPostZone(user, userAvatar, userPhoto, userPost, container) {
  const postContainer = createContentElement(
    "div",
    container,
    "user-post-container",
    "user-post-container"
  );

  postContainer.postId = userPost.id;

  const userPostInfoBox = createContentElement(
    "div",
    postContainer,
    "user-post-info-container",
    "user-post-info-container"
  );

  createContentElement(
    "img",
    userPostInfoBox,
    "user-post-info-avatar",
    "user-post-info-avatar",
    userAvatar.thumbnailUrl
  );

  const userPostNameBox = createContentElement(
    "div",
    userPostInfoBox,
    "user-post-name-box",
    "user-post-name-box"
  );

  createContentElement(
    "strong",
    userPostNameBox,
    "user-post-info-name",
    "user-post-info-name",
    null,
    user.name
  );
  createContentElement(
    "span",
    userPostNameBox,
    "user-post-info-login",
    "user-post-info-login",
    null,
    "@" + user.username.toLowerCase()
  );

  if (userPhoto) {
    const userPostImgsBox = createContentElement(
      "div",
      postContainer,
      "user-post-imgs-box",
      "user-post-imgs-box"
    );

    const userPosetImgFullsizeItem = createContentElement(
      "a",
      userPostImgsBox,
      "user-post-img-fullsize-item",
      "user-post-img-fullsize-item img-fullsize-item",
      userPhoto.url
    );

    userPosetImgFullsizeItem.photoId = userPhoto.id;

    createContentElement(
      "img",
      userPosetImgFullsizeItem,
      "user-post-img-item",
      "user-post-img-item",
      userPhoto.url
    );
  }

  const userPostTextBox = createContentElement(
    "div",
    postContainer,
    "user-post-text-box",
    "user-post-text-box"
  );

  createContentElement(
    "h3",
    userPostTextBox,
    "user-post-header",
    "user-post-header",
    null,
    userPost.title
  );
  createContentElement(
    "p",
    userPostTextBox,
    "user-post-text-content",
    "user-post-text-content",
    null,
    userPost.body
  );

  const userPostRatingsBox = createContentElement(
    "div",
    postContainer,
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

  return postContainer;
}

function createContentElement(
  htmlType,
  container,
  id,
  className,
  src,
  text,
  html
) {
  const element = document.createElement(htmlType);

  if (id) {
    element.id = id;
  }

  if (className) {
    element.className = className;
  }

  if (src) {
    if (htmlType === "a") element.href = src;
    element.src = src;
  }

  if (text) {
    element.innerText = text;
  }

  if (html) {
    element.innerHTML = html;
  }

  container.append(element);

  return element;
}

function makeSpaceBetween(str) {
  return str + " ";
}
