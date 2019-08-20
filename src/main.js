import {getMarkupMenu} from './components/site-menu.js';
import {getMarkupSearch} from './components/search.js';
import {getMarkupFilter} from './components/filter.js';
import {getMarkupBoard} from './components/board.js';
import {getMarkupSorting} from './components/sorting.js';
import {getMarkupCard} from './components/card.js';
import {getMarkupEditCard} from './components/card-edit.js';
import {getMarkupLoadmore} from './components/load-more.js';
import {totalCards, filters} from './data.js';

const CARD_COUNT = 7;

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

for (let i = 1; i <= CARD_COUNT; i++) {
  renderComponent(boardElement, getMarkupCard(totalCards[i]));
}

renderComponent(taskListElement, getMarkupLoadmore());

const loadMoreElement = mainElement.querySelector(`.load-more`);

const loadMoreHandler = () => {
  const totalCardsCount = totalCards.length;
  const cardsElementCount = boardElement.querySelectorAll(`.card`).length;

  if (totalCardsCount > cardsElementCount) {
    for (let i = cardsElementCount; i < totalCardsCount; i++) {
      renderComponent(boardElement, getMarkupCard(totalCards[i]));
    }
  } else {
    loadMoreElement.remove();
  }
};

loadMoreElement.addEventListener(`click`, loadMoreHandler);
