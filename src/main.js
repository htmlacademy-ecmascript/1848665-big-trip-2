import BoardPresenter from './presenter/board-presenter.js';
import FiltersModel from './model/filters-model.js';
import SortingModel from './model/sort-model.js';
import PointsModel from './model/points-model.js';

const tripInfoContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const boardContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();
const sortingModel = new SortingModel();

const boardPresenter = new BoardPresenter({
  tripInfoContainer,
  filtersContainer,
  boardContainer,
  sortingModel,
  filtersModel,
  pointsModel,
});

boardPresenter.init();
