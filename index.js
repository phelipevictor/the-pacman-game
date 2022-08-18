const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.querySelector("#scoreElement");

canvas.width = innerWidth
canvas.height = innerHeight

class Wall {
  static width = 40
  static height = 40
  constructor({ position }) {
    this.position = position
    this.width = 40
    this.height = 40
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Player {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.radians = 0.75
    this.openRate = 0.12
    this.rotation = 0
  }

  draw() {
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation)
    ctx.translate(-this.position.x, -this.position.y)
    ctx.beginPath()
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - 0.75
    );
    ctx.lineTo(this.position.x, this.position.y)
    ctx.fillStyle = "yellow"
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.radians < 0 || this.radians > .75) this.openRate = -this.openRate
    this.radians += this.openRate
  }
}

class Ghost {
    static speed = 2
  constructor({ position, velocity, color = "red" }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.color = color
    this.prevCollisions = []
    this.speed = 2
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Point {
  constructor({ position }) {
    this.position = position;
    this.radius = 3;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
}

const points = [];
const walls = [];
const ghosts = [
  new Ghost({
    position: {
      x: 400,
      y: 60
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
  }),
  new Ghost({
    position: {
        x: 400,
        y: 820
    },
    velocity: {
        x: Ghost.speed,
        y: 0
    },
    color: 'pink'
  }),
  new Ghost({
    position: {
        x: 400,
        y: 500
    },
    velocity: {
        x: Ghost.speed,
        y: 0
    },
    color: 'green'
  })
];

const player = new Player({
  position: {
    x: 100  ,
    y: 60,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

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
};

let lastKey = "";
let score = 0;

const map = [
  [
    " ",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
    " ",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
    ".",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    ".",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
    ".",
    ".",
    ".",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    ".",
    ".",
    "-",
    "-",
    " ",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    ".",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
    ".",
    ".",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    ".",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    ".",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    "-",
    ".",
    "-",
    ".",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    "-",
    ".",
    "-",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "-",
  ],
  [
    " ",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
  ],
];

map.forEach((row, index) => {
  row.forEach((symbol, index2) => {
    switch (symbol) {
      case "-":
        walls.push(
          new Wall({
            position: {
              x: Wall.width * index2,
              y: Wall.height * index,
            },
          })
        );
        break;
      case ".":
        points.push(
          new Point({
            position: {
              x: Wall.width * index2 + Wall.width / 2,
              y: Wall.height * index + Wall.height / 2,
            },
          })
        );
        break;
    }
  });
});

function yellowCollidesWithRectangle({ yellow, rectangle }) {
    const padding = Wall.width / 2 - yellow.radius - 1
  return (
    yellow.position.y - yellow.radius + yellow.velocity.y <=
      rectangle.position.y + rectangle.height + padding &&
    yellow.position.x + yellow.radius + yellow.velocity.x >=
      rectangle.position.x - padding &&
    yellow.position.y + yellow.radius + yellow.velocity.y >=
      rectangle.position.y - padding &&
    yellow.position.x - yellow.radius + yellow.velocity.x <=
      rectangle.position.x + rectangle.width + padding
  )
}

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (
        yellowCollidesWithRectangle({
          yellow: {
            ...player,
            velocity: {
              x: 0,
              y: -5,
            },
          },
          rectangle: wall,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -5;
      }
    }
  } else if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (
        yellowCollidesWithRectangle({
          yellow: {
            ...player,
            velocity: {
              x: -5,
              y: 0,
            },
          },
          rectangle: wall,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -5;
      }
    }
  } else if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (
        yellowCollidesWithRectangle({
          yellow: {
            ...player,
            velocity: {
              x: 0,
              y: 5,
            },
          },
          rectangle: wall,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 5;
      }
    }
  } else if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < walls.length; i++) {
      const wall = walls[i];
      if (
        yellowCollidesWithRectangle({
          yellow: {
            ...player,
            velocity: {
              x: 5,
              y: 0,
            },
          },
          rectangle: wall,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 5;
      }
    }
  }
  if (points.length === 1) {
    console.log("Congratulations, You Win!!!!");
    cancelAnimationFrame(animationId);
  }

  // In contact with points
  for (let i = points.length - 1; 0 < i; i--) {
    const point = points[i];
    point.draw();
    if (
      Math.hypot(
        point.position.x - player.position.x,
        point.position.y - player.position.y
      ) <
      point.radius + player.radius
    ) {
      points.splice(i, 1);
      score += 10;
      scoreElement.innerHTML = score;
    }
  }

  walls.forEach((wall) => {
    wall.draw();

    if (
      yellowCollidesWithRectangle({
        yellow: player,
        rectangle: wall
      })
    ) {
      player.velocity.x = 0
      player.velocity.y = 0
    }
  })
  player.update()

  ghosts.forEach((ghost) => {
    ghost.update()

    if (
        Math.hypot(
          ghost.position.x - player.position.x,
          ghost.position.y - player.position.y
        ) <
        ghost.radius + player.radius
      ) {
        cancelAnimationFrame(animationId)
        console.log('You Lose!!!')
      }
 const collisions = []
    walls.forEach(wall => {
        if (
            !collisions.includes('right') &&
            yellowCollidesWithRectangle({
              yellow: {
                ...ghost,
                velocity: {
                  x: ghost.speed,
                  y: 0
                }
              },
              rectangle: wall
            })
          ) {
            collisions.push('right')
          }
          if (
            !collisions.includes('left') &&
            yellowCollidesWithRectangle({
              yellow: {
                ...ghost,
                velocity: {
                  x: -ghost.speed,
                  y: 0
                },
              },
              rectangle: wall,
            })
          ) {
            collisions.push('left')
          }
          if (
            !collisions.includes('up') &&
            yellowCollidesWithRectangle({
              yellow: {
                ...ghost,
                velocity: {
                  x: 0,
                  y: -ghost.speed,
                }
              },
              rectangle: wall,
            })
          ) {
            collisions.push('up')
          }
          if (
            !collisions.includes('down') &&
            yellowCollidesWithRectangle({
              yellow: {
                ...ghost,
                velocity: {
                  x: 0,
                  y: ghost.speed
                }
              },
              rectangle: wall,
            })
          ) {
            collisions.push('down')
          }
    })

    if (collisions.length > ghost.prevCollisions.length)
    ghost.prevCollisions = collisions

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

        if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
        else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
        else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up') 
        else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

        console.log(collisions)
        console.log(ghost.prevCollisions)

        const pathways = ghost.prevCollisions.filter((collision) => {
            return !collisions.includes(collision)
        })
        console.log({ pathways })

        const direction = pathways[Math.floor(Math.random() * pathways.length)]

        console.log({ direction })

        switch (direction) {
            case 'down':
                ghost.velocity.y = ghost.speed
                ghost.velocity.x = 0
                break
            case 'up':
                ghost.velocity.y = -ghost.speed
                ghost.velocity.x = 0
                break
            case 'right':
                ghost.velocity.y = 0
                ghost.velocity.x = ghost.speed
                break
            case 'left':
                ghost.velocity.y = 0
                ghost.velocity.x = -ghost.speed
                break
        }

        ghost.prevCollisions = []
    }
 })

 if (player.velocity.x > 0) player.rotation = 0
 else if (player.velocity.x < 0) player.rotation = Math.PI
 else if (player.velocity.y > 0) player.rotation = Math.PI / 2
 else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
}

walls.forEach((wall) => {
  wall.draw();
});

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});