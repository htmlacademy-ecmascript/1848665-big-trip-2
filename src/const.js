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

const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

const DateFormats = {
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_TIME_FORMAT: 'YYYY-MM-DDTHH:mm',
  DATE_TIME_FORM_POINTS: 'YY/MM/DD HH:mm',
  MONTH_DATE_FORMAT: 'MMM DD',
  TIME_FORMAT: 'HH:mm',
};


export {pointTypes, SortType, DateFormats};
