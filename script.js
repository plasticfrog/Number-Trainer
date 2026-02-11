window.onload = function() {
    // 1. FORCED SELECTORS: No IDs used here to prevent the "null" crash
    const startBtn = document.querySelector('button'); 
    const inputField = document.querySelector('input');
    const selectMenu = document.querySelector('select');
    
    // Fallback for the target number display
    const targetDisplay = document.getElementById('target-number') || document.querySelector('div[style*="font-size"]');
    const appFrame = document.querySelector('.app-container') || document.querySelector('.app-frame') || document.body;

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime, roundStartTime;
    let keyStrokeTimes = [];
    let isLocked = false;

    if (!startBtn) {
        alert("CRITICAL ERROR: No button found on page.");
        return;
    }

    // 2. THE START LOGIC
    startBtn.onclick = function() {
        // Read test size safely from whatever dropdown exists
        testSize = selectMenu ? parseInt(selectMenu.value) : 15;
        
        // Find areas to hide/show by looking for common patterns
        const setup = document.getElementById('setup-area') || document.querySelector('div:first-of-type');
        const game = document.getElementById('game-area') || document.querySelector('.hidden') || document.querySelectorAll('div')[2];
        
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
        if (targetDisplay) {
            // Generates 3-6 digits automatically
            const len = Math.random() < 0.7 ? (Math.floor(Math.random() * 2) + 4) : (Math.random() < 0.5 ? 3 : 6);
            let num = '';
            for(let i=0; i<len; i++) num += Math.floor(Math.random() * 10);
            targetDisplay.innerText = num;
        }
        roundStartTime = Date.now();
        isLocked = false;
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
                // ERROR PENALTY
                isLocked = true;
                totalAttempts++;
                inputField.disabled = true;
                if (appFrame) appFrame.style.borderColor = "red";
                
                setTimeout(() => {
                    if (appFrame) appFrame.style.borderColor = "";
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
        const acc = Math.round((correctCount / (totalAttempts || 1)) * 100);
        alert(`SPRINT COMPLETE\nTime: ${finalTime}s\nAccuracy: ${acc}%`);
        location.reload();
    }
};
