import {RenderPosition, render, replace, remove} from '../framework/render.js';
import EventsItemView from '../view/events-item-view.js';
import PointEditView from '../view/point-edit-view.js';
import {UserAction, UpdateType, Mode} from '../const.js';

export default class PointPresenter {
  #eventsListComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #destinations = null;
  #offers = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #formPointComponent = null;

  constructor({eventsListComponent, onDataChange, onModeChange, mode}) {
    this.#eventsListComponent = eventsListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#mode = mode;
  }

  init({point, destinations, offers}) {

    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevPointComponent = this.#pointComponent;
    const prevFormPointComponent = this.#formPointComponent;

    this.#pointComponent = new EventsItemView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#formPointComponent = new PointEditView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormArrowClick: this.#handleFormArrowClick,
      deleteFormClick: this.#handleDeleteClick,
    });

    if (prevPointComponent === null || prevFormPointComponent === null) {
      if (this.#mode === Mode.DEFAULT) {
        render(this.#pointComponent, this.#eventsListComponent.element);
        return;
      } else {
        render(this.#formPointComponent, this.#eventsListComponent.element, RenderPosition.AFTERBEGIN);
        return;
      }
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#formPointComponent, prevFormPointComponent);
    }

    if (this.#mode === Mode.NEW) {
      this.#replaceFormToCard();
      replace(this.#formPointComponent, prevFormPointComponent);
      this.#mode = Mode.EDITING;
    }

    remove(prevPointComponent);
    remove(prevFormPointComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleDeleteClick = () => {
    this.#handleDataChange(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      this.#point,
      this.#destinations,
      this.#offers,
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
      this.#destinations,
      this.#offers,
    );
  };

  #handleFormSubmit = (point) => {
    this.#replaceFormToCard();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      {...point},
      this.#destinations,
      this.#offers,
    );
  };

  #handleFormArrowClick = () => {
    this.#replaceFormToCard();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formPointComponent);
  }

  #replaceCardToForm() {
    replace(this.#formPointComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#formPointComponent);
    this.#mode = Mode.DEFAULT;
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#formPointComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }
}
