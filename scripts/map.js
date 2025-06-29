let ctxRef;
export function setMapCanvasContext(context){
    ctxRef = context;
}

export const wallImage = new Image();
wallImage.src = 'images/wall.png';

export function onWallImageLoaded(callback) {
    if (wallImage.complete) {
        callback();
    } else {
        wallImage.onload = callback;
    }
}

export function generateMap(rows, cols, obstacleRate){
    const map = [];
    for(let r = 0; r < rows; r++){
        const row = [];
        const safeRadius = 6;
        for(let c = 0; c < cols; c++){
            if(r === 0 || r === rows - 1 || c === 0 || c === cols - 1){
                row.push(1);
            }
            else if(Math.abs(r - 10) < safeRadius && Math.abs(c - 10) < safeRadius){
                row.push(0);
            }
            else if(Math.random() < obstacleRate){
                row.push(1);
            }
            else{
                row.push(0);
            }
        }
        map.push(row);
    }
    return map;
}

export function drawMap(map, rows, cols, gridSize, canvas){
    ctxRef.clearRect(0, 0, canvas.width, canvas.height);
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            if(map[r][c] === 1){
                if(wallImage.complete){
                    ctxRef.drawImage(wallImage, c * gridSize, r * gridSize, gridSize, gridSize);
                }
                else{
                    ctxRef.fillStyle = 'gray';
                    ctxRef.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
                }
            }
            else{
                ctxRef.fillStyle = 'black';
                ctxRef.fillRect(c * gridSize, r * gridSize, gridSize, gridSize);
            }
        }
    }
}

export function loadNextLevel(currentRows, currentCols, obstacleRate, gridSize, canvas){
    const newMap = generateMap(currentRows, currentCols, obstacleRate);
    drawMap(newMap, currentRows, currentCols, gridSize, canvas);
    return newMap;
}