import AbstractView from '../framework/view/abstract-view.js';
import {sortItems} from '../view-data.js';

function createSorting(items) {
  return items.map((element) => {
    const isDisabled = element.disabled ? 'disabled' : '';
    const isChecked = element.defaultChecked ? 'checked' : '';
    return (
      `<div class="trip-sort__item trip-sort__item--${element.value}">
        <input id="sort-${element.value}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${element.value}" ${isDisabled} ${isChecked}>
        <label class="trip-sort__btn" for="sort-${element.value}">${element.title}</label>
      </div>`
    );
  }).join('');
}

function createSortTemplate(items) {
  return (
    `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${createSorting(items)}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #sortItems = sortItems;
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sortItems);
  }

  #sortTypeChangeHandler = (evt) => {
    this.#handleSortTypeChange(evt.target.value);
  };
}
