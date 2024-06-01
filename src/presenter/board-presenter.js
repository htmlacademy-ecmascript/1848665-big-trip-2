import {RenderPosition, render} from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import EventsItemView from '../view/events-item-view.js';
import SortView from '../view/sort-view .js';
import FormPointView from '../view/form-point-view.js';

export default class BoardPresenter {
  filtersList = new SortView();
  eventsListComponent = new EventsListView();

  constructor({boardContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];
    this.boardDestinations = [...this.pointsModel.getDestinations()];
    this.boardOffers = [...this.pointsModel.getOffers()];

    render(this.filtersList, this.boardContainer);
    render(this.eventsListComponent, this.boardContainer);

    for (let i = 0; i < this.boardPoints.length; i++) {
      if (i === 0) {
        render(new FormPointView({point: this.boardPoints[i], destinations: this.boardDestinations, offers: this.boardOffers}), this.eventsListComponent.element, RenderPosition.BEFOREEND);
      } else {
        render(new EventsItemView({point: this.boardPoints[i], destinations: this.boardDestinations, offers: this.boardOffers}), this.eventsListComponent.element);
      }
    }
  }
}
