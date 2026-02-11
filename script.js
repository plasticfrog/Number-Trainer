window.onload = function() {
    // 1. SELECTORS: We search for the elements by their tag type to avoid "null" errors
    const startBtn = document.querySelector('button'); 
    const inputField = document.querySelector('input');
    const allSelects = document.querySelectorAll('select');
    const testSizeSelect = allSelects[allSelects.length - 1]; // Grabs the last dropdown found
    
    // We search for these by ID, but add fallbacks just in case
    const targetDisplay = document.getElementById('target-number') || document.querySelector('div[id*="target"]');
    const appContainer = document.getElementById('app-container') || document.querySelector('.app-container') || document.body;

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime, roundStartTime;
    let keyStrokeTimes = [];
    let isLocked = false;

    if (!startBtn) return;

    // 2. THE START COMMAND
    startBtn.onclick = function() {
        // Read test size safely
        testSize = testSizeSelect ? parseInt(testSizeSelect.value) : 15;
        
        // Hide the setup and show the game manually
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
        if (inputField) { 
            inputField.value = ''; 
            inputField.disabled = false; 
            inputField.focus(); 
        }
        if (targetDisplay) targetDisplay.innerText = generateNum();
        roundStartTime = Date.now();
        isLocked = false;
    }

    function generateNum() {
        const length = Math.random() < 0.7 ? (Math.floor(Math.random() * 2) + 4) : (Math.random() < 0.5 ? 3 : 6);
        let num = '';
        for(let i=0; i<length; i++) num += Math.floor(Math.random() * 10);
        return num;
    }

    // 3. INPUT DETECTION
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
                // Error Trigger
                isLocked = true;
                totalAttempts++;
                inputField.disabled = true;
                if (appContainer) appContainer.style.borderColor = "#f85149";
                
                setTimeout(() => {
                    if (appContainer) appContainer.style.borderColor = "";
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
        alert("SPRINT COMPLETE\nTime: " + finalTime + "s\nAccuracy: " + Math.round((correctCount/totalAttempts)*100) + "%");
        location.reload();
    }
};
