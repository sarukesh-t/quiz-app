// Quiz data categorized by difficulty
const questions = {
  easy: [
    { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1 },
    { question: "What color is the sky?", answers: ["Green", "Blue", "Red", "Yellow"], correct: 1 },
  ],
  medium: [
    { question: "Which planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
    { question: "Who wrote 'Romeo and Juliet'?", answers: ["Shakespeare", "Hemingway", "Frost", "Poe"], correct: 0 },
  ],
  hard: [
    { question: "What is the derivative of sin(x)?", answers: ["cos(x)", "-cos(x)", "-sin(x)", "tan(x)"], correct: 0 },
    { question: "Who developed the theory of relativity?", answers: ["Newton", "Bohr", "Einstein", "Tesla"], correct: 2 },
  ]
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
