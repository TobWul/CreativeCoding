let cells;
let cellSize;

function rules(state, neighbors) {
  if (state && (neighbors > 3 || neighbors < 2)) return 0;
  if (!state && neighbors === 3) return 1;
  return state;
}

const newArray = (n) => [...new Array(n).keys()].map(() => 0);

function setup() {
  createCanvas(640, 640);
  background(255);
  cols = 50;
  rows = cols;
  numCells = cols * rows;
  cells = newArray(numCells).map(() => (random() > 0.2 ? 1 : 0));
  cellSize = width / cols;
  frameRate(60);
}

function draw() {
  const nextGen = newArray(cells.length);
  for (let i = 0; i < cells.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    let neighbors = 0;
    for (let x = -1; x < 1; x++) {
      for (let y = -1; y < 1; y++) {
        neighbors += cells[col + x + (row + y) * cols];
      }
    }
    neighbors -= cells[i];
    nextGen[i] = rules(cells[i], neighbors);

    fill(cells[i] ? 255 : 0);
    rect(col * cellSize, row * cellSize, cellSize);
  }
  cells = nextGen;
}
