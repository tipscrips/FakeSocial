export { addReloadHandlerToImages };

function addReloadHandlerToImages(element = null) {
  if (element) {
    element = element.onerror = reloadImage;
  } else {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      img.onerror = reloadImage;
    });
  }
}

function reloadImage(event) {
  const img = event.target;
  if (!img.reloadCount) {
    img.reloadCount = 1;
  } else if (img.reloadCount > 1000) {
    return;
  } else {
    img.reloadCount++;
  }
  setTimeout(() => {
    img.src = img.src;
    console.log(
      `Error loading image, reloading... (attempt ${img.reloadCount})`
    );
  }, 0);
}
