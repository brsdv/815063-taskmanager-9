import {createElement} from "../util.js";

export class Filter {
  constructor(filters) {
    this._filters = filters;
  }

  getTemplate() {
    return `<section class="main__filter filter container">
    ${this._filters.map(({title, count}) => `<input
    type="radio"
    id="filter__${title}"
    class="filter__input visually-hidden"
    name="filter"
    ${title === `All` ? `checked` : ``}
    ${count > 0 ? `` : `disabled`}
    />
    <label for="filter__${title}" class="filter__label"
      >${title} <span class="filter__${title.toLowerCase()}-count">${count}</span></label
    >`).join(``)}
    </section>`.trim();
  }

  getElement() {
    return createElement(this.getTemplate());
  }
}
