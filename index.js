const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
    static width = 40
    static height = 40
    constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() {
        ctx.fillStyle = '#7f7f7f';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Corridor {
    static width = 40
    static height = 40
    constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() {
        ctx.fillStyle = '#d6dbd6';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Obstacle {
    static width = 40
    static height = 40
    constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() {
        ctx.fillStyle = '#569232';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Center {
    static width = 40
    static height = 40
    constructor({ position }) {
        this.position = position
        this.width = 40
        this.height = 40
    }

    draw() {
        ctx.fillStyle = '#d6dbd6';
        ctx.strokeStyle = '#324a9f';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height)
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
                boundaries.push(new Boundary({ position: { x: Boundary.width * j, y: Boundary.height * i } }))
                break
            case ' ':
                corridors.push(new Corridor({ position: { x: Corridor.width * j, y: Corridor.height * i } }))
                break
            case 'o':
                obstacles.push(new Obstacle({ position: { x: Obstacle.width * j, y: Obstacle.height * i } }))
                break
            case 'c':
                centers.push(new Center({ position: { x: Center.width * j, y: Center.height * i } }))
                break
        }
    })
})

function circleCollidesWithRectangle({ circle, rectangle }) {
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width
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
                        y: -1
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -1
            }
        }

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: -1
                    }
                },
                rectangle: obstacle
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -1
            }
        }

        for (let i = 0; i < centers.length; i++) {
            const center = centers[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: -1
                    }
                },
                rectangle: center
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -1
            }
        }
    } else if ((keys.ArrowDown.pressed || keys.s.pressed) && (lastKey === 'ArrowDown' || lastKey === 's')) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: 1
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 1
            }
        }

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: 1
                    }
                },
                rectangle: obstacle
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 1
            }
        }

        for (let i = 0; i < centers.length; i++) {
            const center = centers[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: 1
                    }
                },
                rectangle: center
            })
            ) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 1
            }
        }
    } else if ((keys.ArrowLeft.pressed || keys.a.pressed) && (lastKey === 'ArrowLeft' || lastKey === 'a')) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: -1,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -1
            }
        }

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: -1,
                        y: 0
                    }
                },
                rectangle: obstacle
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -1
            }
        }

        for (let i = 0; i < centers.length; i++) {
            const center = centers[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: -1,
                        y: 0
                    }
                },
                rectangle: center
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -1
            }
        }
    } else if ((keys.ArrowRight.pressed || keys.d.pressed) && (lastKey === 'ArrowRight' || lastKey === 'd')) {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 1,
                        y: 0
                    }
                },
                rectangle: boundary
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 1
            }
        }

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 1,
                        y: 0
                    }
                },
                rectangle: obstacle
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 1
            }
        }

        for (let i = 0; i < centers.length; i++) {
            const center = centers[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: 1
                    }
                },
                rectangle: center
            })
            ) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 1
            }
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

    obstacles.forEach((obstacle) => {
        obstacle.draw()

        if (circleCollidesWithRectangle({ circle: player, rectangle: obstacle })) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    centers.forEach((center) => {
        center.draw()

        if (circleCollidesWithRectangle({ circle: player, rectangle: center })) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
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