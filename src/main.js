import {getMarkupMenu} from './components/site-menu.js';
import {getMarkupSearch} from './components/search.js';
import {getMarkupFilter} from './components/filter.js';
import {getMarkupBoard} from './components/board.js';
import {getMarkupSorting} from './components/sorting.js';
import {getMarkupCard} from './components/card.js';
import {getMarkupEditCard} from './components/card-edit.js';
import {getMarkupLoadmore} from './components/load-more.js';
import {totalCards, filters} from './data.js';

const CARD_COUNT = 8;

const renderComponent = (container, markup, place = `beforeend`) => container.insertAdjacentHTML(place, markup);

const mainElement = document.querySelector(`main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

renderComponent(mainControlElement, getMarkupMenu());
renderComponent(mainElement, getMarkupSearch());
renderComponent(mainElement, getMarkupFilter(filters));
renderComponent(mainElement, getMarkupBoard());

const taskListElement = mainElement.querySelector(`.board`);
const boardElement = mainElement.querySelector(`.board__tasks`);

renderComponent(taskListElement, getMarkupSorting(), `afterbegin`);
renderComponent(boardElement, getMarkupEditCard(totalCards[0]));

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const getFragment = (cards, startCount, endCount) => {
  const fragment = document.createDocumentFragment();

  for (let i = startCount; i < endCount; i++) {
    const markupElement = createElement(getMarkupCard(cards[i]));
    fragment.appendChild(markupElement);
  }

  return fragment;
};

boardElement.appendChild(getFragment(totalCards, 1, CARD_COUNT));

renderComponent(taskListElement, getMarkupLoadmore());

const loadMoreElement = mainElement.querySelector(`.load-more`);

const loadMoreHandler = () => {
  const totalCardsCount = totalCards.length;
  const cardsElementCount = boardElement.querySelectorAll(`.card`).length;

  if (totalCardsCount > cardsElementCount) {
    boardElement.appendChild(getFragment(totalCards, cardsElementCount, totalCardsCount));
  } else {
    loadMoreElement.remove();
  }
};

loadMoreElement.addEventListener(`click`, loadMoreHandler);
