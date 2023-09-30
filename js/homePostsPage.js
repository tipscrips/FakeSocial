import { getUserData } from "./search.js";
import { randomizer } from "./renderUserProfile.js";

async function getUsers(url) {
  let respons = await fetch(url);

  let users = await respons.json();

  let randomUserIndex = randomizer(10);
  console.log(users[0]);

  const contentFlow = document.querySelector(".temp-users-name");
}

getUsers("https://jsonplaceholder.typicode.com/users");
