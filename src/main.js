import {Menu} from './components/site-menu.js';
import {Search} from './components/search.js';
import {Filter} from './components/filter.js';
import {BoardController} from "./controllers/board.js";
import {Sorting} from './components/sorting.js';
import {totalCards, filters} from './data.js';
import {renderElement} from "./util.js";

const mainElement = document.querySelector(`main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const renderMarkup = (obj, container, place) => {
  const elementClass = obj;

  renderElement(container, elementClass.getElement(), place);
};

renderMarkup(new Menu(), mainControlElement);
renderMarkup(new Search(), mainElement);
renderMarkup(new Filter(filters), mainElement);

const boardController = new BoardController(mainElement, totalCards, filters);
boardController.init();

const taskListElement = mainElement.querySelector(`.board`);

renderMarkup(new Sorting(), taskListElement, `afterbegin`);
