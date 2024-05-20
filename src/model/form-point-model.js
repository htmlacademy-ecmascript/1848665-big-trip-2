import {getRandomPoint} from '../mock/point.js';
import {mockDestination} from '../mock/destination.js';
import {mockOffers} from '../mock/offers.js';

export default class FormPointModel {
  formPoint = getRandomPoint();
  formDestination = mockDestination;
  formOffers = mockOffers;

  getFormPoint() {
    return this.formPoint;
  }

  getFormDestination() {
    return this.formDestination;
  }

  getFormOffers() {
    return this.formOffers;
  }
}
