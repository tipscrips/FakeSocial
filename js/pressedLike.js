document.addEventListener("click", pressLike);

function pressLike(e) {
  const likeIcon = e.target.closest(".post-like-icon");

  if (!likeIcon) return;

  const likeBtn = likeIcon.closest(".user-post-ratings-button");
  const currentPost = likeBtn.closest(".user-post-container");
  const currentImgBox = likeBtn.closest(".opened-img-box");

  let currentItem;
  let userPostOwnerLogin = null;

  if (currentPost) {
    currentItem = currentPost;
    userPostOwnerLogin = currentItem.querySelector(
      ".user-post-info-login"
    ).innerHTML;
  }

  if (currentImgBox) {
    currentItem = currentImgBox;
  }

  const postId =
    currentItem.postId || currentItem.querySelector(".full-size-img").photoId;

  if (likeIcon.classList.contains("not-liked")) {
    likeBtn.innerHTML =
      '<ion-icon class="post-like-icon liked" name="heart"></ion-icon>';

    dataToServer(
      null,
      postId,
      userPostOwnerLogin,
      "user-liked-post",
      "application/json; charset=UTF-8",
      "https://jsonplaceholder.typicode.com/posts"
    )
      .then((r) => r.json())
      .then((r) => console.log(r));
  } else {
    likeBtn.innerHTML =
      '<ion-icon class="post-like-icon not-liked" name="heart-outline"></ion-icon>';

    dataToServer(
      null,
      postId,
      userPostOwnerLogin,
      "user-unliked-post",
      "application/json; charset=UTF-8",
      "https://jsonplaceholder.typicode.com/posts"
    )
      .then((r) => r.json())
      .then((r) => console.log(r));
  }
}

async function dataToServer(
  user,
  postId,
  userOwnerLogin,
  title,
  contentType,
  url
) {
  let respone = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      title: title,
      body: {
        postId: postId,
      },
      userId: userOwnerLogin,
    }),
    headers: {
      "Content-type": contentType,
    },
  });

  return respone;
}
