let htmlHolidays, htmlBtn, htmlSelectedHoliday, htmlDaysLeft, htmlDays, htmlResult, htmlLoading, htmlSuffix;
let christmasHoliday, springHoliday, easterHoliday, summerHoliday, autumnHoliday, dateToday;
let dayPercentage;
let resultForChart, result;
dateToday = new Date();
dateTodayStr = moment(dateToday).format('YYYY-MM-DD');

holidayJson = [
  {
    name: 'Christmas holiday',
    abbr: 'christmas',
    startDay: '2021-12-27',
  },
  {
    name: 'Spring holiday',
    abbr: 'spring',
    startDay: '2022-02-28',
  },
  {
    name: 'Easter holiday',
    abbr: 'easter',
    startDay: '2022-04-04',
  },
  {
    name: 'Summer holiday',
    abbr: 'summer',
    startDay: '2022-07-01',
  },
  {
    name: 'Autumn holiday',
    abbr: 'autumn',
    startDay: '2022-10-31',
  },
];

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
  getOrdinalNum(queryResponse.day_of_year);

  dayOfWeek.innerHTML = getWeekday(queryResponse.day_of_week);
  dayOfMonth.innerHTML = new Date(queryResponse.datetime).getUTCDate();

  // +1 omdat de maanden tellen van 0 (januari)
  month.innerHTML = getMonthName(new Date(queryResponse.datetime).getUTCMonth() + 1);

  yearNow.innerHTML = year;
  // Hier kijk ik of het huidig jaar een schrikkeljaar is
  // om een correcte hoeveelheid resterende dagen te berekenen
  if (leapYear(year) == true) {
    daysLeftThisYear.innerHTML = 366 - queryResponse.day_of_year;
    dayPercentage = Math.round((queryResponse.day_of_year / 366) * 100);
  } else if (leapYear(year) == false) {
    daysLeftThisYear.innerHTML = 365 - queryResponse.day_of_year;
    dayPercentage = Math.round((queryResponse.day_of_year / 365) * 100);
  }
  drawChart(dayPercentage);
  dateToday = queryResponse.datetime;
};

const showHoliday = (queryResponse) => {
  let InnerHTML = '';
  for (let holiday of queryResponse) {
    InnerHTML += `<option value="${holiday.abbr}">${holiday.name}</option>`;
    if (holiday.abbr == 'christmas') {
      christmasHoliday = holiday.startDay;
    }
    if (holiday.abbr == 'spring') {
      springHoliday = holiday.startDay;
    }
    if (holiday.abbr == 'easter') {
      easterHoliday = holiday.startDay;
    }
    if (holiday.abbr == 'summer') {
      summerHoliday = holiday.startDay;
    }
    if (holiday.abbr == 'autumn') {
      autumnHoliday = holiday.startDay;
    }
  }
  htmlHolidays.innerHTML += InnerHTML;
};

// sleep time expects milliseconds
const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const getOrdinalNum = (number) => {
  let selector;

  if (number <= 0) {
    selector = 4;
  } else if ((number > 3 && number < 21) || number % 10 > 3) {
    selector = 0;
  } else {
    selector = number % 10;
  }

  htmlSuffix.innerHTML = ['th', 'st', 'nd', 'rd', ''][selector];
};

const addEventListeners = () => {
  htmlBtn.addEventListener('click', () => {
    console.log('checking...');
    htmlLoading.style.display = '';
    sleep(1000).then(() => {
      htmlLoading.style.display = 'none';
      htmlResult.style.display = '';
      htmlSelectedHoliday.innerHTML = `${htmlHolidays.value}`;
      if (htmlHolidays.value == 'christmas') {
        calculateDaysLeft(dateTodayStr, christmasHoliday);
      }
      if (htmlHolidays.value == 'spring') {
        calculateDaysLeft(dateTodayStr, springHoliday);
      }
      if (htmlHolidays.value == 'easter') {
        calculateDaysLeft(dateTodayStr, easterHoliday);
      }
      if (htmlHolidays.value == 'summer') {
        calculateDaysLeft(dateTodayStr, summerHoliday);
      }
      if (htmlHolidays.value == 'autumn') {
        calculateDaysLeft(dateTodayStr, autumnHoliday);
      }
      console.log(resultForChart);
      drawChart(resultForChart);
    });
  });
};

const calculateDaysLeft = (date1, date2) => {
  date1 = date1.split('-');
  date2 = date2.split('-');

  date1 = new Date(date1[0], date1[1], date1[2]);
  date2 = new Date(date2[0], date2[1], date2[2]);

  date1_unixtime = parseInt(date1.getTime() / 1000);
  date2_unixtime = parseInt(date2.getTime() / 1000);

  var timeDifference = date2_unixtime - date1_unixtime;
  var timeDifferenceInHours = timeDifference / 60 / 60;
  var timeDifferenceInDays = timeDifferenceInHours / 24;
  result = Math.round(timeDifferenceInDays);
  htmlDaysLeft.innerHTML = `${result}`;
  if (result <= 1) {
    htmlDays.innerHTML = `day `;
  } else {
    htmlDays.innerHTML = `days `;
  }

  if (leapYear(new Date(dateToday).getUTCFullYear()) == true) {
    resultForChart = Math.round(((366 - result) / 366) * 100);
  } else {
    resultForChart = Math.round(((365 - result) / 365) * 100);
  }
};

const drawChart = (percentage) => {
  var options = {
    chart: {
      height: 220,
      type: 'radialBar',
    },
    series: [percentage],
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
          show: true,
          name: {
            show: false,
          },
          value: {
            color: '#19171a',
            fontSize: '24px',
            fontFamily: 'Metropolis Web',
            fontWeight: 400,
            show: true,
            offsetY: 10,
          },
        },
      },
    },
  };
  var DayChart = new ApexCharts(document.querySelector('.js-chart'), options);
  DayChart.render();
};

const get = (url) => fetch(url).then((r) => r.json());

const getOnlineAPI = async (timezone) => {
  const endPoint = `http://worldtimeapi.org/api/timezone/${timezone}`;
  const timeResponse = await get(endPoint);
  console.log({ timeResponse });
  showResult(timeResponse);
};

const init = () => {
  htmlHolidays = document.querySelector('.js-holiday');
  htmlBtn = document.querySelector('.js-btn');
  htmlSelectedHoliday = document.querySelector('.js-selected-holiday');
  htmlDaysLeft = document.querySelector('.js-days-left');
  htmlDays = document.querySelector('.js-days');
  htmlResult = document.querySelector('.js-result');
  htmlLoading = document.querySelector('.js-load-container');
  htmlSuffix = document.querySelector('.js-suffix');
  htmlResult.style.display = 'none';
  htmlLoading.style.display = 'none';
  addEventListeners();
};

document.addEventListener('DOMContentLoaded', () => {
  console.info('DOM geladen');
  init();
  // calculateDays();
  showHoliday(holidayJson);
  getOnlineAPI('Europe/Brussels');
});
