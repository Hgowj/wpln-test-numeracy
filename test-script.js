// Numeracy Assessment JavaScript
// Save this file as "test-script.js"

// Timer variables
let timeRemaining = 4500; // 75 minutes in seconds
let originalTime = 4500;
let timerInterval = null;
let isRunning = false;

// Correct answers
const correctAnswers = {
    'q1': '36',
    'q2': '20', 
    'q3': '150',
    'q27': '34',
    'q28': '154'
};

// Timer functions
function startTimer() {
    console.log('Starting timer...');
    if (isRunning || timeRemaining <= 0) {
        console.log('Timer already running or finished');
        return;
    }
    
    isRunning = true;
    timerInterval = setInterval(function() {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            pauseTimer();
            alert('Time is up! Test will be submitted automatically.');
            submitTest();
        }
    }, 1000);
}

function pauseTimer() {
    console.log('Pausing timer...');
    isRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resetTimer() {
    console.log('Resetting timer...');
    pauseTimer();
    timeRemaining = originalTime;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    
    const timerElement = document.getElementById('timeDisplay');
    if (timerElement) {
        timerElement.textContent = display;
    }
}

// Progress tracking
function updateProgress() {
    const totalQuestions = 5; // Simplified for demo
    let answered = 0;
    
    // Count text inputs with values
    const textInputs = document.querySelectorAll('input[type="number"]');
    textInputs.forEach(function(input) {
        if (input.value.trim() !== '') {
            answered++;
        }
    });
    
    // Count selected radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]:checked');
    answered += radioButtons.length;
    
    const progressPercentage = (answered / totalQuestions) * 100;
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
    }
}

// Submit test function
function submitTest() {
    console.log('Submitting test...');
    pauseTimer();
    
    // Collect user answers
    const userAnswers = {};
    
    // Get text input answers
    const textInputs = document.querySelectorAll('input[type="number"]');
    textInputs.forEach(function(input) {
        if (input.id) {
            userAnswers[input.id] = input.value.trim();
        }
    });
    
    // Get radio button answers
    const radioInputs = document.querySelectorAll('input[type="radio"]:checked');
    radioInputs.forEach(function(input) {
        userAnswers[input.name] = input.value;
    });
    
    // Calculate results
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    const results = [];
    
    Object.keys(correctAnswers).forEach(function(questionId) {
        const userAnswer = userAnswers[questionId] || '';
        const correctAnswer = correctAnswers[questionId];
        
        if (userAnswer === '') {
            unanswered++;
            results.push({
                question: questionId,
                status: 'unanswered',
                userAnswer: 'No answer',
                correctAnswer: correctAnswer
            });
        } else if (userAnswer === correctAnswer) {
            correct++;
            results.push({
                question: questionId,
                status: 'correct',
                userAnswer: userAnswer,
                correctAnswer: correctAnswer
            });
        } else {
            incorrect++;
            results.push({
                question: questionId,
                status: 'incorrect',
                userAnswer: userAnswer,
                correctAnswer: correctAnswer
            });
        }
    });
    
    showResults(correct, incorrect, unanswered, results);
}

// Show results modal
function showResults(correct, incorrect, unanswered, results) {
    const modal = document.getElementById('resultsModal');
    const content = document.getElementById('resultsContent');
    
    const total = correct + incorrect + unanswered;
    const percentage = Math.round((correct / total) * 100);
    
    let html = `
        <div class="score-summary">
            <h2>Test Results</h2>
            <h3>Score: ${correct}/${total} (${percentage}%)</h3>
        </div>
        
        <div class="score-details">
            <div class="score-card correct">
                <h4>Correct</h4>
                <p style="font-size: 24px; margin: 5px 0;">${correct}</p>
            </div>
            <div class="score-card incorrect">
                <h4>Incorrect</h4>
                <p style="font-size: 24px; margin: 5px 0;">${incorrect}</p>
            </div>
            <div class="score-card unanswered">
                <h4>Unanswered</h4>
                <p style="font-size: 24px; margin: 5px 0;">${unanswered}</p>
            </div>
        </div>
        
        <h3>Detailed Results:</h3>
        <div style="max-height: 300px; overflow-y: auto;">
    `;
    
    results.forEach(function(result) {
        const statusClass = result.status === 'correct' ? 'correct-answer' : 
                          result.status === 'incorrect' ? 'incorrect-answer' : 'unanswered';
        const statusText = result.status === 'correct' ? 'CORRECT' : 
                         result.status === 'incorrect' ? 'WRONG' : 'UNANSWERED';
        const statusBadgeClass = 'status-' + result.status;
        
        html += `
            <div class="answer-item ${statusClass}">
                <div>
                    <strong>${result.question.toUpperCase()}:</strong> 
                    Your answer: <code>${result.userAnswer}</code> | 
                    Correct: <code>${result.correctAnswer}</code>
                </div>
                <span class="answer-status ${statusBadgeClass}">${statusText}</span>
            </div>
        `;
    });
    
    html += '</div>';
    
    content.innerHTML = html;
    modal.style.display = 'flex';
}

// Close results modal
function closeResults() {
    const modal = document.getElementById('resultsModal');
    modal.style.display = 'none';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Add event listeners to timer buttons
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const submitBtn = document.getElementById('submitBtn');
    const closeBtn = document.getElementById('closeBtn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startTimer);
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', pauseTimer);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTimer);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', submitTest);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeResults);
    }
    
    // Add progress tracking to all inputs
    const inputs = document.querySelectorAll('input[type="radio"], input[type="number"]');
    inputs.forEach(function(input) {
        input.addEventListener('change', updateProgress);
        input.addEventListener('input', updateProgress);
    });
    
    // Initial progress update
    updateProgress();
    
    console.log('Initialization complete!');
});
