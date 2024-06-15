import dayjs from 'dayjs';

// Форматирует объекты даты в строку в указанном формате
function humanizePointDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function sortByDate(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortByDuration(pointA, pointB) {
  const durationPointA = getPointDuration(pointA);
  const durationPointB = getPointDuration(pointB);
  return durationPointB - durationPointA;
}

function getPointDuration(point) {
  return dayjs(point.dateTo).diff(dayjs(point.dateFrom));
}

function sortByPrice(pointA, pointB) {
  const pricePointA = pointA.basePrice;
  const pricePointB = pointB.basePrice;
  return pricePointB - pricePointA;
}

function getRandomNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

// Возвращает случайный элемент массива
function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function updateItem(items, update) {
  return items.map((item) => (item.id === update.id ? update : item));
}

// Форматирует длительность между двумя датами в строку времени в указанном формате
function humanizePointDuration(dateFrom, dateTo) {
  if (dateFrom && dateTo) {
    // Вычисляет длительность в минутах
    const duration = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

    // Форматирует длительность в часы и минуты
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minute = duration % 60;
      return `0${hours}H ${minute || '00'}M`;
    }
    return `${duration}M`;
  }
  return '';
}

function isPointFavorite(isFavorite) {
  return isFavorite ? 'event__favorite-btn--active' : '';
}

export {
  getRandomNumber,
  getRandomArrayElement,
  humanizePointDate,
  humanizePointDuration,
  updateItem,
  isPointFavorite,
  sortByDate,
  sortByDuration,
  sortByPrice
};
