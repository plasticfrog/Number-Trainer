window.onload = function() {
    // Selectors that don't rely on specific ID names
    const startBtn = document.querySelector('button'); 
    const inputField = document.querySelector('input[type="text"]');
    const allSelects = document.querySelectorAll('select');
    const testSizeSelect = allSelects[allSelects.length - 1]; // Grabs the last dropdown
    const targetDisplay = document.getElementById('target-number') || document.querySelector('div:not([id])');
    const appContainer = document.querySelector('.app-container') || document.querySelector('.app-frame') || document.body.firstElementChild;

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime, roundStartTime;
    let keyStrokeTimes = [];
    let isLocked = false;

    if (!startBtn) return;

    startBtn.onclick = function() {
        testSize = testSizeSelect ? parseInt(testSizeSelect.value) : 15;
        
        // Find and hide setup, show game area by searching for children
        const setup = document.getElementById('setup-area') || appContainer.children[0];
        const game = document.getElementById('game-area') || appContainer.children[1];
        
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
        if (targetDisplay) targetDisplay.innerText = Math.random().toString().slice(2, 7); // Fallback generator
        roundStartTime = Date.now();
        isLocked = false;
    }

    if (inputField) {
        inputField.oninput = function() {
            if (isLocked) return;
            if (inputField.value === targetDisplay.innerText) {
                keyStrokeTimes.push(Date.now() - roundStartTime);
                correctCount++;
                totalAttempts++;
                nextRound();
            } else if (!targetDisplay.innerText.startsWith(inputField.value)) {
                isLocked = true;
                totalAttempts++;
                inputField.disabled = true;
                appContainer.style.borderColor = "red";
                setTimeout(() => {
                    appContainer.style.borderColor = "";
                    nextRound();
                }, 500);
            }
        };
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const timerEl = document.getElementById('timer');
            if (timerEl) timerEl.innerText = elapsed;
        }, 100);
    }

    function endGame() {
        clearInterval(timerInterval);
        alert("Sprint Complete! Accuracy: " + Math.round((correctCount/totalAttempts)*100) + "%");
        location.reload();
    }
};
