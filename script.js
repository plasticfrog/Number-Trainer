document.addEventListener('DOMContentLoaded', () => {
    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval;
    let timeElapsed = 0;
    let startTime;
    let roundStartTime;
    let keyStrokeTimes = [];
    let isLocked = false;

    const inputField = document.getElementById('user-input');
    const targetDisplay = document.getElementById('target-number');
    const container = document.getElementById('main-container');
    const progress = document.getElementById('progress');

    function generateNumber() {
        const rand = Math.random();
        let length = rand < 0.7 ? (Math.floor(Math.random() * 2) + 4) : (Math.random() < 0.5 ? 3 : 6);
        let num = '';
        for(let i=0; i<length; i++) num += Math.floor(Math.random() * 10);
        return num;
    }

    document.getElementById('start-btn').addEventListener('click', () => {
        testSize = parseInt(document.getElementById('test-size').value);
        document.getElementById('total-count').innerText = testSize;
        document.getElementById('setup-area').classList.add('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        
        inputField.disabled = false;
        inputField.focus();
        
        startTime = Date.now();
        startTimer();
        nextRound();
    });

    function nextRound() {
        if (correctCount >= testSize) {
            endGame();
            return;
        }
        inputField.value = '';
        targetDisplay.innerText = generateNumber();
        roundStartTime = Date.now();
        isLocked = false;
        inputField.disabled = false;
        inputField.focus();
    }

    inputField.addEventListener('input', (e) => {
        if (isLocked) return;

        const val = inputField.value;
        const target = targetDisplay.innerText;

        // Check if the current typing matches the START of the target
        if (target.startsWith(val)) {
            if (val === target) {
                // Success
                let timeTaken = Date.now() - roundStartTime;
                keyStrokeTimes.push(timeTaken);
                correctCount++;
                totalAttempts++;
                progress.innerText = correctCount;
                nextRound();
            }
        } else {
            // MISTAKE LOGIC
            triggerError();
        }
    });

    function triggerError() {
        isLocked = true;
        totalAttempts++; // Count the mistake against accuracy
        inputField.disabled = true;
        container.style.backgroundColor = "#7f1d1d"; // Dark Red
        
        setTimeout(() => {
            container.style.backgroundColor = "#1e293b"; // Back to Normal
            nextRound();
        }, 500);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            document.getElementById('timer').innerText = timeElapsed;
        }, 100);
    }

    function endGame() {
        clearInterval(timerInterval);
        inputField.disabled = true;
        document.getElementById('game-area').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');

        const accuracy = Math.round((correctCount / totalAttempts) * 100);
        const avgLatency = (keyStrokeTimes.reduce((a, b) => a + b, 0) / keyStrokeTimes.length / 1000).toFixed(2);

        document.getElementById('final-time').innerText = timeElapsed;
        document.getElementById('accuracy').innerText = accuracy;
        document.getElementById('avg-speed').innerText = avgLatency + "s";

        saveScore(timeElapsed, testSize);
        displayLeaderboard();
    }

    function saveScore(time, size) {
        let history = JSON.parse(localStorage.getItem('numpadSprints')) || [];
        history.push({ time, size, date: new Date().toLocaleDateString() });
        history.sort((a, b) => a.time - b.time); // Best time at top
        localStorage.setItem('numpadSprints', JSON.stringify(history.slice(0, 5)));
    }

    function displayLeaderboard() {
        const list = document.getElementById('leaderboard-list');
        const history = JSON.parse(localStorage.getItem('numpadSprints')) || [];
        list.innerHTML = history.map(s => `<li><span>${s.size} Q's: ${s.time}s</span> <strong>${s.date}</strong></li>`).join('');
    }
});
