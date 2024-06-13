import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDate, humanizePointDateTime, humanizePointMonthDate, humanizePointTime, humanizePointDuration, isPointFavorite} from '../utils.js';

function createOffers(array) {
  return array.map((element) => {
    const offerTitle = element.title;
    const offerPrice = element.price;
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offerTitle}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerPrice}</span>
      </li>`
    );
  }).join('');
}

function createEventsItemTemplate(point, arrayDestinations, arrayOffers) {
  const { type, destination = '', dateFrom = '', dateTo = '', basePrice = '', isFavorite = '', offers = [] } = point;
  const date = humanizePointDate(dateFrom);
  const dateTimeFrom = humanizePointDateTime(dateFrom);
  const dateTimeTo = humanizePointDateTime(dateTo);
  const dateMonth = humanizePointMonthDate(dateFrom);
  const dataTimeFrom = humanizePointTime(dateFrom);
  const dataTimeTo = humanizePointTime(dateTo);
  const duration = humanizePointDuration(dateFrom, dateTo);
  const matchingDestinations = arrayDestinations.filter((element) => destination === element.id)[0].name;
  const matchingOffers = arrayOffers.reduce((acc, currentValue) => {
    if (point.type && currentValue.type === point.type) {
      return [...acc, ...currentValue.offers.filter((o) => offers.includes(o.id))];
    }
    return acc;
  }, []);

  const isFavoriteBtn = isPointFavorite(isFavorite);
  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${date}">${dateMonth}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${matchingDestinations}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateTimeFrom}">${dataTimeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTimeTo}">${dataTimeTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${createOffers(matchingOffers)}
        </ul>
        <button class="event__favorite-btn ${isFavoriteBtn}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class EventsItemView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, destinations, offers, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventsItemTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
