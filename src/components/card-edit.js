import {AbstractComponent} from "./abstract-component";
import moment from "moment";

export class CardEdit extends AbstractComponent {
  constructor({description, dueDate, repeatingDays, tags, color, isFavorite, isArchive}) {
    super();
    this._description = description;
    this._dueDate = dueDate;
    this._repeatingDays = repeatingDays;
    this._tags = Array.from(tags);
    this._color = color;
    this._isFavorite = isFavorite;
    this._isArchive = isArchive;

    this._setDate();
    this._setRepeat();
    this._setColor();
    this._subscribeEvents();
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} 
    ${Object.keys(this._repeatingDays).some((element) => this._repeatingDays[element]) ? `card--repeat` : ``}">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--archive ${this._isArchive ? `` : `card__btn--disabled`}">
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites ${this._isFavorite ? `` : `card__btn--disabled`}"
          >
            favorites
          </button>
        </div>
  
        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>
  
        <div class="card__textarea-wrap">
          <label>
            <textarea
              class="card__text"
              placeholder="Start typing your text here..."
              name="text"
            >${this._description}</textarea>
          </label>
        </div>
  
        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">${this._dueDate ? `yes` : `no`}</span>
              </button>
  
              <fieldset class="card__date-deadline">
                <label class="card__input-deadline-wrap ${this._dueDate ? `` : `visually-hidden`}">
                  <input
                    class="card__date"
                    type="text"
                    placeholder=""
                    name="date"
                    value="${this._dueDate ? moment().format(`YYYY-MM-DD`) : moment(Date.now()).format(`YYYY-MM-DD`)}"
                  />
                </label>
              </fieldset>
  
              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">${Object.keys(this._repeatingDays).some((element) => this._repeatingDays[element]) ? `yes` : `no`}</span>
              </button>
  
              <fieldset class="card__repeat-days">
                <div class="card__repeat-days-inner ${Object.keys(this._repeatingDays).some((element) => this._repeatingDays[element]) ? `` : `visually-hidden`}">
                  ${Object.keys(this._repeatingDays).map((element) => `<input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    id="repeat-${element.toLowerCase()}-4"
                    name="repeat"
                    value="${element}"
                    ${this._repeatingDays[element] ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-${element.toLowerCase()}-4"
                      >${element}</label>`).join(``)}
                </div>
              </fieldset>
            </div>
  
            <div class="card__hashtag">
              <div class="card__hashtag-list">
                ${this._tags.map((element) => `<span class="card__hashtag-inner">
                  <input
                    type="hidden"
                    name="hashtag"
                    value="${element}"
                    class="card__hashtag-hidden-input"
                  />
                  <p class="card__hashtag-name">
                    #${element}
                  </p>
                  <button type="button" class="card__hashtag-delete">
                    delete
                  </button>
                  </span>`).join(``)}
              </div>
  
              <label>
                <input
                  type="text"
                  class="card__hashtag-input"
                  name="hashtag-input"
                  placeholder="Type new hashtag here"
                />
              </label>
            </div>
          </div>
  
          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">

            ${[`black`, `yellow`, `blue`, `green`, `pink`].map((element) => `<input
            type="radio"
            id="color-${element}-4"
            class="card__color-input card__color-input--${element} visually-hidden"
            name="color"
            value="${element}"
            ${element === this._color ? `checked` : ``}
          />
          <label
            for="color-${element}-4"
            class="card__color card__color--${element}"
            >${element}</label
          >`).join(``)}

            </div>
          </div>
        </div>
  
        <div class="card__status-btns">
          <button class="card__save" type="submit">save</button>
          <button class="card__delete" type="button">delete</button>
        </div>
      </div>
    </form>
    </article>`.trim();
  }

  _setDate() {
    const dateStatus = this.getElement().querySelector(`.card__date-status`);
    const dateLabel = this.getElement().querySelector(`.card__input-deadline-wrap`);

    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      if (dateStatus.textContent === `yes`) {
        dateStatus.textContent = `no`;
        dateLabel.classList.add(`visually-hidden`);
        dateLabel.querySelector(`.flatpickr-input`).value = ``;
      } else {
        dateStatus.textContent = `yes`;
        dateLabel.classList.remove(`visually-hidden`);
        dateLabel.querySelector(`.flatpickr-input`).value = moment(Date.now()).format(`YYYY-MM-DD`);
      }
    });
  }

  _setRepeat() {
    const repeatStatus = this.getElement().querySelector(`.card__repeat-status`);
    const repeatInputs = this.getElement().querySelector(`.card__repeat-days-inner`);

    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      if (repeatStatus.textContent === `yes`) {
        repeatStatus.textContent = `no`;
        repeatInputs.classList.add(`visually-hidden`);
        this.getElement().classList.remove(`card--repeat`);
        defaultRepeatHandler(this._repeatingDays, repeatInputs);
      } else {
        repeatStatus.textContent = `yes`;
        repeatInputs.classList.remove(`visually-hidden`);
        this.getElement().classList.add(`card--repeat`);
      }
    });

    const defaultRepeatHandler = (elements, container) => {
      Object.keys(elements).forEach((item) => {
        elements[item] = false;
      });
      container.innerHTML = `${Object.keys(elements).map((item) => `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${item.toLowerCase()}-4"
        name="repeat"
        value="${item}"
        ${elements[item] ? `checked` : ``}/>
        <label class="card__repeat-day" for="repeat-${item.toLowerCase()}-4"
      >${item}</label>`).join(``)}`;
    };
  }

  _setColor() {
    this.getElement().querySelectorAll(`.card__color`).forEach((element) => {
      element.addEventListener(`click`, (evt) => {
        this.getElement().classList.remove(`card--${this._color}`);
        this._color = evt.target.textContent;
        this.getElement().classList.add(`card--${this._color}`);
      });
    });
  }

  _subscribeEvents() {
    const keyDownEnterHandler = (evt) => {
      if (evt.key === `Enter` && evt.target.value) {
        evt.preventDefault();

        this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, `<span class="card__hashtag-inner">
          <input
            type="hidden"
            name="hashtag"
            value="${evt.target.value}"
            class="card__hashtag-hidden-input"
          />
          <p class="card__hashtag-name">
            #${evt.target.value}
          </p>
          <button type="button" class="card__hashtag-delete">
            delete
          </button>
        </span>`);

        evt.target.value = ``;
      }
      document.removeEventListener(`keydown`, keyDownEnterHandler);
    };

    this.getElement().querySelector(`.card__hashtag-input`).addEventListener(`keydown`, keyDownEnterHandler);

    this.getElement().querySelectorAll(`.card__hashtag-inner`).forEach((element) => {
      element.querySelector(`.card__hashtag-delete`).addEventListener(`click`, () => {
        element.remove();
      });
    });
  }
}
