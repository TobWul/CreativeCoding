let oscillators;
const ballWidth = 20;

function setup() {
  createCanvas(640, 640);
  background(0);
  const ballCount = floor(width / ballWidth);
  oscillators = [...new Array(ballCount).keys()].map(
    (_, index) => new Oscillator(index, 1, random(height / 2))
  );
}

function draw() {
  background(0);
  oscillators.forEach((oscillator, index) => {
    // oscillator.oscillate();
    // oscillator.display((x, y) => {
    //   fill(255);
    //   ellipse(index * ballWidth, y, 20);
    // });
    applyMatrix();
    translate(0, height / 2);
    ellipse(
      index * ballWidth,
      sin(frameCount * 0.01 + index) * ballWidth,
      ballWidth
    );
    resetMatrix();
  });
}

class Oscillator {
  constructor(angle, aVelocity, amplitude) {
    this.angle = angle;
    this.aVelocity = aVelocity;
    this.amplitude = amplitude;
  }

  oscillate() {
    this.angle.add(this.aVelocity);
  }

  display(drawFunction) {
    const y = sin(this.angle) * this.amplitude;
    drawFunction(null, y);
  }
}
