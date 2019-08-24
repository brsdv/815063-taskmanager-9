import {createElement} from "../util.js";

export class LoadMore {
  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`.trim();
  }

  getElement() {
    return createElement(this.getTemplate());
  }
}
