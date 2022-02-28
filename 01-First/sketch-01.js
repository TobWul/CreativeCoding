const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

const sketch = () => {
  return ({ context, width, height }) => {
    const rectOptions = {
      width: width * 0.1,
      height: height * 0.1,
      gap: height * 0.03,
    };
    let x, y;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        x = 100 + (rectOptions.width + rectOptions.gap) * i;
        y = 100 + (rectOptions.height + rectOptions.gap) * j;
        context.beginPath();
        context.rect(x, y, rectOptions.width, rectOptions.height);
        context.stroke();
        if (Math.random() > 0.5) {
          context.beginPath();
          context.rect(
            x + 8,
            y + 8,
            rectOptions.width - 16,
            rectOptions.height - 16
          );
          context.stroke();
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
