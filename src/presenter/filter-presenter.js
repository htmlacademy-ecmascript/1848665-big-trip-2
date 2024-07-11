import {FilterType, UpdateType} from '../const.js';
import {filterPoints} from '../utils.js';
import {remove, replace, render} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';

export default class FilterPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  #filterComponent = null;

  constructor({filtersContainer, filtersModel, pointsModel}) {
    this.#container = filtersContainer;
    this.#filterModel = filtersModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);
  }

  get filters() {
    return Object.values(FilterType).map((name) => ({
      name: name,
      count: filterPoints(name, this.#pointsModel.points).length,
      isChecked: name === this.#filterModel.filter
    }));
  }

  init() {
    const previousFilterComponent = this.#filterComponent;

    const newFilterComponent = new FiltersView({filters: this.filters , onFilterChange: this.#handleFilterChange});

    if (previousFilterComponent === null) {
      render(newFilterComponent, this.#container);
    } else {
      replace(newFilterComponent, previousFilterComponent);
      remove(previousFilterComponent);
    }

    this.#filterComponent = newFilterComponent;
  }

  #handleFilterChange = (filterType) => {
    if (this.#filterModel.filter !== filterType) {
      this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
    }
  };

  #handleModelChange = () => {
    this.init();
  };
}
