import {pointTypes, DateFormat} from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createOffers(typeOffersObject, selectedOffers) {
  if (!typeOffersObject || !typeOffersObject.offers || !typeOffersObject.offers.length) {
    return '';
  }

  return typeOffersObject.offers.map((element) => {
    const isChecked = selectedOffers.includes(element.id);

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="${element.id}" type="checkbox" name="${element.id}" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="${element.id}">
          <span class="event__offer-title">${element.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${element.price}</span>
        </label>
      </div>`
    );
  }).join('');
}

function createOffersContainer(arrayOffers, selectedOffers, type) {
  if (!arrayOffers || !Array.isArray(arrayOffers)) {
    return '';
  }

  const typeOffersObject = arrayOffers.find((offerGroup) => offerGroup.type === type);

  if (!typeOffersObject || !typeOffersObject.offers || !typeOffersObject.offers.length) {
    return '';
  }

  return (
    `<section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOffers(typeOffersObject, selectedOffers)}
      </div>
    </section>`
  );
}

function createDestinationPictures(pointDestination) {
  if (!pointDestination.pictures.length) {
    return '';
  }
  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createDestinationPicture(pointDestination)}
      </div>
    </div>`
  );
}

function createDestinationPicture(pointDestination) {
  return pointDestination.pictures.map((element) => `<img class="event__photo" src="${element.src}" alt="${element.alt}">`).join('');
}

function createDestinationSection(pointDestination) {
  if (pointDestination?.description || pointDestination?.pictures?.length) {
    return (
      `<section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestination.description}</p>
        ${createDestinationPictures(pointDestination)}
      </section>`
    );
  }
  return '';
}

function createDestinationOptions(arrayDestinations) {
  if (!arrayDestinations.length) {
    return '';
  }
  return arrayDestinations.map((element) => `<option value="${element.name}"></option>`).join('');
}

function createTypeRadioButtons(array, checkedType) {
  if (!array.length) {
    return '';
  }
  return array.map((element) => {
    const isChecked = element.toLowerCase() === checkedType ? 'checked' : '';
    return (
      `<div class="event__type-item">
        <input id="event-type-${element.toLowerCase()}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${element.toLowerCase()}" ${isChecked}>
        <label for="event-type-${element.toLowerCase()}" class="event__type-label event__type-label--${element.toLowerCase()}" for="${element.toLowerCase()}">${element}</label>
      </div>`
    );
  }).join('');
}

function createEditPointFormTemplate(point, arrayDestinations, arrayOffers) {
  const {basePrice, dateFrom, dateTo, destination, offers, type, isDisabled, isSaving, isDeleting} = point;
  const pointDestination = arrayDestinations.filter((element) => destination === element.id)[0];

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypeRadioButtons(pointTypes, type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">${type}</label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-1" autocomplete="off" ${(isDisabled) ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${createDestinationOptions(arrayDestinations)}
            </datalist>
          </div>
          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}" ${(isDisabled) ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}" ${(isDisabled) ? 'disabled' : ''}>
          </div>
          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${(isDisabled) ? 'disabled' : ''}>
          </div>
          <button class="event__save-btn btn btn--blue" type="submit" ${(isDisabled) ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${(isDisabled) ? 'disabled' : ''}>${(isDeleting) ? 'Deleting...' : 'Delete'}</button>
          <button class="event__rollup-btn" type="button" ${(isDisabled) ? 'disabled' : ''}>
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersContainer(arrayOffers, offers, type)}
          ${createDestinationSection(pointDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleFormArrowClick = null;
  #handleFormDeleteClick = null;
  #dateFromDatapicker = null;
  #dateToDatapicker = null;

  constructor({point, destinations, offers, onFormSubmit, onFormArrowClick, deleteFormClick}) {
    super();
    this._setState(EditPointView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormArrowClick = onFormArrowClick;
    this.#handleFormDeleteClick = deleteFormClick;

    this._restoreHandlers();
  }

  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  get template() {
    return createEditPointFormTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    super.removeElement();
    if (this.#dateFromDatapicker) {
      this.#dateFromDatapicker.destroy();
      this.#dateFromDatapicker = null;
    }
    if (this.#dateToDatapicker) {
      this.#dateToDatapicker.destroy();
      this.dateToDatapicker = null;
    }
  }

  reset(point) {
    this.updateElement(EditPointView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formClickHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offersChangeHandler);
    });
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.#setDateFromDatapicker();
    this.#setDateToDatapicker();
  }

  #setDateFromDatapicker() {
    this.#dateFromDatapicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: DateFormat.DATE_TIME_FORM_POINTS,
        defaultDate: this._state.dateFrom,
        onChange: this.#dueDateFromChangeHandler,
        maxDate: this._state.dateTo || 'today',
        ['time_24hr']: true,
        allowInput: true,
      },
    );
  }

  #setDateToDatapicker() {
    this.#dateToDatapicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: DateFormat.DATE_TIME_FORM_POINTS,
        defaultDate: this._state.dateTo,
        onChange: this.#dueDateToChangeHandler,
        minDate: this._state.dateFrom || 'today',
        ['time_24hr']: true,
        allowInput: true,
      },
    );
  }

  #dueDateFromChangeHandler = ([date]) => {
    this.updateElement({
      dateFrom: date,
    });
    this.#dateFromDatapicker.set('maxDate', date);
  };

  #dueDateToChangeHandler = ([date]) => {
    this.updateElement({
      dateTo: date,
    });
    this.#dateToDatapicker.set('minDate', date);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #formClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormArrowClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const datalist = document.getElementById('destination-list-1');
    const options = datalist.querySelectorAll('option');
    let matched = false;

    for (const option of options) {
      if (option.value === evt.target.value) {
        matched = true;
        break;
      }
    }

    if (matched) {
      const destination = this.#destinations.find((element) => element.name === evt.target.value);
      if (destination) {
        this.updateElement({
          destination: destination.id,
          offers: [],
        });
      }
    }
  };

  #typeChangeHandler = (evt) => {
    const type = evt.target.value;
    this.updateElement({
      type: type,
      offers: [],
    });
  };

  #priceInputHandler = (evt) => {
    const numericValue = evt.target.value.replace(/\D/g, '') || 0;
    this.updateElement({
      basePrice: numericValue,
    });
  };

  #offersChangeHandler = (evt) => {
    const offers = evt.target.id;
    if (evt.target.checked) {
      this.updateElement({
        offers: [...this._state.offers, offers]
      });
    } else {
      this.updateElement({
        offers: this._state.offers.filter((element) => element !== offers)
      });
    }
  };
}
