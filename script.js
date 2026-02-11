document.addEventListener('DOMContentLoaded', () => {
    const getEl = (id) => document.getElementById(id);

    // State
    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime;
    let isLocked = false;

    const startBtn = getEl('start-btn');

    if (startBtn) {
        startBtn.onclick = () => {
            testSize = parseInt(getEl('test-size').value) || 15;
            getEl('total-count').innerText = testSize;

            getEl('setup-area').classList.add('hidden');
            getEl('game-area').classList.remove('hidden');

            const inputField = getEl('user-input');
            inputField.disabled = false;
            inputField.value = '';
            setTimeout(() => inputField.focus(), 50);

            startTime = Date.now();
            startTimer();
            nextRound();
        };
    }

    function generateTarget() {
        const r = Math.random();
        let digits = 5; // Default

        if (r < 0.10) digits = 3;      // 10%
        else if (r < 0.40) digits = 4; // 30%
        else if (r < 0.80) digits = 5; // 40%
        else digits = 6;               // 20%

        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }

    function nextRound() {
        if (correctCount >= testSize) {
            endGame();
            return;
        }

        getEl('progress').innerText = correctCount;
        const inputField = getEl('user-input');
        inputField.value = '';
        inputField.disabled = false;
        inputField.focus();

        getEl('target-number').innerText = generateTarget();
        isLocked = false;
    }

    getEl('user-input').addEventListener('input', (e) => {
        if (isLocked) return;
        const val = e.target.value;
        const target = getEl('target-number').innerText;

        if (val === target) {
            correctCount++;
            totalAttempts++;
            nextRound();
        } else if (!target.startsWith(val) && val.length > 0) {
            isLocked = true;
            totalAttempts++;
            e.target.disabled = true;
            getEl('app-container').style.borderColor = "#f85149";
            
            setTimeout(() => {
                getEl('app-container').style.borderColor = "#30363d";
                nextRound();
            }, 400);
        }
    });

    function startTimer() {
        timerInterval = setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            getEl('timer').innerText = elapsed;
        }, 100);
    }

    function endGame() {
        clearInterval(timerInterval);
        const finalTime = parseFloat(((Date.now() - startTime) / 1000).toFixed(1));
        const accuracy = Math.round((correctCount / (totalAttempts || 1)) * 100);

        // Hide Game, Show Results
        getEl('game-area').classList.add('hidden');
        getEl('results-area').classList.remove('hidden');

        getEl('final-time').innerText = finalTime;
        getEl('final-accuracy').innerText = accuracy;

        saveAndDisplayLeaderboard(finalTime, accuracy);
    }

    function saveAndDisplayLeaderboard(time, acc) {
        let scores = JSON.parse(localStorage.getItem('np_scores') || "[]");
        
        // Add current score
        scores.push({ time, acc, date: new Date().toLocaleDateString() });

        // Sort: Best time first, then highest accuracy
        scores.sort((a, b) => a.time - b.time || b.acc - a.acc);

        // Keep top 5
        scores = scores.slice(0, 5);
        localStorage.setItem('np_scores', JSON.stringify(scores));

        const list = getEl('leaderboard-list');
        list.innerHTML = scores.map((s, i) => `
            <li class="leaderboard-item">
                <span>#${i+1} <strong>${s.time}s</strong></span>
                <span style="color: #8b949e">${s.acc}% accuracy</span>
            </li>
        `).join('');
    }
});
