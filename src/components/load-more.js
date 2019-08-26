import {createElement} from "../util.js";

export class LoadMore {
  constructor() {
    this._element = null;
  }
  getTemplate() {
    return `<button class="load-more" type="button">load more</button>`.trim();
  }

  getElement() {
    return createElement(this.getTemplate());
  }

  removeElement() {
    if (this._element) {
      this._element = null;
    }
  }
}
