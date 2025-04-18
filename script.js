let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let timerInterval;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const resultBox = document.getElementById("result-box");

const questionCounter = document.getElementById("question-counter");
const timerEl = document.getElementById("timer");
const progress = document.getElementById("progress");

function loadQuestion() {
  resetTimer();
  startTimer();

  const q = quizQuestions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => selectOption(btn, idx);
    optionsEl.appendChild(btn);
  });

  feedbackEl.textContent = "";
  selectedOption = null;

  questionCounter.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  progress.style.width = `${(currentQuestion / quizQuestions.length) * 100}%`;
}

function selectOption(button, idx) {
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");
  selectedOption = idx;
}

document.getElementById("submit-btn").addEventListener("click", handleSubmit);

function handleSubmit() {
  if (selectedOption === null) {
    alert("Please select an answer!");
    return;
  }

  clearInterval(timerInterval);

  const correct = quizQuestions[currentQuestion].answer;
  if (selectedOption === correct) {
    score++;
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.style.color = "#06d6a0";
  } else {
    feedbackEl.textContent = `❌ Incorrect! Correct answer: ${quizQuestions[currentQuestion].options[correct]}`;
    feedbackEl.style.color = "#ef476f";
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      loadQuestion();
    } else {
      showScore();
    }
  }, 1200);
}

function showScore() {
  document.getElementById("quiz-container").classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreEl.textContent = score;

  // Save high score
  const bestScore = localStorage.getItem("mait_quiz_highscore");
  if (!bestScore || score > bestScore) {
    localStorage.setItem("mait_quiz_highscore", score);
  }

  const highScore = localStorage.getItem("mait_quiz_highscore");
  const best = document.createElement("p");
  best.textContent = `🏆 Best Score: ${highScore}/10`;
  resultBox.appendChild(best);

  const learnMore = document.createElement("button");
  learnMore.textContent = "🌐 Learn More About MAIT";
  learnMore.onclick = () => window.open("https://mait.ac.in", "_blank");
  resultBox.appendChild(learnMore);

  const shareBtn = document.createElement("button");
  shareBtn.textContent = "📤 Share My Score";
  shareBtn.onclick = () => {
    const text = `I scored ${score}/10 in the MAIT Quiz! Try it yourself.`;
    const url = encodeURIComponent(window.location.href);
    const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
    window.open(shareURL, "_blank");
  };
  resultBox.appendChild(shareBtn);

  const whatsappBtn = document.createElement("button");
  whatsappBtn.textContent = "📱 Share on WhatsApp";
  whatsappBtn.onclick = () => {
    const message = `I scored ${score}/10 in the MAIT Quiz! Check it out: ${window.location.href}`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };
  resultBox.appendChild(whatsappBtn);
}

function startTimer() {
  let timeLeft = 15;
  timerEl.textContent = `⏱ Time Left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱ Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      feedbackEl.textContent = "⏰ Time's up!";
      feedbackEl.style.color = "#ffc107";

      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
          loadQuestion();
        } else {
          showScore();
        }
      }, 1000);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerEl.textContent = "";
}

function addNewQuestion() {
  const q = document.getElementById("admin-question").value;
  const o1 = document.getElementById("admin-opt1").value;
  const o2 = document.getElementById("admin-opt2").value;
  const o3 = document.getElementById("admin-opt3").value;
  const o4 = document.getElementById("admin-opt4").value;
  const ans = parseInt(document.getElementById("admin-answer").value);

  if (!q || isNaN(ans)) {
    alert("Please enter all fields correctly.");
    return;
  }

  quizQuestions.push({
    question: q,
    options: [o1, o2, o3, o4],
    answer: ans,
  });

  alert("Question added successfully!");
}

// Dark mode toggle
const toggleBtn = document.getElementById("dark-toggle");
toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("mait_quiz_theme", document.body.classList.contains("dark") ? "dark" : "light");
};

window.onload = () => {
  if (localStorage.getItem("mait_quiz_theme") === "dark") {
    document.body.classList.add("dark");
  }
  loadQuestion();
};
