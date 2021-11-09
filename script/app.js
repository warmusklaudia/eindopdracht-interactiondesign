let htmlHolidays;

const drawChart = () => {
  var options = {
    chart: {
      height: 220,
      type: 'radialBar',
    },
    series: [70],
    colors: ['#9b47cc'],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: '70%',
        },

        track: {
          background: '#19171a',
        },

        dataLabels: {
          showOn: 'always',
          name: {
            show: false,
          },
          value: {
            color: '#19171a',
            fontSize: '24px',
            fontFamily: 'Metropolis Web',
            fontWeight: 400,
            show: true,
          },
        },
      },
    },
  };
  var DayChart = new ApexCharts(document.querySelector('.js-chart'), options);
  DayChart.render();
};

const getWeekday = (weekday) => {
  switch (weekday) {
    case 0:
      return 'Sunday';
      break;
    case 1:
      return 'Monday';
      break;
    case 2:
      return 'Tuesday';
      break;
    case 3:
      return 'Wednesday';
      break;
    case 4:
      return 'Thursday';
      break;
    case 5:
      return 'Friday';
      break;
    case 6:
      return 'Saturday';
      break;
    default:
      return 'Error';
      break;
  }
};

const getMonthName = (month) => {
  switch (month) {
    case 1:
      return 'January';
      break;
    case 2:
      return 'February';
      break;
    case 3:
      return 'March';
      break;
    case 4:
      return 'April';
      break;
    case 5:
      return 'May';
      break;
    case 6:
      return 'June';
      break;
    case 7:
      return 'July';
      break;
    case 8:
      return 'August';
      break;
    case 9:
      return 'September';
      break;
    case 10:
      return 'October';
      break;
    case 11:
      return 'November';
      break;
    case 12:
      return 'December';
      break;
    default:
      return 'Error';
  }
};

const leapYear = (year) => {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
};

const showResult = (queryResponse) => {
  const dayOfYear = document.querySelector('.js-day-of-year');
  const dayOfWeek = document.querySelector('.js-day-of-week');
  const dayOfMonth = document.querySelector('.js-day-of-month');
  const month = document.querySelector('.js-month');
  const yearNow = document.querySelector('.js-year');
  const daysLeftThisYear = document.querySelector('.js-days-left-this-year');

  const year = new Date(queryResponse.datetime).getUTCFullYear();

  dayOfYear.innerHTML = `${queryResponse.day_of_year}`;
  dayOfWeek.innerHTML = getWeekday(queryResponse.day_of_week);
  dayOfMonth.innerHTML = new Date(queryResponse.datetime).getUTCDate();

  // +1 omdat de maanden tellen van 0 (januari)
  month.innerHTML = getMonthName(new Date(queryResponse.datetime).getUTCMonth() + 1);

  yearNow.innerHTML = year;
  // Hier kijk ik of het huidig jaar een schrikkeljaar is
  // om een correcte hoeveelheid resterende dagen te berekenen
  if (leapYear(year) == true) {
    daysLeftThisYear.innerHTML = 366 - queryResponse.day_of_year;
  } else if (leapYear(year) == false) {
    daysLeftThisYear.innerHTML = 365 - queryResponse.day_of_year;
  }
};

const showHoliday = (queryResponse) => {
  let InnerHTML = '';
  for (let holiday of queryResponse) {
    InnerHTML += `<option value="${holiday.abbr}">${holiday.name}</option>`;
  }
  htmlHolidays.innerHTML += InnerHTML;
};

// const calculateDays = () => {
//   const btn = document.querySelector('.js-btn');

//   // btn.onclick = (e) => {
//   //   e.preventDefault();
//   //   htmlHolidays.addEventListener('input', () => {
//   //     selectedHoliday.innerHTML = htmlHolidays.value;
//   //   });

//   btn.addEventListener('click', () => {
//     checkInput();
//   });
// };

const addEventListeners = () => {
  const btn = document.querySelector('.js-btn');
  btn.addEventListener('click', () => {
    checkInput();
  });
};
const checkInput = () => {
  console.log('checking...');
  const selectedHoliday = document.querySelector('.js-selected-holiday');
  htmlHolidays.addEventListener('input', () => {
    selectedHoliday.innerHTML = `${htmlHolidays.value}`;
  });
};

const get = (url) => fetch(url).then((r) => r.json());

const getOnlineAPI = async (timezone) => {
  const endPoint = `http://worldtimeapi.org/api/timezone/${timezone}`;
  const timeResponse = await get(endPoint);
  console.log({ timeResponse });
  showResult(timeResponse);
};

const getLocalAPI = async (json) => {
  const endPoint = `http://127.0.0.1:5500/${json}`;
  const holidayResponse = await get(endPoint);
  console.log({ holidayResponse });
  showHoliday(holidayResponse);
};

const init = () => {
  htmlHolidays = document.querySelector('.js-holiday');
  addEventListeners();
};

document.addEventListener('DOMContentLoaded', () => {
  console.info('DOM geladen');
  init();
  drawChart();
  // calculateDays();
  getLocalAPI('holiday.json');
  getOnlineAPI('Europe/Brussels');
});
