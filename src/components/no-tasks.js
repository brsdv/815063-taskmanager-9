import {createElement} from "../util.js";

export class NotTasks {
  getTemplate() {
    return `<section class="board container">
        <p class="board__no-tasks">
        Congratulations, all tasks were completed! To create a new click on
        «add new task» button.
        </p>
    </section>`.trim();
  }

  getElement() {
    return createElement(this.getTemplate());
  }
}
