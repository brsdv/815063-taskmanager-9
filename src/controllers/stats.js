import {Statistic} from "../components/statistic.js";
import {renderElement} from "../util.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

export class StatsController {
  constructor(container, cards) {
    this._container = container;
    this._cards = cards;
    this._sortDates = this._cards.map((element) => moment(element.dueDate).format(`DD MMM`)).sort();
    this._formatDates = this._cards.map((element) => moment(element.dueDate).format(`YYYY-MM-DD`)).sort();
    this._allTags = this._cardsInTag(this._cards);
    this._statistic = new Statistic();
    this.init();
  }

  init() {
    renderElement(this._container, this._statistic.getElement());

    flatpickr(this._container.querySelector(`.statistic__period-input`), {
      mode: `range`,
      altInput: true,
      altFormat: `d M`,
      dateFormat: `Y-m-d`,
      defaultDate: [this._formatDates[0], this._formatDates[this._formatDates.length - 1]]
    });

    const daysCtx = this._container.querySelector(`.statistic__days`);
    const tagsCtx = this._container.querySelector(`.statistic__tags`);
    const colorsCtx = this._container.querySelector(`.statistic__colors`);

    const daysChart = new Chart(daysCtx, {
      plugins: [ChartDataLabels],
      type: `line`,
      data: {
        labels: this._uniqueItems(this._sortDates),
        datasets: [{
          data: this._numberOfItems(this._sortDates),
          backgroundColor: `transparent`,
          borderColor: `#000000`,
          borderWidth: 1,
          lineTension: 0,
          pointRadius: 8,
          pointHoverRadius: 8,
          pointBackgroundColor: `#000000`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 10,
              weight: `bold`
            },
            color: `#ffffff`
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: false
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false
        },
        layout: {
          padding: {
            top: 10
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });

    const tagsChart = new Chart(tagsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: this._uniqueItems(this._allTags).map((element) => `#${element}`),
        datasets: [{
          data: this._numberOfItems(this._allTags),
          backgroundColor: this._uniqueItems(this._allTags).map(() => `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`)
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: true,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 10,
          yPadding: 10
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
  }

  hide() {
    this._statistic.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._statistic.getElement().classList.remove(`visually-hidden`);
  }

  _uniqueItems(elements) {
    const uniqueItems = new Set(elements);

    return [...uniqueItems];
  }

  _numberOfItems(elements) {
    const total = elements.reduce((acc, item) => {
      if (typeof acc[item] === `undefined`) {
        acc[item] = 1;
      } else {
        acc[item] += 1;
      }

      return acc;
    }, {});

    return Object.values(total);
  }

  _cardsInTag(cards) {
    const newArray = [];

    cards.map((element) => newArray.push(...[...element.tags]));

    return newArray.sort();
  }
}
