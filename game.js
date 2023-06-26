const scoreElement = document.querySelector('#scoreEl')

const startOverlay = document.getElementById('startOverlay')
const pauseOverlay = document.getElementById('pauseOverlay')
const gameOverOverlay = document.getElementById('gameOverOverlay')

let countdownElement = document.getElementById("countdown")

let gameOver = false

let duration = 60
let countdown = 0

countdownElement.textContent = duration

var maze = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', 'o', 'o', 'o', '.', 'o', 'o', 'o', '.', '-'],
    ['-', '.', 'o', 'o', 'o', '.', 'o', 'o', 'o', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', 'o', '.', '.', 'r', '.', '.', 'o', '.', '-'],
    ['-', '.', 'o', '.', '.', 'c', '.', '.', 'o', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    ['-', '.', 'o', 'o', 'o', '.', 'o', 'o', 'o', '.', '-'],
    ['-', '.', 'o', 'o', 'o', '.', 'o', 'o', 'o', '.', '-'],
    ['-', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
];

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

const cellSize = 100;
const isPacman = true;

function checkCollisionBetweenEntities(entity1X, entity1Y, entity1Size, entity2X, entity2Y, entity2Size) {
    const dx = entity1X - entity2X;
    const dy = entity1Y - entity2Y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < entity1Size + entity2Size;

}


function checkCollision(x, y, isPacman) {
    let col = Math.round(x * 6 + 5);
    let row = 11 - Math.round(y * 6 + 5);

    const cell = maze[row][col];

    if (isPacman) {
        return cell === '-' || cell === 'o' || cell === 'c' || cell === 'r';
    } else {
        return cell === '-' || cell === 'o';
    }
}

const prevDirection = ''
let specialItemEaten = false;

function updatePacmanPosition() {
    const newX = pacmanX + (direction === 'a' ? -0.025 : direction === 'd' ? 0.025 : 0);
    const newY = pacmanY + (direction === 'w' ? 0.025 : direction === 's' ? -0.025 : 0);

    if (checkCollision(newX, newY, true)) {
        return;
    }

    pacmanX = newX;
    pacmanY = newY;

    const col = Math.round(newX * 6 + 5);
    const row = 11 - Math.round(newY * 6 + 5);
    const cell = maze[row][col];

    if (cell === '.') {
        maze[row][col] = ' ';
        score += 100;
        scoreElement.textContent = score;
    } else if (cell === 'p') {
        maze[row][col] = ' ';
        specialItemEaten = true;
    }
}

const directions = ['w', 'a', 's', 'd'];

let ghost1Direction = directions[Math.floor(Math.random() * directions.length)];
let ghost2Direction = directions[Math.floor(Math.random() * directions.length)];

let ghostSpeed = 0.003;

let ghost1FrameCount = 0;
let ghost2FrameCount = 0;
function updateGhostPosition(ghost) {
    let newX;
    let newY;
    let currentDirection;

    const pacmanSize = 0.1;
    const ghostSize = 0.1;

    if (ghost === 1) {
        newX = ghost1X;
        newY = ghost1Y;
        currentDirection = ghost1Direction;
    } else if (ghost === 2) {
        newX = ghost2X;
        newY = ghost2Y;
        currentDirection = ghost2Direction;
    }

    // Check collision with Pac-Man
    if (checkCollisionBetweenEntities(newX, newY, ghostSize, pacmanX, pacmanY, pacmanSize)) {
        // Collision occurred between ghost and Pac-Man
        console.log('Ghost collided with Pac-Man!');
        // Perform action, such as ending the game or reducing Pac-Man's lives
        if (!specialItemEaten) {
            score -= 500;
            scoreElement.textContent = score;

            if (score <= 0) {
                gameOver = true;
            }
        } else {
            specialItemEaten = false;
        }

        if (ghost === 1) {
            ghost1X = 0;
            ghost1Y = 0.025;
        } else if (ghost === 2) {
            ghost2X = 0.0;
            ghost2Y = -0.025;
        }
        return;
    }

    let ghostChaseChance = 0.007;

    // Calculate the distance between the ghost and Pac-Man
    const distanceToPacman = Math.sqrt(Math.pow(newX - pacmanX, 2) + Math.pow(newY - pacmanY, 2));

    // Check if the ghost should chase Pac-Man or choose a random direction
    const shouldChasePacman = Math.random() < ghostChaseChance; // 2% chance of chasing Pac-Man

    if (shouldChasePacman) {
        // Ghost should chase Pac-Man

        // Find the valid directions that will bring the ghost closer to Pac-Man
        const validDirections = directions.filter(dir => {
            const x = dir === 'a' ? newX - ghostSpeed : dir === 'd' ? newX + ghostSpeed : newX;
            const y = dir === 's' ? newY - ghostSpeed : dir === 'w' ? newY + ghostSpeed : newY;

            const distanceToPacmanWithDir = Math.sqrt(Math.pow(x - pacmanX, 2) + Math.pow(y - pacmanY, 2));

            return !checkCollision(x, y, false) && distanceToPacmanWithDir < distanceToPacman;
        });

        if (validDirections.length > 0) {
            // Sort the valid directions based on their proximity to Pac-Man
            validDirections.sort((dirA, dirB) => {
                const xA = dirA === 'a' ? newX - ghostSpeed : dirA === 'd' ? newX + ghostSpeed : newX;
                const yA = dirA === 's' ? newY - ghostSpeed : dirA === 'w' ? newY + ghostSpeed : newY;
                const distanceA = Math.sqrt(Math.pow(xA - pacmanX, 2) + Math.pow(yA - pacmanY, 2));

                const xB = dirB === 'a' ? newX - ghostSpeed : dirB === 'd' ? newX + ghostSpeed : newX;
                const yB = dirB === 's' ? newY - ghostSpeed : dirB === 'w' ? newY + ghostSpeed : newY;
                const distanceB = Math.sqrt(Math.pow(xB - pacmanX, 2) + Math.pow(yB - pacmanY, 2));

                return distanceA - distanceB;
            });

            // Choose the direction that brings the ghost closest to Pac-Man
            const newDirection = validDirections[0];

            if (ghost === 1) {
                ghost1Direction = newDirection;
            } else if (ghost === 2) {
                ghost2Direction = newDirection;
            }
        }
    } else {
        // Ghost should choose a random direction with a cooldown period
        const isCooldownActive = ghost === 1 ? ghost1FrameCount > 0 : ghost2FrameCount > 0;

        if (!isCooldownActive) {
            const validDirections = directions.filter(dir => {
                const x = dir === 'a' ? newX - ghostSpeed : dir === 'd' ? newX + ghostSpeed : newX;
                const y = dir === 's' ? newY - ghostSpeed : dir === 'w' ? newY + ghostSpeed : newY;
                return !checkCollision(x, y, false);
            });

            if (validDirections.length > 0) {
                // Check if the ghost is moving in the opposite direction of its current direction
                const oppositeDirection = currentDirection === 'w' ? 's' : currentDirection === 'a' ? 'd' : currentDirection === 's' ? 'w' : 'a';
                const isMovingOppositeDirection = validDirections.includes(oppositeDirection);

                let newDirection;
                if (isMovingOppositeDirection && Math.random() < 0.5) {
                    // Choose a random direction other than the opposite direction with a 50% chance
                    newDirection = validDirections.find(dir => dir !== oppositeDirection);
                } else {
                    // Choose a random direction from all valid directions
                    newDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
                }

                if (ghost === 1) {
                    ghost1Direction = newDirection;
                    ghost1FrameCount = 10; // Set a cooldown period frames
                } else if (ghost === 2) {
                    ghost2Direction = newDirection;
                    ghost2FrameCount = 10; // Set a cooldown period frames
                }
            }
        }
    }

    // Update the ghost's position based on the current direction
    if (currentDirection === 'w') newY += ghostSpeed;
    else if (currentDirection === 'a') newX -= ghostSpeed;
    else if (currentDirection === 's') newY -= ghostSpeed;
    else if (currentDirection === 'd') newX += ghostSpeed;

    if (!checkCollision(newX, newY, false)) {
        if (ghost === 1) {
            ghost1X = newX;
            ghost1Y = newY;
        } else if (ghost === 2) {
            ghost2X = newX;
            ghost2Y = newY;
        }
    }
}

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

let pacmanX = 0.0; // X-coordinate of Pac-Man
let pacmanY = -0.75; // Y-coordinate of Pac-Man

let ghost1X = 0; // X-coordinate of Ghost 1
let ghost1Y = 0.025; // Y-coordinate of Ghost 1

let ghost2X = 0; // X-coordinate of Ghost 2
let ghost2Y = -0.025; // Y-coordinate of Ghost 2

let direction = ''; // Current direction of Pac-Man

let score = 0; // Current score

const dotSize = cellSize * 0.1;

function drawScene(gl, program) {
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.7, 0.7, 0.7, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const wallPositions = [];
    const obstaclePositions = [];
    const centerPositions = [];
    const dotPositions = [];
    const specialItemPositions = [];

    let offset = -0.08

    if (direction === 'w') {
        pacmanPositions = [
            vec2(pacmanX - 0.05, pacmanY + offset - 0.05),
            vec2(pacmanX + 0.00, pacmanY + offset + 0.05),
            vec2(pacmanX + 0.05, pacmanY + offset - 0.05)
        ];
    } else if (direction === 'a') {
        pacmanPositions = [
            vec2(pacmanX + 0.05, pacmanY + offset - 0.05),
            vec2(pacmanX - 0.05, pacmanY + offset + 0.00),
            vec2(pacmanX + 0.05, pacmanY + offset + 0.05)
        ];
    } else if (direction === 's') {
        pacmanPositions = [
            vec2(pacmanX - 0.05, pacmanY + offset + 0.05),
            vec2(pacmanX + 0.00, pacmanY + offset - 0.05),
            vec2(pacmanX + 0.05, pacmanY + offset + 0.05)
        ];
    } else if (direction === 'd') {
        pacmanPositions = [
            vec2(pacmanX - 0.05, pacmanY + offset - 0.05),
            vec2(pacmanX + 0.05, pacmanY + offset + 0.00),
            vec2(pacmanX - 0.05, pacmanY + offset + 0.05)
        ];
    }

    var ghost1Positions = [
        vec2(ghost1X - 0.05, ghost1Y + 0.10),
        vec2(ghost1X + 0.05, ghost1Y + 0.10),
        vec2(ghost1X + 0.05, ghost1Y + 0.00),
        vec2(ghost1X - 0.05, ghost1Y + 0.10),
        vec2(ghost1X + 0.05, ghost1Y + 0.00),
        vec2(ghost1X - 0.05, ghost1Y + 0.00)
    ];

    var ghost2Positions = [
        vec2(ghost2X - 0.05, ghost2Y - 0.10),
        vec2(ghost2X + 0.05, ghost2Y - 0.10),
        vec2(ghost2X + 0.05, ghost2Y - 0.00),
        vec2(ghost2X - 0.05, ghost2Y - 0.10),
        vec2(ghost2X + 0.05, ghost2Y - 0.00),
        vec2(ghost2X - 0.05, ghost2Y - 0.00)
    ];

    if (direction !== '') {
        updatePacmanPosition();
    }

    updateGhostPosition(1);
    updateGhostPosition(2);

    const borderWidth = 0.01;
    const borderOffset = borderWidth / 2;

    var rectX1 = 0
    var rectY1 = 0
    var rectX2 = 0
    var rectY2 = 0

    var dotX = 0
    var dotY = 0

    var dotX1 = 0
    var dotY1 = 0
    var dotX2 = 0
    var dotY2 = 0

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            const x1 = col * cellSize / gl.canvas.width - 1;
            const y1 = 1 - row * cellSize / gl.canvas.height;
            const x2 = (col + 1) * cellSize / gl.canvas.width - 1;
            const y2 = 1 - (row + 1) * cellSize / gl.canvas.height;
            switch (maze[row][col]) {
                case '-':
                    wallPositions.push(x1, y1, x1, y2, x2, y1, x2, y1, x1, y2, x2, y2);
                    break;
                case 'o':
                    obstaclePositions.push(x1, y1, x1, y2, x2, y1, x2, y1, x1, y2, x2, y2);
                    break;
                case 'c':
                    // Calculate the coordinates of the center rectangle
                    rectX1 = x1 - borderOffset;
                    rectY1 = y1 - borderOffset;
                    rectX2 = x2 + borderOffset;
                    rectY2 = y2 + borderOffset;

                    // Add the lines connecting the corner points to create the dashed rectangle

                    // RIGHT
                    centerPositions.push(rectX2, rectY1);
                    centerPositions.push(rectX2, rectY2);

                    // BOTTOM
                    centerPositions.push(rectX2, rectY2);
                    centerPositions.push(rectX1, rectY2);

                    // LEFT
                    centerPositions.push(rectX1, rectY2);
                    centerPositions.push(rectX1, rectY1);
                    break;
                case 'r':


                    // Calculate the coordinates of the center rectangle
                    rectX1 = x1 - borderOffset;
                    rectY1 = y1 - borderOffset;
                    rectX2 = x2 + borderOffset;
                    rectY2 = y2 + borderOffset;

                    // Add the lines connecting the corner points to create the dashed rectangle

                    // TOP
                    centerPositions.push(rectX1, rectY1);
                    centerPositions.push(rectX2, rectY1);

                    // RIGHT
                    centerPositions.push(rectX2, rectY1);
                    centerPositions.push(rectX2, rectY2);

                    // LEFT
                    centerPositions.push(rectX1, rectY2);
                    centerPositions.push(rectX1, rectY1);
                    break;
                case '.':
                    // Calculate the dot position based on the center of the cell
                    dotX = (x1 + x2) / 2;
                    dotY = (y1 + y2) / 2;

                    // Adjust the dot positions to make them smaller
                    dotX1 = dotX - dotSize / gl.canvas.width;
                    dotY1 = dotY - dotSize / gl.canvas.height;
                    dotX2 = dotX + dotSize / gl.canvas.width;
                    dotY2 = dotY + dotSize / gl.canvas.height;

                    // Add the smaller dot positions to the dotPositions array
                    dotPositions.push(dotX1, dotY1, dotX1, dotY2, dotX2, dotY1, dotX2, dotY1, dotX1, dotY2, dotX2, dotY2);
                    break;
                case 'p':
                    dotX = (x1 + x2) / 2;
                    dotY = (y1 + y2) / 2;

                    // Adjust the dot positions to make them smaller
                    dotX1 = dotX - dotSize / gl.canvas.width;
                    dotY1 = dotY - dotSize / gl.canvas.height;
                    dotX2 = dotX + dotSize / gl.canvas.width;
                    dotY2 = dotY + dotSize / gl.canvas.height;

                    // Add the smaller dot positions to the dotPositions array
                    specialItemPositions.push(dotX1, dotY1, dotX1, dotY2, dotX2, dotY1, dotX2, dotY1, dotX1, dotY2, dotX2, dotY2);
                    break;
            }
        }

    }

    // Render walls
    const wallColorLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(wallColorLocation, 0.5, 0.5, 0.5, 1.0); // Set wall color to gray

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wallPositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, wallPositions.length / 2);

    // Render center
    const centerColorLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(centerColorLocation, 0.0, 0.2, 0.5, 0.7); // Set center color to blue

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(centerPositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, centerPositions.length / 2);

    // Render obstacles
    const obstacleColorLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(obstacleColorLocation, 0.337, 0.573, 0.196, 1.0); // Set obstacle color to green

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obstaclePositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, obstaclePositions.length / 2);

    // Render Pac-Man
    const pacmanColorLocation = gl.getUniformLocation(program, 'u_color');
    if (specialItemEaten) {
        gl.uniform4f(pacmanColorLocation, 1.0, 0.0, 1.0, 1.0); // Set Pac-Man color to magenta
    } else gl.uniform4f(pacmanColorLocation, 0.0, 0.0, 1.0, 1.0); // Set Pac-Man color to blue

    gl.bufferData(gl.ARRAY_BUFFER, flatten(pacmanPositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, pacmanPositions.length);

    // Render Ghost1
    const ghost1ColorLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(ghost1ColorLocation, 1.0, 0.0, 0.0, 0.7); // Set Ghost1 color to red

    gl.bufferData(gl.ARRAY_BUFFER, flatten(ghost1Positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, ghost1Positions.length);

    // Render Ghost2
    const ghost2ColorLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(ghost2ColorLocation, 0.0, 1.0, 1.0, 0.7); // Set Ghost2 color to cyan

    gl.bufferData(gl.ARRAY_BUFFER, flatten(ghost2Positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, ghost2Positions.length);

    // Render dots
    const dotColorLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(dotColorLocation, 1.0, 1.0, 0.0, 1.0); // Set dot color to yellow

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dotPositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, dotPositions.length / 2);

    // Render dots
    const specialItemColorLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4f(specialItemColorLocation, 1.0, 0.0, 1.0, 1.0); // Set dot color to magenta

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specialItemPositions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, specialItemPositions.length / 2);

    let dotCount = 0;

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === '.') {
                dotCount++;
            }
        }
    }

    if (dotCount === 0) {
        scoreEl.textContent = score + (countdown * 100)
        console.log('you win')
        gameOver = true;
    }
}

let animationId = null;

function main() {
    const canvas = document.querySelector('#canvas');
    const gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) return;

    const program = initShaders(gl, "vertex-shader", "fragment-shader")

    function render() {
        drawScene(gl, program);
        if (gameOver || countdown === 0) {
            cancelAnimationFrame(animationId)
            gameOverOverlay.style.display = 'flex'
            gamePaused = true;

        }
        animationId = requestAnimationFrame(render);
    }
    animationId = requestAnimationFrame(render);
}

function startTimer() {
    countdown = duration;

    const timerInterval = setInterval(() => {
        // Display the remaining time
        countdownElement.textContent = countdown;

        if (!gamePaused && !gameOver) {
            // Decrease the time by 1 second
            countdown--;
        }
        // Check if the timer has reached 0
        if (countdown < 0) {
            clearInterval(timerInterval);
            console.log("Timer completed!");
        }
    }, 1000);
}

let gamePaused = true; // Start the game in a paused state
let gameStarted = false;

let isShiftKeyPressed = false;

function handleKeydown(event) {
    if (event.key === "s" && !gameStarted) {
        startGame();
    } else if (event.key === "p") {
        pauseGame();
    } else if (event.key === "R" && event.shiftKey) {
        console.log("Shift + R pressed");
        restartGame();
    } else if (event.key === "r") {
        resumeGame();
    }
}

document.addEventListener("keydown", handleKeydown);

function startGame() {
    if (gamePaused) {
        gameStarted = true;
        gamePaused = false;

        startTimer();
        main();

        startOverlay.style.display = 'none';
        pauseOverlay.style.display = 'none';
        gameOverOverlay.style.display = 'none';
    }
}

function pauseGame() {
    cancelAnimationFrame(animationId);
    gamePaused = true;
    pauseOverlay.style.display = 'flex';
}

function resumeGame() {
    if (gamePaused) {
        gamePaused = false;
        main();
        pauseOverlay.style.display = 'none';
    }
}

function restartGame() {
    console.log("restart game");
    gameStarted = false;
    gameOver = false;
    gamePaused = false;
    specialItemEaten = false;
    score = 0;
    scoreEl.textContent = score;
    countdown = duration;
    countdownElement.textContent = countdown;
    pacmanX = 0;
    pacmanY = -0.75;
    direction = '';
    ghost1X = 0;
    ghost1Y = 0;
    ghost2X = 0;
    ghost2Y = 0;

    maze = [
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
        ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
        ['-', '.', 'o', 'o', 'o', '.', 'o', 'o', 'o', '.', '-'],
        ['-', '.', 'o', 'o', 'o', '.', 'o', 'o', 'o', '.', '-'],
        ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
        ['-', '.', 'o', '.', '.', 'r', '.', '.', 'o', '.', '-'],
        ['-', '.', 'o', '.', '.', 'c', '.', '.', 'o', '.', '-'],
        ['-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
        ['-', '.', 'o', 'o', 'o', '.', 'o', 'o', 'o', '.', '-'],
        ['-', '.', 'o', 'o', 'o', '.', 'o', 'o', 'o', '.', '-'],
        ['-', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '-'],
        ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    ];

    startOverlay.style.display = 'none';
    pauseOverlay.style.display = 'none';
    gameOverOverlay.style.display = 'none';
    startGame();
}

document.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
        case 'a':
        case 's':
        case 'd':
            direction = key;
            break;
    }
});

document.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
        case 'a':
        case 's':
        case 'd':
            direction = '';
            break;
    }
});

startOverlay.style.display = 'flex';
pauseOverlay.style.display = 'none';
gameOverOverlay.style.display = 'none';
