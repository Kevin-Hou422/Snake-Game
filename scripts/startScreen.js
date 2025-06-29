import { clickSound } from "./game.js";

document.querySelector('.js-start-game-button').addEventListener('click', () => {
    clickSound.play();
    setTimeout(() => {
        window.location.href = 'modeChoosing.html';
    }, 200);
});