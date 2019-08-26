const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const isEscButton = (evt, action) => {
  const ESC_KEYDOWN = 27;

  if (evt.keyCode === ESC_KEYDOWN) {
    action();
  }
};

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
  }
};

export const removeNode = (element) => {
  if (element) {
    element.remove();
  }
};
