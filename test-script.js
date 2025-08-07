// Numeracy Assessment JavaScript
// Save this file as "test-script.js"

// Timer variables
let timeRemaining = 4500; // 75 minutes in seconds
let originalTime = 4500;
let timerInterval = null;
let isRunning = false;

// Correct answers for all questions
const correctAnswers = {
    'q1': '36',
    'q2': '77.07',
    'q3': '7.5',
    'q4': '20',
    'q5': '75',
    'q27': '34'
};

// Timer functions
function startTimer() {
    console.log('Start timer clicked');
    if (isRunning || timeRemaining <= 0) {
        console.log('Timer already running or finished');
        return;
    }
    
    console.log('Starting timer...');
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
        console.log('Timer updated:', display);
    }
}

// Progress tracking
function updateProgress() {
    const totalQuestions = Object.keys(correctAnswers).length;
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

// Submit test function - shows answers inline
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
    
    // Show answers inline for each question
    Object.keys(correctAnswers).forEach(function(questionId) {
        const userAnswer = userAnswers[questionId] || '';
        const correctAnswer = correctAnswers[questionId];
        
        // Get feedback and answer display elements
        const feedbackElement = document.getElementById('feedback-' + questionId);
        const answerElement = document.getElementById('answer-' + questionId);
        
        if (feedbackElement && answerElement) {
            // Show feedback badge
            feedbackElement.style.display = 'block';
            answerElement.style.display = 'block';
            
            if (userAnswer === '') {
                feedbackElement.textContent = 'UNANSWERED';
                feedbackElement.className = 'answer-feedback unanswered';
                answerElement.innerHTML = '<strong>Correct Answer:</strong> ' + correctAnswer;
            } else if (userAnswer === correctAnswer) {
                feedbackElement.textContent = '✓ CORRECT';
                feedbackElement.className = 'answer-feedback correct';
                answerElement.innerHTML = '<strong>✓ Your answer (' + userAnswer + ') is correct!</strong>';
            } else {
                feedbackElement.textContent = '✗ INCORRECT';
                feedbackElement.className = 'answer-feedback incorrect';
                answerElement.innerHTML = '<strong>✗ Your answer:</strong> ' + userAnswer + ' <br><strong>Correct answer:</strong> ' + correctAnswer;
            }
        }
    });
    
    // Disable all inputs
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(function(input) {
        input.disabled = true;
    });
    
    // Show completion message
    alert('Test submitted! Scroll through to see correct answers for each question.');
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
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log('Start button clicked');
            startTimer();
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            console.log('Pause button clicked');
            pauseTimer();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('Reset button clicked');
            resetTimer();
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            console.log('Submit button clicked');
            submitTest();
        });
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
    console.log('Found', inputs.length, 'input elements');
    console.log('Timer buttons found:', {
        start: !!startBtn,
        pause: !!pauseBtn,
        reset: !!resetBtn,
        submit: !!submitBtn
    });
});
