import {getMarkupMenu as createSiteMenuTemplate} from './components/site-menu.js';
import {getMarkupSearch as createSearchTempale} from './components/search.js';
import {getMarkupFilter as createFilterTemplate} from './components/filter.js';
import {getMarkupBoard as createBoardTemplate} from './components/board.js';
import {getMarkupSorting as createSortingTemplate} from './components/sorting.js';
import {getMarkupCard as createCardTemplate} from './components/card';
import {getMarkupEditCard as createCardEditTemplate} from './components/card-edit.js';
import {getMarkupLoadmore as createLoadMoreTemplate} from './components/load-more.js';

const CARD_COUNT = 3;

const renderComponent = (container, markup, place = `beforeend`) => container.insertAdjacentHTML(place, markup);

const mainElement = document.querySelector(`main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

renderComponent(mainControlElement, createSiteMenuTemplate());
renderComponent(mainElement, createSearchTempale());
renderComponent(mainElement, createFilterTemplate());
renderComponent(mainElement, createBoardTemplate());

const taskListElement = mainElement.querySelector(`.board`);
const boardElement = mainElement.querySelector(`.board__tasks`);

renderComponent(taskListElement, createSortingTemplate(), `afterbegin`);
renderComponent(boardElement, createCardEditTemplate());

for (let i = 0; i < CARD_COUNT; i++) {
  renderComponent(boardElement, createCardTemplate());
}

renderComponent(taskListElement, createLoadMoreTemplate());
