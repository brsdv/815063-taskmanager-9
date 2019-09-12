import {Card} from "../components/card.js";
import {CardEdit} from "../components/card-edit.js";
import {renderElement, isEscButton} from "../util.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

export class CardController {
  constructor(container, data, dataChangeHandler, changeViewHandler) {
    this._container = container;
    this._data = data;
    this._card = new Card(data);
    this._cardEdit = new CardEdit(data);
    this._dataChangeHandler = dataChangeHandler;
    this._changeViewHandler = changeViewHandler;
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._updateBooleanData = this._getFormData();
    this.init();
  }

  init() {
    const cardElement = this._card.getElement();
    const cardEditElement = this._cardEdit.getElement();

    flatpickr(cardEditElement.querySelector(`.card__date`), {
      altInput: true,
      altFormat: `j F`,
      dateFormat: `Y-m-d`,
      defaultDate: this._data.dueDate,
    });

    const cardClickButtonHandler = (evt, value) => {
      if (evt.target.classList.contains(`card__btn--disabled`)) {
        evt.target.classList.remove(`card__btn--disabled`);
        this._updateBooleanData[value] = true;
      } else {
        evt.target.classList.add(`card__btn--disabled`);
        this._updateBooleanData[value] = false;
      }
    };

    cardElement.querySelector(`.card__btn--edit`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._changeViewHandler();
      this._container.getElement().replaceChild(cardEditElement, cardElement);

      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    cardEditElement.querySelector(`textarea`).addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    cardEditElement.querySelector(`textarea`).addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    cardElement.querySelector(`.card__btn--favorites`).addEventListener(`click`, (evt) => {
      cardClickButtonHandler(evt, `isFavorite`);
      this._dataChangeHandler(this._updateBooleanData, this._data);
    });

    cardEditElement.querySelector(`.card__btn--favorites`).addEventListener(`click`, (evt) => {
      cardClickButtonHandler(evt, `isFavorite`);
    });

    cardElement.querySelector(`.card__btn--archive`).addEventListener(`click`, (evt) => {
      cardClickButtonHandler(evt, `isArchive`);
      this._dataChangeHandler(this._updateBooleanData, this._data);
    });

    cardEditElement.querySelector(`.card__btn--archive`).addEventListener(`click`, (evt) => {
      cardClickButtonHandler(evt, `isArchive`);
    });

    cardEditElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      this._dataChangeHandler(this._getFormData(), this._data);

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    cardEditElement.querySelector(`.card__delete`).addEventListener(`click`, () => {
      this._dataChangeHandler(null, this._data);
    });

    renderElement(this._container.getElement(), cardElement);
  }

  setDefaultView() {
    if (this._container.getElement().contains(this._cardEdit.getElement())) {
      this._container.getElement().replaceChild(this._card.getElement(), this._cardEdit.getElement());
    }
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (isEscButton(evt)) {
      this._container.getElement().replaceChild(this._card.getElement(), this._cardEdit.getElement());
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _getFormData() {
    const formData = new FormData(this._cardEdit.getElement().querySelector(`.card__form`));
    const isFavorite = this._cardEdit.getElement().querySelector(`.card__btn--favorites`).classList.contains(`card__btn--disabled`) ? false : true;
    const isArchive = this._cardEdit.getElement().querySelector(`.card__btn--archive`).classList.contains(`card__btn--disabled`) ? false : true;

    const entry = {
      description: formData.get(`text`),
      color: formData.get(`color`),
      tags: new Set(formData.getAll(`hashtag`)),
      dueDate: formData.get(`date`) === null ? `` : Date.parse(formData.get(`date`)),
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
      }),
      isFavorite,
      isArchive
    };

    return entry;
  }
}
