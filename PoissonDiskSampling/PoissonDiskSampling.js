const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const Tweakpane = require("tweakpane");

const params = {
  radius: 100,
  iterations: 500,
  k: 30,
  backgroundColor: "#EEEEF4",
  foregroundColor: "#292949",
  accentColor: "#F65E7A",
  accentChance: 0.1,
  circleRadiusMin: 1,
  circleRadiusMax: 4,
};

const newArray = (n, initialValue) =>
  [...Array(n).keys()].map((i) => initialValue);

const poissonDiskSampling = (radius, k, width, height) => {
  const dimensions = 2;

  const cellSize = Math.floor(radius / Math.sqrt(dimensions));
  const grid = newArray(
    Math.floor(width / cellSize) * Math.floor(height / cellSize),
    undefined
  );
  const active = [];

  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);

  const getIndexIn2dArray = (point, iMod = 0, jMod = 0) => {
    const i = Math.floor(point.x / cellSize) + iMod;
    const j = Math.floor(point.y / cellSize) + jMod;
    return i + j * cols;
  };
  // initialPoint point
  const x0 = new Vector(random.range(0, width), random.range(0, height));
  grid[getIndexIn2dArray(x0)] = x0;
  active.push(x0);

  for (let i = 0; i < params.iterations; i++) {
    if (active.length <= 0) break;
    const randomIndex = random.rangeFloor(0, active.length);
    const activePoint = active[randomIndex];
    let validPoint = false;
    for (let i = 0; i < k; i++) {
      let [x, y] = random.onCircle();
      const length = random.range(radius, 2 * radius);
      x = x * length + activePoint.x;
      y = y * length + activePoint.y;
      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);
      if (
        col > 0 &&
        row > 0 &&
        col < cols &&
        row < rows &&
        !grid[col + row * cols]
      ) {
        const neighbors = [];
        for (let i = -1; i < 1; i++) {
          for (let j = -1; j < 1; j++) {
            neighbors.push(grid[col + i + (row + j) * cols]);
          }
        }
        if (!neighbors.some((n) => n && activePoint.getDistance(n) < radius)) {
          validPoint = new Vector(x, y);
          active.push(validPoint);
          const gridIndex = col + row * cols;
          grid[gridIndex] = validPoint;
          break;
        }
      }
    }
    if (!validPoint) {
      active.splice(randomIndex, 1);
    }
  }

  return grid;
};

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    return Math.sqrt(Math.pow(v.x + this.x, 2), Math.pow(v.y + this.y, 2));
  }
}

const settings = {
  dimensions: [1080, 1080],
};

const drawPoints = (points, context) => {
  points
    .filter((pos) => pos?.x && pos?.y)
    .forEach((pos) => {
      context.save();
      context.translate(pos.x, pos.y);
      context.beginPath();
      context.fillStyle = !random.chance(params.accentChance)
        ? params.foregroundColor
        : params.accentColor;
      context.arc(
        0,
        0,
        random.range(params.circleRadiusMin, params.circleRadiusMax),
        0,
        Math.PI * 2
      );
      context.fill();
      context.restore();
    });
};

const sketch = () => {
  return ({ context, width, height }) => {
    const points = poissonDiskSampling(params.radius, params.k, width, height);
    context.fillStyle = params.backgroundColor;
    context.fillRect(0, 0, width, height);

    drawPoints(points, context, params.circleRadius);
  };
};

let manager;
const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Drawing" });
  folder.addInput(params, "backgroundColor");
  folder.addInput(params, "foregroundColor");
  folder.addInput(params, "accentColor");
  folder.addInput(params, "circleRadiusMin", { min: 1, max: 500 });
  folder.addInput(params, "circleRadiusMax", { min: 1, max: 500 });
  folder.addInput(params, "accentChance", { min: 0, max: 1 });

  folder = pane.addFolder({ title: "Poisson Disc Sampling" });
  folder.addInput(params, "radius", { min: 0, max: 1000 });
  folder.addInput(params, "k", { min: 1, max: 100 });
  folder.addInput(params, "iterations", { min: 1, max: 100000 });

  pane.on("change", (ev) => {
    manager.render();
  });
};

createPane();

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();
