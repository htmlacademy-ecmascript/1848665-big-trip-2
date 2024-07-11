import AbstractView from '../framework/view/abstract-view.js';

const createButtonTemplate = () => ('<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>');


export default class NewPointButton extends AbstractView {
  #handleNewPointButtonClick = null;

  constructor({onClick: handleNewPointButtonClick}) {
    super();
    this.#handleNewPointButtonClick = handleNewPointButtonClick;

    this.element.addEventListener('click', this.#openPointEditFormHandler);
  }

  get template() {
    return createButtonTemplate();
  }

  #openPointEditFormHandler = (evt) => {
    if (evt.target.tagName === 'BUTTON') {
      evt.preventDefault();
      this.#handleNewPointButtonClick();
    }
  };
}
