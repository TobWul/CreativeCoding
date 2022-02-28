let oscillators;

function setup() {
  createCanvas(640, 640);
  oscillators = [...new Array(10).keys()].map((_, index) => {
    return new Oscillator(index);
  });
}

function draw() {
  background(0);
  stroke(255);
  point(width / 2, height / 2);
  oscillators.forEach((oscillator, index) => {
    oscillator.oscillate();
    oscillator.display();
  });
}

class Oscillator {
  constructor(index) {
    this.angle = createVector(0, 0);
    this.aVelocity = createVector(index / 500, index / 100);
    this.amplitude = createVector(random(width / 2), random(height / 2));
  }
  oscillate() {
    this.angle.add(this.aVelocity);
  }
  display() {
    const x = sin(this.angle.x) * this.amplitude.x;
    const y = sin(this.angle.y) * this.amplitude.y;

    stroke(255);
    fill(255);

    applyMatrix();
    translate(width / 2, height / 2);
    line(0, 0, x, y);
    ellipse(x, y, 20);
    resetMatrix();
  }
}
