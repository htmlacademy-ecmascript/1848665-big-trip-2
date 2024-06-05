import AbstractView from '../framework/view/abstract-view.js';

function createFilters(array) {
  return array.map((element) => {
    const filterTitle = element.title;
    const filterValue = element.filter;
    const isChecked = element.title === 'Everything' ? 'checked' : '';
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filterValue}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterValue}" ${isChecked}>
        <label class="trip-filters__filter-label" for="filter-${filterValue}">${filterTitle}</label>
      </div>`
    );
  }).join('');
}

function createFiltersTemplate(filters) {
  const arrayFilters = filters.filters;
  return (
    `<form class="trip-filters" action="#" method="get">
      ${createFilters(arrayFilters)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #filtersModel = null;
  constructor({filtersModel}) {
    super();
    this.#filtersModel = filtersModel;
  }

  get template() {
    return createFiltersTemplate(this.#filtersModel);
  }
}
