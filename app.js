
let steps = [];

function init() {
  const form = document.getElementById('input');
  form.addEventListener('submit', submitForm);
}

/* Takes a moment date object as input, and calculates the day of the week it falls on. Uses the Doomsday algorithm, which uses special "Doomsday" days which all fall on the same day of the week for a year. One can calculate the day of the week of March 14th Doomsday by adding and subtracting years from the year 2000. */
function calculateDayOfWeek(date) {
  steps = [];
  steps.push('b');
  steps.push('c');
  return 'Monday';
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
      document.getElementById('result-text').innerHTML = `The day of the week is: ${answer}`;
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

window.onload = function () {
  init();
};