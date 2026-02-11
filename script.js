window.onload = function() {
    // 1. SELECT BY TAG (Bypasses ID-related 'null' errors)
    const startBtn = document.querySelector('button');
    const inputField = document.querySelector('input');
    const testSelect = document.querySelector('select');
    
    // Displays
    const targetDisplay = document.getElementById('target-number') || document.querySelector('div[id*="target"]');
    const container = document.getElementById('app-container') || document.body.firstElementChild;

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime, roundStartTime;
    let isLocked = false;

    if (!startBtn) return;

    // 2. START TRIGGER
    startBtn.onclick = function() {
        // Read test size from the dropdown found
        testSize = testSelect ? parseInt(testSelect.value) : 15;
        
        // Manual Toggle of Areas
        const setup = document.getElementById('setup-area') || document.querySelector('div[id*="setup"]');
        const game = document.getElementById('game-area') || document.querySelector('div[id*="game"]');
        
        if (setup) setup.style.display = 'none';
        if (game) {
            game.style.display = 'block';
            game.classList.remove('hidden');
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
        if (inputField) { inputField.value = ''; inputField.disabled = false; inputField.focus(); }
        if (targetDisplay) {
            // Internal number generator
            targetDisplay.innerText = Math.floor(Math.random() * 90000 + 10000).toString();
        }
        roundStartTime = Date.now();
        isLocked = false;
    }

    // 3. TYPING & ERROR LOGIC
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
                if (container) container.style.borderColor = "red";
                
                setTimeout(() => {
                    if (container) container.style.borderColor = "";
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
        alert(`COMPLETE\nTime: ${finalTime}s\nAccuracy: ${Math.round((correctCount/totalAttempts)*100)}%`);
        location.reload();
    }
};
