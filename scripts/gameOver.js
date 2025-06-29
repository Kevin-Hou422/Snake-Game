import { clickSound } from "./game.js";

const finalScore = localStorage.getItem('finalScore') || 0;
document.querySelector('.js-final-score-text').textContent = `最终得分: ${finalScore}`;

document.querySelector('.js-restart-game-button').addEventListener('click', () => {
    clickSound.play();
    setTimeout(() => {
        window.location.href = 'modeChoosing.html';
    }, 200)
});