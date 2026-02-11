window.onload = function() {
    // 1. SELECTORS BY TAG TYPE (Avoids the 'null' ID error entirely)
    const btn = document.querySelector('button');
    const input = document.querySelector('input');
    const select = document.querySelector('select');
    const app = document.querySelector('.app-container') || document.querySelector('.app-frame') || document.body;

    // We find the display areas by looking for divs that aren't hidden
    const divs = document.querySelectorAll('div');
    let targetDisplay = document.getElementById('target-number');
    let setupArea = document.getElementById('setup-area');
    let gameArea = document.getElementById('game-area');

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime, roundStartTime;
    let keyStrokeTimes = [];
    let isLocked = false;

    if (!btn) return;

    // 2. THE START COMMAND
    btn.onclick = function() {
        // Read the value from the FIRST dropdown found on the page
        testSize = select ? parseInt(select.value) : 15;
        
        // Hide/Show logic using whatever IDs exist
        if (setupArea) setupArea.style.display = 'none';
        if (gameArea) {
            gameArea.style.display = 'block';
            gameArea.classList.remove('hidden');
        }

        const totalDisplay = document.getElementById('total-count');
        if (totalDisplay) totalDisplay.innerText = testSize;

        if (input) {
            input.disabled = false;
            input.value = '';
            input.focus();
        }
        
        startTime = Date.now();
        startTimer();
        nextRound();
    };

    function nextRound() {
        if (correctCount >= testSize) { endGame(); return; }
        if (input) { 
            input.value = ''; 
            input.disabled = false; 
            input.focus(); 
        }
        if (targetDisplay) {
            const len = Math.random() < 0.7 ? (Math.floor(Math.random() * 2) + 4) : (Math.random() < 0.5 ? 3 : 6);
            let num = '';
            for(let i=0; i<len; i++) num += Math.floor(Math.random() * 10);
            targetDisplay.innerText = num;
        }
        roundStartTime = Date.now();
        isLocked = false;
    }

    // 3. TYPING LOGIC
    if (input) {
        input.oninput = function() {
            if (isLocked) return;
            const val = input.value;
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
                input.disabled = true;
                if (app) app.style.borderColor = "#f85149";
                
                setTimeout(() => {
                    if (app) app.style.borderColor = "";
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
