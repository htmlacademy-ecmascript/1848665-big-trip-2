import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {FilterType, SortingType} from './const.js';

dayjs.extend(isBetween);

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
 * @param {object} date
 * @param {string} format
 * @returns {string}
 */
function humanizePointDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

/**
 * @param {string} dateFrom
 * @param {string} dateTo
 * @returns {string}
 */
function humanizePointDuration(dateFrom, dateTo) {
  if (dateFrom && dateTo) {
    const duration = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minute = duration % 60;
      return `0${hours}H ${minute || '00'}M`;
    }
    return `${duration}M`;
  }
  return '';
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

/**
 * @param {string} name
 * @param {array} points
 * @returns {array}
 */
const filterPoints = (name, points) => {
  switch (name) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return points.filter((item) => dayjs().isBefore(dayjs(item.dateFrom)));
    case FilterType.PRESENT:
      return points.filter((item) => dayjs().isBetween(dayjs(item.dateTo), dayjs(item.dateFrom)));
    case FilterType.PAST:
      return points.filter((item) => dayjs().isAfter(dayjs(item.dateTo)));
  }
};

/**
 * @param {string} name
 * @param {array} points
 * @returns {array}
 */
const sortPoints = (name, points) => {
  switch (name) {
    case SortingType.DAY.name:
      return points.sort(sortByDate);
    case SortingType.TIME.name:
      return points.sort(sortByDuration);
    case SortingType.PRICE.name:
      return points.sort(sortByPrice);
  }
  return points;
};

export {
  getRandomNumber,
  getRandomArrayElement,
  humanizePointDate,
  humanizePointDuration,
  isPointFavorite,
  filterPoints,
  sortPoints,
};
