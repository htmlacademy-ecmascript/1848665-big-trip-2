import AbstractView from '../framework/view/abstract-view.js';

function createSorting(arraySorting) {
  return arraySorting.map((element) => {
    const sortingTitle = element.title;
    const sortingValue = element.value;
    const isChecked = element.title === 'Day' ? 'Checked' : '';
    return (
      `<div class="trip-sort__item trip-sort__item--${sortingValue}">
        <input id="sort-${sortingValue}" class="trip-sort__input visually-hidden" type="radio" name="trip-sort" value="sort-${sortingValue}" ${isChecked}>
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
  constructor({sortingModel}) {
    super();
    this.#sortingModel = sortingModel;
  }

  get template() {
    return createSortTemplate(this.#sortingModel);
  }
}
