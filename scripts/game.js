import { drawMap, generateMap, loadNextLevel, setMapCanvasContext} from "./map.js";
import { checkFoodCollision, drawFood, drawSnake, generateRandomFood, moveSnake, setFood, setSnake } from "./snake-food.js";
import { setCanvasContext as setSnakeCanvasContext} from "./snake-food.js";
import { wallImage, onWallImageLoaded } from "./map.js";

export const rows = 42;
export const cols = 85;
export const gridSize = 20;

const eatSound = new Audio('sounds/game-bonus-02-294436.mp3');
const crashSound = new Audio('sounds/bricks-104933.mp3');
export const gameOverSounds = new Audio('sounds/game-over-classic-206486.mp3');
window.gameOverSounds = gameOverSounds;
export const gameOverSoundsKid = new Audio('sounds/game-over-kid-voice-clip-352738.mp3');
window.gameOverSoundsKid = gameOverSoundsKid;
export const clickSound = new Audio('sounds/mouse-click-290204.mp3');
window.clickSound = clickSound;
export const winningSound = new Audio('sounds/winning-218995.mp3');
window.winningSound = winningSound;

export let score = 0;

let gameLoopInterval;
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');

    const ctx = canvas.getContext('2d');

    setMapCanvasContext(ctx);
    setSnakeCanvasContext(ctx);

    canvas.width = cols * gridSize;
    canvas.height = rows * gridSize;

    const mode = localStorage.getItem('mode');
    const level = localStorage.getItem('level');

    let timeLeft = 60;
    if(mode === 'timed'){
        const timerElement = document.querySelector('.js-timer');
        timerElement.textContent = `剩余时间: ${timeLeft}s`;
        const timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `剩余时间: ${timeLeft}s`;
            if(timeLeft <= 0){
                clearInterval(timerInterval);
                clearInterval(gameLoopInterval);
                localStorage.setItem('finalScore', score);
                window.location.href = 'gameOver.html';
            }
        }, 1000);
    }

    const levelConfigs = [{
        obstacleRate: 0.02, speed: 100
    },{
        obstacleRate: 0.03, speed: 90
    },{
        obstacleRate: 0.04, speed: 80
    }]

    const parsedLevel = parseInt(level) || 0;
    const currentConfigs = levelConfigs[parsedLevel];

    let gameMap = [];

    onWallImageLoaded(() => {
        gameMap = generateMap(rows, cols, currentConfigs.obstacleRate);
        drawMap(gameMap, rows, cols, gridSize, canvas);

        let snake = [{
            x: 10, y: 10
        },{
            x: 9, y: 10
        },{ 
            x: 8, y: 10
        },{
            x: 7, y: 10
        },{
            x: 6, y: 10
        }]
        
        setSnake(snake);
        
        let food = generateRandomFood(gameMap, snake);
        setFood(food);
        
        let direction = { x: 1, y: 0 };
        
        document.addEventListener('keydown', (event) => {
            switch(event.key){
                case 'ArrowUp':
                    if(direction.y != 1){
                        direction = {x: 0, y: -1};
                    }
                    break;
                case 'ArrowDown':
                    if(direction.y != -1){
                        direction = {x: 0, y: 1};
                    }
                    break;
                case 'ArrowLeft':
                    if(direction.x != 1){
                        direction = {x: -1, y: 0};
                    }
                    break;
                case 'ArrowRight':
                    if(direction.x != -1){
                        direction = {x: 1, y: 0};
                    }
                    break;
            }
        });
        
        function gameLoop(){
            moveSnake(direction);
        
            const head = snake[0];
            if(head.y < 0 || head.y >= rows || head.x < 0 || head.x >= cols || gameMap[head.y][head.x] === 1){
                localStorage.setItem('finalScore', snake.length - 5);
                clearInterval(gameLoopInterval);
                window.location.href = 'gameOver.html';
            }
            
            if(checkFoodCollision(food, gameMap)){
                eatSound.play();
                score ++;
                document.querySelector('.js-current-score').textContent = `当前得分: ${score}`;
                food = generateRandomFood(gameMap, snake);
                setFood(food);
            }
        
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMap(gameMap, rows, cols, gridSize, canvas);
            drawFood(gridSize, food);
            drawSnake(gridSize);
        }
        
        const gameLoopInterval = setInterval(gameLoop, currentConfigs.speed);
    });
});
