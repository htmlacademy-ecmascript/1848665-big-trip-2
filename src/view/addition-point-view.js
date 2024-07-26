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

function createOffersContainer(offers, selectedOffers, type) {
  if (!offers || !Array.isArray(offers)) {
    return '';
  }

  const typeOffersObject = offers.find((offerGroup) => offerGroup.type === type);

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

function createDestinationList(availableDestinations) {
  if (!availableDestinations.length) {
    return '';
  }
  return availableDestinations.map((element) => `<option value="${element.name}"></option>`).join('');
}

function createTypeList(array, checkedType) {
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

function createPointAdditionForm(point, availableDestinations, availableOffers) {
  const {basePrice, dateFrom, dateTo, destination, offers, type, isDisabled, isSaving} = point;
  const pointDestination = availableDestinations.filter((element) => destination === element.id)[0];

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
                  ${createTypeList(pointTypes, type.toLowerCase())}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">${type}</label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination ? pointDestination.name : ''}" list="destination-list-1"  autocomplete="off" required ${(isDisabled) ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${createDestinationList(availableDestinations)}
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
          <button class="event__save-btn btn btn--blue" type="submit">${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn"type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${createOffersContainer(availableOffers, offers, type)}
          ${createDestinationSection(pointDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class AdditionPointView extends AbstractStatefulView {
  #point = null;
  #availableDestinations = null;
  #availableOffers = null;
  #handleFormSubmit = null;
  #cancelFormHandler = null;
  #dateFromDatapicker = null;
  #dateToDatapicker = null;

  constructor({point, availableDestinations, availableOffers, onFormSubmit, onCancelForm}) {
    super();
    this._setState(AdditionPointView.parsePointToState(point));
    this.#availableDestinations = availableDestinations;
    this.#availableOffers = availableOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#cancelFormHandler = onCancelForm;

    this._restoreHandlers();
  }

  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    return point;
  }

  get template() {
    return createPointAdditionForm (this._state, this.#availableDestinations, this.#availableOffers);
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

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceInputHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offersChangeHandler);
    });
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelFormHandler);
    this.#setDateFromDatapicker();
    this.#setDateToDatapicker();
  }

  #setDateFromDatapicker() {
    const dateFromElement = this.element.querySelector('#event-start-time-1');
    if (dateFromElement) {
      this.#dateFromDatapicker = flatpickr(
        dateFromElement,
        {
          enableTime: true,
          dateFormat: DateFormat.DATE_TIME_FORM_POINTS,
          defaultDate: this._state.dateFrom,
          onChange: this.#dueDateFromChangeHandler,
          maxDate: this._state.dateTo || new Date(),
          ['time_24hr']: true,
          allowInput: true,
        },
      );
    }
  }

  #setDateToDatapicker() {
    const dateToElement = this.element.querySelector('#event-end-time-1');
    if (dateToElement) {
      this.#dateToDatapicker = flatpickr(
        dateToElement,
        {
          enableTime: true,
          dateFormat: DateFormat.DATE_TIME_FORM_POINTS,
          defaultDate: this._state.dateTo,
          onChange: this.#dueDateToChangeHandler,
          minDate: this._state.dateFrom || new Date(),
          ['time_24hr']: true,
          allowInput: true,
        },
      );
    }
  }

  #dueDateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
    if (this.#dateToDatapicker) {
      this.#dateToDatapicker.set('minDate', userDate);
    }
  };

  #dueDateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
    if (this.#dateFromDatapicker) {
      this.#dateFromDatapicker.set('maxDate', userDate);
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(AdditionPointView.parseStateToPoint(this._state));
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
      const destination = this.#availableDestinations.find((element) => element.name === evt.target.value);
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
    this._setState({
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
