/* ============================================
   PROPOSAL GAME - JAVASCRIPT
   Author: Created for a special proposal
   Date: February 7th, 2026
   Email: testerofscratchcode@gmail.com
   ============================================ */

// ============================================
// GLOBAL VARIABLES
// ============================================
let gamesCompleted = 0;
const totalGames = 3;

// ============================================
// EMAIL INITIALIZATION
// ============================================
(function(){
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key
})();

// ============================================
// FLOATING HEARTS ANIMATION
// ============================================
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart-float';
        heart.textContent = '💕';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (5 + Math.random() * 5) + 's';
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 8000);
    }, 1000);
}

// Start floating hearts when page loads
createFloatingHearts();

// ============================================
// PROGRESS & GAME MANAGEMENT
// ============================================
function updateProgress() {
    document.getElementById('progress').textContent = 
        `Complete all games to unlock your surprise! (${gamesCompleted}/${totalGames})`;
    
    if (gamesCompleted === totalGames) {
        setTimeout(() => {
            document.getElementById('gameSelector').style.display = 'none';
            document.getElementById('proposalSection').classList.add('active');
        }, 1000);
    }
}

function startGame(gameType) {
    const card = document.getElementById(gameType + 'Card');
    if (card.classList.contains('locked')) return;
    
    document.getElementById('gameSelector').style.display = 'none';
    document.getElementById(gameType + 'Game').classList.add('active');
    
    if (gameType === 'memory') initMemoryGame();
    if (gameType === 'puzzle') initPuzzleGame();
    if (gameType === 'trivia') initTriviaGame();
}

function backToMenu() {
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });
    document.getElementById('gameSelector').style.display = 'grid';
}

function completeGame(gameType) {
    const card = document.getElementById(gameType + 'Card');
    card.classList.add('completed');
    gamesCompleted++;
    updateProgress();
    
    // Unlock next game
    if (gameType === 'memory') {
        document.getElementById('puzzleCard').classList.remove('locked');
    } else if (gameType === 'puzzle') {
        document.getElementById('triviaCard').classList.remove('locked');
    }
}

// ============================================
// GAME 1: MEMORY MATCH
// ============================================
const memoryEmojis = ['💕', '💖', '💝', '💗', '🌹', '💐', '🎁', '⭐'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;

function initMemoryGame() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    memoryCards = [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5);
    flippedCards = [];
    matchedPairs = 0;
    
    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="front">❤️</div>
            <div class="back">${emoji}</div>
        `;
        card.onclick = () => flipCard(card, index, emoji);
        grid.appendChild(card);
    });
}

function flipCard(card, index, emoji) {
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    
    card.classList.add('flipped');
    flippedCards.push({ card, index, emoji });
    
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    
    if (first.emoji === second.emoji) {
        first.card.classList.add('matched');
        second.card.classList.add('matched');
        matchedPairs++;
        
        if (matchedPairs === memoryEmojis.length) {
            document.getElementById('memoryMessage').textContent = '🎉 Perfect! You remembered everything! 🎉';
            setTimeout(() => {
                completeGame('memory');
                backToMenu();
            }, 2000);
        }
    } else {
        first.card.classList.remove('flipped');
        second.card.classList.remove('flipped');
    }
    
    flippedCards = [];
}

// ============================================
// GAME 2: HEART SEQUENCE (Tap in Order)
// ============================================
let puzzleNumbers = [];
let currentNumber = 1;

function initPuzzleGame() {
    puzzleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    currentNumber = 1;
    renderPuzzle();
}

function renderPuzzle() {
    const grid = document.getElementById('puzzleGrid');
    grid.innerHTML = '';
    
    puzzleNumbers.forEach((num, index) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.innerHTML = `<div style="font-size: 0.8em;">❤️</div><div>${num}</div>`;
        piece.id = `puzzle-${num}`;
        piece.onclick = () => tapNumber(num, piece);
        grid.appendChild(piece);
    });
}

function tapNumber(num, piece) {
    if (num === currentNumber) {
        piece.style.background = 'linear-gradient(135deg, #90EE90 0%, #32CD32 100%)';
        piece.style.transform = 'scale(1.2)';
        piece.style.pointerEvents = 'none';
        
        currentNumber++;
        
        if (currentNumber > 9) {
            document.getElementById('puzzleMessage').textContent = '🎉 Perfect! Our hearts beat as one! 🎉';
            setTimeout(() => {
                completeGame('puzzle');
                backToMenu();
            }, 2000);
        }
    } else {
        piece.style.animation = 'shake 0.5s';
        setTimeout(() => {
            piece.style.animation = '';
        }, 500);
    }
}

// ============================================
// GAME 3: LOVE TRIVIA
// ============================================
const triviaQuestions = [
    {
        question: "What makes our relationship special?",
        options: ["Your amazing smile", "Our deep connection", "Every moment together", "All of the above ❤️"],
        correct: 3
    },
    {
        question: "What do I love most about you?",
        options: ["Your kindness", "Your laugh", "Your heart", "Everything about you 💕"],
        correct: 3
    },
    {
        question: "How do I feel when I'm with you?",
        options: ["Complete", "Happy", "In love", "All of these and more! 💖"],
        correct: 3
    }
];

let currentQuestion = 0;

function initTriviaGame() {
    currentQuestion = 0;
    showTriviaQuestion();
}

function showTriviaQuestion() {
    const container = document.getElementById('triviaContainer');
    const q = triviaQuestions[currentQuestion];
    
    container.innerHTML = `
        <div class="trivia-question">
            <h3>Question ${currentQuestion + 1} of ${triviaQuestions.length}</h3>
            <p style="font-size: 1.3em; margin: 20px 0;">${q.question}</p>
            <div class="trivia-options">
                ${q.options.map((opt, i) => `
                    <div class="trivia-option" onclick="answerTrivia(${i})">${opt}</div>
                `).join('')}
            </div>
        </div>
    `;
}

function answerTrivia(selected) {
    const q = triviaQuestions[currentQuestion];
    const options = document.querySelectorAll('.trivia-option');
    
    options[selected].classList.add(selected === q.correct ? 'correct' : 'wrong');
    options[q.correct].classList.add('correct');
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < triviaQuestions.length) {
            showTriviaQuestion();
        } else {
            document.getElementById('triviaContainer').innerHTML = 
                '<div class="message" style="font-size: 1.5em;">🎉 You know our love story perfectly! 🎉</div>';
            setTimeout(() => {
                completeGame('trivia');
                backToMenu();
            }, 2000);
        }
    }, 1500);
}

// ============================================
// PROPOSAL & CELEBRATION
// ============================================
function celebrate() {
    // Send email notification
    const templateParams = {
        to_email: 'testerofscratchcode@gmail.com',
        message: 'SHE SAID YES! 💍 The proposal was accepted!',
        date: new Date().toLocaleString()
    };
    
    // Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with your actual EmailJS IDs
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
        }, function(error) {
            console.log('Email failed...', error);
        });
    
    // Show celebration screen
    document.body.innerHTML = `
        <div style="text-align: center; padding: 50px; background: linear-gradient(135deg, #ffeef8 0%, #ffe0f0 100%); min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div style="font-size: 10em; animation: ring-pulse 2s infinite;">💍</div>
            <h1 style="font-size: 4em; color: #ff1493; margin: 30px 0;">She Said YES! 🎉</h1>
            <p style="font-size: 2em; color: #ff69b4;">Forever starts now! 💕</p>
            <div style="font-size: 5em; margin-top: 30px;">❤️ 💖 💕 💗 💝 ❤️</div>
            <p style="font-size: 1.2em; color: #999; margin-top: 40px;">✉️ Notification sent!</p>
        </div>
    `;
}
