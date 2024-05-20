import TripInfoView from './view/trip-info-view.js';
import FiltersView from './view/filters-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FormPointModel from './model/form-point-model.js';
import {RenderPosition, render} from './render.js';

const tripInfoContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const formPointModel = new FormPointModel();
const boardPresenter = new BoardPresenter({
  boardContainer: eventsContainer,
  pointsModel,
  formPointModel,
});

render(new TripInfoView(), tripInfoContainer, RenderPosition.AFTERBEGIN);
render(new FiltersView(), filtersContainer);

boardPresenter.init();
