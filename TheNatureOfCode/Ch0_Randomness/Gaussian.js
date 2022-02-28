const width = 480;
const height = 480;

const mean = width / 2;
const sd = 30;

function setup() {
  createCanvas(width, height);
  strokeWeight(5);
  background(0);
  colorMode(HSB, 100);
}

function draw() {
  const color = randomGaussian(0, 1) * 5 + 50;
  stroke(color, 100, 50);
  const r = randomGaussian(0, 1);
  const r2 = randomGaussian(0, 1);
  point(sd * r + width / 2, sd * r2 + height / 2);
}
