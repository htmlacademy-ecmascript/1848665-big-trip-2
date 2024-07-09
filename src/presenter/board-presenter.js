import {sortByDate, sortByDuration, sortByPrice} from '../utils.js';
import {RenderPosition, remove, render} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EventsMessageView from '../view/events-message-view.js';
import PointPresenter from './point-presenter.js';
import NewEventButton from '../view/new-event-button-view.js';
import {SortingType, DEFAULT_SORT_TYPE, UpdateType, UserAction} from '../const.js';

export default class BoardPresenter {
  #tripInfoContainer = null;
  #filtersContainer = null;
  #boardContainer = null;
  #pointsModel = null;

  #boardDestinations = [];
  #boardOffers = [];
  #pointsPresenter = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;
  #sortComponent = null;
  #filtersComponent = null;
  #newEventButtonComponent = null;

  #eventsListComponent = new EventsListView();
  #tripInfoComponent = new TripInfoView();
  #noPointsComponent = new EventsMessageView();

  constructor({tripInfoContainer, filtersContainer, boardContainer, pointsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#filtersContainer = filtersContainer;
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortingType.DAY.name:
        return [...this.#pointsModel.points].sort(sortByDate);
      case SortingType.TIME.name:
        return [...this.#pointsModel.points].sort(sortByDuration);
      case SortingType.PRICE.name:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }
    return this.#pointsModel.points;
  }

  init() {
    this.#renderNewEventButton();
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];
    this.#filtersComponent = new FiltersView();

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (name) => {
    if (this.#currentSortType !== name) {
      this.#currentSortType = name;
      this.#clearBoard();
      this.#renderBoard();
    }
  };

  #renderFilters() {
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortComponent, this.#boardContainer);
  }

  #renderNoPoints() {
    render(this.#noPointsComponent, this.#boardContainer);
  }

  #renderNewEventButton() {
    if (this.#newEventButtonComponent === null) {
      this.#newEventButtonComponent = new NewEventButton();
      render(this.#newEventButtonComponent, this.#tripInfoContainer);
    }
  }

  #renderPoint({point, destinations, offers}) {
    const pointPresenter = new PointPresenter({
      eventsListComponent: this.#eventsListComponent,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init({point, destinations, offers});
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint({point: point, destinations: this.#boardDestinations, offers: this.#boardOffers}));
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #renderBoard() {
    this.#renderFilters();
    if (this.#pointsModel.points.length === 0) {
      this.#renderNoPoints();
      return;
    }
    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    this.#renderSort();
    render(this.#eventsListComponent, this.#boardContainer);

    this.#renderPoints(this.#pointsModel.points);
  }
}
