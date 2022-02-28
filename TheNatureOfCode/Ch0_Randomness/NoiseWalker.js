const width = 640;
const height = width;
let walker;

function setup() {
  createCanvas(width, height);
  background(255);
  colorMode(HSL, 100);
  walker = new Walker(width, height);
}

function draw() {
  walker.step();
  walker.display();
}

class Walker {
  constructor(width, height) {
    this.x = random(0, width);
    this.y = random(0, height);
    this.width = width;
    this.height = height;
    this.w = 30;
    this.ty = 1;
    this.tx = 0;
    this.increment = 0.005;
  }

  display() {
    stroke(map(this.tx, 0, 10, 40, 70), 100, 30);
    ellipse(this.x, this.y, this.w);
  }
  step() {
    this.x = map(noise(this.tx), 0, 1, 0, this.width);
    this.y = map(noise(this.ty, this.tx), 0, 1, 0, this.height);
    this.ty += this.increment;
    this.tx += this.increment;
  }
}
