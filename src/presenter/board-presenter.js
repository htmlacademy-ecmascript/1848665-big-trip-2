import {RenderPosition, render} from '../framework/render.js';
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

    render(this.#filtersList, this.#boardContainer);
    render(this.#eventsListComponent, this.#boardContainer);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      if (i === 0) {
        this.#renderFormPoint({point: this.#boardPoints[i], destinations: this.#boardDestinations, offers: this.#boardOffers});
      } else {
        this.#renderPoints({point: this.#boardPoints[i], destinations: this.#boardDestinations, offers: this.#boardOffers});
      }
    }
  }

  #renderFormPoint({point, destinations, offers}) {
    const formPointComponent = new FormPointView({point, destinations, offers});
    render(formPointComponent, this.#eventsListComponent.element);
  }

  #renderPoints({point, destinations, offers}) {
    const pointComponent = new EventsItemView({point, destinations, offers});
    render(pointComponent, this.#eventsListComponent.element, RenderPosition.BEFOREEND);
  }
}
