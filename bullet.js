class Bullet {
  constructor(num, size, speed, shape, movetype) {
    this.num = num
    this.other = players[map(num, 0, 1, 1, 0)]
    this.pos = createVector(players[num].pos.x, players[num].pos.y)
    this.col = players[num].col
    this.size = size
    this.speed = speed
    this.vel = p5.Vector.sub(createVector(this.other.pos.x, this.other.pos.y), this.pos).setMag(this.speed)


    //0=carré,1=triangle
    this.shape = shape

    //0=normal,<0 = follow(+ valeur élevée, + distance de vision grande)
    this.movetype = movetype

    this.delete = false
  }

  update() {
    this.pos.add(this.vel)
    if (this.movetype > 0 && dist(this.pos.x, this.pos.y, this.other.pos.x, this.other.pos.y) < this.movetype)
      this.vel = p5.Vector.sub(createVector(this.other.pos.x, this.other.pos.y), this.pos).setMag(this.speed)


    this.collide()
  }

  render() {
    let xpos = this.pos.x * zoom - cam.x * zoom
    let ypos = this.pos.y * zoom - cam.y * zoom
    if (xpos > -width / 2 && xpos < width / 2 && ypos > -height / 2 && ypos < height / 2) {
      fill(this.col)
      noStroke()
      push()
      translate(xpos, ypos)

      if (this.shape == 0) {
        rect(0, 0, this.size * zoom, this.size * zoom)
      } else {
        rotate(this.vel.heading())
        triangle(-this.size / 2 * zoom, -this.size / 2 * zoom, -this.size / 2 * zoom, this.size / 2 * zoom, this.size / 2 * zoom, 0)
      }
      pop()

    }
  }
  collide() {
    for (y = floor(this.pos.y) - 1; y <= ceil(this.pos.y) + 1; y++) {
      for (x = floor(this.pos.x) - 1; x <= ceil(this.pos.x) + 1; x++) {

        if (x >= 0 && x < gsize.x && y >= 0 && y < gsize.y) {
          if (grid[y][x].hitbox) {
            if (this.collideWith(createVector(grid[y][x].pos.x - 1 / 2, grid[y][x].pos.y - 1 / 2), createVector(grid[y][x].pos.x + 1 / 2, grid[y][x].pos.y + 1 / 2))) {

              for (let i = 0; i < 5; i++) {
                particles.push(new Particle(this.pos.x, this.pos.y, -this.size * 0.05 / 0.2, this.size * 0.05 / 0.2, -this.size * 0.05 / 0.2, this.size * 0.05 / 0.2, 0.95, 0.95, color(this.col[0], this.col[1], this.col[2], 100), color(this.col[0], this.col[1], this.col[2], 0), this.size, 0, 50, this.shape))
              }
              shake = 3 * this.size
              if (this.size > 0.8) {
                Sounds[2].play()
              } else if (this.size > 0.2) {
                Sounds[1].play()
              } else {
                Sounds[0].play()
              }

              this.delete = true
            }

          }
        }
      }

    }

    if (this.collideWith(createVector(this.other.pos.x - this.other.values[3] / 2, this.other.pos.y - this.other.values[3] / 2), createVector(this.other.pos.x + this.other.values[3] / 2, this.other.pos.y + this.other.values[3] / 2))) {
      this.delete = true
      this.other.health -= players[this.num].values[10]
      for (let i = 0; i < 5; i++) {
        particles.push(new Particle(this.pos.x, this.pos.y, -this.size * 0.1 / 0.2, this.size * 0.1 / 0.2, -this.size * 0.1 / 0.2, this.size * 0.1 / 0.2, 0.95, 0.95, color(this.col[0], this.col[1], this.col[2], 200), color(this.col[0], this.col[1], this.col[2], 0), this.size, 0, 50, this.shape))
      }
      shake = 7 * this.size
      if (this.size > 0.8) {
        Sounds[5].play()
      } else if (this.size > 0.2) {
        Sounds[4].play()
      } else {
        Sounds[3].play()
      }

    }

    if (this.collideWith(createVector(-0.5, -1.5), createVector(gsize.x, -0.5)) || this.collideWith(createVector(-1.5, -0.5), createVector(-0.5, gsize.y)) || this.collideWith(createVector(gsize.x - 0.5, -0.5), createVector(gsize.x + 0.5, gsize.y)) || this.collideWith(createVector(-0.5, gsize.y - 0.5), createVector(gsize.x, gsize.y + 0.5))) {
      for (let i = 0; i < 5; i++) {
        particles.push(new Particle(this.pos.x, this.pos.y, -this.size * 0.05 / 0.2, this.size * 0.05 / 0.2, -this.size * 0.05 / 0.2, this.size * 0.05 / 0.2, 0.95, 0.95, color(this.col[0], this.col[1], this.col[2], 100), color(this.col[0], this.col[1], this.col[2], 0), this.size, 0, 50, this.shape))
      }
      shake = 3 * this.size
      this.delete = true
    }

  }

  collideWith(p1, p2) {

    if (this.pos.y < p1.y - this.size * 0.4 || this.pos.y > p2.y + this.size * 0.4) {
      return false
    }
    if (this.pos.x < p1.x - this.size * 0.4 || this.pos.x > p2.x + this.size * 0.4) {
      return false
    }

    return true

  }
}