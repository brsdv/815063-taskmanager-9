import {Menu} from './components/site-menu.js';
import {Search} from './components/search.js';
import {Filter} from './components/filter.js';
import {Board} from './components/board.js';
import {Sorting} from './components/sorting.js';
import {Card} from './components/card.js';
import {CardEdit} from './components/card-edit.js';
import {LoadMore} from './components/load-more.js';
import {NotTasks} from './components/no-tasks.js';
import {totalCards, filters} from './data.js';
import {renderElement, removeNode, isEscButton} from "./util.js";

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
    if (isEscButton(evt)) {
      boardElement.replaceChild(cardElement, cardEditElement);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };

  cardElement.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    boardElement.replaceChild(cardEditElement, cardElement);
    document.addEventListener(`keydown`, escKeyDownHandler);
  });

  cardEditElement.querySelector(`form`).addEventListener(`submit`, () => {
    boardElement.replaceChild(cardElement, cardEditElement);
    document.removeEventListener(`keydown`, escKeyDownHandler);
  });

  cardEditElement.querySelector(`textarea`).addEventListener(`focus`, () => {
    document.removeEventListener(`keydown`, escKeyDownHandler);
  });

  cardEditElement.querySelector(`textarea`).addEventListener(`blur`, () => {
    document.addEventListener(`keydown`, escKeyDownHandler);
  });

  renderElement(boardElement, cardElement);
};

for (let i = 0; i < CARD_COUNT; i++) {
  renderCard(totalCards[i]);
}

renderMarkup(new LoadMore(), taskListElement);

const loadMoreElement = mainElement.querySelector(`.load-more`);

const removeLoadMore = (obj) => {
  removeNode(loadMoreElement);
  obj.removeElement();
};

const loadMoreHandler = () => {
  const totalCardsCount = totalCards.length;
  const currentCardsCount = boardElement.querySelectorAll(`.card`).length;

  if (totalCardsCount > currentCardsCount) {
    for (let i = currentCardsCount; i < totalCardsCount; i++) {
      renderCard(totalCards[i]);
    }
  } else {
    removeLoadMore(new LoadMore());
  }
};

loadMoreElement.addEventListener(`click`, loadMoreHandler);

const filterAll = filters.filter((element) => element.title === `All`).map((element) => element.count).join(``);

if (!parseInt(filterAll, 10)) {
  removeNode(taskListElement);
  removeLoadMore(new LoadMore());
  renderMarkup(new NotTasks(), mainElement);
}
