export { reloadImage };

function reloadImage(img) {
  if (!img.reloadCount) {
    img.reloadCount = 1;
  } else if (img.reloadCount > 10) {
    // ограничение количества перезагрузок до 10
    console.error("Ошибка загрузки изображения, превышено ограничение попыток");
    return;
  } else {
    img.reloadCount++;
  }
  setTimeout(() => {
    img.src = img.src; // перезапускаем загрузку изображения
    console.log(
      `Ошибка загрузки изображения, перезагрузка ... (попытка ${img.reloadCount})`
    );
  }, 5000); // повторно запускаем загрузку через 5 секунд
}
