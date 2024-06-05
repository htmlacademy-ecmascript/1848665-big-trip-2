import {mockSorting} from '../mock/sorting.js';

export default class SortingModel {
  #sorting = mockSorting;

  get sorting() {
    return this.#sorting;
  }
}
