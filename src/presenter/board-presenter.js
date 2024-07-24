import {DEFAULT_SORT_TYPE, DEFAULT_FILTER_TYPE, UpdateType, UserAction, EmptyListMessage, InfoMessageByAction, EMPTY_POINT, BlockerTimeLimit} from '../const.js';
import {filterPoints, sortPoints} from '../utils.js';
import {RenderPosition, remove, render} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import AdditionPointPresenter from './addition-point-presenter.js';
import EventsListView from '../view/events-list-view.js';
import TripInfoView from '../view/trip-info-view.js';
import NewPointButton from '../view/new-point-button-view.js';
import InfoMessage from '../view/info-message-view.js';
import SortView from '../view/sort-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class BoardPresenter {
  #headerContainer = null;
  #eventsContainer = null;
  #pointsModel = null;
  #filtersModel = null;

  #pointsPresenter = new Map();
  #currentSortType = DEFAULT_SORT_TYPE;
  #isFirstRender = false;
  #isLoading = true;
  #loadingComponent = null;
  #errorMessageComponent = null;

  #eventsListComponent = new EventsListView();
  #tripInfoComponent = new TripInfoView();
  #newPointButtonComponent = null;

  #eventsEmptyStateComponent = null;
  #sortComponent = null;
  #newPointPresenter = null;
  #uiBlocker = null;

  constructor({headerContainer, eventsContainer, pointsModel, filtersModel}) {
    this.#headerContainer = headerContainer;
    this.#eventsContainer = eventsContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#uiBlocker = new UiBlocker({
      lowerLimit: BlockerTimeLimit.LOWER_LIMIT,
      upperLimit: BlockerTimeLimit.UPPER_LIMIT
    });
  }

  init() {
    this.#renderNewPointButton();

    if (this.#isLoading) {
      remove(this.#errorMessageComponent);
      this.#loadingComponent = new InfoMessage({message: InfoMessageByAction.LOADING});
      render(this.#loadingComponent, this.#eventsContainer);
    } else {
      this.#renderBoard();
    }
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleAdditionModeChange = () => {
    if (this.#newPointPresenter !== null) {
      this.#newPointPresenter.resetView();
      this.#isFirstRender = false;
      this.#renderNewPointButton();
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_TASK:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
          this.#newPointPresenter.removeElement();
          this.#isFirstRender = false;
          this.#renderNewPointButton();
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_TASK:
        this.#pointsPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointsPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#sortComponent);
        this.#clearBoard();
        this.#renderErrorMessage();
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
    this.#handleModeChange();
  };

  #renderCreatePoint() {
    this.#newPointPresenter = new AdditionPointPresenter({
      eventsListComponent: this.#eventsListComponent,
      onDataChange: this.#handleViewAction,
      onCancelButtonClick: this.#handleCancelButtonClick,
    });
    this.#newPointPresenter.init({
      point: EMPTY_POINT,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
    });
    this.#isFirstRender = true;
    this.#renderNewPointButton();
  }

  #handleCancelButtonClick = () => {
    this.#isFirstRender = false;
    this.#renderNewPointButton();
    this.#newPointPresenter.resetView();
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
    this.#eventsEmptyStateComponent = new InfoMessage({message: EmptyListMessage[this.#filtersModel.filter.toUpperCase()]});
    render(this.#eventsEmptyStateComponent, this.#eventsContainer);
  }

  #renderErrorMessage() {
    this.#errorMessageComponent = new InfoMessage({message: InfoMessageByAction.ERROR});
    render(this.#errorMessageComponent, this.#eventsContainer);
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
      onAdditionModeChange: this.#handleAdditionModeChange,
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
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
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
