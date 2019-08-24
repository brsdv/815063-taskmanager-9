import {createElement} from "../util.js";

export class Board {
  getTemplate() {
    return `<section class="board container">
    <div class="board__tasks">
    </div>
    </section>`.trim();
  }

  getElement() {
    return createElement(this.getTemplate());
  }
}
