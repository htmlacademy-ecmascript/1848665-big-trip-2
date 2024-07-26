import {UserAction, UpdateType} from '../const.js';
import {RenderPosition, render, replace, remove} from '../framework/render.js';
import AbstractView from '../framework/view/abstract-view.js';
import AdditionPointView from '../view/addition-point-view.js';

export default class AdditionPointPresenter extends AbstractView {
  #additionPointComponent = null;
  #eventsListComponent = null;
  #handleDataChange = null;
  #handleCancelForm = null;

  #point = null;
  #destinations = null;
  #offers = null;

  constructor({eventsListComponent, onDataChange, onCancelClick}) {
    super();
    this.#eventsListComponent = eventsListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleCancelForm = onCancelClick;
  }

  init({point, destinations, offers}) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevAdditionPointComponent = this.#additionPointComponent;

    this.#additionPointComponent = new AdditionPointView({
      point: this.#point,
      availableDestinations: this.#destinations,
      availableOffers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onCancelForm: this.#cancelFormHandler,
    });

    if (prevAdditionPointComponent === null) {
      render(this.#additionPointComponent, this.#eventsListComponent.element, RenderPosition.AFTERBEGIN);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      return;
    }
    replace(this.#additionPointComponent, prevAdditionPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    remove(prevAdditionPointComponent);
  }

  setSaving() {
    this.#additionPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#additionPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#additionPointComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      point,
    );
  };

  #cancelFormHandler = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleCancelForm();
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#handleCancelForm();
      this.destroy();
    }
  };

  destroy() {
    remove(this.#additionPointComponent);
  }
}
