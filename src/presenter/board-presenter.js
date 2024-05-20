import EventsListView from '../view/events-list-view.js';
import EventsItemView from '../view/events-item-view.js';
import SortView from '../view/sort-view .js';
import FormPointView from '../view/form-point-view.js';
import {render, RenderPosition} from '../render.js';

export default class BoardPresenter {
  filtersList = new SortView();
  eventsListComponent = new EventsListView();

  constructor({boardContainer, pointsModel, formPointModel}) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
    this.formPointModel = formPointModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];
    this.boardDestination = [...this.pointsModel.getDestination()];
    this.boardOffers = [...this.pointsModel.getOffers()];

    this.boardFormPoint = this.formPointModel.getFormPoint();
    this.boardFormDestination = [...this.formPointModel.getFormDestination()];
    this.boardFormOffers = [...this.formPointModel.getFormOffers()];

    render(this.filtersList, this.boardContainer);
    render(this.eventsListComponent, this.boardContainer);
    render(new FormPointView({formPoint: this.boardFormPoint, formDestination: this.boardFormDestination, formOffers: this.boardFormOffers}), this.eventsListComponent.getElement(), RenderPosition.BEFOREEND);

    for (let i = 0; i < this.boardPoints.length; i++) {
      render(new EventsItemView({point: this.boardPoints[i], destination: this.boardDestination, offers: this.boardOffers}), this.eventsListComponent.getElement());
    }
  }
}
