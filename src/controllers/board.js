import {Board} from "../components/board.js";
import {CardList} from "../components/card-list.js";
import {Card} from '../components/card.js';
import {CardEdit} from '../components/card-edit.js';
import {LoadMore} from '../components/load-more.js';
import {NotTasks} from '../components/no-tasks.js';
import {renderElement, removeNode, isEscButton} from "../util.js";

const CARD_COUNT = 8;

export class BoardController {
  constructor(container, cards, filters) {
    this._container = container;
    this._cards = cards;
    this._filters = filters;
    this._board = new Board();
    this._cardList = new CardList();
    this._loadMore = new LoadMore();
    this._notTasks = new NotTasks();
  }

  init() {
    renderElement(this._container, this._board.getElement());
    renderElement(this._board.getElement(), this._cardList.getElement());
    renderElement(this._board.getElement(), this._loadMore.getElement());

    for (let i = 0; i < CARD_COUNT; i++) {
      this._renderCard(this._cards[i]);
    }

    this._loadMore.getElement().addEventListener(`click`, () => this._loadMoreClickHandler());

    const filterNameAll = this._filters.filter((element) => element.title === `All`).map((element) => element.count).join(``);

    if (!parseInt(filterNameAll, 10)) {
      removeNode(this._board.getElement());
      removeNode(this._loadMore.getElement());
      this._loadMore.removeElement();

      renderElement(this._container, this._notTasks.getElement());
    }
  }

  _renderCard(element) {
    const cardComponent = new Card(element);
    const cardEditComponent = new CardEdit(element);
    const cardElement = cardComponent.getElement();
    const cardEditElement = cardEditComponent.getElement();

    const escKeyDownHandler = (evt) => {
      if (isEscButton(evt)) {
        this._cardList.getElement().replaceChild(cardElement, cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    cardElement.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
      this._cardList.getElement().replaceChild(cardEditElement, cardElement);
      document.addEventListener(`keydown`, escKeyDownHandler);
    });

    cardEditElement.querySelector(`form`).addEventListener(`submit`, () => {
      this._cardList.getElement().replaceChild(cardElement, cardEditElement);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

    cardEditElement.querySelector(`textarea`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

    cardEditElement.querySelector(`textarea`).addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, escKeyDownHandler);
    });

    renderElement(this._cardList.getElement(), cardElement);
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
}
