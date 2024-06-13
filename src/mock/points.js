import {getRandomArrayElement} from '../utils.js';
import {nanoid} from 'nanoid';

const mockPoints = [
  {
    basePrice: 250,
    dateFrom: '2024-05-04T16:30:00.845Z',
    dateTo: '2024-05-04T21:30:00.375Z',
    destination: 'ccc4cc44-c4cc-4cc44-c44c-4c444c444c44',
    isFavorite: false,
    offers: [
      'x7x7x7x7-7777-77xx-x777-x777777xxx77',
    ],
    type: 'train'
  },
  {
    basePrice: 350,
    dateFrom: '2024-05-12T15:30:00.845Z',
    dateTo: '2024-05-12T17:30:00.375Z',
    destination: 'ddd5dd55-d5dd-5dd55-d55d-5d555d555d55',
    isFavorite: true,
    offers: [
      'm8m8m8m8-8888-88mm-m888-m888888mmm88',
      'v9v9v9v9-9999-99vv-v999-v999999vvv99',
    ],
    type: 'sightseeing'
  },
  {
    basePrice: 200,
    dateFrom: '2024-05-12T15:30:00.845Z',
    dateTo: '2024-05-12T17:30:00.375Z',
    destination: 'fff6ff66-f6ff-6f66-f66f-6f666f666f66',
    isFavorite: true,
    offers: [
      'x7x7x7x7-7777-77xx-x777-x777777xxx77',
    ],
    type: 'drive'
  },
  {
    basePrice: 100,
    dateFrom: '2024-05-14T13:00:00.845Z',
    dateTo: '2024-05-14T14:30:00.375Z',
    destination: 'ppp8pp88-p8pp-8h88-h88h-8h888h888h88',
    isFavorite: false,
    offers: [],
    type: 'restaurant'
  },
  {
    basePrice: 300,
    dateFrom: '2024-05-17T18:00:00.845Z',
    dateTo: '2024-05-17T19:30:00.375Z',
    destination: 'hhh7hh77-h7hh-7h77-h77h-7h777h777h77',
    isFavorite: true,
    offers: [
      'x7x7x7x7-7777-77xx-x777-x777777xxx77',
    ],
    type: 'check-in'
  },
];

function getRandomPoint() {
  return {
    id: nanoid(),
    ...getRandomArrayElement(mockPoints),
  };
}

export {getRandomPoint};
