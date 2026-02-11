document.addEventListener('DOMContentLoaded', () => {
    const getEl = (id) => document.getElementById(id);

    // Global Game State
    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime;
    let isLocked = false;

    // View Containers
    const setupArea = getEl('setup-area');
    const gameArea = getEl('game-area');
    const resultsArea = getEl('results-area');

    getEl('start-btn').onclick = () => {
        // 1. Reset variables for fresh start
        correctCount = 0;
        totalAttempts = 0;
        isLocked = false;
        
        // 2. Set test size
        testSize = parseInt(getEl('test-size').value) || 15;
        getEl('total-count').innerText = testSize;
        getEl('progress').innerText = "0";

        // 3. Switch Views
        setupArea.classList.add('hidden');
        resultsArea.classList.add('hidden');
        gameArea.classList.remove('hidden');

        // 4. Prep Input
        const inputField = getEl('user-input');
        inputField.disabled = false;
        inputField.value = '';
        setTimeout(() => inputField.focus(), 50);

        // 5. Start Clock
        startTime = Date.now();
        startTimer();
        nextRound();
    };

    function generateTarget() {
        const r = Math.random();
        let digits = 5; 
        if (r < 0.10) digits = 3;      // 10%
        else if (r < 0.40) digits = 4; // 30%
        else if (r < 0.80) digits = 5; // 40%
        else digits = 6;               // 20%

        const min = Math.pow(10, digits - 1);
        const max = Math.pow(10, digits) - 1;
        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }

    function nextRound() {
        // Critical Check: Is sprint finished?
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
            nextRound(); // This will check if we hit testSize
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
        if (timerInterval) clearInterval(timerInterval);
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
        gameArea.classList.add('hidden');
        resultsArea.classList.remove('hidden');

        getEl('final-time').innerText = finalTime;
        getEl('final-accuracy').innerText = accuracy;

        saveAndDisplayLeaderboard(finalTime, accuracy);
    }

    function saveAndDisplayLeaderboard(time, acc) {
        let scores = JSON.parse(localStorage.getItem('np_scores_v2') || "[]");
        scores.push({ time, acc });
        // Sort by time (fastest first)
        scores.sort((a, b) => a.time - b.time);
        scores = scores.slice(0, 5);
        localStorage.setItem('np_scores_v2', JSON.stringify(scores));

        const list = getEl('leaderboard-list');
        list.innerHTML = scores.map((s, i) => `
            <li class="leaderboard-item">
                <span>#${i+1} <strong>${s.time}s</strong></span>
                <span class="muted-text">${s.acc}% acc</span>
            </li>
        `).join('');
    }
});
