// Quiz data categorized by difficulty
const questions = {
  easy: [
    { question: "What is the output of print(2 + 2)?", answers: ["2", "3", "4", "5"], correct: 2 },
    { question: "Which keyword is used to define a function in Python?", answers: ["func", "def", "function", "lambda"], correct: 1 },
    { question: "What is the correct file extension for Python files?", answers: [".py", ".python", ".pt", ".pyt"], correct: 0 },
    { question: "Which of these is a valid variable name?", answers: ["2name", "name", "name!", "name@"], correct: 1 },
    { question: "What is the data type of 'Hello, World!' in Python?", answers: ["String", "List", "Integer", "Boolean"], correct: 0 },
    { question: "Which function is used to output text in Python?", answers: ["print()", "echo()", "display()", "show()"], correct: 0 },
    { question: "What is the result of len('Python')?", answers: ["6", "5", "7", "8"], correct: 0 },
    { question: "What is used to insert comments in Python?", answers: ["//", "#", "/* */", "--"], correct: 1 },
    { question: "Which keyword is used for loops in Python?", answers: ["loop", "for", "iterate", "repeat"], correct: 1 },
    { question: "How do you declare a variable in Python?", answers: ["var x = 5", "x = 5", "int x = 5", "x := 5"], correct: 1 },
  ],

   medium: [
    { question: "What does the following code return: 'Python'.upper()?", answers: ["PYTHON", "Python", "python", "None"], correct: 0 },
    { question: "Which of these data types is immutable?", answers: ["List", "Dictionary", "String", "Set"], correct: 2 },
    { question: "How do you handle exceptions in Python?", answers: ["try-catch", "try-except", "try-finally", "try-error"], correct: 1 },
    { question: "What is the result of 10 // 3 in Python?", answers: ["3", "3.33", "4", "Error"], correct: 0 },
    { question: "Which method is used to add an element to a set?", answers: ["add()", "append()", "insert()", "extend()"], correct: 0 },
    { question: "How do you create a dictionary in Python?", answers: ["{}", "[]", "()", "<>"], correct: 0 },
    { question: "Which module is used for random number generation?", answers: ["math", "random", "os", "sys"], correct: 1 },
    { question: "What is the output of print(type([]))?", answers: ["<class 'list'>", "<class 'dict'>", "<class 'tuple'>", "<class 'set'>"], correct: 0 },
    { question: "What does the 'pass' statement do?", answers: ["Exits a loop", "Does nothing", "Skips an iteration", "Ends a function"], correct: 1 },
    { question: "What will the expression 5 == 5 return?", answers: ["True", "False", "Error", "None"], correct: 0 },
  ],

  hard: [
    { question: "What is the output of the following: `lambda x: x**2`(3)?", answers: ["3", "6", "9", "Error"], correct: 2 },
    { question: "How do you access the first element of a tuple `(10, 20, 30)`?", answers: ["tuple[0]", "tuple(0)", "tuple.first()", "Error"], correct: 0 },
    { question: "Which function converts an object to a string representation?", answers: ["repr()", "str()", "toString()", "string()"], correct: 1 },
    { question: "How do you create a generator in Python?", answers: ["def with return", "def with yield", "generator()", "create()"], correct: 1 },
    { question: "Which library is used for data manipulation in Python?", answers: ["numpy", "matplotlib", "pandas", "scipy"], correct: 2 },
    { question: "What is the result of `sum([1, 2, 3, 4])`?", answers: ["10", "11", "12", "13"], correct: 0 },
    { question: "What is the correct way to open a file for writing?", answers: ["open('file.txt')", "open('file.txt', 'r')", "open('file.txt', 'w')", "open('file.txt', 'a')"], correct: 2 },
    { question: "What is the difference between `is` and `==`?", answers: ["No difference", "`is` checks identity, `==` checks equality", "`is` checks equality, `==` checks identity", "Both are used for loops"], correct: 1 },
    { question: "Which decorator is used to define a static method?", answers: ["@staticmethod", "@class", "@classmethod", "@static"], correct: 0 },
    { question: "What is the result of `{'a':1, 'b':2}['c']`?", answers: ["KeyError", "None", "0", "Undefined"], correct: 0 },
  ],
};


let currentDifficulty = 'easy';
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let shuffledQuestions = [];

const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const finalScoreDisplay = document.getElementById('final-score');
const timerDisplay = document.getElementById('timer-display');
const quizContainer = document.getElementById('quiz-container');
const resultsScreen = document.getElementById('results-screen');
const homeScreen = document.getElementById('home-screen');
const difficultySelection = document.getElementById('difficulty-selection');
const highScoresList = document.getElementById('high-scores-list');

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  shuffledQuestions = [...questions[currentDifficulty]];
  quizContainer.classList.add('active');
  difficultySelection.classList.remove('active');
  showQuestion();
  startTimer();
}

function showQuestion() {
  resetState();
  let currentQ = shuffledQuestions[currentQuestionIndex];
  questionElement.innerText = currentQ.question;
  currentQ.answers.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.innerText = answer;
    btn.classList.add('btn');
    btn.addEventListener('click', () => selectAnswer(index));
    answerButtons.appendChild(btn);
  });
}

function resetState() {
  clearInterval(timer);
  timeLeft = 15;
  timerDisplay.innerText = `${timeLeft}s`;
  answerButtons.innerHTML = '';
  nextButton.style.display = 'none';
  startTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      selectAnswer(-1); // Time out
    }
  }, 1000);
}

function selectAnswer(index) {
  clearInterval(timer);
  let correctIndex = shuffledQuestions[currentQuestionIndex].correct;
  if (index === correctIndex) score++;

  Array.from(answerButtons.children).forEach((btn, i) => {
    btn.disabled = true;
    btn.style.backgroundColor = i === correctIndex ? '#27ae60' : '#c0392b';
  });

  nextButton.style.display = 'inline-block';
}

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizContainer.classList.remove('active');
  resultsScreen.classList.add('active');
  finalScoreDisplay.innerText = `You scored ${score} out of ${shuffledQuestions.length}`;
  saveHighScore(score);
  displayHighScores();
}

function saveHighScore(score) {
  const stored = JSON.parse(localStorage.getItem('highScores')) || [];
  stored.push({ score, date: new Date().toLocaleString() });
  localStorage.setItem('highScores', JSON.stringify(stored));
}

function displayHighScores() {
  const stored = JSON.parse(localStorage.getItem('highScores')) || [];
  highScoresList.innerHTML = stored
    .slice(-5)
    .reverse()
    .map(s => `<li>${s.score} - ${s.date}</li>`) // most recent 5
    .join('');
}

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.getAttribute('data-target');
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentDifficulty = btn.dataset.difficulty;
    startQuiz();
  });
});

document.getElementById('start-quiz-home-btn').addEventListener('click', () => {
  homeScreen.classList.remove('active');
  difficultySelection.classList.add('active');
});

document.getElementById('restart-quiz-btn').addEventListener('click', () => {
  resultsScreen.classList.remove('active');
  difficultySelection.classList.add('active');
});

document.getElementById('back-home-from-results-btn').addEventListener('click', () => {
  resultsScreen.classList.remove('active');
  homeScreen.classList.add('active');
});
