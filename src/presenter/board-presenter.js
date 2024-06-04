import {RenderPosition, render, replace} from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import EventsItemView from '../view/events-item-view.js';
import SortView from '../view/sort-view .js';
import FormPointView from '../view/form-point-view.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #boardDestinations = null;
  #boardOffers = null;

  #filtersList = new SortView();
  #eventsListComponent = new EventsListView();

  #boardPoints = [];

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#boardOffers = [...this.#pointsModel.offers];

    this.#renderBoard();
  }

  #renderPoints({point, destinations, offers}) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const pointComponent = new EventsItemView({
      point,
      destinations,
      offers,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const formPointComponent = new FormPointView({
      point,
      destinations,
      offers,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormArrowClick: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(formPointComponent, pointComponent);
    }

    function replaceFormToCard() {
      replace(pointComponent, formPointComponent);
    }

    render(pointComponent, this.#eventsListComponent.element, RenderPosition.BEFOREEND);
  }

  #renderBoard() {
    render(this.#filtersList, this.#boardContainer);
    render(this.#eventsListComponent, this.#boardContainer);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoints({point: this.#boardPoints[i], destinations: this.#boardDestinations, offers: this.#boardOffers});
    }
  }
}
