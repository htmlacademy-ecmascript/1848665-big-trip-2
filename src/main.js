import {RenderPosition, render} from './framework/render.js';
import TripInfoView from './view/trip-info-view.js';
import FiltersView from './view/filters-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersModel from './model/filters-model.js';
import SortingModel from './model/sort-model.js';
import EventsMessageView from './view/events-message-view.js';

const tripInfoContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const filtersModel = new FiltersModel();
const sortingModel = new SortingModel();

const boardPresenter = new BoardPresenter({
  boardContainer: eventsContainer,
  pointsModel,
  sortingModel,
});

render(new FiltersView({
  filtersModel,
}), filtersContainer);

if (pointsModel.points.length === 0) {
  render(new EventsMessageView(), eventsContainer);
} else {
  render(new TripInfoView(), tripInfoContainer, RenderPosition.AFTERBEGIN);
  boardPresenter.init();
}
