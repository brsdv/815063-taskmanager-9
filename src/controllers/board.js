import {CardListController} from "./card-list.js";
import {Board} from "../components/board.js";
import {CardList} from "../components/card-list.js";
import {Sort} from "../components/sorting.js";
import {LoadMore} from "../components/load-more.js";
import {NotCards} from "../components/no-cards.js";
import {renderElement, removeNode, Position, SortType} from "../util.js";

export class BoardController {
  constructor(container, dataChangeHandler) {
    this._container = container;
    this._dataChangeMainHandler = dataChangeHandler;
    this._cards = [];
    this._sortCards = []; // Сортированный массив карточек

    this._board = new Board();
    this._sort = new Sort();
    this._cardList = new CardList();
    this._loadMore = new LoadMore();
    this._notCards = new NotCards();
    this._cardListController = new CardListController(this._cardList, this._dataChangeHandler.bind(this));

    this._STEP_RENDER_CARDS = 8; // Шаг с которым рендерим карточки
    this._CURRENT_CARDS = 8; // Текущее значение карточек на странице
    this._cardLoad = {
      current: this._CURRENT_CARDS,
      step: this._STEP_RENDER_CARDS,
      total: this._cards.length
    };

    this._init();
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  show(elements) {
    if (elements !== this._cards) {
      this._setCards(elements);
    }
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  createCard() {
    this._cardListController.createCard();
  }

  _init() {
    renderElement(this._container, this._board.getElement());
    renderElement(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    renderElement(this._board.getElement(), this._cardList.getElement());

    this._sort.getElement().addEventListener(`click`, (evt) => this._sortClickHandler(evt));
  }

  renderElementNoCards(elements) {
    if (elements.length === 0) {
      removeNode(this._board.getElement());
      renderElement(this._container, this._notCards.getElement());
      return;
    }
  }

  renderElementLoadMore(elements) {
    if (elements.length > this._cardLoad.current) {
      renderElement(this._board.getElement(), this._loadMore.getElement());
      this._loadMore.getElement().addEventListener(`click`, () => this._loadMoreClickHandler());
    }
  }

  _renderBoard(elements) {
    removeNode(this._cardList.getElement());
    this._cardList.removeElement();
    removeNode(this._loadMore.getElement());
    this._loadMore.removeElement();

    this.renderElementNoCards(elements);
    this.renderElementLoadMore(elements);

    renderElement(this._sort.getElement(), this._cardList.getElement(), Position.AFTEREND);

    this._cardListController.setCards(elements.slice(0, this._cardLoad.current));
  }

  _setCards(elements) {
    this._cards = elements;

    this._renderBoard(elements);
  }

  _dataChangeHandler(elements) {
    this._cards = [...elements, ...this._cards.slice(this._cardLoad.current)];
    this._cardLoad.total = this._cards.length;

    this._dataChangeMainHandler(this._cards);
    this._renderBoard(this._cards);
  }

  _loadMoreClickHandler() {
    const currentCards = this._cardLoad.current;
    const stepCards = currentCards + this._cardLoad.step;

    this._cardListController.addCards(this._cards.slice(currentCards, stepCards));

    if (stepCards >= this._cardLoad.total) {
      removeNode(this._loadMore.getElement());
      this._loadMore.removeElement();
      this._cardLoad.current = stepCards;
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
      case SortType.DEFAULT:
        this._sortCards = this._cards.slice();
        break;
      case SortType.DATEUP:
        const sortedUpCards = this._cards.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._sortCards = sortedUpCards;
        break;
      case SortType.DATEDOWN:
        const sortedDownCards = this._cards.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._sortCards = sortedDownCards;
        break;
    }

    this._renderBoard(this._sortCards);
  }
}
