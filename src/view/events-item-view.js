import {DateFormat} from '../const.js';
import {humanizePointDate, humanizePointDuration, isPointFavorite} from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

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

function createEventsItem(point, availableDestinations, availableOffers) {
  const { type, destination, dateFrom, dateTo, basePrice, isFavorite, offers} = point;
  const date = humanizePointDate(dateFrom, DateFormat.DATE_FORMAT);
  const dateDayFrom = humanizePointDate(dateFrom, DateFormat.DATE_TIME_FORMAT);
  const dateDayTo = humanizePointDate(dateTo, DateFormat.DATE_TIME_FORMAT);
  const dateMonth = humanizePointDate(dateFrom, DateFormat.MONTH_DATE_FORMAT);
  const dateTimeFrom = humanizePointDate(dateFrom, DateFormat.TIME_FORMAT);
  const dateTimeTo = humanizePointDate(dateTo, DateFormat.TIME_FORMAT);
  const duration = humanizePointDuration(dateFrom, dateTo);

  const matchingDestinations = destination ? availableDestinations.filter((element) => destination === element.id)[0].name : '';
  const matchingOffers = availableOffers.reduce((acc, currentValue) => {
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
            <time class="event__start-time" datetime="${dateDayFrom}">${dateTimeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateDayTo}">${dateTimeTo}</time>
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
  #availableDestinations = null;
  #availableOffers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, availableDestinations, availableOffers, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#availableDestinations = availableDestinations;
    this.#availableOffers = availableOffers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventsItem(this.#point, this.#availableDestinations, this.#availableOffers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick(this.#point);
  };
}
