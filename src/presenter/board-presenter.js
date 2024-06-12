import {updateItem} from '../utils.js';
import {RenderPosition, render} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EventsMessageView from '../view/events-message-view.js';
import PointPresenter from './point-presenter.js';

export default class BoardPresenter {
  #tripInfoContainer = null;
  #filtersContainer = null;
  #boardContainer = null;
  #sortingModel = null;
  #filtersModel = null;
  #pointsModel = null;

  #boardPoints = [];
  #boardDestinations = [];
  #boardOffers = [];
  #pointsPresenter = new Map();
  #sortComponent = null;
  #filtersComponent = null;

  #eventsListComponent = new EventsListView();
  #tripInfoComponent = new TripInfoView();
  #noPointsComponent = new EventsMessageView();

  constructor({tripInfoContainer, filtersContainer, boardContainer, sortingModel, filtersModel, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filtersContainer = filtersContainer;
    this.#boardContainer = boardContainer;
    this.#sortingModel = sortingModel;
    this.#filtersModel = filtersModel;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];
    this.#sortComponent = new SortView({sortingModel: this.#sortingModel});
    this.#filtersComponent = new FiltersView({filtersModel: this.#filtersModel});

    this.#renderBoard();
  }

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderFilters() {
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#boardContainer);
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#boardContainer);
  }

  #renderPoint({point, destinations, offers}) {
    const pointPresenter = new PointPresenter({
      eventsListComponent: this.#eventsListComponent,
      onDataChange: this.#handlePointChange,
    });
    pointPresenter.init({point, destinations, offers});
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #renderPoits() {
    this.#boardPoints.forEach((point) => {
      this.#renderPoint({point: point, destinations: this.#boardDestinations, offers: this.#boardOffers});
    });
  }

  #clearPointsList() {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
  }

  #renderPointsList() {
    render(this.#eventsListComponent, this.#boardContainer);
  }

  #renderBoard() {
    this.#renderFilters();
    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }
    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    this.#renderSort();
    this.#renderPointsList();

    this.#renderPoits();
  }
}
