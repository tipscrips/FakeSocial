export { getUserData };
import { openUserProfile } from "./renderUserProfile.js";
import { usersProfiles } from "./cache.js";

let lastUser = null;

function searchError() {
  document.getElementById("content-flow").innerHTML =
    "<div id='error-container' class='error-container'><strong id='search-error' class='search-error'><p id='error-num'>404</p> user not found</strong></div>";
}

//let userCounter = 0;
let waiter = false;

async function getUserByUrl(url) {
  let user = await fetch(url)
    .then((resp) => resp.json())
    .catch((err) => (user = 404));

  if (user.length === 0) return (user = 404);

  return user[0];
}

async function searchUserByName(name) {
  let searchedUser;
  let checkCache = false;

  if (usersProfiles.size > 2) {
    const firstKey = usersProfiles.keys().next().value; // получаем ключ первого элемента

    usersProfiles.delete(firstKey);
  }

  for (let profile of usersProfiles) {
    if (profile.name === name) {
      searchedUser = profile;

      checkCache = true;

      break;
    }

    if (profile.username === name) {
      searchedUser = profile;

      checkCache = true;

      break;
    }
  }

  if (!searchedUser) {
    while (true) {
      let user = await getUserByUrl(
        `https://jsonplaceholder.typicode.com/users?username=${name}`
      );

      if (user === 404) {
        user = await getUserByUrl(
          `https://jsonplaceholder.typicode.com/users?name=${name}`
        );
      }

      if (user === 404) {
        lastUser = searchedUser;
        waiter = false;
        break;
      }

      searchedUser = user;

      if (searchedUser) break;
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
    if (lastUser.username === searchedUser.username) {
      console.log(1);
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

  currentUserProfile.name = user.name;
  currentUserProfile.username = user.username;
  currentUserProfile.userId = user.id;
  usersProfiles.add(user.username, currentUserProfile);
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
