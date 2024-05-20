import dayjs from 'dayjs';

const getRandomNumber = () => Math.floor(Math.random() * 10) + 1;

// Определяют форматы даты и времени
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
const DATE_TIME_FORM_POINTS = 'YY/MM/DD HH:mm';
const MONTH_DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';

// Возвращает случайный элемент массива
const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

// Форматирует объекты даты в строку в указанном формате
const humanizePointDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';

const humanizePointDateTime = (date) => date ? dayjs(date).format(DATE_TIME_FORMAT) : '';

const humanizePointDateTimeFormPoints = (date) => date ? dayjs(date).format(DATE_TIME_FORM_POINTS) : '';

const humanizePointMonthDate = (date) => date ? dayjs(date).format(MONTH_DATE_FORMAT) : '';

const humanizePointTime = (date) => date ? dayjs(date).format(TIME_FORMAT) : '';


// Форматирует длительность между двумя датами в строку времени в указанном формате
const humanizePointDuration = (dateFrom, dateTo) => {
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
};

const isPointFavorite = (isFavorite) => isFavorite ? 'event__favorite-btn--active' : '';

export {getRandomNumber, getRandomArrayElement, humanizePointDate, humanizePointDateTime, humanizePointDateTimeFormPoints, humanizePointMonthDate, humanizePointTime, humanizePointDuration, isPointFavorite };
