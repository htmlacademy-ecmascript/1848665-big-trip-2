import dayjs from 'dayjs';

// Определяют форматы даты и времени
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const DATE_TIME_FORM_POINTS = 'YY/MM/DD HH:mm';
const MONTH_DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';

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

// Форматирует объекты даты в строку в указанном формате
function humanizePointDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function humanizePointDateTime(date) {
  return date ? dayjs(date).format(DATE_TIME_FORMAT) : '';
}

function humanizePointDateTimeFormPoints(date) {
  return date ? dayjs(date).format(DATE_TIME_FORM_POINTS) : '';
}

function humanizePointMonthDate(date) {
  return date ? dayjs(date).format(MONTH_DATE_FORMAT) : '';
}

function humanizePointTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
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

export {getRandomNumber, getRandomArrayElement, updateItem,humanizePointDate, humanizePointDateTime, humanizePointDateTimeFormPoints, humanizePointMonthDate, humanizePointTime, humanizePointDuration, isPointFavorite };
