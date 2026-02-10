document.addEventListener('DOMContentLoaded', () => {
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
    const startBtn = document.getElementById('start-btn');
    const setupArea = document.getElementById('setup-area');
    const gameArea = document.getElementById('game-area');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score-display');

    function generateNumber() {
        const rand = Math.random();
        let length = rand < 0.7 ? (Math.floor(Math.random() * 2) + 4) : (Math.random() < 0.5 ? 3 : 6);
        let num = '';
        for(let i=0; i<length; i++) num += Math.floor(Math.random() * 10);
        return num;
    }

    startBtn.addEventListener('click', () => {
        selectedTime = parseInt(document.getElementById('time-select').value);
        timeLeft = selectedTime;
        
        setupArea.classList.add('hidden');
        gameArea.classList.remove('hidden');
        
        inputField.disabled = false;
        inputField.value = '';
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
        inputField.value = inputField.value.replace(/[^0-9]/g, '');
        if (inputField.value === targetDisplay.innerText) {
            let timeTaken = Date.now() - startTime;
            keyStrokeTimes.push(timeTaken);
            score++;
            totalChars += targetDisplay.innerText.length;
            totalAttempts++;
            scoreDisplay.innerText = score;
            nextRound();
        }
    });

    function startTimer() {
        timerDisplay.innerText = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
            if (timeLeft <= 0) endGame();
        }, 1000);
    }

    function endGame() {
        clearInterval(timerInterval);
        inputField.disabled = true;
        gameArea.classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');

        const cpm = Math.round((totalChars / selectedTime) * 60);
        const accuracy = Math.round((score / (totalAttempts || 1)) * 100);
        const avgLatency = keyStrokeTimes.length > 0 
            ? (keyStrokeTimes.reduce((a, b) => a + b) / keyStrokeTimes.length / 1000).toFixed(2) 
            : 0;

        document.getElementById('final-score').innerText = cpm;
        document.getElementById('accuracy').innerText = accuracy;
        document.getElementById('avg-speed').innerText = avgLatency + "s";

        saveScore(cpm);
        displayLeaderboard();
    }

    function saveScore(newCpm) {
        let history = JSON.parse(localStorage.getItem('numpadScores')) || [];
        history.push({ score: newCpm, date: new Date().toLocaleDateString() });
        history.sort((a, b) => b.score - a.score);
        localStorage.setItem('numpadScores', JSON.stringify(history.slice(0, 5)));
    }

    function displayLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        const history = JSON.parse(localStorage.getItem('numpadScores')) || [];
        list.innerHTML = history.map(s => `<li><span>${s.date}</span> <strong>${s.score} CPM</strong></li>`).join('');
    }
});
