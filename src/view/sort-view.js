import AbstractView from '../framework/view/abstract-view.js';

const disabledTypes = ['Event', 'Offer'];

function createSorting(arraySorting) {
  return arraySorting.map((element) => {
    const sortingTitle = element.title;
    const isDisabled = disabledTypes.includes(element.title) ? 'disabled' : '';
    const isChecked = element.title === 'Day' ? 'checked' : '';
    const sortingValue = element.value;
    return (
      `<div class="trip-sort__item trip-sort__item--${sortingValue}">
        <input id="sort-${sortingValue}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${sortingValue}" ${isChecked} ${isDisabled}>
        <label class="trip-sort__btn" for="sort-${sortingValue}">${sortingTitle}</label>
      </div>`
    );
  }).join('');
}

function createSortTemplate(sorting) {
  const arraySorting = sorting.sorting;
  return (
    `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${createSorting(arraySorting)}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #sortingModel = null;
  #handleSortTypeChange = null;

  constructor({sortingModel, onSortTypeChange}) {
    super();
    this.#sortingModel = sortingModel;
    this.#handleSortTypeChange = onSortTypeChange;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sortingModel);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#handleSortTypeChange(evt.target.value);
  };
}
