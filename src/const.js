/**
 * @fileoverview Constants and enums used throughout the event planning application
 * @module EventConstants
 */

/**
 * @type {string[]}
 * @description Array of available point types for events
 */
const pointTypes = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

/**
 * @enum {string}
 * @description Date format constants used in the application
 */
const DateFormat = {
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_TIME_FORMAT: 'YYYY-MM-DDTHH:mm',
  DATE_TIME_FORM_POINTS: 'YY/MM/DD HH:mm',
  MONTH_DATE_FORMAT: 'MMM DD',
  TIME_FORMAT: 'HH:mm',
};

/**
 * @enum {string}
 * @description Messages displayed when the event list is empty
 */
const EmptyListMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
};

/**
 * @enum {string}
 */
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

/**
 * @enum {string}
 */
const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

/**
 * @enum {string}
 */
const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST',
};

/**
 * @typedef {Object} SortingTypeItem
 * @property {string} name - The name of the sorting type
 * @property {boolean} isDisabled - Whether the sorting type is disabled
 */

/**
 * @type {Object.<string, SortingTypeItem>}
 * @description Sorting types available for events, with their disabled status
 */
const SortingType = {
  DAY: {name: 'day', isDisabled: false},
  EVENT: {name: 'event', isDisabled: true},
  TIME: {name: 'time', isDisabled: false},
  PRICE: {name: 'price', isDisabled: false},
  OFFER: {name: 'offer', isDisabled: true},
};

/**
 * @type {string}
 * @description Default filter type used when initializing the application
 */
const DEFAULT_FILTER_TYPE = FilterType.EVERYTHING;

/**
 * @type {string}
 * @description Default sort type used when initializing the application
 */
const DEFAULT_SORT_TYPE = SortingType.DAY.name;

export {
  pointTypes,
  DateFormat,
  EmptyListMessage,
  UpdateType,
  UserAction,
  FilterType,
  SortingType,
  DEFAULT_FILTER_TYPE,
  DEFAULT_SORT_TYPE,
};
