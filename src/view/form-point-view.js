import AbstractView from '../framework/view/abstract-view.js';
import {getRandomNumber, humanizePointDateTimeFormPoints} from '../utils.js';

function createOffers(array, offers, type) {
  const typeOffers = array.reduce((acc, currentValue) => {
    if (currentValue.type === type) {
      return [...acc, ...currentValue.offers];
    }
    return acc;
  }, []);

  return typeOffers.map((element) => {
    const offerTitle = element.title;
    const offerPrice = element.price;
    const isChecked = offers.includes(element.id);

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${offerTitle}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerPrice}</span>
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
  return pointDestination.pictures.map((element) => {
    const pictureSrc = element.src;
    const pictureDescription = element.alt;
    return (
      `<img class="event__photo" src="${pictureSrc}${getRandomNumber()}" alt="${pictureDescription}">`
    );
  }).join('');
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
function createFormPointTemplate(point, arrayDestinations, arrayOffers) {
  const { basePrice, dateFrom, dateTo, destination, offers, type } = point;
  const pointDestination = arrayDestinations.filter((element) => destination === element.id)[0];
  const destinationTitle = pointDestination.name;
  const dateTimeFrom = humanizePointDateTimeFormPoints(dateFrom);
  const dateTimeTo = humanizePointDateTimeFormPoints(dateTo);


  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>
                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationTitle}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateTimeFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTimeTo}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          ${createOffersContainer(arrayOffers, offers, type)}
          ${createDestination(pointDestination)}
        </section>
      </form>
    </li>`
  );
}

export default class FormPointView extends AbstractView {
  constructor({point, destinations, offers}) {
    super();
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  get template() {
    return createFormPointTemplate(this.point, this.destinations, this.offers);
  }
}
