class Bonus {
  constructor() {
    this.t = floor(random(0, 3))

    this.pos = createVector(floor(random(0, gsize.x)), floor(random(0, gsize.y)))
    while (grid[this.pos.y][this.pos.x].hitbox || dist(this.pos.x, this.pos.y, players[0].pos.x, players[0].pos.y) < 5 || dist(this.pos.x, this.pos.y, players[1].pos.x, players[1].pos.y) < 5) {
      this.pos = createVector(floor(random(0, gsize.x)), floor(random(0, gsize.y)))
    }

    this.size = 0
    this.timer = 0
    this.delete = false
  }
  update() {
    if (this.timer > 600) {
      this.size += (0 - this.size) / 15
      this.delete = true
    } else {
      this.timer++
      this.size += (zoom * 0.7 - this.size) / 15
    }
    if (random(0, 1) < 0.06) {
      particles.push(new Particle(this.pos.x + random(-0.3, 0.3), this.pos.y + random(-0.3, 0.3), 0, 0, 0, 0, 0, 0, color(255), color(255, 0), 0.05, random(0.1, 0.2), 25, 0))
    }

  }

  render() {
    fill(150)
    noStroke()
    rect(this.pos.x * zoom - cam.x * zoom, this.pos.y * zoom - cam.y * zoom + sin(timer / 20) * 5, this.size, this.size)
    noStroke()
    textAlign(CENTER, CENTER)
    textSize(this.size * 0.9)
    textFont('Helvetica')

    strokeWeight(zoom * 0.07)
    stroke(0)
    if (this.t == 0) {
      fill(25, 181, 178)
      text("➠", this.pos.x * zoom - cam.x * zoom, this.pos.y * zoom - cam.y * zoom + zoom * 0.05 + sin(timer / 20) * 5)
    } else if (this.t == 1) {
      fill(214, 8, 8)
      text("✸", this.pos.x * zoom - cam.x * zoom, this.pos.y * zoom - cam.y * zoom + zoom * 0.05 + sin(timer / 20) * 5)
    } else if (this.t == 2) {
      fill(41, 183, 25)
      text("✚", this.pos.x * zoom - cam.x * zoom, this.pos.y * zoom - cam.y * zoom + zoom * 0.05 + sin(timer / 20) * 5)
    }


    this.collide()
  }
  collide() {
    for (let p of players) {
      if (dist(this.pos.x, this.pos.y, p.pos.x, p.pos.y) < 0.7) {

        shake = 10
        Sounds[7+this.t].play()
        
        for (let i = 0; i < 20; i++) {
          particles.push(new Particle(this.pos.x, this.pos.y, -0.1, 0.1, -0.1, 0.1, 0.99, 0.99, color(255), color(255, 0), 0.4, 0, 100, 1))
        }

        this.delete = true
        this.timer = 0
        this.size = 0

        if (this.t == 0) {
          p.Btimer = 300
          p.Btimermax = 300
          p.Btype = 0
        } else if (this.t == 1) {
          p.Btimer = 200
          p.Btimermax = 200
          p.Btype = 1
        } else if (this.t == 2) {
          p.Btimer = 1
          p.Btimermax = 0
          p.Btype = 2
          p.health += int(p.values[12] / 2)
          if (p.health > p.values[12]) {
            p.health = p.values[12]
          }
        }
      }
    }
  }

}