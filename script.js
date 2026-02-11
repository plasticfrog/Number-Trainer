window.onload = function() {
    // 1. Bulletproof Selectors (No IDs used to prevent "null" errors)
    const startBtn = document.querySelector('button'); 
    const testSizeSelect = document.querySelector('select');
    const inputField = document.querySelector('input');
    
    // UI Elements
    const setupArea = document.getElementById('setup-area');
    const gameArea = document.getElementById('game-area');
    const targetDisplay = document.getElementById('target-number') || document.querySelector('div[id*="target"]');

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime, roundStartTime;
    let keyStrokeTimes = [];
    let isLocked = false;

    if (!startBtn) return;

    // 2. The Start Trigger
    startBtn.onclick = function() {
        // Read test size from whatever dropdown exists
        testSize = testSizeSelect ? parseInt(testSizeSelect.value) : 15;
        
        // Hide setup, show game
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

    function nextRound() {
        if (correctCount >= testSize) { endGame(); return; }
        if (inputField) { 
            inputField.value = ''; 
            inputField.disabled = false; 
            inputField.focus(); 
        }
        // Generate a random 5-digit number
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
                keyStrokeTimes.push(Date.now() - roundStartTime);
                correctCount++;
                totalAttempts++;
                const prog = document.getElementById('progress');
                if (prog) prog.innerText = correctCount;
                nextRound();
            } else if (!target.startsWith(val)) {
                // Mistake Logic: Flash red border and delay
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
        alert(`SPRINT COMPLETE\nTime: ${finalTime}s\nAccuracy: ${Math.round((correctCount/totalAttempts)*100)}%`);
        location.reload();
    }
};
