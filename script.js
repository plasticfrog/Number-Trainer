window.onload = function() {
    // 1. DYNAMIC SELECTORS: If ID fails, find by Tag Name
    const startBtn = document.getElementById('start-btn') || document.querySelector('button');
    const testSizeSelect = document.getElementById('test-size') || document.querySelector('select');
    const inputField = document.getElementById('user-input') || document.querySelector('input');
    
    // UI Elements
    const setupArea = document.getElementById('setup-area');
    const gameArea = document.getElementById('game-area');
    const targetDisplay = document.getElementById('target-number');

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime, roundStartTime;
    let isLocked = false;

    // 2. THE START TRIGGER
    if (startBtn) {
        startBtn.onclick = function() {
            // Read value safely - fallback to 15 if somehow still null
            testSize = (testSizeSelect && testSizeSelect.value) ? parseInt(testSizeSelect.value) : 15;
            
            // UI Toggle
            if (setupArea) setupArea.style.display = 'none';
            if (gameArea) {
                gameArea.style.display = 'block';
                gameArea.classList.remove('hidden');
            }

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

    function nextRound() {
        if (correctCount >= testSize) { endGame(); return; }
        if (inputField) { inputField.value = ''; inputField.disabled = false; inputField.focus(); }
        
        // Generate a 5-digit number
        if (targetDisplay) targetDisplay.innerText = Math.floor(10000 + Math.random() * 90000).toString();
        
        roundStartTime = Date.now();
        isLocked = false;
    }

    if (inputField) {
        inputField.oninput = function() {
            if (isLocked) return;
            const val = inputField.value;
            const target = targetDisplay ? targetDisplay.innerText : "";

            if (val === target) {
                correctCount++;
                totalAttempts++;
                const prog = document.getElementById('progress');
                if (prog) prog.innerText = correctCount;
                nextRound();
            } else if (!target.startsWith(val)) {
                // RED FLASH ERROR
                isLocked = true;
                totalAttempts++;
                inputField.disabled = true;
                const container = document.getElementById('app-container');
                if (container) container.style.borderColor = "#f85149";
                
                setTimeout(() => {
                    if (container) container.style.borderColor = "#30363d";
                    nextRound();
                }, 500);
            }
        };
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
};
