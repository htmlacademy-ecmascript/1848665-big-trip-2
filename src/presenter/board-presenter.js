import {DEFAULT_SORT_TYPE, DEFAULT_FILTER_TYPE, UpdateType, UserAction, EmptyListMessage, EMPTY_POINT} from '../const.js';
import {filterPoints, sortPoints} from '../utils.js';
import {RenderPosition, remove, render} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import CreatePointPresenter from './create-point-presenter.js';

import EventsListView from '../view/events-list-view.js';
import TripInfoView from '../view/trip-info-view.js';
import NewPointButton from '../view/new-point-button-view.js';
import EventsEmptyStateView from '../view/events-empty-state-view.js';
import SortView from '../view/sort-view.js';

export default class BoardPresenter {
  #headerContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #filtersModel = null;

  #boardDestinations = [];
  #boardOffers = [];
  #pointsPresenter = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;
  #isFirstRender = false;

  #eventsListComponent = new EventsListView();
  #tripInfoComponent = new TripInfoView();
  #newPointButtonComponent = null;

  #eventsEmptyStateComponent = null;
  #sortComponent = null;
  #newPointPresenter = null;

  constructor({headerContainer, eventsContainer, pointsModel, filtersModel}) {
    this.#headerContainer = headerContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderNewPointButton();
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];

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
        this.#newPointPresenter.removeElement();
        this.#isFirstRender = false;
        this.#renderNewPointButton();
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

  #handleNewPointButtonClick = () => {
    this.#currentSortType = DEFAULT_SORT_TYPE;
    this.#filtersModel.setFilter(UpdateType.MINOR, DEFAULT_FILTER_TYPE);
    this.#renderCreatePoint();
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderCreatePoint() {
    this.#newPointPresenter = new CreatePointPresenter({
      eventsListComponent: this.#eventsListComponent,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onCancelButtonClick: this.#handleCancelButtonClick,
    });
    this.#newPointPresenter.init({
      point: EMPTY_POINT,
      destinations: this.#boardDestinations,
      offers: this.#boardOffers,
    });
    this.#isFirstRender = true;
    this.#renderNewPointButton();
  }

  #handleCancelButtonClick = () => {
    this.#isFirstRender = false;
    this.#renderNewPointButton();
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderNewPointButton() {
    const prevNewPointButtonComponent = this.#newPointButtonComponent;
    if (prevNewPointButtonComponent) {
      remove(prevNewPointButtonComponent);
    }
    this.#newPointButtonComponent = new NewPointButton({
      onClick: this.#handleNewPointButtonClick,
      isDisabled: this.#isFirstRender,
    });
    render(this.#newPointButtonComponent, this.#headerContainer);
  }

  #renderEventsEmptyState() {
    this.#eventsEmptyStateComponent = new EventsEmptyStateView({message: EmptyListMessage[this.#filtersModel.filter.toUpperCase()]});
    render(this.#eventsEmptyStateComponent, this.#eventsContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortComponent, this.#eventsContainer);
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

  #renderBoard() {
    const filteredPoints = filterPoints(this.#filtersModel.filter, this.#pointsModel.points);
    if (filteredPoints.length === 0) {
      this.#renderEventsEmptyState();
      return;
    }
    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
    this.#renderSort();
    render(this.#eventsListComponent, this.#eventsContainer);
    sortPoints(this.#currentSortType, filteredPoints);
    filteredPoints.forEach((point) => this.#renderPoint({
      point: point,
      destinations: this.#boardDestinations,
      offers: this.#boardOffers
    }));
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#eventsEmptyStateComponent);

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }
}
