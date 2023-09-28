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
    img.src = img.src; // перезапускаем загрузку изображения
    console.log(
      `Error loading image, reloading... (attempt ${img.reloadCount})`
    );
  }, 2000); // повторно запускаем загрузку через 5 секунд
}
