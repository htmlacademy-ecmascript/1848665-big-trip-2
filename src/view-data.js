/**
 * @typedef {Object} FilterItem
 * @property {string} title - The filtering value title.
 * @property {string} value - The filtering value.
 * @property {boolean} defaultChecked - The default checked state.
 */

/**
 * @type {FilterItem[]}
 */
const filterItems = [
  {
    title: 'Everything',
    value: 'everything',
    defaultChecked: true,
  },
  {
    title: 'Future',
    value: 'future',
    defaultChecked: false,
  },
  {
    title: 'Present',
    value: 'present',
    defaultChecked: false,
  },
  {
    title: 'Past',
    value: 'past',
    defaultChecked: false,
  },
];

/**
 * @typedef {Object} PointType
 * @property {string} title - The type point title.
 * @property {string} value - The type point value.
 */

/**
 * @type {PointType[]}
 */
const pointTypes = [
  {
    title: 'Taxi',
    value: 'taxi',
  },
  {
    title: 'Bus',
    value: 'bus',
  },
  {
    title: 'Train',
    value: 'train',
  },
  {
    title: 'Ship',
    value: 'ship',
  },
  {
    title: 'Drive',
    value: 'drive',
  },
  {
    title: 'Flight',
    value: 'flight',
  },
  {
    title: 'Check-in',
    value: 'check-in',
  },
  {
    title: 'Sightseeing',
    value: 'sightseeing',
  },
  {
    title: 'Restaurant',
    value: 'restaurant',
  },
];

export {filterItems, pointTypes};
