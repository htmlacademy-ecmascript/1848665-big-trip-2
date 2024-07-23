import {ApiMethod} from './const.js';
import ApiService from './framework/api-service.js';

export default class EventsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: ApiMethod.PUT,
      body: JSON.stringify(this.#adaptPointToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptPointToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': parseInt(point.basePrice, 10),
      'date_to': point.dateTo,
      'date_from': point.dateFrom,
      'is_favorite': point.isFavorite
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.isFavorite;
    return adaptedPoint;
  }

}
