let score = 0;
let totalChars = 0;
let totalAttempts = 0;
let timeLeft = 0;
let selectedTime = 30;
let timerInterval;
let startTime;
let keyStrokeTimes = [];

const inputField = document.getElementById('user-input');
const targetDisplay = document.getElementById('target-number');

// Generate the 3-6 digit number
function generateNumber() {
    const rand = Math.random();
    let length = rand < 0.7 ? (Math.floor(Math.random() * 2) + 4) : (Math.random() < 0.5 ? 3 : 6);
    let num = '';
    for(let i=0; i<length; i++) num += Math.floor(Math.random() * 10);
    return num;
}

document.getElementById('start-btn').addEventListener('click', () => {
    selectedTime = parseInt(document.getElementById('time-select').value);
    timeLeft = selectedTime;
    document.getElementById('setup-area').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    inputField.disabled = false;
    inputField.focus();
    nextRound();
    startTimer();
});

function nextRound() {
    inputField.value = '';
    targetDisplay.innerText = generateNumber();
    startTime = Date.now();
}

inputField.addEventListener('input', () => {
    if (inputField.value === targetDisplay.innerText) {
        let timeTaken = Date.now() - startTime;
        keyStrokeTimes.push(timeTaken);
        score++;
        totalChars += targetDisplay.innerText.length;
        totalAttempts++;
        document.getElementById('score').innerText = score;
        nextRound();
    }
});

function startTimer() {
    document.getElementById('timer').innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    inputField.disabled = true;
    document.getElementById('game-area').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');

    // Calculations
    const accuracy = Math.round((score / (totalAttempts || 1)) * 100);
    const avgSpeed = keyStrokeTimes.length > 0 ? Math.round(keyStrokeTimes.reduce((a, b) => a + b) / keyStrokeTimes.length) : 0;
    
    // Normalization: CPM (Characters Per Minute)
    const cpm = Math.round((totalChars / selectedTime) * 60);

    document.getElementById('final-score').innerText = cpm;
    document.getElementById('accuracy').innerText = accuracy;
    document.getElementById('avg-speed').innerText = avgSpeed;

    saveScore(cpm);
    displayLeaderboard();
}

function saveScore(score) {
    let history = JSON.parse(localStorage.getItem('numpadScores')) || [];
    history.push({ score, date: new Date().toLocaleDateString() });
    history.sort((a, b) => b.score - a.score);
    localStorage.setItem('numpadScores', JSON.stringify(history.slice(0, 5))); // Keep top 5
}

function displayLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    const history = JSON.parse(localStorage.getItem('numpadScores')) || [];
    list.innerHTML = history.map(s => `<li>${s.score} CPM - ${s.date}</li>`).join('');
}
