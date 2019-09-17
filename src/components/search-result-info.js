import {AbstractComponent} from "./abstract-component";

export class SearchResultInfo extends AbstractComponent {
  getTemplate() {
    return `<h2 class="result__title">
        #work<span class="result__count">17</span>
      </h2>`.trim();
  }
}
