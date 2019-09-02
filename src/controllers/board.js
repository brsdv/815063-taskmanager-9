import {CardController} from "./card.js";
import {Board} from "../components/board.js";
import {CardList} from "../components/card-list.js";
import {Sort} from "../components/sorting.js";
import {LoadMore} from "../components/load-more.js";
import {NotTasks} from "../components/no-tasks.js";
import {renderElement, removeNode} from "../util.js";

const CARD_COUNT = 8;

export class BoardController {
  constructor(container, cards, filters) {
    this._container = container;
    this._cards = cards;
    this._filters = filters;
    this._board = new Board();
    this._sort = new Sort();
    this._cardList = new CardList();
    this._loadMore = new LoadMore();
    this._notTasks = new NotTasks();
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
  }

  init() {
    renderElement(this._container, this._board.getElement());
    renderElement(this._board.getElement(), this._sort.getElement(), `afterbegin`);
    renderElement(this._board.getElement(), this._cardList.getElement());

    for (let i = 0; i < CARD_COUNT; i++) {
      this._renderCard(this._cards[i]);
    }

    this._sort.getElement().addEventListener(`click`, (evt) => this._sortClickHandler(evt));

    if (this._cards.length > CARD_COUNT) {
      renderElement(this._board.getElement(), this._loadMore.getElement());
      this._loadMore.getElement().addEventListener(`click`, () => this._loadMoreClickHandler());
    }

    const filterNameAll = this._filters.filter((element) => element.title === `All`).map((element) => element.count).join(``);
    if (!parseInt(filterNameAll, 10)) {
      removeNode(this._board.getElement());
      removeNode(this._loadMore.getElement());
      this._loadMore.removeElement();

      renderElement(this._container, this._notTasks.getElement());
    }
  }

  _renderBoard(elements) {
    removeNode(this._cardList.getElement());
    this._cardList.removeElement();

    renderElement(this._sort.getElement(), this._cardList.getElement(), `afterend`);
    for (let i = 0; i < CARD_COUNT; i++) {
      this._renderCard(elements[i]);
    }
  }

  _renderCard(element) {
    const cardController = new CardController(this._cardList, element, this._dataChangeHandler);
    cardController.init();
  }

  _renderCards(elements) {
    for (let i = 0; i < CARD_COUNT; i++) {
      this._renderCard(elements[i]);
    }
  }

  _dataChangeHandler(newData, oldData) {
    this._cards[this._cards.findIndex((element) => element === oldData)] = newData;

    this._renderBoard(this._cards);
  }

  _loadMoreClickHandler() {
    const totalCardsCount = this._cards.length;
    const currentCardsCount = this._cardList.getElement().querySelectorAll(`.card`).length;

    if (totalCardsCount > currentCardsCount) {
      for (let i = currentCardsCount; i < totalCardsCount; i++) {
        this._renderCard(this._cards[i]);
      }
    } else {
      removeNode(this._loadMore.getElement());
      this._loadMore.removeElement();
    }
  }

  _sortClickHandler(evt) {
    evt.preventDefault();

    if (evt.target.localName !== `a`) {
      return;
    }

    this._cardList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `default`:
        this._renderCards(this._cards);
        break;
      case `date-up`:
        const sortedUpCards = this._cards.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._renderCards(sortedUpCards);
        break;
      case `date-down`:
        const sortedDownCards = this._cards.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._renderCards(sortedDownCards);
        break;
    }
  }
}
