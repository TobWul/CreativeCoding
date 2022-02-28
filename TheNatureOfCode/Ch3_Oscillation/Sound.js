class Wave {
  constructor(period) {
    this.amplitude = 20;
    this.period = map(period, 200, 500, 0, 10);
  }
  point(frameCount, index) {
    return sin(index / this.period + frameCount / 10) * this.amplitude;
  }
}

let frequencies;

let resolution;

let activeKeys = ["C"];

function setup() {
  createCanvas(640, 640);
  resolution = 200;
  frequencies = {
    c: new Wave(261.63),
    C: new Wave(277.18),
    d: new Wave(293.66),
    D: new Wave(311.13),
    e: new Wave(329.63),
    f: new Wave(349.23),
    F: new Wave(369.99),
    g: new Wave(392.0),
    G: new Wave(415.3),
    a: new Wave(440.0),
    A: new Wave(466.16),
    h: new Wave(493.88),
  };
}

function draw() {
  const ballWidth = width / resolution;

  background(0);
  beginShape();
  for (let i = 0; i < resolution; i++) {
    const y = activeKeys.reduce(
      (ySum, key) =>
        frequencies[key]
          ? ySum + frequencies[key].point(frameCount, i)
          : ySum + 0,
      0
    );
    // applyMatrix();
    // translate(0, height / 2);
    noFill();
    stroke(255);
    curveVertex(ballWidth / 2 + i * ballWidth, y + height / 2);
    // resetMatrix();
  }
  endShape();
}

function keyPressed(e) {
  if (e.key === "Escape") {
    activeKeys = [];
  }
  activeKeys.push(e.key);
  activeKeys = [...new Set(activeKeys)];
}
