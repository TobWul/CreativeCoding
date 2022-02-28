const width = 500;
const height = 500;
let walker;

function setup() {
  createCanvas(width, height);
  background(220);
  strokeWeight(2);
  walker = new Walker(width, height);
}

function draw() {
  walker.display();
  walker.step();
}

class Walker {
  constructor(width, height) {
    this.x = width / 2;
    this.y = height / 2;
  }
  display() {
    stroke(0);
    point(this.x, this.y);
  }
  step() {
    const r = random(1);
    if (r < 0.4) {
      this.x++;
    } else if (r < 0.6) {
      this.x--;
    } else if (r < 0.8) {
      this.y--;
    } else {
      this.y++;
    }
  }
}
