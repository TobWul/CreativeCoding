const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  cols: 50,
  rows: 50,
  scaleMin: 1,
  scaleMax: 3,
  minWidth: -10,
  maxWidth: 10,
  freq: -0.002,
  amplitude: 0.59,
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    const grid = {
      cols: params.cols,
      rows: params.rows,
      width: width,
      height: height,
    };
    const cell = {
      width: grid.width / grid.cols,
      height: grid.height / grid.rows,
    };
    const gap = {
      x: 0,
      y: 0,
    };
    const numCells = grid.cols * grid.rows;

    for (let i = 0; i < numCells; i++) {
      const col = i % grid.cols;
      const row = Math.floor(i / grid.cols);
      const x = col * cell.width;
      const y = row * cell.height;
      const width = cell.width;
      const height = cell.height;

      const n = random.noise2D(x + frame * 1, y, params.freq);
      const angle = n * Math.PI * params.amplitude;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x, y);
      context.translate(gap.x, gap.y);
      context.translate(cell.width * 0.5, cell.height * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;

      context.beginPath();
      context.moveTo(width * math.mapRange(n, -1, 1, params.minWidth, 0), 0);
      context.lineTo(width * math.mapRange(n, -1, 1, 0, params.maxWidth), 0);
      context.strokeStyle = "white";
      context.stroke();
      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Grid" });
  folder.addInput(params, "cols", { min: 2, max: 100, step: 1 });
  folder.addInput(params, "rows", { min: 2, max: 100, step: 1 });
  folder.addInput(params, "scaleMin", { min: 0.01, max: 3 });
  folder.addInput(params, "scaleMax", { min: 0.01, max: 3 });
  folder.addInput(params, "minWidth", { min: -100, max: 0 });
  folder.addInput(params, "maxWidth", { min: 0, max: 100 });

  folder = pane.addFolder({ title: "Noise" });
  folder.addInput(params, "freq", { min: -0.01, max: 0.01 });
  folder.addInput(params, "amplitude", { min: 0, max: 1 });
};

createPane();
canvasSketch(sketch, settings);
