import { cols, rows } from './game.js';

let ctxRef;
export function setCanvasContext(context){
    ctxRef = context;
}

let snake = [];
let food = null;

const appleImage = new Image();
appleImage.src = 'images/apple.png';

export function setSnake(s){
    snake = s;
}

export function setFood(f){
    food = f;
}

export function moveSnake(direction){
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    }
    snake.unshift(newHead);
    snake.pop();
}

export function drawFood(gridSize, food){
    appleImage.onload = () => {
        ctxRef.drawImage(appleImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);  
    }
    if(appleImage.complete){
        ctxRef.drawImage(appleImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }
}

export function drawSnake(gridSize){
    ctxRef.fillStyle = 'green';
    snake.forEach((segment) => {
        ctxRef.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

export function generateRandomFood(gameMap, snake){
    let x, y;
    do {
        x = Math.floor(Math.random() * (cols - 4)) + 2;
        y = Math.floor(Math.random() * (rows - 4)) + 2;
    }
    while(gameMap[y][x] === 1 || snake.some(segment => segment.x === x && segment.y === y));
    return { x, y };
}

export function checkFoodCollision(food, gameMap){
    if(snake[0].x === food.x && snake[0].y === food.y){
        snake.push({x: food.x, y: food.y});
        return true;
    }
    else{
        return false;
    }
}