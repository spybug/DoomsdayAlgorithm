const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const LEAP_YEAR_SPECIAL_MONTHS = new Set([1, 2]); // Add 1 day to anchor day in these months.

// Key years where the anchor day for a century repeats.
const KEY_YEARS = [0, 28, 56, 84];

// Map of month to date of anchor dates in common year.
const ANCHOR_DATES = new Map([
  [1, 3], [2, 28], [3, 14],
  [4, 4], [5, 9], [6, 6],
  [7, 11], [8, 8], [9, 5],
  [10, 10], [11, 7], [12, 12]
]);

let steps = [];

function init() {
  const form = document.getElementById('input');
  form.addEventListener('submit', submitForm);
}

/* Takes a moment date object as input, and calculates the day of the week it falls on. Uses the Doomsday algorithm, which uses special "Doomsday" days which all fall on the same day of the week for a year. One can calculate the day of the week of March 14th Doomsday by adding and subtracting years from the year 2000. */
function calculateDayOfWeek(date) {
  steps = [];

  const century = Math.floor(date.year() / 100);
  const year = parseInt(date.year().toString().slice(-2));
  const centuryAnchorDay = calculateCenturyAnchorDay(century);
  steps.push(`First, we calculate the anchor day for the year ${date.year()}`);
  steps.push(`Anchor day for the ${century}00s century is: ${DAY_NAMES[centuryAnchorDay]}`);

  const closestKeyYear = findClosestSmaller(KEY_YEARS, year);
  steps.push(`The closest key year to ${year} out of [0, 28, 56, 84] is: ${closestKeyYear}`);

  const baseDaysToAdd = year - closestKeyYear;
  const leapYearDaysToAdd = Math.floor((year - closestKeyYear) / 4);
  const totalDaysToAdd = baseDaysToAdd + leapYearDaysToAdd;
  steps.push(`Adding ${totalDaysToAdd} total days, because there are ${baseDaysToAdd} years and ${leapYearDaysToAdd} leap years in between the key year`);

  const actualDaysToAdd = mod(totalDaysToAdd, 7);
  if (totalDaysToAdd >= 7) {
    steps.push(`Really only need to add ${actualDaysToAdd} days, because the remainder of ${totalDaysToAdd} / 7 is ${actualDaysToAdd}`);
  }

  const yearAnchorDay = mod((centuryAnchorDay + actualDaysToAdd), 7);
  steps.push(`So the anchor day for ${date.year()} is ${DAY_NAMES[yearAnchorDay]}!`);

  const isLeapYear = (date.year() % 4 == 0);
  let anchorDate = ANCHOR_DATES.get(date.month() + 1);
  if (LEAP_YEAR_SPECIAL_MONTHS.has(date.month() + 1) && isLeapYear) {
    anchorDate++;
    steps.push(`Since ${date.year()} is divisible by 4, it's a leap year which means we need to add 1 to our anchor date in January or February.`);
  }
  steps.push(`The anchor date for the month of ${date.format("MMMM")} is: ${anchorDate} (${date.month() + 1}/${anchorDate})`);

  const anchorDateDiff = date.date() - anchorDate;
  const resultDay = yearAnchorDay + anchorDateDiff;
  steps.push(`So we offset the anchor day (${DAY_NAMES[yearAnchorDay]}) by adding ${anchorDateDiff} days.`);

  if (anchorDateDiff >= 7 || anchorDateDiff <= -7) {
    steps.push(`Really only need to add ${mod(anchorDateDiff, 7)} days to the anchor day, because the remainder of ${anchorDateDiff} / 7 is ${mod(anchorDateDiff, 7)}`);
  }

  const actualResultDay = mod(resultDay, 7);
  steps.push(`So in the end, the resulting day is a ${DAY_NAMES[actualResultDay]}`)
  return DAY_NAMES[actualResultDay];
}

function submitForm(event) {
  event.preventDefault();

  const dateInput = document.getElementById('user-date');
  const errorText = document.getElementById('error-text');
  const resultDiv = document.getElementById('result');

  if (!dateInput.value || dateInput.value === '') {
    errorText.innerHTML = 'Please input a date before submitting';
    showErrorText(errorText, resultDiv);
    return;
  }

  try {
    const date = moment(dateInput.value, 'YYYY-MM-DD');
    console.log("Date: " + date);

    if (!date.isValid()) {
      errorText.innerHTML = 'Date input is invalid, please retry entering the date.'
      showErrorText(errorText, resultDiv);
      return;
    }

    const answer = calculateDayOfWeek(date);
    if (answer) {
      document.getElementById('result-text').innerHTML = `The day of the week is: ${answer} 🎉`;
    }

    const stepsOrderedList = document.getElementById('result-steps');
    stepsOrderedList.innerHTML = ''; // Clear existing list elements
    for (const step of steps) {
      const listEl = document.createElement('li');
      console.log(step);
      listEl.textContent = step;
      stepsOrderedList.appendChild(listEl);
    }

    showResultText(errorText, resultDiv);
  } catch (ex) {
    console.error(ex);
    errorText.innerHTML = ex.message;
    showErrorText(errorText, resultDiv);
  }
}


function showErrorText(errorDiv, resultDiv) {
  errorDiv.style.display = 'block'
  resultDiv.style.display = 'none';
}

function showResultText(errorDiv, resultDiv) {
  errorDiv.style.display = 'none'
  resultDiv.style.display = 'block';
}

// Takes the century number (18, 19, 21) and calculates it's anchor day index.
function calculateCenturyAnchorDay(century) {
  return ((5 * (century % 4)) % 7 + 2) % 7;
}

function addDaysToWeekDay(day, amountToAdd) {
  return (day + (amountToAdd % 7)) % 7;
}

// List should be sorted ascending.
function findClosestSmaller(list, target) {
  for (var i = list.length - 1; i >= 0; i--) {
    if (list[i] <= target) {
      return list[i];
    }
  }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

window.onload = function () {
  init();
};