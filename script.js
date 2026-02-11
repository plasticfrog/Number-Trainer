window.onload = function() {
    // 1. Core Variables
    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval;
    let startTime;
    let roundStartTime;
    let keyStrokeTimes = [];
    let isLocked = false;

    // 2. Element Selectors (Searching for both possible ID names to prevent 'null' errors)
    const startBtn = document.getElementById('start-btn') || document.querySelector('button');
    const inputField = document.getElementById('user-input') || document.querySelector('input[type="text"]');
    const targetDisplay = document.getElementById('target-number');
    const appContainer = document.getElementById('app-container') || document.getElementById('app-frame');
    const testSizeSelect = document.getElementById('test-size') || document.getElementById('test-length') || document.querySelector('select');

    // 3. The Start Function
    if (startBtn) {
        startBtn.onclick = function() {
            // Safely get the test size
            if (testSizeSelect) {
                testSize = parseInt(testSizeSelect.value) || 15;
            }

            // Update UI elements if they exist
            const totalDisplay = document.getElementById('total-count');
            if (totalDisplay) totalDisplay.innerText = testSize;

            const setupArea = document.getElementById('setup-area');
            const gameArea = document.getElementById('game-area');
            
            if (setupArea) setupArea.classList.add('hidden');
            if (gameArea) gameArea.classList.remove('hidden');
            
            if (inputField) {
                inputField.disabled = false;
                inputField.value = '';
                inputField.focus();
            }
            
            startTime = Date.now();
            startTimer();
            nextRound();
        };
    }

    // 4. Game Logic
    function nextRound() {
        if (correctCount >= testSize) {
            endGame();
            return;
        }
        if (inputField) {
            inputField.value = '';
            inputField.disabled = false;
            inputField.focus();
        }
        if (targetDisplay) targetDisplay.innerText = generateNumber();
        roundStartTime = Date.now();
        isLocked = false;
    }

    function generateNumber() {
        const rand = Math.random();
        let length = rand < 0.7 ? (Math.floor(Math.random() * 2) + 4) : (Math.random() < 0.5 ? 3 : 6);
        let num = '';
        for(let i=0; i<length; i++) num += Math.floor(Math.random() * 10);
        return num;
    }

    if (inputField) {
        inputField.oninput = function() {
            if (isLocked) return;
            const val = inputField.value;
            const target = targetDisplay ? targetDisplay.innerText : "";

            if (target.startsWith(val)) {
                if (val === target) {
                    keyStrokeTimes.push(Date.now() - roundStartTime);
                    correctCount++;
                    totalAttempts++;
                    const progDisplay = document.getElementById('progress');
                    if (progDisplay) progDisplay.innerText = correctCount;
                    nextRound();
                }
            } else {
                triggerError();
            }
        };
    }

    function triggerError() {
        isLocked = true;
        totalAttempts++;
        if (inputField) inputField.disabled = true;
        if (appContainer) appContainer.style.borderColor = "#f85149";
        
        setTimeout(() => {
            if (appContainer) appContainer.style.borderColor = "#30363d";
            nextRound();
        }, 500);
    }

    function startTimer() {
        const timerDisplay = document.getElementById('timer');
        timerInterval = setInterval(() => {
            const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            if (timerDisplay) timerDisplay.innerText = timeElapsed;
        }, 100);
    }

    function endGame() {
        clearInterval(timerInterval);
        const finalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        if (inputField) inputField.disabled = true;
        
        const gameArea = document.getElementById('game-area');
        const resultsArea = document.getElementById('results');
        if (gameArea) gameArea.classList.add('hidden');
        if (resultsArea) resultsArea.classList.remove('hidden');

        const accuracy = Math.round((correctCount / (totalAttempts || 1)) * 100);
        const avgLatency = (keyStrokeTimes.reduce((a, b) => a + b, 0) / (keyStrokeTimes.length || 1) / 1000).toFixed(2);

        if (document.getElementById('final-time')) document.getElementById('final-time').innerText = finalTime;
        if (document.getElementById('accuracy')) document.getElementById('accuracy').innerText = accuracy;
        if (document.getElementById('avg-speed')) document.getElementById('avg-speed').innerText = avgLatency + "s";
    }
};
