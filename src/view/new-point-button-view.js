import AbstractView from '../framework/view/abstract-view.js';

const createButtonTemplate = (isDisabled) => (`<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button" ${isDisabled ? 'disabled' : ''}>New event</button>`);


export default class NewPointButton extends AbstractView {
  #handleNewPointButtonClick = null;
  #isDisabled = null;

  constructor({onClick, isDisabled}) {
    super();
    this.#handleNewPointButtonClick = onClick;
    this.#isDisabled = isDisabled;

    this.element.addEventListener('click', this.#openPointEditFormHandler);
  }

  get template() {
    return createButtonTemplate(this.#isDisabled);
  }

  #openPointEditFormHandler = (evt) => {
    if (evt.target.tagName === 'BUTTON') {
      evt.preventDefault();
      this.#handleNewPointButtonClick();
    }
  };
}
