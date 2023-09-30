export { loadUserData };
import { openUserProfile } from "./renderUserProfile.js";
import { usersProfiles } from "./cache.js";

let lastUser = null;
let waiter = false;

function searchError() {
  document.getElementById("content-flow").innerHTML =
    "<div id='error-container' class='error-container'><strong id='search-error' class='search-error'><p id='error-num'>404</p> user not found</strong></div>";
}

async function getUserByUrl(url) {
  let user;

  user = await fetch(url)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

  if (user.length === 0) return (user = 404);

  return user[0];
}

function checkCache(username) {
  let foundProfile;

  for (let profile of usersProfiles.keys()) {
    if (profile.name === username) {
      foundProfile = profile;
      break;
    }

    if (profile.username === username) {
      foundProfile = profile;
      break;
    }
  }

  return foundProfile;
}

async function searchUserByName(name) {
  document.querySelector(".content-flow").classList.add("user-page");
  if (lastUser) {
    if (lastUser.username === name || lastUser.name === name) {
      doCache = false;
      waiter = false;
      return;
    }
  }

  let searchedUser;
  let doCache = false;

  if (usersProfiles.size > 1) {
    if (usersProfiles.size > 2) {
      const firstValue = usersProfiles.values().next().value;

      usersProfiles.delete(firstValue);
    }

    searchedUser = await checkCache(name);

    if (searchedUser) doCache = true;
  }

  if (!searchedUser) {
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
    } else {
      searchedUser = user;
    }
  }

  if (!searchedUser) {
    lastUser = searchedUser;
    doCache = false;
    waiter = false;
    searchError();
    return;
  }

  if (doCache) {
    openUserProfile(searchedUser);
    doCache = false;
    waiter = false;
    lastUser = searchedUser;
    return;
  }

  getUserData(searchedUser);

  lastUser = searchedUser;
  doCache = false;
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
  usersProfiles.add(currentUserProfile);
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
    e.preventDefault();
    menuStartSearching.click();
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
