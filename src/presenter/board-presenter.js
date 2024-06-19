import {updateItem, sortByDate, sortByDuration, sortByPrice} from '../utils.js';
import {RenderPosition, render} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EventsMessageView from '../view/events-message-view.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../const.js';

export default class BoardPresenter {
  #tripInfoContainer = null;
  #filtersContainer = null;
  #boardContainer = null;
  #pointsModel = null;

  #boardPoints = [];
  #boardDestinations = [];
  #boardOffers = [];
  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #filtersComponent = null;

  #eventsListComponent = new EventsListView();
  #tripInfoComponent = new TripInfoView();
  #noPointsComponent = new EventsMessageView();

  constructor({tripInfoContainer, filtersContainer, boardContainer, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filtersContainer = filtersContainer;
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#sortTasks(this.#currentSortType);
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];
    this.#sortComponent = new SortView({onSortTypeChange: this.#handleClickSort});
    this.#filtersComponent = new FiltersView();

    this.#renderBoard();
  }


  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointsPresenter.get(updatedPoint.id).init({point: updatedPoint, destinations:this.#boardDestinations, offers: this.#boardOffers});
  };

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #sortTasks = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints.sort(sortByDate);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortByDuration);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortByPrice);
        break;
    }
    this.#currentSortType = sortType;
  };

  #handleClickSort = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
    this.#clearPointsList();
    this.#renderPoints();
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
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init({point, destinations, offers});
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
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

    this.#renderPoints();
  }
}
