import {CardController} from "./card.js";
import {Board} from "../components/board.js";
import {CardList} from "../components/card-list.js";
import {Sort} from "../components/sorting.js";
import {LoadMore} from "../components/load-more.js";
import {NotCards} from "../components/no-cards.js";
import {renderElement, removeNode} from "../util.js";

export class BoardController {
  constructor(container, cards, filters) {
    this._container = container;
    this._cards = cards;
    this._filters = filters;
    this._board = new Board();
    this._sort = new Sort();
    this._cardList = new CardList();
    this._loadMore = new LoadMore();
    this._notCards = new NotCards();
    this._sortCards = cards; // Сортированный массив карточек
    this._STEP_RENDER_CARDS = 8; // Шаг с которым рендерим карточки
    this._CURRENT_CARDS = 8; // Текущее значение карточек на странице
    this._cardLoad = {
      current: this._CURRENT_CARDS,
      step: this._STEP_RENDER_CARDS,
      total: this._cards.length
    };
    this._subscriptions = [];
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._changeViewHandler = this._changeViewHandler.bind(this);
  }

  init() {
    renderElement(this._container, this._board.getElement());
    renderElement(this._board.getElement(), this._sort.getElement(), `afterbegin`);
    renderElement(this._board.getElement(), this._cardList.getElement());

    if (this._cards.length === 0) {
      removeNode(this._board.getElement());
      renderElement(this._container, this._notCards.getElement());
      return;
    }

    this._cards.slice(0, this._CURRENT_CARDS).forEach((element) => this._renderCard(element));

    this._sort.getElement().addEventListener(`click`, (evt) => this._sortClickHandler(evt));

    if (this._cards.length > this._STEP_RENDER_CARDS) {
      renderElement(this._board.getElement(), this._loadMore.getElement());
      this._loadMore.getElement().addEventListener(`click`, () => this._loadMoreClickHandler());
    }
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  _renderBoard(elements) {
    removeNode(this._cardList.getElement());
    this._cardList.removeElement();

    renderElement(this._sort.getElement(), this._cardList.getElement(), `afterend`);
    elements.slice(0, this._cardLoad.current).forEach((element) => this._renderCard(element));
  }

  _renderCard(element) {
    const cardController = new CardController(this._cardList, element, this._dataChangeHandler, this._changeViewHandler);
    cardController.init();
    this._subscriptions.push(cardController.setDefaultView.bind(cardController));
  }

  _changeViewHandler() {
    this._subscriptions.forEach((item) => item());
  }

  _dataChangeHandler(newData, oldData) {
    this._cards[this._cards.findIndex((element) => element === oldData)] = newData;
    this._sortCards[this._sortCards.findIndex((element) => element === oldData)] = newData;
    this._renderBoard(this._sortCards);
  }

  _loadMoreClickHandler() {
    const currentCards = this._cardLoad.current;
    const stepCards = currentCards + this._cardLoad.step;

    this._sortCards.slice(currentCards, stepCards).forEach((element) => this._renderCard(element));

    if (stepCards >= this._cardLoad.total) {
      removeNode(this._loadMore.getElement());
      this._loadMore.removeElement();
      this._cardLoad.current = this._cardLoad.total;
    } else {
      this._cardLoad.current = stepCards;
    }
  }

  _sortClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.localName !== `a`) {
      return;
    }

    switch (evt.target.dataset.sortType) {
      case `default`:
        this._sortCards = this._cards.slice();
        break;
      case `date-up`:
        const sortedUpCards = this._cards.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._sortCards = sortedUpCards;
        break;
      case `date-down`:
        const sortedDownCards = this._cards.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._sortCards = sortedDownCards;
        break;
    }

    this._renderBoard(this._sortCards);
  }
}
