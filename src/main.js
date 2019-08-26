import {Menu} from './components/site-menu.js';
import {Search} from './components/search.js';
import {Filter} from './components/filter.js';
import {Board} from './components/board.js';
import {Sorting} from './components/sorting.js';
import {Card} from './components/card.js';
import {CardEdit} from './components/card-edit.js';
import {LoadMore} from './components/load-more.js';
import {totalCards, filters} from './data.js';
import {renderElement, removeNode, keyEvent} from "./util.js";

const CARD_COUNT = 8;

const mainElement = document.querySelector(`main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const renderMarkup = (obj, container, place) => {
  const elementClass = obj;

  renderElement(container, elementClass.getElement(), place);
};

renderMarkup(new Menu(), mainControlElement);
renderMarkup(new Search(), mainElement);
renderMarkup(new Filter(filters), mainElement);
renderMarkup(new Board(), mainElement);

const taskListElement = mainElement.querySelector(`.board`);
const boardElement = mainElement.querySelector(`.board__tasks`);

renderMarkup(new Sorting(), taskListElement, `afterbegin`);

const renderCard = (element) => {
  const card = new Card(element);
  const cardEdit = new CardEdit(element);
  const cardElement = card.getElement();
  const cardEditElement = cardEdit.getElement();

  const escKeyDownHandler = (evt) => {
    keyEvent(evt, () => {
      boardElement.replaceChild(cardElement, cardEditElement);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    });
  };

  cardElement.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    boardElement.replaceChild(cardEditElement, cardElement);
    document.addEventListener(`keydown`, escKeyDownHandler);
  });

  cardEditElement.querySelector(`form`).addEventListener(`submit`, () => {
    boardElement.replaceChild(cardElement, cardEditElement);
    document.removeEventListener(`keydown`, escKeyDownHandler);
  });

  renderElement(boardElement, cardElement);
};

for (let i = 0; i < CARD_COUNT; i++) {
  renderCard(totalCards[i]);
}

renderMarkup(new LoadMore(), taskListElement);

const loadMoreElement = mainElement.querySelector(`.load-more`);

const loadMoreHandler = () => {
  const totalCardsCount = totalCards.length;
  const cardsElementCount = boardElement.querySelectorAll(`.card`).length;

  if (totalCardsCount > cardsElementCount) {
    for (let i = cardsElementCount; i < totalCardsCount; i++) {
      renderCard(totalCards[i]);
    }
  } else {
    removeNode(loadMoreElement);
    new LoadMore().removeElement();
  }
};

loadMoreElement.addEventListener(`click`, loadMoreHandler);
