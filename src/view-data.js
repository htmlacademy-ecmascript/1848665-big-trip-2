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
