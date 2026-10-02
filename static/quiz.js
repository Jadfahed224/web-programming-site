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

const questions = [
    {
        question: "Which technology is primarily responsible for allowing a VR system to determine the user's head position and orientation?",
        choices: [
            "A. Cloud storage",
            "B. Image compression",
            "C. Motion Tracking",
            "D. Audio encoding"
        ],
        answer: 2,
        explanation: "Motion tracking detects changes in the user's position and orientation so the virtual scene can respond accordingly."
    },

    {
        question: "Why is low latency important in a VR system?",
        choices: [
            "A. It reduces the delay between user movement and visual response",
            "B. It increases the storage capacity of the headset",
            "C. It automatically increases image resolution",
            "D. It removes the need for motion tracking"
        ],
        answer: 0,
        explanation: "Low latency allows the virtual environment to respond quickly to the user's movements, which helps maintain immersion and reduce discomfort."
    },

    {
        question: "What is the main purpose of stereoscopic rendering in VR?",
        choices: [
            "A. To increase internet bandwidth",
            "B. To display slightly different images to each eye",
            "C. To track the user's hands",
            "D. To reduce the headset's weight"
        ],
        answer: 1,
        explanation: "Stereoscopic rendering provides each eye with a slightly different image, creating the perception of depth."
    },

    {
        question: "What does the term 'presence' describe in virtual reality?",
        choices: [
            "A. The feeling of actually being inside the virtual environment",
            "B. The amount of storage available on the headset",
            "C. The physical size of the VR headset",
            "D. The number of applications installed"
        ],
        answer: 0,
        explanation: "Presence describes the psychological feeling of being located within and experiencing the virtual environment."
    },

    {
        question: "Why is consistent frame timing important in a VR system?",
        choices: [
            "A. It increases the storage capacity of the headset",
            "B. It helps maintain smooth visual updates and reduces noticeable stutteringIt increases the storage capacity of the headset",
            "C. It eliminates the need for motion tracking",
            "D. It allows the headset to work without a graphics processor"
        ],
        answer: 1,
        explanation: "Consistent frame timing helps the VR system display frames smoothly. Irregular frame delivery can cause visible stuttering and reduce the quality of the experience."
    },

    {
        question: "Which combination is most important for accurate and responsive VR interaction?",
        choices: [
            "A. Screen size and hard-drive capacity",
            "B. Storage capacity and file compression",
            "C. Keyboard layout and printer speed",
            "D. Motion tracking and low-latency rendering"
        ],
        answer: 3,
        explanation: "Motion tracking detects user movement, while low-latency rendering allows the system to respond quickly to that movement."
    },

    {
        question: "What is the fundamental difference between VR and AR?",
        choices: [
            "A. VR requires the internet, while AR never does",
            "B. VR only uses audio, while AR only uses video",
            "C. VR creates a simulated environment, while AR adds digital content to the real world",
            "D. VR is only for entertainment, while AR is only for education"
        ],
        answer: 2,
        explanation: "VR immerses the user in a computer-generated environment, while AR keeps the real-world view and adds digital elements."
    },

    {
        question: "Why can VR be useful for professional training?",
        choices: [
            "A. It can simulate situations that may be expensive or difficult to reproduce physically",
            "B. It completely eliminates the need for instructors",
            "C. It guarantees that every trainee behaves identically",
            "D. It permanently replaces all physical training equipment"
        ],
        answer: 0,
        explanation: "VR can create controlled simulations for areas such as medicine, engineering, aviation, and industrial training."
    },

    {
        question: "What is a major technical challenge when creating highly realistic VR environments?",
        choices: [
            "A. Increasing the number of USB ports",
            "B. Rendering complex environments quickly enough for smooth interaction",
            "C. Making the keyboard larger",
            "D. Reducing the number of files on the computer"
        ],
        answer: 1,
        explanation: "Highly detailed environments require significant processing power while still needing fast rendering to maintain a smooth experience."
    },

    {
        question: "Why can VR be valuable for scientific research and experimentation?",
        choices: [
            "A. It removes the need to collect experimental data",
            "B. It completely eliminates all experimental variables",
            "C. It guarantees identical behavior from every participant",
            "D. It can provide controlled and repeatable simulated environments"
        ],
        answer: 3,
        explanation: "Researchers can control aspects of a virtual environment and reproduce experimental conditions more consistently."
    }
];

// ======================================================
// APPLICATION STATE
// ======================================================
let currentQuestion = 0;
const userAnswers = new Array(questions.length);

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
  if (currentQuestion < questions.length - 1) {
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
  currentQuestion = questions.length - 1;
  renderQuestion();
}

// ======================================================
// CALCULATE SCORE
// ======================================================
function calculateScore() {
  //   Calculate the user's score based on their answers.
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].answer) {
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
  return Math.round((score / questions.length) * 100);
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

function buildCorrection() {
  let correction = "";
  //   Build a correction string that includes the question, the user's answer,
  //   the correct answer, and an explanation for each question.
  for (let i = 0; i < questions.length; i++) {
    let userAnswer;
    if (userAnswers[i] !== undefined) {
      userAnswer = questions[i].choices[userAnswers[i]];
    } else {
      userAnswer = "Not Answered";
    }
    let correctAnswer = questions[i].choices[questions[i].answer];
    let result;
    if (userAnswers[i] === questions[i].answer) {
      result = "Correct";
    } else {
      result = "Incorrect";
    }
    correction +=
      "Question " + (i + 1) + ": " + questions[i].question + "\n\n" +
      "Your answer: " + userAnswer + "\n" +
      "Correct answer: " + correctAnswer + "\n" +
      "Result: " + result + "\n" +
      "Explanation: " + questions[i].explanation + "\n\n" +
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
function submitQuiz() {
  const score = calculateScore();
  const percentage = calculatePercentage(score);
  const message = getPerformanceMessage(percentage);
  const correction = buildCorrection();
  showResults(score, percentage, message, correction);
}

function renderQuestion() {
  const q = questions[currentQuestion];

  // --------------------------------------------------
  // QUESTION NUMBER
  // --------------------------------------------------
  document.getElementById("progress").textContent =
    `Question ${currentQuestion + 1} of ${questions.length}`;

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
    currentQuestion === questions.length - 1;
  document.getElementById("lastBtn").disabled =
    currentQuestion === questions.length - 1;
}

// ======================================================
// DISPLAY RESULTS
// ======================================================
function showResults(score, percentage, message, correction) {
  document.getElementById("quizPanel").style.display = "none";
  document.getElementById("resultsPanel").style.display = "block";
  document.getElementById("scoreText").textContent =
    `Score: ${score} / ${questions.length}`;
  document.getElementById("percentageText").textContent =
    `Percentage: ${percentage}%`;
  document.getElementById("performanceText").textContent = message;
  document.getElementById("correction").textContent = correction;
}

// ======================================================
// START APPLICATION
// ======================================================
renderQuestion();
