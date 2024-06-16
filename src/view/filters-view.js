import AbstractView from '../framework/view/abstract-view.js';
import {filterItems} from '../view-data.js';

/**
 * @param {import('../view-data.js').FilterItem[]} items
 * @returns {string}
 */
function createFilters(items) {
  return items.map((element) => {
    const isChecked = element.defaultChecked ? 'checked' : '';
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${element.value}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${element.value}" ${isChecked}>
        <label class="trip-filters__filter-label" for="filter-${element.value}">${element.title}</label>
      </div>`
    );
  }).join('');
}

/**
 * @param {import('../view-data.js').FilterItem[]} items
 * @returns {string}
 */
function createFiltersTemplate(items) {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${createFilters(items)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #filterItems = filterItems;
  constructor() {
    super();
  }

  get template() {
    return createFiltersTemplate(this.#filterItems);
  }
}
