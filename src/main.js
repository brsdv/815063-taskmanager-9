import {Menu} from './components/site-menu.js';
import {Search} from './components/search.js';
import {Filter} from './components/filter.js';
import {BoardController} from "./controllers/board.js";
import {totalCards, filters} from './data.js';
import {renderElement} from "./util.js";

const mainElement = document.querySelector(`main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const render = (container, obj, place) => {
  renderElement(container, obj.getElement(), place);
};

render(mainControlElement, new Menu());
render(mainElement, new Search());
render(mainElement, new Filter(filters));

const boardController = new BoardController(mainElement, totalCards, filters);
boardController.init();
