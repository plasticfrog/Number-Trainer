let score = 0;
let totalAttempts = 0;
let timeLeft = 60;
let timerInterval;
const targetDisplay = document.getElementById('target-number');
const inputField = document.getElementById('user-input');
const startBtn = document.getElementById('start-btn');

function generateNumber() {
    // 70% chance of 4-5 digits, 30% chance of 3 or 6
    const rand = Math.random();
    let length;
    if (rand < 0.7) {
        length = Math.floor(Math.random() * 2) + 4; // 4 or 5
    } else {
        length = Math.random() < 0.5 ? 3 : 6; // 3 or 6
    }
    
    let num = '';
    for(let i=0; i<length; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}

function startGame() {
    score = 0;
    totalAttempts = 0;
    timeLeft = 60;
    startBtn.classList.add('hidden');
    inputField.disabled = false;
    inputField.value = '';
    inputField.focus();
    targetDisplay.innerText = generateNumber();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

inputField.addEventListener('input', () => {
    if (inputField.value === targetDisplay.innerText) {
        score++;
        totalAttempts++;
        document.getElementById('score').innerText = score;
        inputField.value = '';
        targetDisplay.innerText = generateNumber();
    }
});

function endGame() {
    clearInterval(timerInterval);
    inputField.disabled = true;
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;
    document.getElementById('accuracy').innerText = Math.round((score / totalAttempts) * 100) || 100;
}

startBtn.addEventListener('click', startGame);
