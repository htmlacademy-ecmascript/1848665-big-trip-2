import {pointTypes, DateFormat} from '../const.js';
import {getRandomNumber} from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createOffers(array, offers, type) {
  if (offers.length === 0) {
    return '';
  }
  const typeOffers = array.reduce((acc, currentValue) => {
    if (currentValue.type === type) {
      return [...acc, ...currentValue.offers];
    }
    return acc;
  }, []);

  return typeOffers.map((element) => {
    const isChecked = offers.includes(element.id);

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${element.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${element.price}</span>
        </label>
      </div>`
    );
  }).join('');
}

function createOffersContainer(arrayOffers, offers, type) {
  if (offers.length === 0) {
    return '';
  }
  const typeOffers = arrayOffers.filter((element) => type === element.type)[0];
  if (!typeOffers.offers.length) {
    return '';
  }
  return (
    `<section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${createOffers(arrayOffers, offers, type)}
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
  return pointDestination.pictures.map((element) => `<img class="event__photo" src="${element.src}${getRandomNumber()}" alt="${element.alt}">`).join('');
}

function createDestination(pointDestination) {
  if (pointDestination) {
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

function createDestinationList(arrayDestinations) {
  if (!arrayDestinations.length) {
    return '';
  }
  return arrayDestinations.map((element) => `<option value="${element.name}"></option>`).join('');
}

function createTypeList(array, checkedType) {
  if (!array.length) {
    return '';
  }
  return array.map((element) => {
    const isChecked = element.toLowerCase() === checkedType ? 'checked' : '';
    return (
      `<div class="event__type-item">
        <input id="event-type-${element.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${element.toLowerCase()}" ${isChecked}>
        <label class="event__type-label event__type-label--${element.toLowerCase()}" for="event-type-${element.toLowerCase()}-1">${element}</label>
      </div>`
    );
  }).join('');
}

function getCreatePointTemplate(point, arrayDestinations, arrayOffers) {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;
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
                  ${createTypeList(pointTypes, type)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">${type}</label>
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination ? pointDestination.name : ''}" list="destination-list-1"  autocomplete="off" required>
            <datalist id="destination-list-1">
              ${createDestinationList(arrayDestinations)}
            </datalist>
          </div>
          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
          </div>
          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn"type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${createOffersContainer(arrayOffers, offers, type)}
          ${createDestination(pointDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class CreatePointView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleCancelForm = null;
  #dateFromDatapicker = null;
  #dateToDatapicker = null;

  constructor({point, destinations, offers, onFormSubmit, onCancelButtonClick}) {
    super();
    this._setState(CreatePointView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCancelForm = onCancelButtonClick;

    if (!this._state.dateFrom) {
      this._state.dateFrom = new Date();
    }
    if (!this._state.dateTo) {
      this._state.dateTo = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // +1 день
    }

    this._restoreHandlers();
  }

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }

  get template() {
    return getCreatePointTemplate(this._state, this.#destinations, this.#offers);
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
    this.updateElement(CreatePointView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
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
          maxDate: this._state.dateTo,
          ['time_24hr']: true,
          allowInput: true,
          onReady: (selectedDates) => {
            this._setState({
              dateFrom: selectedDates[0] || new Date()
            });
          },
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
          minDate: this._state.dateFrom,
          ['time_24hr']: true,
          allowInput: true,
          onReady: (selectedDates) => {
            this._setState({
              dateTo: selectedDates[0] || new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
            });
          },
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
    this.#handleFormSubmit(CreatePointView.parseStateToPoint(this._state));
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

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancelForm();
  };
}
