document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    
    // Game State
    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime;
    let isLocked = false;

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Re-select elements to ensure they exist
            const testSizeSelect = document.getElementById('test-size');
            const setupArea = document.getElementById('setup-area');
            const gameArea = document.getElementById('game-area');
            const totalCountEl = document.getElementById('total-count');
            const inputField = document.getElementById('user-input');

            // 1. Set the test size
            if (testSizeSelect) {
                testSize = parseInt(testSizeSelect.value);
            }
            if (totalCountEl) {
                totalCountEl.innerText = testSize;
            }

            // 2. Switch Screens
            if (setupArea) setupArea.style.display = 'none';
            if (gameArea) gameArea.style.display = 'block';

            // 3. Prep Input
            if (inputField) {
                inputField.disabled = false;
                inputField.value = '';
                setTimeout(() => inputField.focus(), 10);
            }

            // 4. Start Game
            startTime = Date.now();
            startTimer();
            nextRound();
        });
    }

    function nextRound() {
        const inputField = document.getElementById('user-input');
        const targetDisplay = document.getElementById('target-number');

        if (correctCount >= testSize) {
            endGame();
            return;
        }

        if (inputField) {
            inputField.value = '';
            inputField.disabled = false;
            inputField.focus();
        }

        if (targetDisplay) {
            targetDisplay.innerText = Math.floor(10000 + Math.random() * 90000).toString();
        }
        isLocked = false;
    }

    // Handle Typing
    const inputField = document.getElementById('user-input');
    if (inputField) {
        inputField.addEventListener('input', (e) => {
            if (isLocked) return;

            const val = e.target.value;
            const target = document.getElementById('target-number').innerText;
            const container = document.getElementById('app-container');

            if (val === target) {
                correctCount++;
                totalAttempts++;
                document.getElementById('progress').innerText = correctCount;
                nextRound();
            } else if (!target.startsWith(val) && val.length > 0) {
                isLocked = true;
                totalAttempts++;
                e.target.disabled = true;
                if (container) container.style.borderColor = "#f85149";
                
                setTimeout(() => {
                    if (container) container.style.borderColor = "#30363d";
                    nextRound();
                }, 500);
            }
        });
    }

    function startTimer() {
        const timerEl = document.getElementById('timer');
        timerInterval = setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            if (timerEl) timerEl.innerText = elapsed;
        }, 100);
    }

    function endGame() {
        clearInterval(timerInterval);
        const finalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        const accuracy = Math.round((correctCount / (totalAttempts || 1)) * 100);
        alert(`SPRINT COMPLETE\nTime: ${finalTime}s\nAccuracy: ${accuracy}%`);
        location.reload();
    }
});
