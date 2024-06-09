import {render,replace} from '../framework/render.js';
import EventsItemView from '../view/events-item-view.js';
import FormPointView from '../view/form-point-view.js';

export default class PointPresenter {
  #eventsListComponent = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #pointComponent = null;
  #formPointComponent = null;

  constructor({eventsListComponent}) {
    this.#eventsListComponent = eventsListComponent;
  }

  init({point, destinations, offers}) {
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#pointComponent = new EventsItemView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: this.#handleEditClick,
    });

    this.#formPointComponent = new FormPointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormArrowClick: this.#handleFormArrowClick,
    });

    render(this.#pointComponent, this.#eventsListComponent.element);
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

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormArrowClick = () => {
    this.#replaceFormToCard();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceCardToForm() {
    replace(this.#formPointComponent, this.#pointComponent);
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#formPointComponent);
  }
}
