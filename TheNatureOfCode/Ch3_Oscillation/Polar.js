const width = 640;
const height = width;

let angle = 0;
let radius = 1;

function setup() {
  createCanvas(width, height);
  background(0);
}

function draw() {
  angle += 0.1;
  radius += 0.1;
  const x = radius * sin(angle);
  const y = radius * cos(angle);
  applyMatrix();
  translate(width / 2, height / 2);
  ellipse(x, y, 10);
  resetMatrix();
}
