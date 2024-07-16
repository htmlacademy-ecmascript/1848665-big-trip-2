import {UserAction, UpdateType} from '../const.js';
import {RenderPosition, render, replace, remove} from '../framework/render.js';
import AbstractView from '../framework/view/abstract-view.js';
import CreatePointView from '../view/create-point-view.js';

export default class CreatePointPresenter extends AbstractView {
  #createPointComponent = null;
  #eventsListComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #handleCancelForm = null;

  #point = null;
  #destinations = null;
  #offers = null;

  constructor({eventsListComponent, onDataChange, onModeChange, onCancelButtonClick}) {
    super();
    this.#eventsListComponent = eventsListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#handleCancelForm = onCancelButtonClick;
  }

  init({point, destinations, offers}) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevCreatePointComponent = this.#createPointComponent;

    this.#createPointComponent = new CreatePointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onCancelButtonClick: this.#handleCancelFormClose,
    });

    if (prevCreatePointComponent === null) {
      render(this.#createPointComponent, this.#eventsListComponent.element, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#createPointComponent, prevCreatePointComponent);
    remove(prevCreatePointComponent);
  }

  destroy() {
    remove(this.#createPointComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };


  #handleFormSubmit = (point) => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleDataChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      {...point},
    );
    this.destroy();
  };

  #handleCancelFormClose = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handleCancelForm();
    this.destroy();
  };
}
