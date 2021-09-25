class Tile {
  constructor(x, y, col, hitbox) {
    this.pos = createVector(x, y)
    this.col = col
    this.hitbox = hitbox
  }
  render() {
    noStroke()
    fill(this.col)
    rect(this.pos.x * zoom - cam.x * zoom, this.pos.y * zoom - cam.y * zoom, zoom + 1, zoom + 1)


  }
}