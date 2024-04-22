import EventsListView from '../view/events-list-view.js';
import EventsItemView from '../view/events-item-view.js';
import SortView from '../view/sort-view .js';
import FormPointView from '../view/form-point-view.js';
import FormPointOffersView from '../view/form-point-offers-view.js';
import FormPointDestinationView from '../view/form-point-destination-view.js';
import FormPointPhotosView from '../view/form-point-photos-view.js';
import { render, RenderPosition } from '../render.js';

export default class BoardPresenter {
  filtersList = new SortView();
  eventsListComponent = new EventsListView();
  pointDescription = new FormPointView();
  pointDestination = new FormPointDestinationView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.filtersList, this.boardContainer);
    render(this.eventsListComponent, this.boardContainer);
    render(this.pointDescription, this.eventsListComponent.getElement(), RenderPosition.BEFOREEND);
    if (this.pointDescription) {
      render(new FormPointOffersView(), this.pointDescription.getElement().querySelector('.event__details'));
      render(this.pointDestination, this.pointDescription.getElement().querySelector('.event__details'));
    }
    if (this.pointDestination) {
      render(new FormPointPhotosView(), this.pointDestination.getElement());
    }
    for (let i = 0; i < 3; i++) {
      render(new EventsItemView(), this.eventsListComponent.getElement());
    }
  }
}

