window.onload = function() {
    const startBtn = document.getElementById('start-btn');
    const testSizeSelect = document.getElementById('test-size');
    const inputField = document.getElementById('user-input');
    const setupArea = document.getElementById('setup-area');
    const gameArea = document.getElementById('game-area');
    const targetDisplay = document.getElementById('target-number');
    const progressEl = document.getElementById('progress');
    const totalCountEl = document.getElementById('total-count');
    const container = document.getElementById('app-container');

    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval, startTime;
    let isLocked = false;

    if (startBtn) {
        startBtn.onclick = function() {
            // Set test size
            testSize = parseInt(testSizeSelect.value) || 15;
            if (totalCountEl) totalCountEl.innerText = testSize;
            
            // Switch UI
            setupArea.classList.add('hidden');
            gameArea.classList.remove('hidden');

            // Enable Input
            inputField.disabled = false;
            inputField.value = '';
            inputField.focus();
            
            // Start Logic
            startTime = Date.now();
            startTimer();
            nextRound();
        };
    }

    function nextRound() {
        if (correctCount >= testSize) { 
            endGame(); 
            return; 
        }
        
        inputField.value = '';
        inputField.disabled = false;
        inputField.focus();
        
        // Generate a random 5-digit number
        targetDisplay.innerText = Math.floor(10000 + Math.random() * 90000).toString();
        isLocked = false;
    }

    inputField.oninput = function() {
        if (isLocked) return;
        
        const val = inputField.value;
        const target = targetDisplay.innerText;

        if (val === target) {
            correctCount++;
            totalAttempts++;
            if (progressEl) progressEl.innerText = correctCount;
            nextRound();
        } else if (!target.startsWith(val) && val.length > 0) {
            // Error handling
            isLocked = true;
            totalAttempts++;
            inputField.disabled = true;
            container.style.borderColor = "#f85149"; // Flash red
            
            setTimeout(() => {
                container.style.borderColor = "#30363d"; // Reset border
                nextRound();
            }, 500);
        }
    };

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
