var grid = []
var zoom = 45
var desiredZoom = 45
var cam
var x;
var y
var players = []
var particles = []
var bullets = []
var gsize
var fps
var Maps = []
var Spos
var timer = 0
var colorScheme
var barL0
var barL1
var shake = 0
var bonuss = []
var loadedMap
var Sounds = []
var InGame = false
var restart = 0
var Musics = []
var trans = false
var t=0


//Speed,Acceleration,Friction,size(%),border size(%), reload time, bullet size, bullet speed, bullet shape, bullet type, bullet damage, squishiness, health
const playerClasses = [
  [0.1, 0.05, 0.8, 0.9, 0.2, 25, 0.4, 0.15, 0, 0, 10, 1, 100],
  [0.15, 0.05, 0.9, 0.6, 0.1, 5, 0.2, 0.2, 0, 0, 2, 2, 50],
  [0.07, 0.05, 0.85, 1.3, 0.3, 60, 0.9, 0.35, 1, 0, 30, 0.7, 150],
  [0.09, 0.05, 0.85, 0.8, 0.4, 20, 0.5, 0.13, 1, 3, 7, 1.1, 85]
]

function preload() {
  Maps.push(loadImage("Maps/levelTest1.png"))
  Maps.push(loadImage("Maps/levelTest2.png"))
  Maps.push(loadImage("Maps/levelTest3.png"))
  
  Sounds.push(loadSound("Sounds/impact 1.mp3"))
  Sounds.push(loadSound("Sounds/impact 2.mp3"))
  Sounds.push(loadSound("Sounds/impact 3.mp3"))
  Sounds.push(loadSound("Sounds/hit 1.mp3"))
  Sounds.push(loadSound("Sounds/hit 2.mp3"))
  Sounds.push(loadSound("Sounds/hit 3.mp3"))
  Sounds.push(loadSound("Sounds/Explosion.mp3"))
  Sounds.push(loadSound("Sounds/Bonus 1.mp3"))
  Sounds.push(loadSound("Sounds/Bonus 2.mp3"))
  Sounds.push(loadSound("Sounds/Bonus 3.mp3"))
  Sounds.push(loadSound("Sounds/shot 1.mp3"))
  Sounds.push(loadSound("Sounds/shot 2.mp3"))
  Sounds.push(loadSound("Sounds/shot 3.mp3"))
  Musics.push(loadSound("Sounds/menu.mp3"))
  Musics.push(loadSound("Sounds/InGame.mp3"))
  

  sfont = loadFont("Pixel Bug.otf")
}

function loadMap(index) {
  loadedMap = Maps[index]
  grid = []
  gsize = createVector(loadedMap.width, (loadedMap.height - 1) / 2)
  colorScheme = []
  colorScheme.push(color(loadedMap.get(0, gsize.y * 2)[0], loadedMap.get(0, gsize.y * 2)[1], loadedMap.get(0, gsize.y * 2)[2], 150))
  colorScheme.push(color(loadedMap.get(1, gsize.y * 2)[0], loadedMap.get(1, gsize.y * 2)[1], loadedMap.get(1, gsize.y * 2)[2], 0))

  Spos = [0, 0, 0, 0]
  for (y = 0; y < gsize.y; y++) {
    grid[y] = []
    for (x = 0; x < gsize.x; x++) {
      if (loadedMap.get(x, y)[0] == 255 && loadedMap.get(x, y)[1] == 128 && loadedMap.get(x, y)[2] == 0) {
        Spos[0] = x
        Spos[1] = y
        grid[y].push(new Tile(x, y, loadedMap.get(x, y + gsize.y), false))
      } else if (loadedMap.get(x, y)[0] == 128 && loadedMap.get(x, y)[1] == 0 && loadedMap.get(x, y)[2] == 255) {
        Spos[2] = x
        Spos[3] = y
        grid[y].push(new Tile(x, y, loadedMap.get(x, y + gsize.y), false))
      } else if (loadedMap.get(x, y)[0] == 0 && loadedMap.get(x, y)[1] == 0 && loadedMap.get(x, y)[2] == 0) {
        grid[y].push(new Tile(x, y, loadedMap.get(x, y + gsize.y), true))
      } else {
        grid[y].push(new Tile(x, y, loadedMap.get(x, y + gsize.y), false))
      }
    }
  }
}

function StartGame() {
  Musics[0].stop()
  background(0,255,0)
  zoom=45
  desiredZoom=45
  InGame = true
  cam = createVector(0, 0)
  loadMap(2)
  players = []
  particles = []
  players.push(new Player(Spos[0], Spos[1], [242, 133, 24], [90, 81, 83, 68, 70], 0, 1))
  players.push(new Player(Spos[2], Spos[3], [133, 24, 242], [38, 37, 40, 39, 96], 1, 2))
  for (let i = 0; i < 25; i++) {
    particles.push(new Particle(Spos[0], Spos[1], -0.01, 0.01, -0.01, 0, 1.01, 1.03, color(255, 255), color(255, 0), random(0.4, 0.5), 0, random(80, 120), 1))
    particles.push(new Particle(Spos[2], Spos[3], -0.01, 0.01, -0.01, 0, 1.01, 1.03, color(255, 255), color(255, 0), random(0.4, 0.5), 0, random(80, 120), 1))

  }
  moveCam(1)
  barL0 = players[0].values[12]
  barL1 = players[1].values[12]
  
  Musics[1].loop()
  Musics[1].play()
  Musics[1].setVolume(0.5)
}

function RestartGame(){
  zoom=45
  desiredZoom=45
  cam = createVector(0, 0)
  players = []
  particles = []
  players.push(new Player(Spos[0], Spos[1], [242, 133, 24], [90, 81, 83, 68, 70], 0, 1))
  players.push(new Player(Spos[2], Spos[3], [133, 24, 242], [38, 37, 40, 39, 96], 1, 2))
  for (let i = 0; i < 25; i++) {
    particles.push(new Particle(Spos[0], Spos[1], -0.01, 0.01, -0.01, 0, 1.01, 1.03, color(255, 255), color(255, 0), random(0.4, 0.5), 0, random(80, 120), 1))
    particles.push(new Particle(Spos[2], Spos[3], -0.01, 0.01, -0.01, 0, 1.01, 1.03, color(255, 255), color(255, 0), random(0.4, 0.5), 0, random(80, 120), 1))
  }
  moveCam(1)
  barL0 = players[0].values[12]
  barL1 = players[1].values[12]
}


function BackToMenu(){
  InGame=false
  players=[]
  particles=[]
  bonuss=[]
  Musics[1].stop()
  Musics[0].loop()
  Musics[0].play()
}


function setup() {
  createCanvas(830, 580)
  fps = createElement("t", "")
  BackToMenu()
  
}

function draw() {
  timer++
  if (trans){
    t+=10
  }else{
    t-=10
  }
  
  if (InGame) {
    if (players.length==1){
      restart+=2
      if (restart>255){
        RestartGame()
      }
    }else{
      if (restart>0){
        restart-=10
      }
    }
    
    if (random(0, 1) < 0.001 && bonuss.length < 1 && players.length == 2) {
      bonuss.push(new Bonus())
    }

    shake *= 0.85

    if (random(0, 1) < 0.5) {
      particles.push(new Particle(random(gsize.x), random(gsize.y), 0, 0, -0.02, -0.01, 1, 1.01, colorScheme[0], colorScheme[1], 0, 0.4, 100, 0))
    }

    background(0);
    if (timer / 10 == floor(timer / 10)) {
      fps.html("FPS : " + int(frameRate()))
    }
    let sx
    let sy
    if (random(0, 1) < 0.5) {
      sx = shake
    } else {
      sx = -shake
    }
    if (random(0, 1) < 0.5) {
      sy = shake
    } else {
      sy = -shake
    }

    rectMode(CENTER)
    moveCam(15)
    zoom += (desiredZoom - zoom) / 50
    //print(cam.x,cam.y,zoom)
    translate(width / 2 + sx, height / 2 + sy)
    renderGrid()

    for (let b = bonuss.length - 1; b >= 0; b--) {

      bonuss[b].render()
      bonuss[b].update()
      if (bonuss[b].delete && bonuss[b].size < 5) {
        bonuss.splice(b, 1)
      }
    }


    for (let p of players) {
      p.update()
      p.render()
    }
    for (let bu = bullets.length - 1; bu >= 0; bu--) {

      bullets[bu].render()
      bullets[bu].update()
      if (bullets[bu].delete) {
        bullets.splice(bu, 1)
      }
    }


    for (let pa = particles.length - 1; pa >= 0; pa--) {
      particles[pa].render()
      particles[pa].update()
      if (particles[pa].delete) {
        particles.splice(pa, 1)
      }
    }

    translate(-width / 2, -height / 2)
    if (players.length == 2) {
      RenderBars(150, 60)
    }
    renderBonusArrow(20)
    
    background(255,restart)
    textFont(sfont)
    fill(255,restart)
    stroke(0,restart)
    strokeWeight(restart/50)
    textSize(20)
    textAlign(CENTER,BOTTOM)
    text("Press Escape to quit",width/2,height)
    textAlign(CENTER,CENTER)
    strokeWeight(restart/25)
    textSize(restart/2)
    text("You Won !",width/2,height/2)
    if (keyIsDown(27)) {
      trans=true
    }
    if (t>255){
      BackToMenu()
      trans=false 
    }
    
    
  }else{
    background(255,0,0)
    if (keyIsDown(32)) {
      trans=true
    }
    if (t>255){
        StartGame() 
        trans=false
      }
    
    
  }
  background(0,t)
}

function renderGrid() {
  for (y = floor(cam.y) - floor(height / zoom / 2) - 1; y <= ceil(cam.y) + ceil(height / zoom / 2); y++) {
    for (x = floor(cam.x) - floor(width / zoom / 2) - 1; x <= ceil(cam.x) + ceil(width / zoom / 2); x++) {
      if (x >= 0 && x < gsize.x && y >= 0 && y < gsize.y)
        grid[y][x].render()
    }
  }
}

function moveCam(value) {
  //MOVING THE CAMERA
  if (players.length == 2) {
    cam.x += (((players[0].pos.x + players[1].pos.x) / 2) - cam.x) / value
    cam.y += (((players[0].pos.y + players[1].pos.y) / 2) - cam.y) / value
    changeZoom()
  } else if (players.length == 1) {
    cam.x += (players[0].pos.x - cam.x) / value
    cam.y += (players[0].pos.y - cam.y) / value
  }

  if (cam.x < width / zoom / 2 - 0.5) {
    cam.x = width / zoom / 2 - 0.5
  } else if (cam.x > gsize.x - 0.5 - (width / zoom / 2)) {
    cam.x = gsize.x - 0.5 - (width / zoom / 2)
  }
  if (cam.y < height / zoom / 2 - 0.5) {
    cam.y = height / zoom / 2 - 0.5
  } else if (cam.y > gsize.y - 0.5 - (height / zoom / 2)) {
    cam.y = gsize.y - 0.5 - (height / zoom / 2)
  }

}

function changeZoom() {
  let p1pos = createVector(players[0].pos.x * zoom - cam.x * zoom, players[0].pos.y * zoom - cam.y * zoom)
  let p2pos = createVector(players[1].pos.x * zoom - cam.x * zoom, players[1].pos.y * zoom - cam.y * zoom)

  if ((p1pos.x > width / 2 - desiredZoom * 1 || p1pos.x < -width / 2 + desiredZoom * 1 || p1pos.y > height / 2 - desiredZoom * 1 || p1pos.y < -height / 2 + desiredZoom * 1) && (p2pos.x > width / 2 - desiredZoom * 1 || p2pos.x < -width / 2 + desiredZoom * 1 || p2pos.y > height / 2 - desiredZoom * 1 || p2pos.y < -height / 2 + desiredZoom * 1)) {
    if (desiredZoom > width / max(gsize.x, gsize.y) + 1 && desiredZoom > 30 && dist(players[0].pos.x, players[0].pos.y, players[1].pos.x, players[1].pos.y) > width / zoom / 2) {
      desiredZoom -= 0.5
    }
  } else {
    if (desiredZoom <= 45) {
      desiredZoom += 0.5
    }
  }

}


function RenderBars(barsize, barsize2) {
  rectMode(CORNER)
  textAlign(CENTER, TOP)
  textSize(15)
  textFont(sfont)
  barL0 += (players[0].health - barL0) / 15
  barL1 += (players[1].health - barL1) / 15
  noStroke()

  fill(220)
  rect(10 - 5, 10 - 5, barsize + 10, 15 + 10)
  rect(width - 10 - 5 - barsize, 10 - 5, barsize + 10, 15 + 10)

  if (players[0].Btimer > 0) {
    if (players[0].Btype == 0) {
      fill(25, 181, 178)
    } else if (players[0].Btype == 1) {
      fill(214, 8, 8)
    } else if (players[0].Btype == 2) {
      fill(41, 183, 25)
    }
    rect(barsize + 10 + 5, 10 - 5, -map(players[0].Btimer, 0, players[0].Btimermax, 0, barsize), 15 + 10)

  }
  if (players[1].Btimer > 0) {
    if (players[1].Btype == 0) {
      fill(25, 181, 178)
    } else if (players[1].Btype == 1) {
      fill(214, 8, 8)
    } else if (players[1].Btype == 2) {
      fill(41, 183, 25)
    }
    rect(width - 10 + 5, 10 - 5, -map(players[1].Btimer, 0, players[1].Btimermax, 0, barsize), 15 + 10)
  }


  fill(30)
  rect(10 - 2, 10 - 2, barsize + 4, 15 + 4)
  rect(width - 10 - 2 - barsize, 10 - 2, barsize + 10 - 6, 15 + 10 - 6)


  fill(color(players[0].col[0], players[0].col[1], players[0].col[2]))

  rect(10 + barsize, 10, map(barL0, 0, players[0].values[12], 0, -barsize), 15)

  fill(color(players[1].col[0], players[1].col[1], players[1].col[2]))
  noStroke()
  rect(width - 10, 10, map(barL1, 0, players[1].values[12], 0, -barsize), 15)

  fill(30)
  stroke(220)
  strokeWeight(3)
  text(players[0].health + "/" + players[0].values[12], 10 + 3 + (barsize) / 2, 2 + 6 + 15 + sin(timer / 20) * 3)
  text(players[1].health + "/" + players[1].values[12], width - 10 - 3 - (barsize) / 2, 2 + 6 + 15 + sin(timer / 20) * 3)

  //
  fill(30)
  stroke(220)
  strokeWeight(1)
  rect(barsize * 1.2 - 1, 10 - 1, barsize2 + 2, 10 + 2)
  rect(width - barsize * 1.2 - barsize2 - 2, 10 - 1, barsize2 + 2, 10 + 2)

  fill(255)
  noStroke()
  rect(barsize2 + barsize * 1.2, 10, map(players[0].reload, 0, players[0].values[5], -barsize2, 0), 10)
  rect(width - 1 - barsize * 1.2, 10, map(players[1].reload, 0, players[1].values[5], -barsize2, 0), 10)

}


function renderBonusArrow(si) {
  for (let b of bonuss) {
    if (b.pos.x * zoom - cam.x * zoom < -width / 2 || b.pos.x * zoom - cam.x * zoom > width / 2 || b.pos.y * zoom - cam.y * zoom < -height / 2 || b.pos.y * zoom - cam.y * zoom > height / 2) {
      let dir = p5.Vector.sub(createVector(b.pos.x, b.pos.y), cam).setMag(1)
      push()
      if (b.t == 0) {
        fill(25, 181, 178, 200)
      } else if (b.t == 1) {
        fill(214, 8, 8, 200)
      } else if (b.t == 2) {
        fill(41, 183, 25, 200)
      }
      noStroke()
      translate(width / 2, height / 2)
      translate(dir.x * width / 2.1, dir.y * height / 2.1)
      rotate(dir.heading())
      triangle(-si / 2, -si / 2, -si / 2, si / 2, si / 1.5, 0)
      pop()
    }
  }
}