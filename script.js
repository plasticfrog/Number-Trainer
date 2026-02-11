window.onload = function() {
    // 1. Grab elements by the EXACT IDs from your HTML
    const startBtn = document.getElementById('start-btn');
    const testSizeSelect = document.getElementById('test-size');
    const inputField = document.getElementById('user-input');
    
    // UI Containers
    const setupArea = document.getElementById('setup-area');
    const gameArea = document.getElementById('game-area');
    const targetDisplay = document.getElementById('target-number');

    // 2. CRITICAL: Stop the script if the core elements are missing
    if (!startBtn || !testSizeSelect) {
        console.error("Missing Elements: Check if your HTML IDs match 'start-btn' and 'test-size'");
        return;
    }

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime, roundStartTime;
    let isLocked = false;

    // 3. START SPRINT LOGIC
    startBtn.onclick = function() {
        // Read the dropdown value
        testSize = parseInt(testSizeSelect.value);
        
        // Update Total Count display if it exists
        const totalDisplay = document.getElementById('total-count');
        if (totalDisplay) totalDisplay.innerText = testSize;

        // Toggle Screens
        if (setupArea) setupArea.style.display = 'none';
        if (gameArea) {
            gameArea.style.display = 'block';
            gameArea.classList.remove('hidden');
        }

        // Prepare Input
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
        if (correctCount >= testSize) {
            endGame();
            return;
        }
        if (inputField) {
            inputField.value = '';
            inputField.disabled = false;
            inputField.focus();
        }
        // Random 5-digit number for the trainer
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
                // Mistake Penalty
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
        
        // Show result and reload
        alert(`SPRINT COMPLETE\nTime: ${finalTime}s\nAccuracy: ${accuracy}%`);
        location.reload();
    }
};
