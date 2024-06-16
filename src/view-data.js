/**
 * @typedef {Object} SortItem
 * @property {string} title - The sorting value title.
 * @property {string} value - The sorting value.
 * @property {boolean} defaultChecked - The default checked state.
 * @property {boolean} disabled - The disabled state.
 */

/**
 * @type {SortItem[]}
 */
const sortItems = [
  {
    title: 'Day',
    value: 'day',
    defaultChecked: true,
    disabled: false,
  },
  {
    title: 'Event',
    value: 'event',
    defaultChecked: false,
    disabled: true,
  },
  {
    title: 'Time',
    value: 'time',
    defaultChecked: false,
    disabled: false,
  },
  {
    title: 'Price',
    value: 'price',
    defaultChecked: false,
    disabled: false,
  },
  {
    title: 'Offer',
    value: 'offer',
    defaultChecked: false,
    disabled: true,
  },
];

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

export {sortItems, filterItems};
