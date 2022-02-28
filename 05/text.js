const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
};

const params = {
  text: "A",
  fontWeight: "bold",
  fontFamily: "Circular Std",
  fontSize: 1200,
};

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height, frame }) => {
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    params.fontSize = cols;

    typeContext.fillStyle = "white";
    typeContext.font = `${params.fontWeight} ${params.fontSize}px ${params.fontFamily}`;
    typeContext.textBaseline = "top";

    const metrics = typeContext.measureText(params.text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    typeContext.save();
    typeContext.translate(tx, ty);
    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    typeContext.fillText(params.text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);
    context.textBaseline = "middle";
    context.textAlign = "center";

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4];

      const fontSizeModifier = random.chance(0.1) ? 2 : 0.5;
      context.font = `${params.fontWeight} ${
        params.fontSize * fontSizeModifier
      }px ${params.fontFamily}`;
      context.fillStyle = "white";

      context.save();
      context.translate(x, y);
      context.translate(cell / 2, cell / 2);
      //   context.fillRect(0, 0, cell, cell);
      context.fillText(getGlyph(r), 0, 0);
      context.restore();
    }
  };
};

const getGlyph = (v) => {
  if (v < 50) return "";
  if (v < 100) return "•";
  if (v < 150) return "-";
  if (v < 200) return "+";
  //   if (v > 200) return "word";

  const glyphs = "_= /".split("");

  return random.pick(glyphs);
};

document.addEventListener("keydown", (e) => {
  params.text = e.key.toUpperCase();
  manager.render();
});

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Grid" });
};

createPane();
start();
