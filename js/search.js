import { openUserProfile } from "./renderUserProfile.js";
import { usersProfiles } from "./cache.js";

let lastUser = null;

function searchError() {
  document.getElementById("content-flow").innerHTML =
    "<div id='error-container' class='error-container'><strong id='search-error' class='search-error'><p id='error-num'>404</p> user not found</strong></div>";
}

let userCounter = 0;
let waiter = false;

async function load2Users(url) {
  const users = [];

  for (let i = 1; i <= 2; i++) {
    ++userCounter;
    const respone = await fetch(url + userCounter).catch(
      (err) => (users = 404)
    );

    if (!respone.ok) {
      return respone.status;
    }

    const user = await respone.json().catch((err) => (users = 404));
    users.push(user);
  }

  return users;
}

async function searchUserByName(name) {
  let searchedUser;
  let checkCache = false;

  if (usersProfiles.size > 2) {
    const firstKey = usersProfiles.keys().next().value; // получаем ключ первого элемента

    usersProfiles.delete(firstKey);
  }
  for (let [key, value] of usersProfiles) {
    if (key === name.toLowerCase()) {
      value.name = key;
      searchedUser = value;

      checkCache = true;
      break;
    }
  }

  if (!searchedUser) {
    while (true) {
      let users = await load2Users(
        `https://jsonplaceholder.typicode.com/users/`
      );

      if (users === 404) {
        lastUser = searchedUser;
        waiter = false;
        userCounter = 0;
        break;
      }

      for (let user of users) {
        if (user.name === name) {
          searchedUser = user;
          break;
        }
      }

      if (searchedUser) {
        userCounter = 0;
        break;
      }
    }
  }

  if (!searchedUser) {
    lastUser = searchedUser;
    checkCache = false;
    waiter = false;
    searchError();
    return;
  }

  if (lastUser) {
    if (lastUser.name.toLowerCase() === searchedUser.name.toLowerCase()) {
      checkCache = false;
      waiter = false;
      return;
    }
  }

  if (checkCache) {
    openUserProfile(searchedUser);
    checkCache = false;
    waiter = false;
    lastUser = searchedUser;
    return;
  }

  getUserData(searchedUser);

  lastUser = searchedUser;
  checkCache = false;
  waiter = false;
}

async function getUserData(user) {
  const userPhotosArray = await await loadUserData(
    `https://jsonplaceholder.typicode.com/albums/${user.id}/photos`
  );

  const userPostsArray = await loadUserData(
    `https://jsonplaceholder.typicode.com/user/${user.id}/posts`
  );

  const userAvatar = userPhotosArray[0];

  let currentUserProfile = openUserProfile(
    null,
    user,
    userAvatar,
    userPhotosArray,
    userPostsArray
  );

  usersProfiles.set(user.name.toLowerCase(), currentUserProfile);
}

async function loadUserData(url) {
  let currentData;
  const respone = await fetch(url);

  await respone.json().then((data) => (currentData = data));

  return currentData;
}

const menuStartSearching = document.getElementById("menu-start-searching-btn");
const menuInputStartSearchingByEnter =
  document.getElementById("menu-search-value");

menuInputStartSearchingByEnter.onkeydown = async function (e) {
  if (e.code === "Enter") {
    e.preventDefault(); // отменяем стандартное поведение браузера
    menuStartSearching.click(); // симулируем нажатие на кнопку поиска
  }
};

menuStartSearching.onclick = async function (e) {
  e.preventDefault();

  if (waiter) return;

  waiter = true;
  const menuSearchValue = document.getElementById("menu-search-value").value;

  if (!menuSearchValue || menuSearchValue === "") {
    waiter = false;
    return;
  }
  await searchUserByName(menuSearchValue);
};
