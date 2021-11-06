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
  const daysLeftThisYear = document.querySelector('.js-days-left-this-year');

  // In mijn huidige versie van JS functie getYear() trekt 1900 af van het huidige jaar
  // om het in orde te krijgen heb ik dus weer 1900 moeten bijrekenen.
  const year = new Date(queryResponse.datetime).getYear() + 1900;

  dayOfYear.innerHTML = `${queryResponse.day_of_year}`;
  dayOfWeek.innerHTML = getWeekday(queryResponse.day_of_week);
  dayOfMonth.innerHTML = new Date(queryResponse.datetime).getDay();
  month.innerHTML = getMonthName(new Date(queryResponse.datetime).getMonth() + 1);

  // Hier kijk ik of het huidig jaar een schrikkeljaar is
  // om een correcte hoeveelheid resterende dagen te berekenen
  if (leapYear(year) == true) {
    daysLeftThisYear.innerHTML = 366 - queryResponse.day_of_year;
  } else if (leapYear(year) == false) {
    daysLeftThisYear.innerHTML = 365 - queryResponse.day_of_year;
  }
};

const get = (url) => fetch(url).then((r) => r.json());

const getAPI = async (timezone) => {
  const endPoint = `http://worldtimeapi.org/api/timezone/${timezone}`;
  const timeResponse = await get(endPoint);
  console.log({ timeResponse });
  showResult(timeResponse);
};

document.addEventListener('DOMContentLoaded', () => {
  console.info('DOM geladen');
  drawChart();
  getAPI('Europe/Brussels');
});
