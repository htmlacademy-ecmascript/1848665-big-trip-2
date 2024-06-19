import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {DateFormat} from '../const.js';
import {pointTypes} from '../view-data.js';
import {getRandomNumber, humanizePointDate} from '../utils.js';

function createOffers(array, offers, type) {
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
    const isChecked = element.value === checkedType ? 'checked' : '';
    return (
      `<div class="event__type-item">
        <input id="event-type-${element.value}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${element.value}" ${isChecked}>
        <label class="event__type-label event__type-label--${element.value}" for="event-type-${element.value}-1">${element.title}</label>
      </div>`
    );
  }).join('');
}


function createFormPointTemplate(point, arrayDestinations, arrayOffers) {
  const { basePrice, dateFrom, dateTo, destination, offers, type } = point;
  const pointDestination = arrayDestinations.filter((element) => destination === element.id)[0];
  const dateTimeFrom = humanizePointDate(dateFrom, DateFormat.DATE_TIME_FORM_POINTS);
  const dateTimeTo = humanizePointDate(dateTo, DateFormat.DATE_TIME_FORM_POINTS);


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
            <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointDestination.name}" list="destination-list-1" autocomplete="off">
            <datalist id="destination-list-1">
              ${createDestinationList(arrayDestinations)}
            </datalist>
          </div>
          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateTimeFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTimeTo}">
          </div>
          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersContainer(arrayOffers, offers, type)}
          ${createDestination(pointDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class PointEditView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleFormSubmit = null;
  #handleFormArrowClick = null;

  constructor({point, destinations, offers, onFormSubmit, onFormArrowClick}) {
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormArrowClick = onFormArrowClick;

    this._restoreHandlers();
  }

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }

  get template() {
    return createFormPointTemplate(this._state, this.#destinations, this.#offers);
  }

  reset(point) {
    this.updateElement(PointEditView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formClickHandler);

    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormArrowClick();
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
}
