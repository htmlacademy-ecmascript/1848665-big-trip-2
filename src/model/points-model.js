import {getRandomPoint} from '../mock/point.js';
import {mockDestination} from '../mock/destination.js';
import {mockOffers} from '../mock/offers.js';

const COUNT_POINTS = 3;

export default class PointsModel {
  points = Array.from({length: COUNT_POINTS}, getRandomPoint);
  destination = mockDestination;
  offers = mockOffers;

  getPoints() {
    return this.points;
  }

  getDestination() {
    return this.destination;
  }

  getOffers() {
    return this.offers;
  }
}
