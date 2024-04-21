import TripInfoView from './view/trip-info-view.js';
import FiltersView from './view/filters-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { RenderPosition, render } from './render.js';

const tripInfoContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({boardContainer: eventsContainer});

render(new TripInfoView(), tripInfoContainer, RenderPosition.AFTERBEGIN);
render(new FiltersView(), filtersContainer);

boardPresenter.init();
