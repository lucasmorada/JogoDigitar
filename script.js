const quotes = [
    "O rato roeu a roupa do rei de Roma.",
    "Javascript é a linguagem mais usada no front-end.",
    "Geração Z faz código e meme ao mesmo tempo.",
    "Typings rápidos impressionam no teste de habilidade.",
    "Nunca pare de aprender e praticar programação.",
    "Digitar rápido é um superpoder subestimado."
];

const quoteDisplay = document.getElementById("quoteDisplay");
const quoteInput = document.getElementById("quoteInput");
const timerText = document.getElementById("timer");
const wpmText = document.getElementById("wpm");
const accuracyText = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");

let startTime, timerInterval;

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function startGame() {
    const quote = getRandomQuote();
    quoteDisplay.textContent = quote;
    quoteInput.value = "";
    quoteInput.disabled = false;
    quoteInput.focus();
    startTime = null;

    timerText.textContent = "Tempo: 0s";
    wpmText.textContent = "WPM: 0";
    accuracyText.textContent = "Acurácia: 100%";

    if (timerInterval) clearInterval(timerInterval);
}

quoteInput.addEventListener("input", () => {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }

    const quote = quoteDisplay.textContent;
    const userInput = quoteInput.value;

    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === quote[i]) {
            correctChars++;
        }
    }

    const accuracy = userInput.length > 0 ? ((correctChars / userInput.length) * 100).toFixed(0) : 100;
    accuracyText.textContent = `Acurácia: ${accuracy}%`;

    if (userInput === quote) {
        endGame(correctChars);
    }
});

function updateTimer() {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timerText.textContent = `Tempo: ${seconds}s`;

    const wordsTyped = quoteInput.value.trim().split(" ").length;
    const minutes = seconds / 60;
    const wpm = minutes > 0 ? Math.floor(wordsTyped / minutes) : 0;
    wpmText.textContent = `WPM: ${wpm}`;
}

function endGame(correctChars) {
    clearInterval(timerInterval);
    quoteInput.disabled = true;

    const totalWords = quoteDisplay.textContent.split(" ").length;
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    alert(`🎉 Completo! Tempo: ${totalTime}s — Palavras: ${totalWords}`);
}

restartBtn.addEventListener("click", startGame);

// Start on load
startGame();
