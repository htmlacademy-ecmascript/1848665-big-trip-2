import {render,replace, remove} from '../framework/render.js';
import EventsItemView from '../view/events-item-view.js';
import FormPointView from '../view/form-point-view.js';

export default class PointPresenter {
  #eventsListComponent = null;
  #handleDataChange = null;
  #point = null;
  #destinations = null;
  #offers = null;
  #pointComponent = null;
  #formPointComponent = null;

  constructor({eventsListComponent, onDataChange}) {
    this.#eventsListComponent = eventsListComponent;
    this.#handleDataChange = onDataChange;
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

    this.#formPointComponent = new FormPointView({
      point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onFormArrowClick: this.#handleFormArrowClick,
    });

    if (prevPointComponent === null || prevFormPointComponent === null) {
      render(this.#pointComponent, this.#eventsListComponent.element);
      return;
    }

    if (this.#eventsListComponent.element.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#eventsListComponent.element.contains(prevFormPointComponent.element)) {
      replace(this.#formPointComponent, prevFormPointComponent);
    }

    this.#destroy();
  }

  #destroy() {
    remove(this.#pointComponent);
    remove(this.#formPointComponent);
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

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite}, this.#destinations, this.#offers);
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
