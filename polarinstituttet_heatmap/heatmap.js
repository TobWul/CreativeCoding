const canvasSketch = require("canvas-sketch");
const { mapRange } = require("canvas-sketch-util/math");
import ColorScale from "color-scales";

let colorScale = new ColorScale(0, 255, ["#ACCB96", "#477F8A", "#2D316D"], 0.6); // alpha is optional. defaults to 1

const settings = {
  dimensions: [632, 200],
};

let manager;

const imageCanvas = document.createElement("canvas");
imageCanvas.width = 632;
imageCanvas.height = 200;
const imageContext = imageCanvas.getContext("2d");

var img = new Image();
img.crossOrigin = "anonymous";
img.src = "./polarinstituttet/heatmap.png";

imageContext.drawImage(img, 0, 0);

const colors = {
  yellows: [60, 50, 44, 35, 26, 11, 4, 0, 351],
};

const getHue = (a) => {
  const { r, g, b } = colorScale.getColor(a);
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
};

console.log(getHue(50));

const sketch = ({ context, width, height }) => {
  return ({ context, width, height, frame }) => {
    const imageData = imageContext
      .getImageData(0, 0, width, height)
      .data.filter((_, index) => index % 4);

    for (let i = 0; i < width * height; i++) {
      const x = i % width;
      const y = Math.floor(i / width);
      const a = imageData[i * 3];

      context.save();
      context.translate(x, y);
      context.fillStyle = getHue(a);
      context.fillRect(0, 0, 1, 1);
      context.restore();
    }
  };
};

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

img.onload = () => {
  start();
};
