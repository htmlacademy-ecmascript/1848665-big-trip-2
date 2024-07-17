import AbstractView from '../framework/view/abstract-view.js';

const createEventsEmptyStateTemplate = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class EventsEmptyStateView extends AbstractView {
  #message = null;

  constructor({message}) {
    super();
    this.#message = message;
  }

  get template() {
    return createEventsEmptyStateTemplate(this.#message);
  }
}
