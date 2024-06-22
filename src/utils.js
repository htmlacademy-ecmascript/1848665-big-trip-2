import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

/**
 * @returns {number}
 */
function getRandomNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

/**
 * @param {Array} items
 * @returns {*}
 */
function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * @param {Array} items
 * @param {object} update
 * @returns {Array}
 */
function updateItem(items, update) {
  return items.map((item) => (item.id === update.id ? update : item));
}

/**
 * @param {object} date
 * @param {string} format
 * @returns {string}
 */
function humanizePointDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}
/**
 * @param {object} durationObj
 * @returns {string}
 */
function formatedDuration(durationObj) {
  const days = Math.floor(durationObj.asDays());
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();

  if (days === 0 && hours === 0 && minutes === 0) {
    return '00D 00H 01M';
  }

  return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
}

/**
 * @param {string} dateFrom
 * @param {string} dateTo
 * @returns {string}
 */
function humanizePointDuration(dateFrom, dateTo) {
  const startDate = dayjs(dateFrom);
  const endDate = dayjs(dateTo);
  const durationDiff = dayjs.duration(endDate.diff(startDate));
  return formatedDuration(durationDiff);
}

/**
 * @param {object} pointA
 * @param {object} pointB
 * @returns {number}
 */
function sortByDate(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

/**
 * @param {object} point
 * @returns {number}
 */
function getPointDuration(point) {
  return dayjs(point.dateTo).diff(dayjs(point.dateFrom));
}

/**
 * @param {object} pointA
 * @param {object} pointB
 * @returns {number}
 */
function sortByDuration(pointA, pointB) {
  const durationPointA = getPointDuration(pointA);
  const durationPointB = getPointDuration(pointB);
  return durationPointB - durationPointA;
}

/**
 * @param {object} pointA
 * @param {object} pointB
 * @returns {number}
 */
function sortByPrice(pointA, pointB) {
  const pricePointA = pointA.basePrice;
  const pricePointB = pointB.basePrice;
  return pricePointB - pricePointA;
}

/**
 * @param {boolean} isFavorite
 * @returns {string}
 */
function isPointFavorite(isFavorite) {
  return isFavorite ? 'event__favorite-btn--active' : '';
}

export {
  getRandomNumber,
  getRandomArrayElement,
  updateItem,
  humanizePointDate,
  humanizePointDuration,
  isPointFavorite,
  sortByDate,
  sortByDuration,
  sortByPrice
};
