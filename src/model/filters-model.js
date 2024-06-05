import {mockFilters} from '../mock/filters.js';

export default class FiltersModel {
  #filters = mockFilters;

  get filters() {
    return this.#filters;
  }
}
