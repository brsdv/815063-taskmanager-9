import {AbstractComponent} from "./abstract-component.js";

export class CardList extends AbstractComponent {
  getTemplate() {
    return `<div class="board__tasks">
    </div>`.trim();
  }
}
