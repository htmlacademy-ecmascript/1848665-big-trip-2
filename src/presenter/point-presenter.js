import {UserAction, UpdateType, Mode} from '../const.js';
import {render, replace, remove} from '../framework/render.js';
import EventsItemView from '../view/events-item-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class PointPresenter {
  #eventsListComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #handleAdditionModeChange = null;

  #point = null;
  #destinations = null;
  #offers = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #formPointComponent = null;

  constructor({eventsListComponent, onDataChange, onModeChange, onAdditionModeChange}) {
    this.#eventsListComponent = eventsListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#handleAdditionModeChange = onAdditionModeChange;
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

    this.#formPointComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormArrowClick: this.#handleFormArrowClick,
      deleteFormClick: this.#handleDeleteClick,
    });

    if (prevPointComponent === null || prevFormPointComponent === null) {
      render(this.#pointComponent, this.#eventsListComponent.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#formPointComponent, prevFormPointComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevFormPointComponent);
  }

  #resetForm() {
    this.#formPointComponent.reset(this.#point);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#resetForm();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      point,
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
    this.#handleDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      point,
      this.#destinations,
      this.#offers,
    );
    this.#resetForm();
    this.#replaceFormToCard();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormArrowClick = () => {
    this.#resetForm();
    this.#replaceFormToCard();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formPointComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#formPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#formPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#formPointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#formPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formPointComponent.shake(resetFormState);
  }

  #replaceCardToForm() {
    replace(this.#formPointComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#handleAdditionModeChange();
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
