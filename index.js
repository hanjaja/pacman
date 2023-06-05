const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

let score = 0;
let duration = 60;

let countdownElement = document.getElementById("countdown");
countdownElement.textContent = duration;

let scoreElement = document.getElementById("score");
scoreElement.textContent = score;

class Boundary {
    static width = 40
    static height = 40
    constructor({ position, color }) {
        this.position = position
        this.color = color
        this.width = 40
        this.height = 40
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Pellet {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

const pellets = []
const boundaries = []
const corridors = []
const obstacles = []
const centers = []

const player = new Player({
    position: {
        x: Boundary.width * 11 / 2,
        y: Boundary.height * 21 / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const keys = {
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ''

const map = [
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', ' ', 'o', 'o', 'o', ' ', 'o', 'o', 'o', ' ', '-',],
    ['-', ' ', 'o', 'o', 'o', ' ', 'o', 'o', 'o', ' ', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', ' ', 'o', ' ', ' ', 'c', ' ', ' ', 'o', ' ', '-',],
    ['-', ' ', 'o', ' ', ' ', 'c', ' ', ' ', 'o', ' ', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', ' ', 'o', 'o', 'o', ' ', 'o', 'o', 'o', ' ', '-',],
    ['-', ' ', 'o', 'o', 'o', ' ', 'o', 'o', 'o', ' ', '-',],
    ['-', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-',],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-',],
]

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(new Boundary({ position: { x: Boundary.width * j, y: Boundary.height * i }, color: '#7f7f7f' }))
                break
            case ' ':
                pellets.push(new Pellet({ position: { x: Boundary.width * j + Boundary.width / 2, y: Boundary.height * i + Boundary.height / 2 } }))
                break
            case 'o':
                boundaries.push(new Boundary({ position: { x: Boundary.width * j, y: Boundary.height * i }, color: '#569232' }))
                break
            case 'c':
                boundaries.push(new Boundary({ position: { x: Boundary.width * j, y: Boundary.height * i }, color: '#324a9f' }))
                break
        }
    })
})

function circleCollidesWithRectangle({ circle, rectangle }) {
    return (
        circle.position.y - circle.radius + (circle.velocity.y * 3) <= rectangle.position.y + rectangle.height &&
        circle.position.y + circle.radius + (circle.velocity.y * 3) >= rectangle.position.y &&
        circle.position.x + circle.radius + (circle.velocity.x * 3) >= rectangle.position.x &&
        circle.position.x - circle.radius + (circle.velocity.x * 3) <= rectangle.position.x + rectangle.width
    )
}

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if ((keys.ArrowUp.pressed || keys.w.pressed) && (lastKey === 'ArrowUp' || lastKey === 'w')) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: -2
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -2
                
            }
        }



    } else if ((keys.ArrowDown.pressed || keys.s.pressed) && (lastKey === 'ArrowDown' || lastKey === 's')) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: 2
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 2
                
            }
        }



    } else if ((keys.ArrowLeft.pressed || keys.a.pressed) && (lastKey === 'ArrowLeft' || lastKey === 'a')) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: -2,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -2
                
            }
        }


    } else if ((keys.ArrowRight.pressed || keys.d.pressed) && (lastKey === 'ArrowRight' || lastKey === 'd')) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 2,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 2
                
            }
        }

    }

    for (let i = pellets.length - 1; i >= 0; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius) {
            pellets.splice(i, 1)

            score += 100;
            scoreElement.textContent = score;
        }
    }

    boundaries.forEach((boundary) => {
        boundary.draw()

        if (circleCollidesWithRectangle({ circle: player, rectangle: boundary })) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    corridors.forEach((corridor) => {
        corridor.draw()
    })

    player.update()
}


animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            lastKey = 'ArrowUp'
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            lastKey = 'ArrowDown'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            lastKey = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            lastKey = 'ArrowRight'
            break

        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break

        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})

function startTimer() {
  let countdown = duration;
  const timerInterval = setInterval(() => {
    // Display the remaining time
    countdownElement.textContent = countdown;

    // Decrease the time by 1 second
    countdown--;

    // Check if the timer has reached 0
    if (countdown < 0) {
      clearInterval(timerInterval);
      console.log("Timer completed!");
    }
  }, 1000);
}

startTimer();

