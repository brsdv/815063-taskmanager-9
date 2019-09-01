import {Card} from "../components/card.js";
import {CardEdit} from "../components/card-edit.js";
import {renderElement, isEscButton} from "../util.js";

export class CardController {
  constructor(container, data, dataChangeHandler) {
    this._container = container;
    this._data = data;
    this._card = new Card(data);
    this._cardEdit = new CardEdit(data);
    this._dataChangeHandler = dataChangeHandler;
  }

  init() {
    const cardElement = this._card.getElement();
    const cardEditElement = this._cardEdit.getElement();

    const escKeyDownHandler = (evt) => {
      if (isEscButton(evt)) {
        this._container.getElement().replaceChild(cardElement, cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    cardElement.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
      this._container.getElement().replaceChild(cardEditElement, cardElement);
      document.addEventListener(`keydown`, escKeyDownHandler);
    });

    cardEditElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
      this._container.getElement().replaceChild(cardElement, cardEditElement);
      evt.preventDefault();
    });

    cardEditElement.querySelector(`textarea`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

    cardEditElement.querySelector(`textarea`).addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, escKeyDownHandler);
    });

    cardEditElement.querySelector(`.card__save`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      const formData = new FormData(cardEditElement.querySelector(`.card__form`));

      const entry = {
        description: formData.get(`text`),
        color: formData.get(`color`),
        tags: new Set(formData.getAll(`hashtag`)),
        dueDate: formData.get(`date`),
        repeatingDays: formData.getAll(`repeat`).reduce((acc, item) => {
          acc[item] = true;
          return acc;
        }, {
          'Mo': false,
          'Tu': false,
          'We': false,
          'Th': false,
          'Fr': false,
          'Sa': false,
          'Su': false,
        })
      };

      this._dataChangeHandler(entry, this._data);

      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

    renderElement(this._container.getElement(), cardElement);
  }
}
