class Player {
  constructor(x, y, col, keys, number, playerClass) {
    this.pos = createVector(x, y)
    this.vel = createVector(0, 0)
    this.keys = keys
    this.col = col
    this.number = number
    this.reload = 0

    this.Btimer = 0
    this.Btimermax = 0
    //0=speed ;1=bullet speed ;2=pv
    this.Btype = 0

    this.values = playerClasses[playerClass]
    this.health = this.values[12]

  }
  render() {
    stroke(this.col[0], this.col[1], this.col[2], 255)
    strokeWeight(zoom * this.values[3] * this.values[4])
    fill(this.col[0], this.col[1], this.col[2], 150)
    rect(this.pos.x * zoom - cam.x * zoom,
      this.pos.y * zoom - cam.y * zoom,
      zoom * this.values[3] * map(this.values[4], 0, 1, 1, 0) + abs(this.vel.x) * this.values[11] * zoom * this.values[3] - abs(this.vel.y) * this.values[11] * zoom * this.values[3],
      zoom * this.values[3] * map(this.values[4], 0, 1, 1, 0) - abs(this.vel.x) * this.values[11] * zoom * this.values[3] + abs(this.vel.y) * this.values[11] * zoom * this.values[3])




  }
  update() {
    if (this.health <= 0) {
      this.health = 0
      shake = 20
      Sounds[6].play()
      desiredZoom = 60
      for (let i = 0; i < 30; i++) {
        particles.push(new Particle(this.pos.x, this.pos.y, -0.1, 0.1, -0.1, 0.1, 0.98, 0.98, color(this.col[0], this.col[1], this.col[2], 255), color(this.col[0], this.col[1], this.col[2], 0), 0.5, 0, 200, 0))
      }
      bonuss = []
      bullets = []
      players.splice(this.number, 1)
    }
    
    if (players.length==1){
      this.Btimer=0 
    }

    if (this.Btimer > 0) {
      this.Btimer--
    }

    let speedboost = 1
    if (this.Btimer > 0 && this.Btype == 0) {
      speedboost = 2
    }

    if (keyIsDown(this.keys[0])) {
      if (this.vel.y > -this.values[0] * speedboost) {
        this.vel.y -= this.values[1]
      } else {
        this.vel.y = -this.values[0] * speedboost
      }
    }
    if (keyIsDown(this.keys[1])) {
      if (this.vel.x > -this.values[0] * speedboost) {
        this.vel.x -= this.values[1]
      } else {
        this.vel.x = -this.values[0] * speedboost
      }
    }
    if (keyIsDown(this.keys[2])) {
      if (this.vel.y < this.values[0] * speedboost) {
        this.vel.y += this.values[1]
      } else {
        this.vel.y = this.values[0] * speedboost
      }
    }
    if (keyIsDown(this.keys[3])) {
      if (this.vel.x < this.values[0] * speedboost) {
        this.vel.x += this.values[1]
      } else {
        this.vel.x = this.values[0] * speedboost
      }
    }

    if (this.reload > 0) {
      this.reload--
      if (this.Btimer > 0 && this.Btype == 1 && this.reload > 0) {
        this.reload--
      }
    }

    if (keyIsDown(this.keys[4]) && this.reload == 0 && players.length == 2) {
      this.reload = this.values[5]
      bullets.push(new Bullet(this.number, this.values[6], this.values[7], this.values[8], this.values[9]))
      if (this.values[5]>50){
        Sounds[12].play() 
      }else if (this.values[5]>10){
        Sounds[11].play() 
      }else{
        Sounds[10].play() 
      }
      

    }

    this.pos.x += this.vel.x
    if (!keyIsDown(this.keys[1]) && !keyIsDown(this.keys[3])) {
      this.vel.x *= this.values[2]
    }

    if (this.collide()) {
      while (this.collide()) {
        this.pos.x -= (abs(this.vel.x) / this.vel.x) / zoom
      }
      this.vel.x = 0
    }
    this.pos.y += this.vel.y
    if (!keyIsDown(this.keys[0]) && !keyIsDown(this.keys[2])) {
      this.vel.y *= this.values[2]
    }

    if (this.collide()) {
      while (this.collide()) {
        this.pos.y -= (abs(this.vel.y) / this.vel.y) / zoom
      }
      this.vel.y = 0
    }


  }
  collide() {
    for (y = floor(this.pos.y) - 1; y <= ceil(this.pos.y) + 1; y++) {
      for (x = floor(this.pos.x) - 1; x <= ceil(this.pos.x) + 1; x++) {

        if (x >= 0 && x < gsize.x && y >= 0 && y < gsize.y) {
          if (grid[y][x].hitbox) {
            if (this.collideWith(createVector(grid[y][x].pos.x - 1 / 2, grid[y][x].pos.y - 1 / 2), createVector(grid[y][x].pos.x + 1 / 2, grid[y][x].pos.y + 1 / 2))) {
              return true
            }
          }
        }

      }
    }
    if (this.collideWith(createVector(-0.5, -1.5), createVector(gsize.x, -0.5))) {
      return true
    }
    if (this.collideWith(createVector(-1.5, -0.5), createVector(-0.5, gsize.y))) {
      return true
    }
    if (this.collideWith(createVector(gsize.x - 0.5, -0.5), createVector(gsize.x + 0.5, gsize.y))) {
      return true
    }
    if (this.collideWith(createVector(-0.5, gsize.y - 0.5), createVector(gsize.x, gsize.y + 0.5))) {
      return true
    }


  }

  collideWith(p1, p2) {
    let l1 = createVector(this.pos.x - this.values[3] / 2, this.pos.y - this.values[3] / 2)
    let r1 = createVector(this.pos.x + this.values[3] / 2, this.pos.y + this.values[3] / 2)
    let l2 = p1
    let r2 = p2

    if (l1.x >= r2.x || l2.x >= r1.x) {
      return false
    }
    if (l1.y >= r2.y || l2.y >= r1.y) {
      return false
    }
    return true


  }
}