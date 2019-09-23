import {CardController} from './card.js';
import {Mode} from '../util.js';

export class CardListController {
  constructor(container, dataChangeHandler) {
    this._container = container;
    this._dataChangeBoardHandler = dataChangeHandler;

    this._cards = [];
    this._subscriptions = [];
    this._creatingCard = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._changeViewHandler = this._changeViewHandler.bind(this);
  }

  setCards(elements) {
    this._cards = elements;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._cards.forEach((element) => this._renderCard(element));
  }

  addCards(elements) {
    elements.forEach((element) => this._renderCard(element));
    this._cards = this._cards.concat(elements);
  }

  createCard() {
    if (this._creatingCard) {
      return;
    }

    const defaultCard = {
      description: ``,
      dueDate: Date.now(),
      repeatingDays: {
        'Mo': false,
        'Tu': false,
        'We': false,
        'Th': false,
        'Fr': false,
        'Sa': false,
        'Su': false,
      },
      tags: new Set(),
      color: `black`,
      isFavorite: false,
      isArchive: false,
    };

    this._creatingCard = new CardController(this._container, defaultCard, Mode.ADDING, this._dataChangeHandler, this._changeViewHandler);
  }

  _renderCard(element) {
    const cardController = new CardController(this._container, element, Mode.DEFAULT, this._dataChangeHandler, this._changeViewHandler);

    this._subscriptions.push(cardController.setDefaultView.bind(cardController));
  }

  _changeViewHandler() {
    this._subscriptions.forEach((item) => item());
  }

  _dataChangeHandler(newData, oldData) {
    const index = this._cards.findIndex((element) => element === oldData);

    if (newData === null) {
      this._cards = [...this._cards.slice(0, index), ...this._cards.slice(index + 1)];
    } else if (oldData === null) {
      this._creatingCard = null;
      this._cards = [newData, ...this._cards];
    } else {
      this._creatingCard = null;
      this._cards[index] = newData;
    }

    this.setCards(this._cards);

    this._dataChangeBoardHandler(this._cards);
  }
}
