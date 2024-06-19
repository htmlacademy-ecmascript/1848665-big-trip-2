import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';

const tripInfoContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const boardContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();

const boardPresenter = new BoardPresenter({
  tripInfoContainer,
  filtersContainer,
  boardContainer,
  pointsModel,
});

boardPresenter.init();
