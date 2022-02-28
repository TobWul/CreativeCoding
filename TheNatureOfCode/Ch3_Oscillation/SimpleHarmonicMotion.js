const amplitude = 200;
const period = 120;
let x;

function setup() {
  createCanvas(640, 640);
  x = width / 2;
}

function draw() {
  background(0);
  x = width / 2 - amplitude * sin((2 * PI * frameCount) / period);
  fill(255);
  ellipse(x, height / 2, 20);
}
