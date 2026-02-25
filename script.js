const wordsList = "o rato roeu a roupa do rei de roma java script desenvolvimento web tecnologia teclado rapido codigo fonte aprender praticar constante foco performance interface usuario sistema algoritmo logica programacao".split(" ");

let currentWordIndex = 0;
let currentCharIndex = 0;
let startTime = null;
let timerInterval = null;
const gameTime = 30;

const wordsWrapper = document.getElementById('words-wrapper');
const input = document.getElementById('hidden-input');
const caret = document.getElementById('caret');
const timerEl = document.getElementById('timer');

function initGame() {
    wordsWrapper.innerHTML = '';
    // Gera 100 palavras aleatórias
    for (let i = 0; i < 100; i++) {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        const randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
        
        randomWord.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.innerText = char;
            wordDiv.appendChild(span);
        });
        wordsWrapper.appendChild(wordDiv);
    }
    resetState();
    updateCaret();
}

function resetState() {
    currentWordIndex = 0;
    currentCharIndex = 0;
    startTime = null;
    clearInterval(timerInterval);
    timerEl.innerText = gameTime;
    input.value = '';
    input.disabled = false;
    updateCaret();
}

function updateCaret() {
    const word = document.querySelectorAll('.word')[currentWordIndex];
    const letter = word.querySelectorAll('.letter')[currentCharIndex] || word;
    const rect = letter.getBoundingClientRect();
    const containerRect = document.getElementById('words-container').getBoundingClientRect();

    caret.style.left = (currentCharIndex === 0 ? rect.left : rect.right) - containerRect.left + 'px';
    caret.style.top = rect.top - containerRect.top + 'px';
}

input.addEventListener('input', (e) => {
    if (!startTime) startTimer();

    const words = document.querySelectorAll('.word');
    const currentWord = words[currentWordIndex];
    const letters = currentWord.querySelectorAll('.letter');
    const val = input.value;
    const lastChar = val[val.length - 1];

    // Lógica de Espaço (Próxima Palavra)
    if (lastChar === ' ') {
        if (val.trim().length > 0) {
            currentWordIndex++;
            currentCharIndex = 0;
            input.value = '';
        }
    } else {
        currentCharIndex = val.length;
        // Validação visual
        letters.forEach((s, i) => {
            if (!val[i]) s.className = 'letter';
            else if (val[i] === s.innerText) s.className = 'letter correct';
            else s.className = 'letter incorrect';
        });
    }
    updateCaret();
    calculateStats();
});

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        const remaining = gameTime - diff;
        timerEl.innerText = remaining;

        if (remaining <= 0) {
            clearInterval(timerInterval);
            input.disabled = true;
            alert(`Fim! WPM: ${document.getElementById('wpm').innerText}`);
        }
    }, 1000);
}

function calculateStats() {
    const correctLetters = document.querySelectorAll('.letter.correct').length;
    const totalTyped = document.querySelectorAll('.letter.correct, .letter.incorrect').length;
    
    // WPM: (letras corretas / 5) / (tempo decorrido em minutos)
    const timeElapsed = (Date.now() - startTime) / 60000 || 0.001;
    const wpm = Math.round((correctLetters / 5) / timeElapsed);
    const acc = totalTyped > 0 ? Math.round((correctLetters / totalTyped) * 100) : 100;

    document.getElementById('wpm').innerText = wpm;
    document.getElementById('accuracy').innerText = acc;
}

document.getElementById('restart-btn').addEventListener('click', initGame);
document.body.addEventListener('click', () => input.focus());

initGame();