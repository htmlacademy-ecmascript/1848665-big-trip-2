import {getRandomPoint} from '../mock/points.js';
import {mockDestinations} from '../mock/destinations.js';
import {mockOffers} from '../mock/offers.js';

const COUNT_POINTS = 4;

export default class PointsModel {
  #points = Array.from({length: COUNT_POINTS}, getRandomPoint);
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
