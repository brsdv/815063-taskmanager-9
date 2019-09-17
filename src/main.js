import {Menu} from './components/site-menu.js';
import {Statistic} from './components/statistic.js';
import {Search} from './components/search.js';
import {Filter} from './components/filter.js';
import {BoardController} from "./controllers/board.js";
import {totalCards, filters} from './data.js';
import {renderElement, MenuId} from "./util.js";

const mainElement = document.querySelector(`main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const menu = new Menu();
const search = new Search();
const filter = new Filter(filters);
const statistic = new Statistic();

renderElement(mainControlElement, menu.getElement());
renderElement(mainElement, search.getElement());
renderElement(mainElement, filter.getElement());
renderElement(mainElement, statistic.getElement());

const boardController = new BoardController(mainElement, totalCards, filters);
boardController.init();

menu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName.toLowerCase() !== `input`) {
    return;
  }

  switch (evt.target.id) {
    case MenuId.TASK:
      statistic.getElement().classList.add(`visually-hidden`);
      boardController.show();
      break;
    case MenuId.STATISTIC:
      statistic.getElement().classList.remove(`visually-hidden`);
      boardController.hide();
      break;
    case MenuId.NEW_TASK:
      boardController.createCard();
      menu.getElement().querySelector(`#${MenuId.TASK}`).checked = true;
      break;
  }
});
