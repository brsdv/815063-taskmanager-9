import {AbstractComponent} from "./abstract-component.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

export class Statistic extends AbstractComponent {
  constructor() {
    super();
    this._cards = [];
    this._daysChart = null;
    this._tagsChart = null;
    this._colorsChart = null;
  }

  getTemplate() {
    return `<section class="statistic container visually-hidden">
    <div class="statistic__line">
      <div class="statistic__period">
        <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

        <div class="statistic-input-wrap">
          <input
            class="statistic__period-input"
            type="text"
            placeholder="01 Feb - 08 Feb"
          />
        </div>

        <p class="statistic__period-result">
          In total for the specified period
          <span class="statistic__task-found">0</span> tasks were fulfilled.
        </p>
      </div>
      <div class="statistic__line-graphic">
        <canvas class="statistic__days" width="550" height="150"></canvas>
      </div>
    </div>

    <div class="statistic__circle">
      <div class="statistic__tags-wrap">
        <canvas class="statistic__tags" width="400" height="300"></canvas>
      </div>
      <div class="statistic__colors-wrap">
        <canvas class="statistic__colors" width="400" height="300"></canvas>
      </div>
    </div>
    </section>`.trim();
  }

  _removeChart(...charts) {
    charts.forEach((element) => {
      if (element) {
        element.destroy();
      }
    });
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
    this._removeChart(this._daysChart, this._tagsChart, this._colorsChart);
  }

  show(cards) {
    this._cards = cards;
    const formatDates = cards.map((element) => moment(element.dueDate).format(`YYYY-MM-DD`)).sort();

    flatpickr(this.getElement().querySelector(`.statistic__period-input`), {
      mode: `range`,
      altInput: true,
      altFormat: `d M`,
      dateFormat: `Y-m-d`,
      defaultDate: [formatDates[0], formatDates[formatDates.length - 1]],
      locale: {
        rangeSeparator: ` - `
      }
    });

    this.getElement().classList.remove(`visually-hidden`);

    this._createDaysChart();
    this._createTagsChart();
    this._createColorsChart();
  }

  _lineChart(ctx, labels, data) {
    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `line`,
      data: {
        labels,
        datasets: [{
          data,
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
  }

  _pieChart(ctx, labels, dataColors, backgroundColor) {
    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels,
        datasets: [{
          data: dataColors,
          backgroundColor
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

  _createDaysChart() {
    const ctx = this.getElement().querySelector(`.statistic__days`);
    const sortDates = this._cards.map((element) => moment(element.dueDate).format(`DD MMM`)).sort();

    this._daysChart = this._lineChart(ctx, this._uniqueItems(sortDates), this._numberOfItems(sortDates));
  }

  _createTagsChart() {
    const ctx = this.getElement().querySelector(`.statistic__tags`);
    const allTags = this._cardsInTag(this._cards);

    const labels = this._uniqueItems(allTags).map((element) => `#${element}`);
    const data = this._numberOfItems(allTags);
    const backgroundColor = this._uniqueItems(allTags).map(() => `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`);

    this._tagsChart = this._pieChart(ctx, labels, data, backgroundColor);
  }

  _createColorsChart() {
    const ctx = this.getElement().querySelector(`.statistic__colors`);
    const sortColors = this._cards.map((element) => element.color).sort();

    const labels = this._uniqueItems(sortColors);
    const data = this._numberOfItems(sortColors);
    const backgroundColor = this._uniqueItems(sortColors).map((element) => {
      switch (element) {
        case `black`:
          return `#000000`;
        case `blue`:
          return `#0c5cdd`;
        case `green`:
          return `#31b55c`;
        case `pink`:
          return `#ff3cb9`;
        case `yellow`:
          return `#ffe125`;
      }
      return element;
    });

    this._colorsChart = this._pieChart(ctx, labels, data, backgroundColor);
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
