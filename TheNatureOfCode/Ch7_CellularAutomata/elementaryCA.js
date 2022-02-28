let cells;
let cellSize;
const ruleset = [0, 1, 0, 1, 1, 0, 1, 1];

function rules(a, b, c) {
  const index = parseInt(`${a}${b}${c}`, 2);
  return ruleset[index];
}

const newArray = (n) => [...new Array(n).keys()].map(() => 0);

function setup() {
  createCanvas(640, 640);
  background(255);
  cellSize = 0.5;
  cells = newArray(Math.floor(width / cellSize)).map(() => 0);
  cells[Math.floor(cells.length / 2)] = 1;
  cellSize = width / cells.length;
  noStroke();
}

function draw() {
  const nextGen = newArray(cells.length);
  for (let i = 1; i < cells.length - 1; i++) {
    const left = cells[i - 1];
    const middle = cells[i];
    const right = cells[i + 1];
    nextGen[i] = rules(left, middle, right);

    fill(middle ? 0 : 255);
    rect(i * cellSize, (frameCount - 1) * cellSize, cellSize, cellSize);
  }
  cells = nextGen;
}
