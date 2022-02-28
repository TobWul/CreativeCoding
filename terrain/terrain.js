const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");
const load = require("load-asset");
var fs = require("fs");

const settings = {
  dimensions: "a4",
  pixelsPerInch: 300,
  animate: true,
};

const params = {
  heightOffset: 1826.09,
  renderToRow: 222,
  rowInterval: 1,
  colInterval: 4,
  rowGap: 24,
  lineWidth: 4,
  backgroundColor: "#ddc9d0",
  foregroundColor: "#64597d",
};

const terrainCanvas = document.createElement("canvas");
const terrainContext = terrainCanvas.getContext("2d");

const sketch = async ({ context, width }) => {
  const image = await load("terrain/heightmap.png");
  terrainContext.drawImage(image, 0, 0, image.width, image.height);
  context.drawImage(image, 0, 0, image.width, image.height);

  const imageData = terrainContext.getImageData(
    0,
    0,
    image.width,
    image.height
  ).data;

  const pixels = [];
  for (let i = 0; i < Math.pow(image.width, 2); i++) {
    pixels.push(imageData[i * 4]);
  }
  console.log(pixels);

  return ({ context, width, height }) => {
    let prevRow = -1;
    context.fillStyle = params.backgroundColor;
    context.fillRect(0, 0, width, height);
    context.strokeStyle = params.foregroundColor;
    for (
      let i = 0;
      i < image.width * params.renderToRow;
      i += params.colInterval
    ) {
      const col = i % image.width;
      const row = Math.floor(i / image.width);
      const shouldDrawRow = row % params.rowInterval === 0;
      const isNewRow = row !== prevRow;

      const x = (col / 512) * width * 2;
      const y = row * params.rowGap;

      if (isNewRow) {
        prevRow = row;
        context.stroke();
        // context.fill();
        // context.closePath();
        context.restore();
        context.save();
        context.fillStyle = params.backgroundColor;
        context.strokeStyle = params.foregroundColor;
        context.lineWidth = params.lineWidth;
        context.moveTo(x, y);
        context.beginPath();
      }

      if (shouldDrawRow) {
        context.lineTo(
          x,
          y + math.mapRange(pixels[i], 0, 255, 0, params.heightOffset)
        );
      }
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Map" });
  folder = pane.addInput(params, "heightOffset", { min: 0, max: 2000 });
  folder = pane.addInput(params, "renderToRow", { min: 0, max: 512, step: 1 });
  folder = pane.addInput(params, "rowInterval", { min: 1, max: 48, step: 1 });
  folder = pane.addInput(params, "colInterval", { min: 1, max: 48, step: 1 });
  folder = pane.addInput(params, "rowGap", { min: 1, max: 48, step: 1 });
  folder = pane.addFolder({ title: "Style" });
  folder = pane.addInput(params, "lineWidth", { min: 1, max: 48 });
  pane.addInput(params, "backgroundColor");
  pane.addInput(params, "foregroundColor");
};

createPane();
canvasSketch(sketch, settings);
