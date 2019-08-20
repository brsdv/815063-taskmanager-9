const TOTAL_CARD_COUNT = 16;

const getRandomTags = () => {
  const tags = new Set([
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `keks`
  ]);

  // Тассование массива Фишера Йетса
  const shuffle = function (array) {
    let cloneArray = Array.from(array).slice();
    let j;
    let temp;

    for (let i = cloneArray.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = cloneArray[j];
      cloneArray[j] = cloneArray[i];
      cloneArray[i] = temp;
    }

    return cloneArray;
  };

  return shuffle(tags);
};

// Функция которая возвращает структуру данных описывающая задачи(карточки)
const getCardData = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`,
  ][Math.floor(Math.random() * 3)],
  dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  repeatingDays: {
    'Mo': false,
    'Tu': false,
    'We': Math.random() >= 0.5,
    'Th': false,
    'Fr': false,
    'Sa': false,
    'Su': false,
  },
  tags: getRandomTags().slice(0, 3),
  color: [
    `black`,
    `yellow`,
    `blue`,
    `green`,
    `pink`
  ][Math.floor(Math.random() * 5)],
  isFavorite: Math.random() >= 0.5,
  isArchive: Math.random() >= 0.5
});

// Множество с названиями фильтров
const filterTitles = new Set([
  `All`,
  `Overdue`,
  `Today`,
  `Favorites`,
  `Repeating`,
  `Tags`,
  `Archive`
]);

// Функция подсчитывающая кол-во фильтров на осонове списка задач
const filterCount = (title, cards) => {
  let total;

  switch (title) {
    case `All`:
      total = cards;
      break;
    case `Overdue`:
      total = cards.filter((element) => element.dueDate < Date.now());
      break;
    case `Today`:
      total = cards.filter((element) => {
        const today = new Date().toDateString();
        return new Date(element.dueDate).toDateString() === today;
      });
      break;
    case `Favorites`:
      total = cards.filter((element) => element.isFavorite);
      break;
    case `Repeating`:
      total = cards.filter((element) => {
        const {repeatingDays} = element;
        return Object.keys(repeatingDays).some((day) => repeatingDays[day]);
      });
      break;
    case `Tags`:
      total = cards.filter((element) => Array.from(element.tags).length > 0);
      break;
    case `Archive`:
      total = cards.filter((element) => element.isArchive);
      break;
    default:
      total = [];
      break;
  }

  return total.length;
};

// Функция которая возвращает структуру данных под компонент "фильтры"
const getFilter = (element) => ({
  title: element,
  count: filterCount(element, totalCards)
});

// Структура данных описывающая все задачи
export const totalCards = new Array(TOTAL_CARD_COUNT).fill(``).map(getCardData);

// Структура данных под компонент "фильтры"
export const filters = Array.from(filterTitles).map(getFilter);
