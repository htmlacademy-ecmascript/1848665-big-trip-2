const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

const DateFormat = {
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_TIME_FORMAT: 'YYYY-MM-DDTHH:mm',
  DATE_TIME_FORM_POINTS: 'YY/MM/DD HH:mm',
  MONTH_DATE_FORMAT: 'MMM DD',
  TIME_FORMAT: 'HH:mm',
};

const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST'
};

const SortingType = {
  DAY: {name: 'day', isDisabled: false},
  EVENT: {name: 'event', isDisabled: true},
  TIME: {name: 'time', isDisabled: false},
  PRICE: {name: 'price', isDisabled: false},
  OFFER: {name: 'offer', isDisabled: true}
};

const DEFAULT_SORT_TYPE = SortingType.DAY.name;
const DEFAULT_FILTER_TYPE = FilterType.EVERYTHING;

export {
  SortType,
  DateFormat,
  UpdateType,
  UserAction,
  FilterType,
  SortingType,
  DEFAULT_SORT_TYPE,
  DEFAULT_FILTER_TYPE,
};
