const ESC_KEYDOWN = 27;

export const Position = {
  BEFOREEND: `beforeend`,
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`
};

export const SortType = {
  DEFAULT: `default`,
  DATEUP: `date-up`,
  DATEDOWN: `date-down`
};

export const MenuId = {
  NEW_TASK: `control__new-task`,
  TASK: `control__task`,
  STATISTIC: `control__statistic`
};

export const Mode = {
  DEFAULT: `default`,
  ADDING: `adding`
};

export const isEscButton = (evt) => evt.keyCode === ESC_KEYDOWN;

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const renderElement = (container, markup, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(markup);
      break;
    case Position.BEFOREEND:
      container.append(markup);
      break;
    case Position.AFTEREND:
      container.after(markup);
      break;
  }
};

export const removeNode = (element) => {
  if (element) {
    element.remove();
  }
};
