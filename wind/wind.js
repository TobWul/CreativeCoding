import canvasSketch from "canvas-sketch";
import { noise2D, pick, range } from "canvas-sketch-util/random";
import { Pane } from "tweakpane";

const settings = {
  foregroundColor: "#fff",
  backgroundColor: "#241a64",
  debug: false,
  vectorFieldLineThickness: 0.5,
  vectorFieldLineLength: 20,
  vectorFieldColRowCount: 48,
  frequency: 0.002,
  amplitude: 1.5,
  lineCount: 5000,
  lineStep: 0.3,
  lineWidth: 1,
  damping: 0.88,
  iterations: 100,
};

const sketch = ({ width, height }) => {
  return ({ context, width, height }) => {
    const points = [...Array(settings.lineCount).keys()].map(
      () => new Point(width, height)
    );
    context.fillStyle = settings.backgroundColor;
    context.fillRect(0, 0, width, height);
    if (settings.debug) drawVectorField(context, width, height);
    if (settings.debug) drawPoints(context, points);
    for (let i = 0; i < 50; i++) {
      points.forEach((point) => {
        movePoint(point);
      });
    }
    const lines = points.map((point) => point.line);

    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = settings.lineWidth;

    lines.forEach((line) => {
      const [start, ...pts] = line;
      context.save();
      context.beginPath();
      context.moveTo(start.x, start.y);
      pts.forEach((pt) => {
        context.lineTo(...pt);
      });

      context.strokeStyle = settings.foregroundColor;
      context.stroke();
      context.restore();
    });
  };
};

const movePoint = (point) => {
  // Calculate direction from noise
  const angle = noise2D(
    point.x,
    point.y,
    settings.frequency,
    settings.amplitude
  );

  // Update the velocity of the point
  // based on the direction
  point.velocity.x += Math.cos(angle) * settings.lineStep;
  point.velocity.y += Math.sin(angle) * settings.lineStep;

  // Move the point
  point.x += point.velocity.x;
  point.y += point.velocity.y;

  // Use damping to slow down the point (think friction)
  point.velocity.x *= settings.damping;
  point.velocity.y *= settings.damping;

  point.line.push([point.x, point.y]);
};

const drawPoints = (context, points) => {
  points.forEach(({ x, y }) => {
    context.save();
    context.fillStyle = "red";
    context.translate(x, y);
    context.beginPath();
    context.arc(0, 0, 4, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
};
const drawVectorField = (context, width, height) => {
  const cell = {
    w: width / settings.vectorFieldColRowCount,
    h: height / settings.vectorFieldColRowCount,
  };
  context.save();
  context.strokeStyle = "white";
  context.lineWidth = settings.vectorFieldLineThickness;
  for (let x = 0; x < settings.vectorFieldColRowCount; x++) {
    for (let y = 0; y < settings.vectorFieldColRowCount; y++) {
      const angle = noise2D(
        cell.w * x,
        cell.h * y,
        settings.frequency,
        settings.amplitude
      );
      const from = new Vector(x * cell.w, y * cell.h);
      const to = new Vector(
        from.x + settings.vectorFieldLineLength * Math.cos(angle),
        from.y + settings.vectorFieldLineLength * Math.sin(angle)
      );
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    }
  }
  context.restore();
};

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Point {
  constructor(width, height) {
    this.x = range(0, width);
    this.y = range(0, height);
    this.velocity = { x: 0, y: 0 };
    this.line = [];
    this.color = pick(["#fcfaf1", "#aaa", "#cacaca", "#e6b31e"]);
  }
  velocityMag() {
    return Math.sqrt(
      Math.pow(this.velocity.x, 2),
      Math.pow(this.velocity.y, 2)
    );
  }
}

let manager;

const createPane = () => {
  const pane = new Pane();
  let folder;
  folder = pane.addFolder({ title: "Debug", expanded: false });
  folder.addInput(settings, "debug");
  folder.addInput(settings, "vectorFieldLineThickness", { min: 0, max: 10 });
  folder.addInput(settings, "vectorFieldLineLength", { min: 1, max: 50 });
  folder.addInput(settings, "vectorFieldColRowCount", {
    min: 4,
    max: 1024,
    step: 1,
  });

  folder = pane.addFolder({ title: "Lines" });
  folder.addInput(settings, "lineCount", { min: 1, max: 50000, step: 1 });
  folder.addInput(settings, "lineWidth", { min: 0.1, max: 5 });
  folder.addInput(settings, "lineStep", { min: 0.1, max: 1 });
  folder.addInput(settings, "iterations", { min: 1, max: 1000 });
  folder.addInput(settings, "damping", { min: 0, max: 1 });

  folder = pane.addFolder({ title: "Colors" });
  folder.addInput(settings, "foregroundColor");
  folder.addInput(settings, "backgroundColor");

  folder = pane.addFolder({ title: "Noise" });
  folder.addInput(settings, "frequency", { min: 0, max: 0.01 });
  folder.addInput(settings, "amplitude", { min: -10, max: 10 });

  pane.on("change", () => manager.render());
};

const start = async () => {
  manager = await canvasSketch(sketch, {
    dimensions: [1080, 1080],
  });
};

createPane();

start();
