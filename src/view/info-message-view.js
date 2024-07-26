import AbstractView from '../framework/view/abstract-view.js';

const createEventsEmptyState = (message) => `<p class="trip-events__msg">${message}</p>`;

export default class InfoMessageView extends AbstractView {
  #message = null;

  constructor({message}) {
    super();
    this.#message = message;
  }

  get template() {
    return createEventsEmptyState(this.#message);
  }
}
