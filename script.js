// Function to start the whole app
function init() {
    let correctCount = 0;
    let totalAttempts = 0;
    let testSize = 15;
    let timerInterval;
    let startTime;
    let roundStartTime;
    let keyStrokeTimes = [];
    let isLocked = false;

    const startBtn = document.getElementById('start-btn');
    const inputField = document.getElementById('user-input');
    const targetDisplay = document.getElementById('target-number');
    const appContainer = document.getElementById('app-container');

    if (!startBtn) return; // Guard clause

    startBtn.onclick = () => {
        testSize = parseInt(document.getElementById('test-size').value);
        document.getElementById('total-count').innerText = testSize;
        document.getElementById('setup-area').classList.add('hidden');
        document.getElementById('game-area').classList.remove('hidden');
        
        inputField.disabled = false;
        inputField.focus();
        
        startTime = Date.now();
        startTimer();
        nextRound();
    };

    function nextRound() {
        if (correctCount >= testSize) {
            endGame();
            return;
        }
        inputField.value = '';
        targetDisplay.innerText = generateNumber();
        roundStartTime = Date.now();
        isLocked = false;
        inputField.disabled = false;
        inputField.focus();
    }

    function generateNumber() {
        const rand = Math.random();
        let length = rand < 0.7 ? (Math.floor(Math.random() * 2) + 4) : (Math.random() < 0.5 ? 3 : 6);
        let num = '';
        for(let i=0; i<length; i++) num += Math.floor(Math.random() * 10);
        return num;
    }

    inputField.oninput = () => {
        if (isLocked) return;
        const val = inputField.value;
        const target = targetDisplay.innerText;

        if (target.startsWith(val)) {
            if (val === target) {
                keyStrokeTimes.push(Date.now() - roundStartTime);
                correctCount++;
                totalAttempts++;
                document.getElementById('progress').innerText = correctCount;
                nextRound();
            }
        } else {
            triggerError();
        }
    };

    function triggerError() {
        isLocked = true;
        totalAttempts++;
        inputField.disabled = true;
        appContainer.style.borderColor = "#f85149";
        
        setTimeout(() => {
            appContainer.style.borderColor = "#30363d";
            nextRound();
        }, 500);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            document.getElementById('timer').innerText = timeElapsed;
        }, 100);
    }

    function endGame() {
        clearInterval(timerInterval);
        const finalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        inputField.disabled = true;
        document.getElementById('game-area').classList.add('hidden');
        document.getElementById('results').classList.remove('hidden');

        const accuracy = Math.round((correctCount / totalAttempts) * 100);
        const avgLatency = (keyStrokeTimes.reduce((a, b) => a + b, 0) / (keyStrokeTimes.length || 1) / 1000).toFixed(2);

        document.getElementById('final-time').innerText = finalTime;
        document.getElementById('accuracy').innerText = accuracy;
        document.getElementById('avg-speed').innerText = avgLatency + "s";
    }
}

// Run the initialization
init();
