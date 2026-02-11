document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS WITH FALLBACKS
    const getEl = (id, tag) => document.getElementById(id) || document.querySelector(tag);

    const startBtn = getEl('start-btn', 'button');
    const container = getEl('app-container', '.app-container');

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime;
    let isLocked = false;

    if (startBtn) {
        startBtn.onclick = () => {
            // Find elements inside the click to ensure they exist
            const testSizeSelect = getEl('test-size', 'select');
            const setupArea = getEl('setup-area', '#setup-area');
            const gameArea = getEl('game-area', '#game-area');
            const totalCountEl = getEl('total-count', '#total-count');
            const inputField = getEl('user-input', 'input');

            // Set test size (safely)
            testSize = testSizeSelect ? parseInt(testSizeSelect.value) : 15;
            if (totalCountEl) totalCountEl.innerText = testSize;

            // Toggle screens
            if (setupArea) setupArea.style.display = 'none';
            if (gameArea) gameArea.style.display = 'block';

            // Focus input
            if (inputField) {
                inputField.disabled = false;
                inputField.value = '';
                setTimeout(() => inputField.focus(), 50);
            }

            startTime = Date.now();
            startTimer();
            nextRound();
        };
    }

    function nextRound() {
        const inputField = getEl('user-input', 'input');
        const targetDisplay = getEl('target-number', '#target-number');
        const progressEl = getEl('progress', '#progress');

        if (correctCount >= testSize) {
            endGame();
            return;
        }

        if (progressEl) progressEl.innerText = correctCount;
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

    // Handle Input
    document.addEventListener('input', (e) => {
        if (e.target.id !== 'user-input' && e.target.tagName !== 'INPUT') return;
        if (isLocked) return;

        const val = e.target.value;
        const targetDisplay = getEl('target-number', '#target-number');
        const target = targetDisplay ? targetDisplay.innerText : "";

        if (val === target) {
            correctCount++;
            totalAttempts++;
            nextRound();
        } else if (target && !target.startsWith(val) && val.length > 0) {
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

    function startTimer() {
        const timerEl = getEl('timer', '#timer');
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
