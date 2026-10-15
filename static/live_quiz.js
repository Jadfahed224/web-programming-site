// ======================================================
// QUESTIONS
// ======================================================

// Populate this array with question objects as needed.
// Each question object should have the following structure:
//   {
//     question:
//       "Which keyword declares a block-scoped variable that can later be reassigned?",
//     choices: ["var", "let", "const", "static"],
//     answer: 1,
//     explanation:
//       "let declares a block-scoped variable whose value may later be reassigned.",
//   },

let total = 0;    // Total number of questions in the quiz (from the server)
const cache = {};  // Cache for storing questions fetched from the server

// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = [];

async function getQuestion(i) {
    if (cache[i] !== undefined) {
      return cache[i]; // Return cached question if available
    }

    try {
      const response = await fetch(`/api/question/${i}`);
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    
    const data = await response.json(); // parse the JSON (also async)
    cache[i] = data; // Cache the question for future use
    return data;

    } catch (error) {
    console.log("Could not load question:", error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}


// ======================================================
// SAVE AN ANSWER
// ======================================================
function saveAnswer(choiceIndex) {
  //   Save the user's answer for the current question.
  userAnswers[currentQuestion] = choiceIndex;
}

// ======================================================
// NAVIGATION
// ======================================================
function goNext() {
  //   Move to the next question if not at the last question.
  if (currentQuestion < total - 1) {
    currentQuestion++;
    renderQuestion();
  }
}

function goPrevious() {
  //   Move to the previous question if not at the first question.
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function goFirst() {
  //   Move to the first question.
  currentQuestion = 0;
  renderQuestion();
}

function goLast() {
  //   Move to the last question.
  currentQuestion = total - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
async function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score = 0;
  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    if (userAnswers[i] === q.answer) {
      score++;
    }
  }
  return score;
}

// ======================================================
// CALCULATE PERCENTAGE
// ======================================================
function calculatePercentage(score) {
  //   Calculate the percentage score based on the total number of questions.
  return Math.round((score / total) * 100);
}

// ======================================================
// PERFORMANCE MESSAGE
// ======================================================

function getPerformanceMessage(percentage) {
  //   Return a performance message based on the percentage score.
  if (percentage >= 80) {
    return "Excellent";
  } else if (percentage >= 60) {
    return "Good";
  } else if (percentage >= 50) {
    return "Pass";
  } else {
    return "Needs improvement";
  }
}

// ======================================================
// BUILD CORRECTION
// ======================================================

async function buildCorrection() {
  let correction = "";
  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.
  for (let i = 0; i < total; i++) {
    const q = await getQuestion(i);
    let userAnswer;
    if (userAnswers[i] !== undefined) {
      userAnswer = q.choices[userAnswers[i]];
    } else {
      userAnswer = "Not Answered";
    }
    let correctAnswer = q.choices[q.answer];
    let result;
    if (userAnswers[i] === q.answer) {
      result = "Correct";
    } else {
      result = "Incorrect";
    }
    correction +=
      "Question " + (i + 1) + ": " + q.question + "\n\n" +
      "Your answer: " + userAnswer + "\n" +
      "Correct answer: " + correctAnswer + "\n" +
      "Result: " + result + "\n" +
      "Explanation: " + q.explanation + "\n\n" +
      "────────────────────────────────────────\n\n";
  }
  return correction;
}

// ======================================================
// PROVIDED INTERFACE CODE
//
// DOM manipulation and events will be studied later.
// ======================================================

// ======================================================
// SUBMIT QUIZ
// ======================================================
async function submitQuiz() {
  const score = await calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = await buildCorrection();
  showResults(score, percentage, message, correction);
}

async function renderQuestion() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  loading.hidden = false;
  error.hidden = true;
  error.textContent = "";
  try {
    const q = await getQuestion(currentQuestion);

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${total}`;

  // --------------------------------------------------
  // QUESTION
  // --------------------------------------------------
  document.getElementById("questionText").textContent = q.question;

  // --------------------------------------------------
  // CHOICES
  // --------------------------------------------------
  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";
  for (let i = 0; i < q.choices.length; i++) {
    const label = document.createElement("label");
    label.className = "choice";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;
    // Restore an answer previously selected
    // by the user.
    if (userAnswers[currentQuestion] === i) {
      radio.checked = true;
    }
    // When the user selects this answer,
    // save its index.
    radio.onclick = function () {
      saveAnswer(i);
    };
    label.appendChild(radio);
    label.appendChild(document.createTextNode(" " + q.choices[i]));
    choicesContainer.appendChild(label);
  }

  // --------------------------------------------------
  // NAVIGATION BUTTONS
  // --------------------------------------------------
  document.getElementById("firstBtn").disabled = currentQuestion === 0;
  document.getElementById("previousBtn").disabled = currentQuestion === 0;
  document.getElementById("nextBtn").disabled =
    currentQuestion === total - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === total - 1;

  } catch (err) {
    error.textContent = "Could not load question: " + err.message;
    error.hidden = false;
  } finally {
    loading.hidden = true;
  }
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${total}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
async function init() {
    const response = await fetch("/api/questions/count");
    if (!response.ok) {
        throw new Error("HTTP " + response.status);
    }
    const data = await response.json();
    total = data.count;
    await renderQuestion();
}
init();