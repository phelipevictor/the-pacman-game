const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Wall {
    static width = 40
    static height = 40
    constructor({position}) {
        this.position = position
        this.width = 40
        this.height = 40  
    }

    draw() {
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

class Player {
    constructor({ position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'yellow'
        ctx.fill()
        ctx.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Point {
    constructor({ position }) {
        this.position = position
        this.radius = 3
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.closePath()
    }
}

const points = []
const walls = []
const player = new Player({
    position: {
        x: 60,
        y: 180
    },
    velocity: {
        x: 0,   
        y: 0
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = ''

const map = [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', '.', '.', '.', '.', '.', ' ', ' ', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', '-', '-', '-', '-', '.', '-', ' ', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', ' ', ' ', ' ', ' ', ' ', ' ', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', '-', '-', '-', '-', '.', '-', '-', '-', '-', '-', ' ', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', '-', '-', '-', '-', '.', '-', '-', '-', '-', '-', ' ', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', '-', '-', '-', '-', '-', ' ', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '.', '-', '-', '-', '-', '-', ' ', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', '-', '-', '-', '-', '-', ' ', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '.', '-', '-', '-', '-', '-', ' ', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', ' ', ' ', ' ', ' ', ' ', ' ', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', '-', ' ', '-', ' ', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', ' ', '.', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' ', '-'],
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
    ]

map.forEach((row, index) => {
    row.forEach((symbol, index2)  => {
        switch (symbol) {
            case '-':
                walls.push(
                    new Wall({
                    position: {
                    x: Wall.width * index2,
                    y: Wall.height * index
                    }
                })
                )
            break
            case '.':
                points.push(
                    new Point({
                        position: {
                        x: Wall.width * index2 + Wall.width / 2,
                        y: Wall.height * index + Wall.height / 2
                        }
                    })
                )
                break
        }
    })
})

function yellowCollidesWithRectangle({
    yellow,
    rectangle
}) {
    return (yellow.position.y - yellow.radius + yellow.velocity.y <= rectangle.position.y + rectangle.height &&
        yellow.position.x + yellow.radius + yellow.velocity.x >= rectangle.position.x && 
        yellow.position.y + yellow.radius + yellow.velocity.y >= rectangle.position.y && 
        yellow.position.x - yellow.radius + yellow.velocity.x <= rectangle.position.x + rectangle.width)
}

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastKey === 'w') {
       for (let i = 0; i < walls.length; i++) {
        const wall = walls[i]
        if (
            yellowCollidesWithRectangle({
            yellow: 
            {...player, 
                velocity: {
                x: 0, 
                y: -5
            }},
            rectangle: wall
        })
        ) {
            player.velocity.y = 0
            break
        }  else {
            player.velocity.y = -5
        }
    }
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i]
            if (
                yellowCollidesWithRectangle({
                yellow: 
                {...player,     
                    velocity: {
                    x: -5, 
                    y: 0
                }},
                rectangle: wall
            })
            ) {
                player.velocity.x = 0
                break
            }  else {
                player.velocity.x = -5
            }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i]
            if (
                yellowCollidesWithRectangle({
                yellow: 
                {...player, 
                    velocity: {
                    x: 0, 
                    y: 5
                }},
                rectangle: wall
            })
            ) {
                player.velocity.y = 0
                break
            }  else {
                player.velocity.y = 5
            }
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i]
            if (
                yellowCollidesWithRectangle({
                yellow: 
                {...player,     
                    velocity: {
                    x: 5, 
                    y: 0
                }},
                rectangle: wall
            })
            ) {
                player.velocity.x = 0
                break
            }  else {
                player.velocity.x = 5
            }
        }
    }

points.forEach((point, i) => {
    point.draw()
    if (Math.hypot(point.position.x - player.position.x, 
        point.position.y - player.position.y) < point.radius
        + player.radius) {
            points.splice(i, 1)
        }
})

    walls.forEach((wall) => {
        wall.draw()

        if (
            yellowCollidesWithRectangle({
                yellow: player,
                rectangle: wall
            }) 
        )   {
                player.velocity.x = 0
                player.velocity.y = 0
            }
    })

    player.update()
    //player.velocity.x = 0
    //player.velocity.y = 0

}

walls.forEach((wall) => {
    wall.draw()
})

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w': 
        keys.w.pressed = true
        lastKey = 'w'
        break
        case 'a': 
        keys.a.pressed = true
        lastKey = 'a'
        break
        case 's': 
        keys.s.pressed = true
        lastKey = 's'
        break
        case 'd': 
        keys.d.pressed = true
        lastKey = 'd'
        break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w': 
        keys.w.pressed = false
        break
        case 'a': 
        keys.a.pressed = false
        break
        case 's': 
        keys.s.pressed = false
        break
        case 'd': 
        keys.d.pressed = false
        break
    }
})